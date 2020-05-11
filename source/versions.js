'use strict'

const Version = require('./version.js')
const { EventEmitter } = require('events')
const semver = require('semver')

/**
 * A JSON object representing the status of our {@link Versoins} instance.
 * It contains a `success` property, which can be `true` or `false.
 * It also contains the various version numbers mapped to arrays based on their status.
 * @example {"success": true, "passed": ["10.6.0", "10.7.0"]}
 * @typedef {Object} JSONResult
 * @property {boolean} success
 * @public
 */

/**
 * Versions class.
 * Emits an `update` event.
 * @class
 * @extends EventEmitter
 * @constructor
 * @param {array} versions
 * @public
 */
class Versions extends EventEmitter {
	constructor(versions) {
		super()

		/**
		 * The array of resolved versions.
		 * @type {Array<Version>}
		 * @public
		 */
		this.array = versions.map((v) => {
			const V = new Version(v)
			V.on('update', (...args) => this.emit('update', ...args))
			return V
		})

		// Sort
		this.sort()
	}

	/**
	 * The compartor to use for sorting an array of versions.
	 * @param {Version} left
	 * @param {Version} right
	 * @returns {number}
	 * @static
	 * @public
	 */
	static comparator(left, right) {
		const a = semver.coerce(left.version)
		const b = semver.coerce(right.version)

		if (!a) {
			return 1
		} else if (!b) {
			return -1
		} else if (semver.gt(a, b)) {
			return 1
		} else if (semver.lt(a, b)) {
			return -1
		}
		return 0
	}

	/**
	 * Run map on our versions
	 * @param {...*} args
	 * @returns {Array<Version>}
	 * @public
	 */
	map(...args) {
		return this.array.map(...args)
	}

	/**
	 * Run forEach on our versions
	 * @param {...*} args
	 * @returns {this}
	 * @public
	 */
	forEach(...args) {
		this.array.forEach(...args)
		return this
	}

	/**
	 * Sort our versions by our comparator
	 * @returns {this}
	 * @public
	 */
	sort() {
		this.array.sort(Versions.comparator)
		return this
	}

	/**
	 * Compact versions that share the same exact version number together.
	 * @returns {this}
	 * @public
	 */
	compact() {
		const map = {}
		this.array.forEach(function (V) {
			if (map[V.version]) {
				map[V.version].alias = V.alias
			} else {
				map[V.version] = V
			}
		})
		this.array = Object.values(map)
		return this
	}

	/**
	 * Unless every version of ours was successful, then this will be `false`
	 * @property {boolean} success
	 * @public
	 */
	get success() {
		const failure = this.array.some((V) => V.success === false)
		return !failure
	}

	/**
	 * Get how many versions we have
	 * @property {number} length
	 * @public
	 */
	get length() {
		return this.array.length
	}

	/**
	 * Get the results of our versions as a JSON object.
	 * @property {JSONResult} json
	 * @public
	 */
	get json() {
		const results = { success: true }
		this.array.forEach(function (V) {
			results[V.status] = (results[V.status] || []).concat(V.version)
			if (V.success === false) results.success = false
		})
		return results
	}

	/**
	 * An array of the {@link Version#row} results for use of displaying our status as a neat table.
	 * @property {Array<Array>} table
	 * @public
	 */
	get table() {
		return this.array.map((V) => V.row)
	}

	/**
	 * An array of the {@link Version#message} results for use of displaying detailed status updates of each version.
	 * @property {Array<Array>} table
	 * @public
	 */
	get messages() {
		return this.array.map((V) => V.message)
	}

	/**
	 * Loads each of our versions, by calling {@link Version#load} on each of them.
	 * @param {boolean} [compact=true]
	 * @returns {Promise}
	 */
	async load(compact = true) {
		await Promise.all(this.array.map((V) => V.load()))
		if (compact) this.compact()
		this.sort()
		return this
	}

	/**
	 * Installs any missing versions, by calling {@link Version#install} on each of them.
	 * @returns {Promise}
	 */
	async install() {
		await Promise.all(this.array.map((V) => V.install()))
		return this
	}

	/**
	 * Runs the test for each version, by calling {@link Version#test} on each of them.
	 * @param {string} [command]
	 * @param {boolean} [serial=false] - whether or not to run them one at a time, one after another
	 * @returns {Promise}
	 */
	async test(command, serial = false) {
		if (serial) {
			for (const V of this.array) {
				await V.test(command)
			}
		}
		await Promise.all(this.array.map((V) => V.test(command)))
		return this
	}
}

module.exports = Versions
