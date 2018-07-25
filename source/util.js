'use strict'

const exec = require('then-exec')

function trim (string) {
	return string.replace(/^\s+|\s+$/g, '')
}

function runCommand (version, command) {
	return exec(`unset npm_config_prefix && . ~/.nvm/nvm.sh && nvm use --silent ${version} && ${command}`)
}

function runVersion (version) {
	return runCommand(version, "node -e 'process.stdout.write(process.versions.node)'")
}

function runInstall (version) {
	return exec(`unset npm_config_prefix && . ~/.nvm/nvm.sh && nvm install ${version}`)
}

function parseExitCode (code) {
	// needed, as sometimes error codes aren't numbers :angry_face:
	const number = Number(code)
	if (isNaN(number)) return null
	return number
}

function uniq (array) {
	return [...new Set(array)]
}

module.exports = { trim, runCommand, runVersion, runInstall, parseExitCode, uniq }
