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

test('shows the updated service name and direct WhatsApp contact', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');

  assert.match(html, /Petróleo &amp; Gas/);
  assert.match(html, /href="https:\/\/wa\.me\/584147017200"/);
  assert.match(html, /href="https:\/\/wa\.me\/584249037609"/);
  assert.match(html, /\+58 414 701 7200/);
  assert.match(html, /\+58 424 903 7609/);
  assert.match(html, /aria-label="Contactar por WhatsApp al \+58 414 701 7200"/);
  assert.match(html, /aria-label="Contactar por WhatsApp al \+58 424 903 7609"/);
});

test('uses the new field photography without changing the brand logo', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');

  assert.match(css, /assets\/hero-earthworks\.png/);
  assert.match(html, /assets\/project-field-testing\.png/);
  assert.match(html, /assets\/project-valve-maintenance\.png/);
  assert.match(html, /assets\/project-lifting-complete\.png/);
  assert.match(html, /assets\/commitment-team\.png/);
  assert.match(html, /assets\/logo-teychu-transparent\.png/);
});

test('keeps collapsed capability panels hidden', async () => {
  const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');

  assert.match(css, /\.service-body\[hidden\]\{display:none\}/);
});

test('keeps hero content and proof in normal flow on every viewport', async () => {
  const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');

  assert.match(css, /\.hero\{height:auto;min-height:max\(760px,100svh\);display:flex;flex-direction:column\}/);
  assert.match(css, /\.hero-proof\{position:relative;inset:auto;/);
});

test('provides an accessible hero work carousel and complete lifting image', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');
  const script = await readFile(new URL('../dist/script.js', import.meta.url), 'utf8');

  assert.match(html, /aria-roledescription="carousel"/);
  assert.match(html, /data-hero-slide/);
  assert.match(css, /assets\/project-special-studies\.png/);
  assert.match(css, /assets\/project-welding\.png/);
  assert.match(html, /assets\/project-lifting-complete\.png/);
  assert.match(css, /\.project-lifting img\{[^}]*object-position:center 68%/);
  assert.match(script, /const heroSlides/);
  assert.match(script, /prefers-reduced-motion/);
});
