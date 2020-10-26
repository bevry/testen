'use strict'

const chalk = require('chalk')
const figures = require('figures')
const { EventEmitter } = require('events')
const semver = require('semver')
const {
	runCommand,
	runVersion,
	runInstall,
	uniq,
	trim,
	loadVersion,
} = require('./util.js')

/**
 * Version class.
 * Emits an `update` event.
 * @class
 * @extends EventEmitter
 * @constructor
 * @param {string|number} version
 * @public
 */
class Version extends EventEmitter {
	constructor(version) {
		super()

		/**
		 * The precise version number, or at least the WIP version number until it is resolved further.
		 * @type {string}
		 * @public
		 */
		this.version = String(version)

		/**
		 * An array of aliases for this versionif any were used.
		 * @type {Array<string>}
		 * @public
		 */
		this.aliases = []

		/**
		 * The current status of this version, initially it is `pending`.
		 * @type {string}
		 * @public
		 */
		this.status = 'pending'

		/**
		 * Whether or not this version has been successful.
		 * @type {boolean?}
		 * @public
		 */
		this.success = null

		/**
		 * Any error that occured against this version.
		 * @type {Error?}
		 * @public
		 */
		this.error = null

		/**
		 * The last stdout value that occured against this version.
		 * @type {string?}
		 * @public
		 */
		this.stdout = null

		/**
		 * The last stderr value that occured against this version.
		 * @type {string?}
		 * @public
		 */
		this.stderr = null

		// Set alias
		if (semver.coerce(this.version) == null) {
			this.alias = this.version
		}
	}

	/**
	 * The alias for this version if any were provided. E.g. `system` or `current`
	 */
	get alias() {
		return this.aliases[0]
	}
	set alias(alias) {
		if (alias) {
			const aliases = this.aliases.concat(alias)
			this.aliases = uniq(aliases)
		}
	}

	/**
	 * Reset the version state
	 * @returns {this}
	 * @private
	 */
	reset() {
		this.success = null
		this.error = null
		this.stdout = null
		this.stderr = null
		return this
	}

	/**
	//  * Notify that an update has occurred, by emitting the update event
	 * @returns {this}
	 * @private
	 */
	update() {
		this.emit('update', this)
		return this
	}

	/**
	 * Load the version, which
	 * resolves the precise version number
	 * and determines if it is available or not
	 * @returns {Promise}
	 * @public
	 */
	async load() {
		this.status = 'loading'
		this.reset().update()

		const result = await loadVersion(this.version)
		if (result.error) {
			if (result.error.toString().includes('not yet installed')) {
				this.status = 'missing'
				this.success = false
			} else {
				this.status = 'failed'
				this.success = false
			}
			this.error = result.error
			this.stdout = (result.stdout || '').toString()
			this.stderr = (result.stderr || '').toString()
		} else {
			const result = await runVersion(this.version)
			if (result.error) {
				this.status = 'failed'
				this.success = false
				this.error = result.error
				this.stdout = (result.stdout || '').toString()
				this.stderr = (result.stderr || '').toString()
			} else {
				this.version = result.stdout.toString()
				this.status = 'loaded'
			}
		}

		this.update()
		return this
	}

	/**
	 * Install the version if it was missing.
	 * Requires the current state to be `missing`.
	 * @returns {Promise}
	 * @public
	 */
	async install() {
		if (this.status !== 'missing') return this

		this.status = 'installing'
		this.reset().update()

		const result = await runInstall(this.version)
		if (result.error) {
			this.error = result.error
			this.status = 'missing'
			this.success = false
			this.stdout = (result.stdout || '').toString()
			this.stderr = (result.stderr || '').toString()
		} else {
			this.status = 'installed'
			this.update()
			await this.load()
		}

		return this
	}

	/**
	 * Run the command against the version.
	 * Requires the current state to be `loaded`.
	 * @param {string} command
	 * @returns {Promise}
	 * @public
	 */
	async test(command) {
		if (this.status !== 'loaded') return this

		this.status = 'running'
		this.reset().update()

		this.started = Date.now()
		const result = await runCommand(this.version, command)
		this.finished = Date.now()

		this.error = result.error
		this.stdout = (result.stdout || '').toString()
		this.stderr = (result.stderr || '').toString()

		// this.status = output[0] ? (result.error ? 'failed' : 'passed') : 'missing'
		this.success = Boolean(result.error) === false
		this.status = this.success ? 'passed' : 'failed'

		this.update()
		return this
	}

	/**
	 * Converts the version properties into an array for use of displaying in a neat table.
	 * Caches for each status change.
	 * @property {Array<string>} row - [icon, version+alias, status, duration]
	 * @public
	 */
	get row() {
		// Cache
		if (this._row && this._row[0] === this.status) return this._row[1]

		const indicator =
			this.success === null
				? chalk.dim(figures.circle)
				: this.success
				? chalk.green(figures.tick)
				: chalk.red(figures.cross)

		const result =
			this.success === null
				? chalk.dim(this.status)
				: this.success
				? chalk.green(this.status)
				: chalk.red(this.status)

		// note that caching prevents realtime updates of duration time
		const duration = this.started
			? chalk.dim(`${(this.finished || new Date()) - this.started}ms`)
			: ''

		const aliases = this.aliases.length
			? chalk.dim(` [${this.aliases.join('|')}]`)
			: ''

		const row = ['  ' + indicator, this.version + aliases, result, duration]

		// Cache
		this._row = [this.status, row]
		return row
	}

	/**
	 * Converts the version properties a detailed message of what has occured with this version.
	 * Caches for each status change.
	 * @property {string} message
	 * @public
	 */
	get message() {
		// Cache
		if (this._message && this._message[0] === this.status)
			return this._message[1]

		// Prepare
		const parts = []

		// fetch heading
		const heading = `Node version ${chalk.underline(this.version)} ${
			this.status
		}`
		if (this.status === 'missing') {
			parts.push(chalk.bold(chalk.red(heading)))
		} else if (this.success === true) {
			parts.push(chalk.bold(chalk.green(heading)))
		} else if (this.success === false) {
			parts.push(chalk.bold(chalk.red(heading)))
		} else {
			// running, loading, etc - shown in verbose mode
			parts.push(chalk.bold(chalk.dim(heading)))
		}

		// Output the command that was run
		if (this.error) {
			parts.push(chalk.red(this.error.message.split('\n')[0]))
		}

		// Output stdout and stderr
		if (this.status === 'missing') {
			parts.push(chalk.red(`You need to run: nvm install ${this.version}`))
		} else {
			const stdout = trim(this.stdout || '')
			const stderr = trim(this.stderr || '')
			if (!stdout && !stderr) {
				parts.push(chalk.grey('no output'))
			} else {
				if (stdout) {
					parts.push(stdout)
				}
				if (stderr) {
					parts.push(chalk.red(stderr))
				}
			}
		}

		// Join it all together
		const message = parts.join('\n')

		// Cache
		this._message = [this.status, message]
		return message
	}
}

module.exports = Version
