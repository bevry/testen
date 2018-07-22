'use strict'

const Versions = require('./versions.js')
const { equal, deepEqual } = require('assert-helpers')
const { runVersion, parseExitCode, uniq } = require('./util.js')
const semver = require('semver')

function isCurrentVersion (currentVersion, version) {
	return semver.satisfies(currentVersion, version)
}

async function runTests (command, serial = false) {
	let versions, updateOrder

	function resetUpdateOrder () {
		updateOrder = []
	}
	function updatesOrdered () {
		deepEqual(versions.array, updateOrder, 'updates are in order')
	}
	function updatesUnordered () {
		try {
			updatesOrdered()
		}
		catch (err) {
			// ignore
		}
		equal(versions.array, 'random order', 'updates were in order when they should be random')
	}
	function storeOrder (V) {
		if (updateOrder.slice(-1)[0] === V) return this
		updateOrder.push(V)
	}

	try {
		// Note
		console.log('Running tests on node version', process.versions.node, 'with command:', command)

		// Create the versions
		versions = new Versions(['current', 10, 8])
		deepEqual(
			versions.map((V) => ({ version: V.version, aliases: V.aliases })),
			[
				{
					version: '8',
					aliases: []
				},
				{
					version: '10',
					aliases: []
				},
				{
					version: 'current',
					aliases: ['current']
				}
			],
			'versions are sorted intially correctly'
		)

		// Load
		await versions.load()

		// Install
		await versions.install()

		// Fetch the actual exact versions
		const nodeCurrentVersion = await runVersion('current').then((result) => result.stdout.toString().trim())
		const nodeEightVersion = await runVersion(8).then((result) => result.stdout.toString().trim())
		const nodeTenVersion = await runVersion(10).then((result) => result.stdout.toString().trim())

		// Confirm compaction and everything occured correctly
		const latest = uniq([nodeCurrentVersion, nodeEightVersion, nodeTenVersion]).map((v) => ({
			version: v,
			aliases: isCurrentVersion(nodeCurrentVersion, v) ? ['current'] : []
		})).sort(Versions.comparator)
		deepEqual(
			versions.map((V) => ({ version: V.version, aliases: V.aliases })),
			latest,
			'versions are sorted after load correctly'
		)

		// Test
		versions.on('update', storeOrder)
		resetUpdateOrder()
		await versions.test(command, serial)
		if (serial) updatesOrdered()
		// else updatesUnordered()

		// Check how we did
		if (!versions.success) {
			return Promise.reject(new Error('a testen execution failed:\n\n' + versions.messages.join('\n\n')))
		}
		else {
			return versions
		}
	}
	catch (err) {
		return Promise.reject(err)
	}
}

Promise.resolve()
	.then(() => runTests('echo planned success'))
	.then(() => runTests('echo planned failure && exit 1')
		.then(() => Promise.reject(new Error('planned failure should not be successful')))
		.catch(function (err) {
			if (err.message.indexOf('a testen execution failed') !== -1) return Promise.resolve()
			return Promise.reject(err)
		})
	)
	.then(() => runTests('echo planned success in serial mode', true))
	.then(() => runTests('echo planned failure in serial mode && exit 1', true)
		.then(() => Promise.reject(new Error('planned failure should not be successful')))
		.catch(function (err) {
			if (err.message.indexOf('a testen execution failed') !== -1) return Promise.resolve()
			return Promise.reject(err)
		})
	)
	.then(function () {
		console.log('\ntests were OK')
	})
	.catch(function (err) {
		console.error('\n' + err + '\n')
		console.error('\ntests were NOT OK')
		process.exit(parseExitCode(err.code) || 1)
	})
