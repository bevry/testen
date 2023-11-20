#!/usr/bin/env node
/* eslint no-sync:0, no-inner-declarations:0 */

// local
import { Version, Versions } from './index.js'
import { parseExitCode } from './util.js'

// external
import versionRange from 'version-range'
import minimist from 'minimist'
import textTable from 'text-table'
import stringWidth from 'string-width'
import Logger from 'logger-clearable'
import Spinner from 'spinner-title'
import { isReadable } from '@bevry/fs-readable'
import wait from '@bevry/wait'
import { readJSON } from '@bevry/json'
import {
	preloadNodeVersions,
	filterSignificantNodeVersions,
} from '@bevry/nodejs-versions'
import filedirname from 'filedirname'
const [file, dir] = filedirname()

// builtin
import process from 'node:process'
import { join } from 'node:path'

// prepare
const spinner: any = null
async function parse(): Promise<null | any> {
	// parse the cli flags/arguments
	const cli: any = minimist(process.argv.slice(2), {
		'--': true,
		alias: {
			h: 'help',
			j: 'json',
			n: 'node',
			s: 'serial',
		},
		string: ['node', 'spinner'],
		// boolean: ['json', 'serial', 'verbose'], <-- this defaults to false instead of null, preventing accurate fallbacks
	})
	if (cli.help) {
		// output help and exit
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
		return null
	}
	if (cli.version) {
		// output version and exit
		const testenPackage: any = await readJSON(join(dir, 'package.json'))
		process.stdout.write(testenPackage.version + '\n')
		return null
	}

	// return configuration from cli
	const cliTestenConfig: any = {}
	if (cli.node)
		cliTestenConfig.node =
			Array.isArray(cli.node) && cli.node.length === 1 ? cli.node[0] : cli.node
	if (cli['--'] && cli['--'].join(''))
		cliTestenConfig.command = cli['--'].join(' ')
	if (cli.spinner != null) cliTestenConfig.spinner = cli.spinner
	if (cli.serial != null) cliTestenConfig.serial = cli.serial
	if (cli.json != null) cliTestenConfig.json = cli.json
	if (cli.verbose != null) cliTestenConfig.verbose = cli.verbose
	return cliTestenConfig
}
async function testen(customTestenConfig = {}) {
	// fetch the user package configuration
	const cwd = process.cwd()
	const userPackagePath = `${cwd}/package.json`
	const userPackage: any = (await isReadable(userPackagePath))
		? await readJSON(userPackagePath)
		: {}

	// merge the default, package, and custom configuration
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

	// parse node versions
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
			}).filter((version: string) => versionRange(version, testenConfig.node)),
		)
	} else {
		nodeVersions.push('current', 'stable', 'system')
	}
	if (!nodeVersions || !nodeVersions.length) {
		throw new Error('No node versions specified')
	}

	// create the testen instance
	const listeners = []
	let interval: any = null
	let spinner: any = null
	if (!testenConfig.json) {
		// create and start spinner
		spinner = new Spinner({
			style: testenConfig.spinner,
			interval: 1000,
		} as any)
		spinner.start()
		// prepare the logging, note that logger-clearable uses setImmediate, so requires a wait
		const logger = new Logger()
		function table(result: any) {
			return textTable(result, { stringLength: stringWidth })
		}
		function refresh(versions: Versions) {
			const messages: any = []
			versions.array.forEach(function (V: Version) {
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
		interval = setInterval(refresher, 1000)
		listeners.push(refresher)
	}
	const versions = new Versions(nodeVersions, listeners as any)

	// run
	await versions.load()
	await versions.install()
	await versions.test(testenConfig.command, testenConfig.serial)

	// output and cleanup
	if (testenConfig.json) {
		// output json
		process.stdout.write(JSON.stringify(versions.json, null, '  '))
	} else {
		// output already occurred via listeners
		// cleanup our listeners
		if (interval) {
			clearInterval(interval) // stop the refresh interval
			interval = null
		}
		spinner.stop() // stop the spinner
		await wait(0) // wait for the logger to finish
	}

	// return versions instance
	return versions
}

// start the cli
Promise.resolve()
	.then(parse)
	.then(async function (cliTestenConfig: any = null) {
		if (cliTestenConfig) {
			const versions = await testen(cliTestenConfig)
			process.exitCode = versions.success ? 0 : 1
		}
	})
	.catch(function (err: any) {
		if (spinner) spinner.stop()
		process.stderr.write((err.stack || err.message || err).toString())
		process.exitCode = parseExitCode(err.code) || 2
	})
