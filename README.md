<!-- TITLE/ -->

# @bevry/testen

<!-- /TITLE -->

<!-- BADGES/ -->

<span class="badge-githubworkflow"><a href="https://github.com/bevry/testen/actions?query=workflow%3Abevry" title="View the status of this project's GitHub Workflow: bevry"><img src="https://github.com/bevry/testen/workflows/bevry/badge.svg" alt="Status of the GitHub Workflow: bevry" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/@bevry/testen" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@bevry/testen.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/@bevry/testen" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@bevry/testen.svg" alt="NPM downloads" /></a></span>
<br class="badge-separator" />
<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/bevry" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<br class="badge-separator" />
<span class="badge-discord"><a href="https://discord.gg/nQuXddV7VP" title="Join this project's community on Discord"><img src="https://img.shields.io/discord/1147436445783560193?logo=discord&amp;label=discord" alt="Discord server badge" /></a></span>
<span class="badge-twitch"><a href="https://www.twitch.tv/balupton" title="Join this project's community on Twitch"><img src="https://img.shields.io/twitch/status/balupton?logo=twitch" alt="Twitch community badge" /></a></span>

<!-- /BADGES -->

<!-- DESCRIPTION/ -->

Run your tests locally against multiple node.js versions

<!-- /DESCRIPTION -->


`@bevry/testen` is a fork of [testen](https://github.com/egoist/testen) which continues maintenance with various improvements and fixes.

## Examples

### Success

<a href="https://asciinema.org/a/se1hXojsgeN4EJj0q2u0CRiQj?autoplay=1"><img src="https://asciinema.org/a/se1hXojsgeN4EJj0q2u0CRiQj.png" width="350" alt="success case"/></a>

As JSON:

<a href="https://asciinema.org/a/pRI8Q5oNkbt3vSVa1JXfMMyE4?autoplay=1&amp;speed=10"><img src="https://asciinema.org/a/pRI8Q5oNkbt3vSVa1JXfMMyE4.png" width="350" alt="success case as JSON"/></a>

### Failure

<a href="https://asciinema.org/a/T6TzRzu8R9ozEdsMkoAK1rjU5?autoplay=1&amp;speed=5"><img src="https://asciinema.org/a/T6TzRzu8R9ozEdsMkoAK1rjU5.png" width="350" alt="failure case"/></a>

As JSON:

<a href="https://asciinema.org/a/XnZasiO2HKi9wnXjd0LJgLjv7?autoplay=1&amp;speed=10"><img src="https://asciinema.org/a/XnZasiO2HKi9wnXjd0LJgLjv7.png" width="350" alt="failure case as JSON"/></a>

## Usage

[Complete API Documentation.](http://master.testen.bevry.surge.sh/docs/)

Testen uses [nvm](https://github.com/creationix/nvm) behind the scenes for its node.js version management.

### Node.js Versions

The CLI will determine which Node.js versions to run your tests again in this order of most preferred first:

-   use the CLI via `-n <version>` flag (`--node` is also suitable):
    -   `testen -n 8.0.0 -n 10`
    -   `testen -n '8 || 10'`
    -   `testen -n '>=8 <=10'`
-   use the `package.json` configuration file via:
    -   `"testen": { "node": ["8.0.0", 10] }`
    -   `"testen": { "node": "8 || 10" }`
    -   `"testen": { "node": ">=8 <=10" }`
-   use the `package.json` configuration file via:
    -   `"testen": { "node": "8 || 10" }`
    -   `"testen": { "node": ">=8 <=10" }`
-   otherwise, the `current`, `stable`, and `system` versions are used which are resolved by nvm

### Command

The CLI will default to `npm test` as the command that will run for each Node.js version, however the API has no such default. You can customize this via:

-   use the CLI via `-- <command>`, e.g. `testen -- echo hello world`
-   use the `package.json` configuration file via `"testen": { "serial": true }`

### Serial or Parallel

By default tests will run in parallel (multiple at once), to use serial, you can either:

-   use the CLI via `-s` flag (`--serial` is also suitable)
-   use the `package.json` configuration file via `"testen": { "serial": true }`

### JSON Output

By default Testen will output pretty output, to only output the JSON result, you can either:

-   use the CLI via `-j` flag (`--json` is also suitable)
-   use the `package.json` configuration file via `"testen": { "json": true }`

### Other CLI Flags

Refer to `testen --help`.

### API Usage

Testen also provides an API which can be used like so:

```javascript
const { Versions } = require('@bevry/testen')
async function main() {
    const versions = new Versions([4, 8, 10, 'current', 'stable', 'system'])
    await versions.load()
    await versions.install()
    await versions.test('npm test')
    console.log(versions.success)
}
main()
```

[Complete API documentation is available.](http://master.testen.bevry.surge.sh/docs/)

<!-- INSTALL/ -->

## Install

### [npm](https://npmjs.com "npm is a package manager for javascript")

#### Install Globally

-   Install: `npm install --global @bevry/testen`
-   Executable: `@bevry/testen`

#### Install Locally

-   Install: `npm install --save @bevry/testen`
-   Executable: `npx @bevry/testen`
-   Import: `import * as pkg from ('@bevry/testen')`
-   Require: `const pkg = require('@bevry/testen')`

### [Editions](https://editions.bevry.me "Editions are the best way to produce and consume packages you care about.")

This package is published with the following editions:
-   `@bevry/testen/source/index.ts` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") source code with [Import](https://babeljs.io/docs/learn-es2015/#modules "ECMAScript Modules") for modules
-   `@bevry/testen` aliases `@bevry/testen/edition-es2022-esm/index.js`
-   `@bevry/testen/edition-es2022-esm/index.js` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled against [ES2022](https://en.wikipedia.org/wiki/ES2022 "ECMAScript 2022") for [Node.js](https://nodejs.org "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine") 18 || 20 || 21 with [Import](https://babeljs.io/docs/learn-es2015/#modules "ECMAScript Modules") for modules
-   `@bevry/testen/edition-types/index.d.ts` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled Types with [Import](https://babeljs.io/docs/learn-es2015/#modules "ECMAScript Modules") for modules

<!-- /INSTALL -->

<!-- HISTORY/ -->

## History

[Discover the release history by heading on over to the `HISTORY.md` file.](https://github.com/bevry/testen/blob/HEAD/HISTORY.md#files)

<!-- /HISTORY -->

<!-- BACKERS/ -->

## Backers

### Code

[Discover how to contribute via the `CONTRIBUTING.md` file.](https://github.com/bevry/testen/blob/HEAD/CONTRIBUTING.md#files)

#### Authors

-   2018+ [Benjamin Lupton](https://balupton.com) — Accelerating collaborative wisdom.
-   2016-2017 [EGOIST](https://egoist.dev) — Indie Hacker

#### Maintainers

-   [Benjamin Lupton](https://github.com/balupton) — Accelerating collaborative wisdom.

#### Contributors

-   [Benjamin Lupton](https://github.com/balupton) — [view contributions](https://github.com/bevry/testen/commits?author=balupton "View the GitHub contributions of Benjamin Lupton on repository bevry/testen")
-   [EGOIST](https://github.com/egoist) — [view contributions](https://github.com/bevry/testen/commits?author=egoist "View the GitHub contributions of EGOIST on repository bevry/testen")
-   [Greenkeeper](https://github.com/greenkeeperio-bot) — [view contributions](https://github.com/bevry/testen/commits?author=greenkeeperio-bot "View the GitHub contributions of Greenkeeper on repository bevry/testen")

### Finances

<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/bevry" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>

#### Sponsors

-   [Andrew Nesbitt](https://nesbitt.io) — Software engineer and researcher
-   [Balsa](https://balsa.com) — We're Balsa, and we're building tools for builders.
-   [Codecov](https://codecov.io/) — Empower developers with tools to improve code quality and testing.
-   [Poonacha Medappa](https://poonachamedappa.com)
-   [Rob Morris](https://github.com/Rob-Morris)
-   [Sentry](https://sentry.io) — Real-time crash reporting for your web apps, mobile apps, and games.
-   [Syntax](https://syntax.fm) — Syntax Podcast

#### Donors

-   [Andrew Nesbitt](https://nesbitt.io)
-   [Balsa](https://balsa.com)
-   [Chad](https://opencollective.com/chad8)
-   [Codecov](https://codecov.io/)
-   [entroniq](https://gitlab.com/entroniq)
-   [Jean-Luc Geering](https://github.com/jlgeering)
-   [Michael Duane Mooring](https://mdm.cc)
-   [Mohammed Shah](https://github.com/smashah)
-   [Poonacha Medappa](https://poonachamedappa.com)
-   [Rob Morris](https://github.com/Rob-Morris)
-   [Sentry](https://sentry.io)
-   [ServieJS](https://github.com/serviejs)
-   [Skunk Team](https://skunk.team)
-   [Syntax](https://syntax.fm)

<!-- /BACKERS -->

<!-- LICENSE/ -->

## License

Unless stated otherwise all works are:

-   Copyright &copy; 2018+ [Benjamin Lupton](https://balupton.com)
-   Copyright &copy; 2016-2017 [EGOIST](https://egoist.dev)

and licensed under:

-   [Artistic License 2.0](http://spdx.org/licenses/Artistic-2.0.html)

<!-- /LICENSE -->
