// external
import * as ansi from '@bevry/ansi'
import figures from '@bevry/figures'
import versionClean from 'version-clean'

// local
import {
	runCommand,
	runVersion,
	runInstall,
	uniq,
	trim,
	loadVersion,
	lastLine,
} from './util.js'

export type Status =
	| 'pending'
	| 'loading'
	| 'missing'
	| 'failed'
	| 'loaded'
	| 'installing'
	| 'installed'
	| 'running'
	| 'passed'

export type Row = [
	icon: string,
	version_or_alias: string,
	rendered_status: string,
	duration: string,
]

function getTime() {
	return Date.now()
}

/** Version */
export class Version {
	/** The precise version number, or at least the WIP version number/alias until it is resolved further. */
	version: string

	/** The list of listeners we will call when updates happen. */
	listeners: Array<Function> = []

	/** An array of aliases for this version if any were used. */
	aliases: Array<string> = []

	/** The current status of this version, initially it is `pending`. */
	status: Status = 'pending'

	/**
	 * The version resolution that was successfully loaded.
	 * For instance, if a nvm alias is used such as "current" which resolves to 18.18.2 which is the system Node.js version, but is not installed via nvm itself, then trying to resolve "18.18.2" will fail with [version "v18.18.2" is not yet installed] but the original "current" resolution will work.
	 */
	loadedVersion: string | null = null

	/** Whether or not this version has been successful. */
	success: boolean | null = null

	/** Any error that occurred against this version.  */
	error: Error | null = null

	/** The last stdout value that occurred against this version. */
	stdout: string | null = null

	/** The last stderr value that occurred against this version. */
	stderr: string | null = null

	/** The time the run started. */
	started: number | null = null

	/** The time the run finished. */
	finished: number | null = null

	/** Cache of the message. */
	private messageCache: [status: Status, message: string] | null = null

	/** Create our Version instance */
	constructor(version: string | number, listeners: Array<Function> = []) {
		this.listeners.push(...listeners)
		this.version = String(version)

		// If it fails to pass, then it is an alias, not a version
		if (!versionClean(this.version)) {
			// this uses a setter to add to this.aliases
			this.alias = this.version
		}
	}

	/** The alias for this version if any were provided. E.g. `system` or `current` */
	get alias() {
		return this.aliases[0]
	}
	set alias(alias) {
		if (alias) {
			const aliases = this.aliases.concat(alias)
			this.aliases = uniq(aliases)
		}
	}

	/** Reset the version state. */
	reset() {
		this.success = null
		this.error = null
		this.stdout = null
		this.stderr = null
		this.started = null
		this.finished = null
		this.messageCache = null
		return this
	}

	/** Notify that an update has occurred.
	 * @param {string?} status
	 * @returns {this}
	 * @private
	 */
	async update(status?: Status) {
		if (status) this.status = status
		await Promise.all(this.listeners.map((listener) => listener(this)))
		return this
	}

	/** Load the version, which resolves the precise version number and determines if it is available or not. */
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
	 */
	async test(command: string) {
		if (!command) {
			throw new Error('no command provided to the testen version runner')
		}
		if (this.status !== 'loaded') return this

		this.status = 'running'
		this.reset()
		await this.update()

		this.started = getTime()
		const result = await runCommand(this.loadedVersion || this.version, command)
		this.finished = getTime()

		this.error = result.error
		this.stdout = (result.stdout || '').toString()
		this.stderr = (result.stderr || '').toString()

		this.success = Boolean(result.error) === false

		await this.update(this.success ? 'passed' : 'failed')
		return this
	}

	/**
	 * Converts the version properties into an array for use of displaying in a neat table.
	 * Doesn't cache as we want to refresh timers.
	 */
	get row(): Row {
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
		const ms = this.started ? (this.finished || getTime()) - this.started : 0
		const duration = this.started
			? ansi.dim(ms > 1000 ? `${Math.round(ms / 1000)}s` : `${ms}ms`)
			: ''

		const aliases = this.aliases.length
			? ansi.dim(` [${this.aliases.join('|')}]`)
			: ''

		const row: Row = [
			'  ' + indicator,
			this.version + aliases,
			result,
			duration,
		]
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
		if (this.messageCache && this.messageCache[0] === this.status) {
			return this.messageCache[1]
		}

		// Prepare
		const parts: Array<string> = []

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
		this.messageCache = [this.status, message]
		return message
	}
}
export default Version
