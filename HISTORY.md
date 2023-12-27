# History

## v9.3.0 2023 December 28

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io/), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v9.2.0 2023 December 6

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v9.1.0 2023 November 25

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v9.0.0 2023 November 23

-   Testen v8.0.0 supported Node.js v14 and v16 via the API, however the CLI did not, because the CLI depends on `string-width` which is a Sindre package that depends on dozens of other Sindre packages, and all Sindre packages needlessly break support for Node.js versions <=v18 and CJS modules (needless as they could have just used boundation)
-   As such, the minimum required Node.js version changed from `node: >=14` to `node: >=18` and only ESM is now exported.
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

This resolves the error:

```
/opt/homebrew/lib/node_modules/@bevry/testen/edition-es2022/bin.js:15
const string_width_1 = __importDefault(require("string-width"));
                                       ^

Error [ERR_REQUIRE_ESM]: require() of ES Module /opt/homebrew/lib/node_modules/@bevry/testen/node_modules/string-width/index.js from /opt/homebrew/lib/node_modules/@bevry/testen/edition-es2022/bin.js not supported.
Instead change the require of index.js in /opt/homebrew/lib/node_modules/@bevry/testen/edition-es2022/bin.js to a dynamic import() which is available in all CommonJS modules.
    at Object.<anonymous> (/opt/homebrew/lib/node_modules/@bevry/testen/edition-es2022/bin.js:15:40) {
  code: 'ERR_REQUIRE_ESM'
}
```

## v8.0.0 2023 November 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required Node.js version changed from `node: >=18` to `node: >=14` adapting to ecosystem changes

## v7.0.0 2023 November 20

-   Rewrote in TypeScript
-   Removed `map` and `forEach` helpers on `Versions`
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required Node.js version changed from `node: >=8` to `node: >=18` adapting to ecosystem changes

## v6.1.0 2023 November 19

-   Drop `semver` dependency for [version-clean](https://github.com/bevry/version-clean), [version-compare](https://github.com/bevry/version-compare), [version-range](https://github.com/bevry/version-range) which are lightweight alternatives, with better ecosystem support
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.0.0 2023 November 14

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required Node.js version changed from `node: >=18` to `node: >=8` adapting to ecosystem changes

## v5.0.2 2023 November 2

-   Dramatically improved configuration handling
-   Fixed an issue where the CLI could exit too early, before the result and exit/error status was finished reporting
-   Testen now fails no test command is provided, rather than always defaulting to `npm test`
-   Testen is no longer an event emitter, instead pass listeners to the constructor
-   Testen now updates durations every second via the cli
    -   Testen no longer caches row output, as it can't generate durations
    -   Durations are also in milliseconds and seconds now, rather than just milliseconds

## v4.0.0 2023 November 2

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Updated license from [`MIT`](http://spdx.org/licenses/MIT.html) to [`Artistic-2.0`](http://spdx.org/licenses/Artistic-2.0.html)
-   Minimum required node version changed from `node: >=8` to `node: >=18` to keep up with mandatory ecosystem changes
-   Swapped `chalk` for `@bevry/ansi` to maintain ecosystem compatibility
-   Swapped `figures` for `@bevry/figures` to maintain ecosystem compatibility
-   Removed update notifier, and removed travis or circle functionality
    -   If no custom config, and `package.json:engines:node` exists, then it now uses all the maintained + historical LTS versions of Node.js that match the engine range
    -   Otherwise it still fallbacks to the current, stable, and system versions.

## v3.7.1 2020 October 26

-   Fixed break on recent nvm versions
    -   If --silent was being used and the node version does not exist, then before nvm would error but now it does not, so have adjusted the detection accordingly

## v3.7.0 2020 May 11

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.6.0 2019 December 11

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.5.0 2019 December 10

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.4.0 2019 December 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.3.0 2019 December 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.2.0 2019 November 18

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.1.0 2019 November 13

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.0.1 2018 July 27

-   Fixed package installation under some circumstances
-   Fixed duplicate log messages from showing under some circumstances
-   Moved the spinner to the title bar

## v3.0.0 2018 July 22

-   New features
    -   [Now installs missing Node.js versions](https://github.com/egoist/testen/issues/15)
    -   [Introduced the `--json` flag for JSON output](https://github.com/egoist/testen/issues/19)
    -   Programmatic API
-   Fixed bugs
    -   Exit codes are now appropriate for the result (such that scripts that consume testen will detect failures more automatically)
-   Improvements
    -   Node flag now supports comma seperated values
    -   Complete version numbers are now resolved and displayed
    -   Versions that were defined by an alias (such as `current`, or `system`) now show their alias as well as their version number
    -   Versions that are doubled up, now get compacted with their aliases merged together
    -   Removed many unused internal dependencies
    -   Codebase is now tested and documented
-   Breaking changes
    -   Minimum supported node version for the testen client is now version 8, instead of version 4
    -   Certain command line flags have changed names to be more accurate
    -   `package.json:tested:test` is now `package.json:tested:command` to be more accurate

## Earlier

-   Earlier versions are detailed on the [egoist/testen](https://github.com/egoist/testen) repository
