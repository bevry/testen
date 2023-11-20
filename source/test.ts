/* eslint no-console:0 */

// external
import { equal, deepEqual } from 'assert-helpers'

// local
import { Version, Versions } from './index.js'
import { parseExitCode } from './util.js'

// vars
import process from 'node:process'
const nodeProcessVersion = process.versions.node

async function runTests(command: string, serial = false) {
	let versions: Versions
	const updates: any[] = []
	function serializeUpdate(V: Version) {
		return {
			version: V.version,
			status: V.status,
			success: V.success,
			error: V.error,
			stdout: V.stdout,
			stderr: V.stderr,
		}
	}
	function checkUpdates() {
		if (serial) {
			deepEqual(
				versions.array.map(serializeUpdate),
				updates.filter((V) => V.status === 'passed' || V.status === 'failed'),
				'in serial mode, tests ran in order',
			)
		}
	}
	function storeUpdate(V: Version) {
		updates.push(serializeUpdate(V))
	}

	try {
		// log
		console.log(
			'Running tests on node version',
			process.versions.node,
			'with command:',
			command,
		)

		// create the versions (use old versions as they stay the same, new versions change)
		versions = new Versions(['current', 10, 8], [storeUpdate])
		deepEqual(
			versions.array.map((V: Version) => ({
				version: V.version,
				aliases: V.aliases,
			})),
			[
				{
					version: '8',
					aliases: [],
				},
				{
					version: '10',
					aliases: [],
				},
				{
					version: 'current',
					aliases: ['current'],
				},
			],
			'versions are sorted initially correctly',
		)

		// resolve/load versions
		await versions.load()

		// install missing versions
		await versions.install()

		// fetch the resolved versions
		const nodeCurrentVersion = versions.get('current')?.version
		const nodeEightVersion = versions.get('8')?.version
		const nodeTenVersion = versions.get('10')?.version

		// node current version is the process version
		equal(
			nodeCurrentVersion,
			nodeProcessVersion,
			'Node.js current version resolved to Node.js process version',
		)

		// confirm version fetching, confirm compation, confirm sorting
		const latest = [
			{
				version: nodeEightVersion,
				aliases: [],
			},
			{
				version: nodeTenVersion,
				aliases: [],
			},
			{
				version: nodeCurrentVersion,
				aliases: ['current'],
			},
		]
		deepEqual(
			versions.array.map((V: Version) => ({
				version: V.version,
				aliases: V.aliases,
			})),
			latest,
			'versions are sorted after load correctly',
		)

		// run our test on them
		await versions.test(command, serial)
		checkUpdates()

		// check how we did
		if (!versions.success) {
			return Promise.reject(
				new Error(
					'a testen execution failed:\n\n' + versions.messages.join('\n\n'),
				),
			)
		} else {
			return versions
		}
	} catch (err) {
		return Promise.reject(err)
	}
}

Promise.resolve()
	.then(() => runTests('echo planned success'))
	.then(() =>
		runTests('echo planned failure && exit 1')
			.then(() =>
				Promise.reject(new Error('planned failure should not be successful')),
			)
			.catch(function (err) {
				if (err.message.indexOf('a testen execution failed') !== -1)
					return Promise.resolve()
				return Promise.reject(err)
			}),
	)
	.then(() => runTests('echo planned success in serial mode', true))
	.then(() =>
		runTests('echo planned failure in serial mode && exit 1', true)
			.then(() =>
				Promise.reject(new Error('planned failure should not be successful')),
			)
			.catch(function (err) {
				if (err.message.indexOf('a testen execution failed') !== -1)
					return Promise.resolve()
				return Promise.reject(err)
			}),
	)
	.then(function () {
		console.log('\ntests were OK')
	})
	.catch(function (err) {
		console.error('\n' + err + '\n')
		console.error('\ntests were NOT OK')
		process.exit(parseExitCode(err.code) || 1)
	})
