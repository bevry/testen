# History

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
