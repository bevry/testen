'use strict'

// external
const ansi = require('@bevry/ansi')
const figures = require('@bevry/figures').default
const versionClean = require('version-clean').default

// local
const {
	runCommand,
	runVersion,
	runInstall,
	uniq,
	trim,
	loadVersion,
	lastLine,
} = require('./util.js')

/**
 * Version class.
 * Emits an `update` event.
 * @class
 * @constructor
 * @param {string|number} version
 * @param {Array<Function>?} listeners
 * @public
 */
class Version {
	constructor(version, listeners = []) {
		/**
		 * The precise version number, or at least the WIP version number/alias until it is resolved further.
		 * @type {string}
		 * @public
		 */
		this.version = String(version)

		/**
		 * The list of listeners we will call when updates happen.
		 * @type {Array<Function>}
		 * @public
		 */
		this.listeners = listeners

		/**
		 * An array of aliases for this version if any were used.
		 * @type {Array<string>}
		 * @public
		 */
		this.aliases = []

		// If it fails to pass, then it is an alias, not a version
		if (!versionClean(this.version)) {
			// this uses a setter to add to this.aliases
			this.alias = this.version
		}

		/**
		 * The current status of this version, initially it is `pending`.
		 * @type {string}
		 * @public
		 */
		this.status = 'pending'

		/**
		 * The version resolution that was successfully loaded.
		 * For instance, if a nvm alias is used such as "current" which resolves to 18.18.2 which is the system Node.js version, but is not installed via nvm itself, then trying to resolve "18.18.2" will fail with [version "v18.18.2" is not yet installed] but the original "current" resolution will work.
		 * @type {string?}
		 * @public
		 */
		this.loadedVersion = null

		/**
		 * Whether or not this version has been successful.
		 * @type {boolean?}
		 * @public
		 */
		this.success = null

		/**
		 * Any error that occurred against this version.
		 * @type {Error?}
		 * @public
		 */
		this.error = null

		/**
		 * The last stdout value that occurred against this version.
		 * @type {string?}
		 * @public
		 */
		this.stdout = null

		/**
		 * The last stderr value that occurred against this version.
		 * @type {string?}
		 * @public
		 */
		this.stderr = null
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
	 * Notify that an update has occurred.
	 * @param {string?} status
	 * @returns {this}
	 * @private
	 */
	async update(status) {
		if (status) this.status = status
		await Promise.all(this.listeners.map((listener) => listener(this)))
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
		this.reset()
		await this.update()

		const result = await loadVersion(this.version)
		if (result.error) {
			if ((result.error || '').toString().includes('not yet installed')) {
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
				this.loadedVersion = this.loadedVersion || this.version
				this.version = lastLine(result.stdout) // resolve the version
				this.status = 'loaded'
			}
		}

		await this.update()
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
		this.reset()
		await this.update()

		const result = await runInstall(this.version)
		if (result.error) {
			this.error = result.error
			this.status = 'missing'
			this.success = false
			this.stdout = (result.stdout || '').toString()
			this.stderr = (result.stderr || '').toString()
		} else {
			await this.update('installed')
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
		if (!command) {
			throw new Error('no command provided to the testen version runner')
		}
		if (this.status !== 'loaded') return this

		this.status = 'running'
		this.reset()
		await this.update()

		this.started = Date.now()
		const result = await runCommand(this.loadedVersion || this.version, command)
		this.finished = Date.now()

		this.error = result.error
		this.stdout = (result.stdout || '').toString()
		this.stderr = (result.stderr || '').toString()

		// this.status = output[0] ? (result.error ? 'failed' : 'passed') : 'missing'
		this.success = Boolean(result.error) === false

		await this.update(this.success ? 'passed' : 'failed')
		return this
	}

	/**
	 * Converts the version properties into an array for use of displaying in a neat table.
	 * Doesn't cache as we want to refresh timers.
	 * @property {Array<string>} row - [icon, version+alias, status, duration]
	 * @public
	 */
	get row() {
		const indicator =
			this.success === null
				? ansi.dim(figures.circle)
				: this.success
				  ? ansi.green(figures.tick)
				  : ansi.red(figures.cross)

		const result =
			this.success === null
				? ansi.dim(this.status)
				: this.success
				  ? ansi.green(this.status)
				  : ansi.red(this.status)

		// note that caching prevents realtime updates of duration time
		const ms = this.started ? (this.finished || new Date()) - this.started : 0
		const duration = this.started
			? ansi.dim(ms > 1000 ? `${Math.round(ms / 1000)}s` : `${ms}ms`)
			: ''

		const aliases = this.aliases.length
			? ansi.dim(` [${this.aliases.join('|')}]`)
			: ''

		const row = ['  ' + indicator, this.version + aliases, result, duration]
		return row
	}

	/**
	 * Converts the version properties a detailed message of what has occurred with this version.
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
		const heading = `Node version ${ansi.underline(this.version)} ${
			this.status
		}`
		if (this.status === 'missing') {
			parts.push(ansi.bold(ansi.red(heading)))
		} else if (this.success === true) {
			parts.push(ansi.bold(ansi.green(heading)))
		} else if (this.success === false) {
			parts.push(ansi.bold(ansi.red(heading)))
		} else {
			// running, loading, etc - shown in verbose mode
			parts.push(ansi.bold(ansi.dim(heading)))
		}

		// Output the command that was run
		if (this.error) {
			parts.push(ansi.red(this.error.message.split('\n')[0]))
		}

		// Output stdout and stderr
		if (this.status === 'missing') {
			parts.push(ansi.red(`You need to run: nvm install ${this.version}`))
		} else {
			const stdout = trim(this.stdout || '')
			const stderr = trim(this.stderr || '')
			if (!stdout && !stderr) {
				parts.push(ansi.dim('no output'))
			} else {
				if (stdout) {
					parts.push(stdout)
				}
				if (stderr) {
					parts.push(ansi.red(stderr))
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
