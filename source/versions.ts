// external
import versionClean from 'version-clean'
import versionCompare from 'version-compare'
import versionRange from 'version-range'

// local
import Version, { Status, Row } from './version.js'

/**
 * A JSON object representing the status of our {@link Versions} instance.
 * It contains a `success` property, which can be `true` or `false.
 * It also contains the various version numbers mapped to arrays based on their status.
 * @example {"success": true, "passed": ["10.6.0", "10.7.0"]}
 */
export type JSONResult = {
	[status in Status]?: Array<string>
} & {
	success: boolean
}

/** Versions */
export class Versions {
	/** The list of listeners we will call when updates happen. */
	listeners: Array<Function> = []

	/** The list of Version instances. */
	array: Array<Version> = []

	/** Create our Versions instance */
	constructor(
		versions: Array<string | number>,
		listeners: Array<Function> = [],
	) {
		this.listeners.push(...listeners)
		this.add(versions)
	}

	/** The comparator to use for sorting an array of versions. */
	static comparator(left: Version, right: Version): 1 | -1 | 0 {
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

	/** Add version(s) to the list. */
	add(versions: Array<string | number> | string | number) {
		if (!Array.isArray(versions)) versions = [versions]
		this.array.push(
			...versions.map((v) => {
				const V = new Version(v, this.listeners)
				return V
			}),
		)
		this.compact()
		return this
	}

	/** Get version(s) from the list. */
	get(version: string): Version | null {
		return (
			this.array.find((V) => V.version === version) ||
			this.array.find((V) => V.aliases.includes(version)) ||
			this.array.find((V) => versionRange(V.version, version)) ||
			null
		)
	}

	/** Sort our versions by our comparator. */
	sort() {
		this.array.sort(Versions.comparator)
		return this
	}

	/** Compact versions that share the same exact version number together. */
	compact() {
		const map: { [version: string]: Version } = {}
		this.array.forEach(function (V) {
			if (map[V.version]) {
				map[V.version].alias = V.alias
			} else {
				map[V.version] = V
			}
		})
		this.array = Object.values(map)
		this.sort()
		return this
	}

	/** Unless every version of ours was successful, then this will be `false`. */
	get success() {
		const failure = this.array.some((V) => V.success === false)
		return !failure
	}

	/** Get how many versions we have. */
	get length() {
		return this.array.length
	}

	/** Get the results of our versions as a JSON object. */
	get json() {
		const results: JSONResult = { success: true }
		this.array.forEach(function (V) {
			results[V.status] = (results[V.status] || []).concat(V.version)
			if (V.success === false) results.success = false
		})
		return results
	}

	/** An array of {@link Version.row} results for use of displaying our status as a neat table. */
	get table(): Array<Row> {
		return this.array.map((V) => V.row)
	}

	/** An array of the {@link Version.message} results for use of displaying detailed status updates of each version. */
	get messages(): Array<string> {
		return this.array.map((V) => V.message)
	}

	/** Loads each of our versions. */
	async load(compact = true) {
		await Promise.all(this.array.map((V) => V.load()))
		if (compact) {
			this.compact()
		} else {
			this.sort()
		}
		return this
	}

	/** Installs any missing versions. */
	async install() {
		await Promise.all(this.array.map((V) => V.install()))
		return this
	}

	/** Runs the test for each version. */
	async test(command: string, serial: boolean = false) {
		if (!command) {
			throw new Error('no command provided to the testen versions runner')
		}
		if (serial) {
			for (const V of this.array) {
				await V.test(command)
			}
		} else {
			await Promise.all(this.array.map((V) => V.test(command)))
		}
		return this
	}
}
export default Versions
