'use strict'

// external
const versionClean = require('version-clean').default
const versionCompare = require('version-compare').default

// local
const Version = require('./version.js')

/**
 * A JSON object representing the status of our {@link Versions} instance.
 * It contains a `success` property, which can be `true` or `false.
 * It also contains the various version numbers mapped to arrays based on their status.
 * @example {"success": true, "passed": ["10.6.0", "10.7.0"]}
 * @typedef {Object} JSONResult
 * @property {boolean} success
 * @public
 */

/**
 * Versions class.
 * @class
 * @constructor
 * @param {array} versions
 * @param {Array<Function>?} listeners
 * @public
 */
class Versions {
	constructor(versions, listeners = []) {
		/**
		 * The list of listeners we will call when updates happen.
		 * @type {Array<Function>}
		 * @public
		 */
		this.listeners = listeners

		/**
		 * The array of resolved versions.
		 * @type {Array<Version>}
		 * @public
		 */
		this.array = versions.map((v) => {
			const V = new Version(v, this.listeners)
			return V
		})

		// Sort
		this.sort()
	}

	/**
	 * The comparator to use for sorting an array of versions.
	 * @param {Version} left
	 * @param {Version} right
	 * @returns {number}
	 * @static
	 * @public
	 */
	static comparator(left, right) {
		const a = versionClean(left.version)
		const b = versionClean(right.version)
		if (!a) {
			// a was an alias, put it last
			return 1
		} else if (!b) {
			// b was an alias, put it last
			return -1
		} else {
			// otherwise do normal sorting
			return versionCompare(a, b)
		}
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
		if (!command) {
			throw new Error('no command provided to the testen versions runner')
		}
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
