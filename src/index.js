/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const path = require('path');
const year = require('year');
const arrayify = require('arrayify');
const builtins = require('builtin-modules');
const { minify } = require('uglify-es');
const babelPlugin = require('rollup-plugin-babel');
const uglifyPlugin = require('rollup-plugin-uglify');
const resolvePlugin = require('rollup-plugin-node-resolve');
const commonjsPlugin = require('rollup-plugin-commonjs');
const gzipPlugin = require('./gzip-plugin.js');

const pkg = require(path.join(process.cwd(), 'package.json'));
const licenseYear = pkg.licenseStart || year();

const preamble = `/**
 * @copyright ${licenseYear}-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */`;

module.exports = function rollupConfig (opts) {
  const options = Object.assign({}, opts);
  options.resolve = arrayify(options.resolve);
  options.babel = {
    presets: [
      [
        'env',
        {
          spec: true,
          modules: false,
          targets: Object.assign({ node: 6 }, options.targets),
        },
      ],
    ],
    plugins: [
      'external-helpers',
      ['transform-object-rest-spread', { useBuiltIns: true }],
      'unassert',
    ],
  };

  let resolve = null;
  let external = []
    .concat(Object.keys(pkg.dependencies || {}))
    .concat(Object.keys(pkg.devDependencies || {}))
    .concat(builtins);

  if (options.resolve.length) {
    resolve = resolvePlugin({ extensions: ['.js', '.mjs'] });
    external = external.filter((name) => !options.resolve.includes(name));
  }

  const uglifyOptions = Object.assign(
    {
      compress: { warnings: false },
      output: { preamble },
    },
    options.uglify
  );

  const uglify = options.uglify ? uglifyPlugin(uglifyOptions, minify) : null;
  const gzip = options.gzip ? gzipPlugin() : null;
  const plugins = [commonjsPlugin(), resolve, babelPlugin(options.babel), uglify, gzip];

  return {
    banner: preamble,
    plugins: plugins.filter(Boolean),
    external,
  };
};
