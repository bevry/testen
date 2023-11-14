<!-- TITLE/ -->

<h1>@bevry/testen</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-githubworkflow"><a href="https://github.com/bevry/testen/actions?query=workflow%3Abevry" title="View the status of this project's GitHub Workflow: bevry"><img src="https://github.com/bevry/testen/workflows/bevry/badge.svg" alt="Status of the GitHub Workflow: bevry" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/@bevry/testen" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@bevry/testen.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/@bevry/testen" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@bevry/testen.svg" alt="NPM downloads" /></a></span>
<br class="badge-separator" />
<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/balupton" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

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

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>npm</h3></a>
<h4>Install Globally</h4>
<ul>
<li>Install: <code>npm install --global @bevry/testen</code></li>
<li>Executable: <code>@bevry/testen</code></li>
</ul>
<h4>Install Locally</h4>
<ul>
<li>Install: <code>npm install --save @bevry/testen</code></li>
<li>Executable: <code>npx @bevry/testen</code></li>
<li>Import: <code>import * as pkg from ('@bevry/testen')</code></li>
<li>Require: <code>const pkg = require('@bevry/testen')</code></li>
</ul>

<h3><a href="https://editions.bevry.me" title="Editions are the best way to produce and consume packages you care about.">Editions</a></h3>

<p>This package is published with the following editions:</p>

<ul><li><code>@bevry/testen</code> aliases <code>@bevry/testen/source/index.js</code></li>
<li><code>@bevry/testen/source/index.js</code> is <a href="https://en.wikipedia.org/wiki/ECMAScript#ES.Next" title="ECMAScript Next">ESNext</a> source code for <a href="https://nodejs.org" title="Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine">Node.js</a> 8 || 10 || 12 || 14 || 16 || 18 || 20 || 21 with <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a> for modules</li></ul>

<h3><a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a></h3>

This project provides its type information via inline <a href="http://usejsdoc.org" title="JSDoc is an API documentation generator for JavaScript, similar to Javadoc or phpDocumentor">JSDoc Comments</a>. To make use of this in <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a>, set your <code>maxNodeModuleJsDepth</code> compiler option to `5` or thereabouts. You can accomlish this via your `tsconfig.json` file like so:

``` json
{
  "compilerOptions": {
    "maxNodeModuleJsDepth": 5
  }
}
```

<!-- /INSTALL -->


<!-- HISTORY/ -->

<h2>History</h2>

<a href="https://github.com/bevry/testen/blob/master/HISTORY.md#files">Discover the release history by heading on over to the <code>HISTORY.md</code> file.</a>

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

<h2>Contribute</h2>

<a href="https://github.com/bevry/testen/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

These amazing people are maintaining this project:

<ul><li><a href="https://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/testen/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/testen">view contributions</a></li></ul>

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/balupton" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="https://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/testen/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/testen">view contributions</a></li>
<li><a href="https://egoist.dev">EGOIST</a> — <a href="https://github.com/bevry/testen/commits?author=egoist" title="View the GitHub contributions of EGOIST on repository bevry/testen">view contributions</a></li>
<li><a href="https://github.com/greenkeeperio-bot">Greenkeeper</a> — <a href="https://github.com/bevry/testen/commits?author=greenkeeperio-bot" title="View the GitHub contributions of Greenkeeper on repository bevry/testen">view contributions</a></li></ul>

<a href="https://github.com/bevry/testen/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; 2016-2017 <a href="https://egoist.dev">EGOIST</a></li>
<li>Copyright &copy; 2018+ <a href="https://balupton.com">Benjamin Lupton</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/Artistic-2.0.html">Artistic License 2.0</a></li></ul>

<!-- /LICENSE -->
