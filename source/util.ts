import exec from 'then-exec'

export function trim(string: string) {
	return string.replace(/^\s+|\s+$/g, '')
}

export function loadVersion(version: string | number) {
	return exec(
		`unset npm_config_prefix && . ~/.nvm/nvm.sh && nvm use ${version}`,
	)
}

export function runCommand(version: string | number, command: string) {
	return exec(
		`unset npm_config_prefix && . ~/.nvm/nvm.sh && nvm use ${version} && ${command}`,
	)
}

export function runVersion(version: string | number) {
	return runCommand(
		version,
		"node -e 'process.stdout.write(process.versions.node)'",
	)
}

export function runInstall(version: string | number) {
	return exec(
		`unset npm_config_prefix && . ~/.nvm/nvm.sh && nvm install --no-progress ${version}`,
	)
}

export function lastLine(string: any) {
	return string.toString().trim().split('\n').slice(-1)[0].trim()
}

export function parseExitCode(code: any) {
	// needed, as sometimes error codes aren't numbers :angry_face:
	const number = Number(code)
	if (isNaN(number)) return null
	return number
}

export function uniq(array: any[]) {
	return [...new Set(array)]
}
