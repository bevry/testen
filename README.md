<!-- TITLE/ -->

<h1>@bevry/testen</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-travisci"><a href="http://travis-ci.com/bevry/testen" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/com/bevry/testen/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/@bevry/testen" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@bevry/testen.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/@bevry/testen" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@bevry/testen.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/bevry/testen" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/bevry/testen.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://david-dm.org/bevry/testen#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/bevry/testen.svg" alt="Dev Dependency Status" /></a></span>
<br class="badge-separator" />
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
<li>Require: <code>require('@bevry/testen')</code></li>
</ul>

<h3><a href="https://editions.bevry.me" title="Editions are the best way to produce and consume packages you care about.">Editions</a></h3>

<p>This package is published with the following editions:</p>

<ul><li><code>@bevry/testen</code> aliases <code>@bevry/testen/source/index.js</code></li>
<li><code>@bevry/testen/source/index.js</code> is esnext source code with require for modules</li></ul>

<p>Environments older than Node.js v8 may need <a href="https://babeljs.io/docs/usage/polyfill/" title="A polyfill that emulates missing ECMAScript environment features">Babel's Polyfill</a> or something similar.</p>

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


## Usage

Testen runs your tests again multiple node versions, however the testen client can only run on Node 8 or higher.

Testen uses [nvm](https://github.com/creationix/nvm) behind the scens for its node.js version management.


### CLI Usage

You can specify the exact node versions to test your project against by using the `-n <version>` flag (`--node` is also suitable).
This flag can occur multiple times, and also supports versions seperated by a comma.
Such that `testen -n 8 -n 10` and `testen -n 8,10` will both use node versions 8 and 10.

If you do not specify any versions via the CLI arguments, then it will use:

- the `testen.node` property of your projects `package.json` file
- otherwise, the travis or circle ci node versions that you have configured for your project
- otherwise, the `current`, `stable`, and `system` versions which are resolved by nvm

If a node version is currently missing, it will be installed for you automatically.

You can specify the extact command to run against your project by placing it after the `--` argument, for example `testen -- echo hello world` to run `echo hello world`.
If you do not specify a command via the CLI, then it will use:
- the `testen.command` property of your projects `package.json` file
- otherwise, `npm test` is used

Other key arguments are:

- `--json` will output the results in JSON format, for progamatic consumption
- `--verbose` will report the details of all versions, not just the versions that have failed
- `--serial` will run the tests serially (one after the other), however for performance, loading of versions still occurs in parallel

And full help, as always is available via `testen --help`.


### API Usage

Testen also provides an API which can be used like so:

``` javascript
const {Versions} = require('@bevry/testen')
async function main () {
    const versions = new Versions([4, 8, 10, 'current', 'stable', 'system'])
    await versions.load()
    await versions.install()
    await versions.test()
    console.log(versions.success)
}
main()
```

[Complete API documentation is available.](http://master.testen.bevry.surge.sh/docs/)


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

<ul><li><a href="http://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/testen/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/testen">view contributions</a></li></ul>

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

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

<ul><li><a href="http://patreon.com/egoist">Kevin Titor</a> — <a href="https://github.com/bevry/testen/commits?author=egoist" title="View the GitHub contributions of Kevin Titor on repository bevry/testen">view contributions</a></li>
<li><a href="http://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/testen/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/testen">view contributions</a></li>
<li><a href="http://greenkeeper.io/">Greenkeeper</a> — <a href="https://github.com/bevry/testen/commits?author=greenkeeperio-bot" title="View the GitHub contributions of Greenkeeper on repository bevry/testen">view contributions</a></li></ul>

<a href="https://github.com/bevry/testen/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; 2016-2017 <a href="http://patreon.com/egoist">Kevin Titor</a></li>
<li>Copyright &copy; 2018+ <a href="http://balupton.com">Benjamin Lupton</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
