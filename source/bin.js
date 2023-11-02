#!/usr/bin/env node
/* eslint no-sync:0 */
'use strict'

// Local
const Versions = require('./versions.js')
const { parseExitCode } = require('./util.js')

// External
const fs = require('fs')
const semver = require('semver')
const minimist = require('minimist')
const textTable = require('text-table')
const stringWidth = require('string-width')
const Logger = require('logger-clearable')
const Spinner = require('spinner-title')
const wait = require('@bevry/wait').default
const {
	preloadNodeVersions,
	filterSignificantNodeVersions,
} = require('@bevry/nodejs-versions')

// Parse the CLI
const cli = minimist(process.argv.slice(2), {
	'--': true,
	alias: {
		j: 'json',
		n: 'node',
		s: 'serial',
	},
	string: ['node', 'spinner'],
	// boolean: ['json', 'serial', 'verbose'], <-- this defaults to false instead of null, preventing accurate fallbacks
})
if (cli.help) {
	// Output the help and eixt
	process.stdout.write(
		[
			'Usage:',
			'',
			'  -n/--node [version]:   Add a Node.js version to test',
			'  -s/--serial:           Run tests serially, one after the other',
			'  -j/--json:             Output the test results as JSON',
			'  --spinner [spinner]    Which spinner to use in the title bar',
			'  --verbose:             Report details about all statuses, not just failures',
			'  --version:             Output the version of Testen',
			'  --help:                Output this help',
			'  -- [command]:          The test command you expect',
			'',
		].join('\n'),
	)
	process.exit()
}
if (cli.version) {
	// Print the version and exit
	const testenPackage = require('../package.json')
	process.stdout.write(testenPackage.version + '\n')
	process.exit()
}

// Create the CLI configuration
const cliTestenConfig = {}
if (cli.node)
	cliTestenConfig.node =
		Array.isArray(cli.node) && cli.node.length === 1 ? cli.node[0] : cli.node
if (cli['--'] && cli['--'].join(''))
	cliTestenConfig.command = cli['--'].join(' ')
if (cli.spinner != null) cliTestenConfig.spinner = cli.spinner
if (cli.serial != null) cliTestenConfig.serial = cli.serial
if (cli.json != null) cliTestenConfig.json = cli.json
if (cli.verbose != null) cliTestenConfig.verbose = cli.verbose

// Prepare the globals
let spinner // defined later once config loaded
const logger = new Logger()
const table = (result) => textTable(result, { stringLength: stringWidth })

// Prepare our runner
async function run(customTestenConfig = {}) {
	// Fetch the user package configuration
	const cwd = process.cwd()
	const userPackagePath = `${cwd}/package.json`
	const userPackage = fs.existsSync(userPackagePath)
		? require(userPackagePath)
		: {}

	// Merge the default, package, and custom configuration
	const testenConfig = Object.assign(
		{
			node: (userPackage.engines && userPackage.engines.node) || '',
			command: 'npm test',
			spinner: 'monkey',
			serial: false,
			json: false,
			verbose: false,
		},
		userPackage.testen || {},
		customTestenConfig,
	)

	// Parse node versions
	const nodeVersions = []
	if (Array.isArray(testenConfig.node) && testenConfig.node.length) {
		// specific versions
		nodeVersions.push(...testenConfig.node)
	} else if (testenConfig.node && /^[\d\w.-]+$/.test(testenConfig.node)) {
		// specific version
		nodeVersions.push(testenConfig.node)
	} else if (testenConfig.node) {
		// range
		await preloadNodeVersions()
		nodeVersions.push(
			...filterSignificantNodeVersions({
				maintainedOrLTS: true,
				released: true,
			}).filter((version) =>
				semver.satisfies(semver.coerce(version), testenConfig.node),
			),
		)
	} else {
		nodeVersions.push('current', 'stable', 'system')
	}
	if (!nodeVersions || !nodeVersions.length) {
		throw new Error('No node versions specified')
	}

	// Create the tTesten instance
	const listeners = [],
		interval = null
	if (!testenConfig.json) {
		// create and start spinner
		spinner = new Spinner({
			style: testenConfig.spinner,
			interval: 1000,
		})
		spinner.start()
		// prepare the logging, note that logger-clearable uses setImmediate, so requires a wait
		/* eslint-disable-next-line no-inner-declarations */
		function refresh(versions) {
			const messages = []
			versions.forEach(function (V) {
				if (V.success === false || testenConfig.verbose) {
					messages.push(V.message)
				}
			})
			if (messages.length) {
				return (
					'\n' + messages.join('\n\n') + '\n\n' + table(versions.table) + '\n\n'
				)
			} else {
				return '\n' + table(versions.table) + '\n\n'
			}
		}
		/* eslint-disable-next-line no-inner-declarations */
		function refresher() {
			/* eslint-disable-next-line no-use-before-define */
			logger.queue(() => refresh(versions))
		}
		setInterval(refresher, 1000)
		listeners.push(refresher)
	}
	const versions = new Versions(nodeVersions, listeners)

	// Run
	await versions.load()
	await versions.install()
	await versions.test(testenConfig.command, testenConfig.serial)

	// Finish up
	if (testenConfig.json) {
		// Output JSON
		process.stdout.write(JSON.stringify(versions.json, null, '  '))
	} else {
		clearInterval(interval) // stop the refresh interval
		spinner.stop() // stop the spinner
		await wait(0) // wait for the logger to finish
	}

	// Return the versions object
	return versions
}

// Actually run the versions
run(cliTestenConfig)
	.then(function (versions) {
		process.exitCode = versions.success ? 0 : 1
	})
	.catch(function (err) {
		if (spinner) spinner.stop()
		process.stderr.write((err.stack || err.message || err).toString())
		process.exitCode = parseExitCode(err.code) || 2
	})
