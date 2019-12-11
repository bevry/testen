#!/usr/bin/env node
/* eslint no-sync:0 */
'use strict'

// Local
const Versions = require('./versions.js')
const { parseExitCode } = require('./util.js')

// External
const fs = require('fs')
const minimist = require('minimist')
const update = require('update-notifier')
const textTable = require('text-table')
const travisOrCircle = require('travis-or-circle')
const stringWidth = require('string-width')
const Logger = require('logger-clearable')
const Spinner = require('spinner-title')

// Fetch our own package configuration, and alert the user if there is an update
const testenPackage = require('../package.json')
update({ pkg: testenPackage }).notify()

// Fetch the user package configuration
const cwd = process.cwd()
const userPackagePath = `${cwd}/package.json`
const userPackage = fs.existsSync(userPackagePath)
	? require(userPackagePath)
	: {}

// Parse the CLI options
const cli = minimist(process.argv.slice(2), {
	'--': true,
	alias: {
		j: 'json',
		n: 'node'
	},
	string: ['node']
})

// Print the help
if (cli.help) {
	console.log(
		[
			'',
			'Usage:',
			'',
			'  -j/--json:             Output the test results as JSON',
			'  -n/--node [version]:   Add a node version to test',
			'  --serial:              Run tests serially, one after the other',
			'  --spinner [spinner]    Which spinner to use in the title bar',
			'  --verbose:             Report details about all statuses, not just failures',
			'  --version:             Output the version of testen',
			'  --help:                Output this help',
			'  -- [command]:          The test command you expect',
			''
		].join('\n')
	)
	process.exit()
}

// Print the version
if (cli.version) {
	console.log(testenPackage.version)
	process.exit()
}

// Prepare
function table(result) {
	return textTable(result, { stringLength: stringWidth })
}
// const spin = new Hinata({ char: '●', text: '  ', prepend: true, spacing: 1 })

// Determine the test script
let command = cli['--'].join(' ')
if (!command) {
	command =
		userPackage.testen && userPackage.testen.command
			? userPackage.testen.command
			: 'npm test'
}

// Get node versions from CLI arguments
// Otherwise package.json:testen:node
// Otherwise travis or circle
// Otherwise current and latest
const nodeVersions = (cli.node
	? [].concat(cli.node)
	: (userPackage.testen && userPackage.testen.node) || travisOrCircle() || []
)
	.join(' ')
	.split(/[,\s]+/)
if (nodeVersions.join('') === '') {
	nodeVersions.pop()
	nodeVersions.push('current', 'stable', 'system')
}

// Prepare outputs
const logger = new Logger()
const spinner = new Spinner({ style: cli.spinner || 'monkey', interval: 1000 })
function log(versions) {
	const messages = []
	versions.forEach(function(V) {
		if (V.success === false || cli.verbose) {
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

// Run the versions
async function run(nodeVersions) {
	// Load the actual versions
	const versions = new Versions(nodeVersions)

	// Prepare
	function update() {
		logger.queue(() => log(versions))
	}

	// Output
	if (!cli.json) {
		// start the spinner
		spinner.start()

		// keep the user updated with new events
		versions.on('update', update)
	}

	// Run
	await versions.load()
	await versions.install()
	await versions.test(command, cli.serial)

	// Output
	if (!cli.json) {
		// Cleanup
		spinner.stop()
		versions.removeListener('update', update)
	} else {
		// Output
		console.log(JSON.stringify(versions.json, null, '  '))
	}

	// Return the versions object
	return versions
}

// Actually run the versions
run(nodeVersions)
	.then(function(versions) {
		process.exitCode = versions.success ? 0 : 1
	})
	.catch(function(err) {
		spinner.stop()
		console.error(err)
		process.exitCode = parseExitCode(err.code) || 1
	})
