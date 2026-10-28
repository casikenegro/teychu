import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('uses the transparent brand logo without color-destroying CSS filters', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');
  const logo = await readFile(new URL('../dist/assets/logo-teychu-transparent.png', import.meta.url));

  assert.match(html, /assets\/logo-teychu-transparent\.png/);
  assert.match(css, /\.brand img\{[^}]*filter:none!important/);
  assert.match(css, /\.brand\{[^}]*background:transparent/);
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

test('keeps the mobile hero and media in normal responsive flow', async () => {
  const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');

  assert.match(css, /@media\(max-width:600px\)[\s\S]*?\.hero\{height:auto;min-height:100svh;display:flex;flex-direction:column\}/);
  assert.match(css, /\.hero-proof\{position:relative;inset:auto;/);
  assert.match(css, /\.project-card\{height:auto;aspect-ratio:4\/3;/);
  assert.match(css, /h1\{font-size:clamp\(2\.35rem,11vw,3\.25rem\)/);
});
