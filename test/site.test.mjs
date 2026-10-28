import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('uses the transparent brand logo without color-destroying CSS filters', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');
  const logo = await readFile(new URL('../dist/assets/logo-teychu-transparent.png', import.meta.url));

  assert.match(html, /assets\/logo-teychu-transparent\.png/);
  assert.match(css, /\.brand img\{filter:none!important\}/);
  assert.match(css, /\.brand\{[^}]*background:rgba\(255,255,255,\.94\)/);
  assert.equal(logo.subarray(1, 4).toString(), 'PNG');
  assert.ok(logo.includes(Buffer.from('IHDR')), 'logo must be a valid PNG');
  assert.equal(logo[25], 6, 'logo PNG must include an alpha channel');
});

test('serves the static site locally', async () => {
  const { resolveRequest } = await import('../server.mjs');
  const response = await resolveRequest('/');

  assert.equal(response.status, 200);
  assert.match(response.headers['content-type'], /text\/html/);
  assert.match(response.body.toString(), /TEYCHU/);
});
