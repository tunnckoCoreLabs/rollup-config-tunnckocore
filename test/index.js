/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const test = require('mukla');
const isObject = require('isobject');
const plugin = require('../src/index.js');

test('returns an object with banner, plugins, external', (done) => {
  const opts = plugin();
  test.strictEqual(isObject(opts), true);
  test.strictEqual(typeof opts.banner, 'string');
  test.ok(opts.plugins);
  done();
});

test('includes the uglify plugin when opts.uglify: true', (done) => {
  const { plugins } = plugin({ uglify: true });
  const [uglifyPlugin] = plugins.filter(({ name }) => name === 'uglify');

  test.strictEqual(isObject(uglifyPlugin), true);
  test.strictEqual(uglifyPlugin.name, 'uglify');
  done();
});

test('includes the gzip plugin when opts.gzip: true', (done) => {
  const config = plugin({ gzip: true });
  const plugins = config.plugins.filter(({ name }) => name === 'just-gzip');

  test.strictEqual(plugins.length, 1);
  done();
});

test('should includes node-resolve plugin when opts.resolve exist', (done) => {
  const cfg = plugin({ resolve: 'pify' });

  test.strictEqual(cfg.plugins.length, 3);
  test.strictEqual(cfg.plugins[1].name, 'node-resolve');
  done();
});
