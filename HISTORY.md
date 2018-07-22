# History

## v3.0.0 2018 July 22
- New features
    - [Now installs missing Node.js versions](https://github.com/egoist/testen/issues/15)
    - [Introduced the `--json` flag for JSON output](https://github.com/egoist/testen/issues/19)
    - Programmatic API
- Fixed bugs
    - Exit codes are now appropriate for the result (such that scripts that consume testen will detect failures more automatically)
- Improvements
    - Node flag now supports comma seperated values
    - Complete version numbers are now resolved and displayed
    - Versions that were defined by an alias (such as `current`, or `system`) now show their alias as well as their version number
    - Versions that are doubled up, now get compacted with their aliases merged together
    - Removed many unused internal dependencies
    - Codebase is now tested and documented
- Breaking changes
    - Minimum supported node version for the testen client is now version 8, instead of version 4
    - Certain command line flags have changed names to be more accurate
    - `package.json:tested:test` is now `package.json:tested:command` to be more accurate

## Earlier
- Earlier versions are detailed on the [egoist/testen](https://github.com/egoist/testen) repository
