// Browser tests for svg_overflow_check.js (node:test + Playwright).
//
//   node --test plugins/tech-tutorial/skills/tech-tutorial/scripts/test_svg_check.mjs
//
// Env:
//   PLAYWRIGHT_MODULE  path to playwright's index.js, used when `import('playwright')`
//                      does not resolve from here.
//   SVG_CHECK_SCRIPT   checker to test (default: the sibling svg_overflow_check.js);
//                      point it at an older copy to watch these tests fail.
// Skips (does not fail) when Playwright or a Chromium/Chrome browser is unavailable.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const scriptPath = process.env.SVG_CHECK_SCRIPT || join(here, 'svg_overflow_check.js');
const src = readFileSync(scriptPath, 'utf8');

async function loadChromium() {
  const tries = ['playwright'];
  if (process.env.PLAYWRIGHT_MODULE) tries.push(pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href);
  for (const spec of tries) {
    try {
      const mod = await import(spec);
      const chromium = mod.chromium || (mod.default && mod.default.chromium);
      if (chromium) return chromium;
    } catch { /* try the next location */ }
  }
  return null;
}

let browser = null, page = null, skip = false;
const chromium = await loadChromium();
if (!chromium) {
  skip = 'Playwright not found (install it, or set PLAYWRIGHT_MODULE=/path/to/playwright/index.js)';
} else {
  for (const opts of [{ channel: 'chrome' }, {}]) {
    try { browser = await chromium.launch(opts); break; } catch { /* try the bundled browser */ }
  }
  if (browser) page = await browser.newPage();
  else skip = 'no launchable browser (neither channel "chrome" nor the Playwright-bundled Chromium)';
}
if (skip) console.log(`# SKIP svg_overflow_check browser tests: ${skip}`);
after(async () => { if (browser) await browser.close(); });

// Run the checker against a page whose <body> is `markup`. The file is a bare arrow
// function, so evaluating it as-is would return the function — call it.
async function check(markup) {
  await page.setContent(`<!doctype html><html><head><style>
    svg text { font-family: sans-serif; font-size: 14px; }
  </style></head><body>${markup}</body></html>`);
  return page.evaluate(`(${src})()`);
}

const svg = (label, w, h, inner) =>
  `<svg aria-label="${label}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${inner}</svg>`;

// Violations of `issue` for figure `fig` (result is 'OK: ...' or an array).
const hits = (res, fig, issue) => (Array.isArray(res) ? res : [])
  .filter(v => v.fig === fig && v.issue === issue);

test('left-anchored label overflowing a narrow rect is past box border', { skip }, async () => {
  const res = await check(svg('left', 400, 100,
    '<rect x="10" y="10" width="60" height="40" fill="none" stroke="#000"/>' +
    '<text x="14" y="35">A very long label that overflows</text>'));
  assert.equal(hits(res, 'left', 'past box border').length, 1, JSON.stringify(res));
});

test('end-anchored label overflowing a narrow rect is past box border', { skip }, async () => {
  const res = await check(svg('end', 400, 100,
    '<rect x="330" y="10" width="60" height="40" fill="none" stroke="#000"/>' +
    '<text x="386" y="35" text-anchor="end">A very long label that overflows</text>'));
  assert.equal(hits(res, 'end', 'past box border').length, 1, JSON.stringify(res));
});

test('label overflowing an ellipse is past box border', { skip }, async () => {
  const res = await check(svg('ellipse', 400, 100,
    '<ellipse cx="200" cy="50" rx="30" ry="20" fill="none" stroke="#000"/>' +
    '<text x="200" y="55" text-anchor="middle">Long label in ellipse overflow</text>'));
  assert.equal(hits(res, 'ellipse', 'past box border').length, 1, JSON.stringify(res));
});

test('label overflowing a circle is past box border', { skip }, async () => {
  const res = await check(svg('circle', 400, 100,
    '<circle cx="200" cy="50" r="25" fill="#eee" stroke="#000"/>' +
    '<text x="200" y="55" text-anchor="middle">Circle label far too wide</text>'));
  assert.equal(hits(res, 'circle', 'past box border').length, 1, JSON.stringify(res));
});

test('label overflowing a polygon diamond is past box border', { skip }, async () => {
  const res = await check(svg('diamond', 400, 120,
    '<polygon points="200,20 260,60 200,100 140,60" fill="none" stroke="#000"/>' +
    '<text x="200" y="65" text-anchor="middle">Is the request fully valid?</text>'));
  assert.equal(hits(res, 'diamond', 'past box border').length, 1, JSON.stringify(res));
});

test('label spilling past the slanted edge of a diamond is caught (not just its bbox)', { skip }, async () => {
  // Fits the flat diamond's 120x40 bounding box (text is ~92x16), but its corners
  // cross the slanted edges.
  const res = await check(svg('diamond-bbox', 400, 120,
    '<polygon points="200,40 260,60 200,80 140,60" fill="none" stroke="#000"/>' +
    '<text x="200" y="65" text-anchor="middle">Retry request?</text>'));
  assert.equal(hits(res, 'diamond-bbox', 'past box border').length, 1, JSON.stringify(res));
});

test('label overflowing a rotated-rect diamond is past box border', { skip }, async () => {
  const res = await check(svg('rot-diamond', 400, 140,
    '<rect x="170" y="40" width="60" height="60" transform="rotate(45 200 70)" fill="none" stroke="#000"/>' +
    '<text x="200" y="75" text-anchor="middle">Retry the whole request?</text>'));
  assert.equal(hits(res, 'rot-diamond', 'past box border').length, 1, JSON.stringify(res));
});

test('text inside <foreignObject> is reported as not measured', { skip }, async () => {
  const res = await check(svg('fo', 200, 100,
    '<foreignObject x="150" y="10" width="200" height="40">' +
    '<div style="white-space:nowrap">Foreign text overflowing viewBox way past</div></foreignObject>'));
  const v = hits(res, 'fo', 'not measured (foreignObject)');
  assert.equal(v.length, 1, JSON.stringify(res));
  assert.match(v[0].text, /^Foreign text/);
});

test('clean figures return OK (fitting labels, free labels, dots, rotated axis label)', { skip }, async () => {
  const res = await check([
    // diagram_guide Base Figure Pattern
    svg('base', 680, 360,
      '<defs><marker id="a1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">' +
      '<path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>' +
      '<rect x="40" y="120" width="140" height="64" rx="6" fill="#fff" stroke="#000"/>' +
      '<text x="110" y="148" text-anchor="middle">Client</text>' +
      '<text x="110" y="168" text-anchor="middle" style="font-size:12px">sends request</text>' +
      '<line x1="180" y1="152" x2="280" y2="152" stroke="#000" marker-end="url(#a1)"/>'),
    // left-anchored labels that fit; a free edge label between boxes inside a lane;
    // a start-anchored note beside a box (anchor outside every shape)
    svg('lane', 600, 160,
      '<rect x="5" y="5" width="590" height="150" fill="#fafafa" stroke="#ccc"/>' +
      '<rect x="20" y="40" width="150" height="40" fill="none" stroke="#000"/>' +
      '<text x="28" y="65">Left label fits</text>' +
      '<rect x="330" y="40" width="150" height="40" fill="none" stroke="#000"/>' +
      '<text x="472" y="65" text-anchor="end">Right label fits</text>' +
      '<line x1="170" y1="60" x2="330" y2="60" stroke="#000"/>' +
      '<text x="250" y="52" text-anchor="middle">calls</text>' +
      '<text x="488" y="65">note</text>'),
    // shapes whose labels fit
    svg('shapes', 600, 140,
      '<ellipse cx="80" cy="60" rx="70" ry="30" fill="none" stroke="#000"/>' +
      '<text x="80" y="65" text-anchor="middle">Fits ellipse</text>' +
      '<circle cx="230" cy="60" r="40" fill="none" stroke="#000"/>' +
      '<text x="230" y="65" text-anchor="middle">Node</text>' +
      '<polygon points="400,10 490,60 400,110 310,60" fill="none" stroke="#000"/>' +
      '<text x="400" y="65" text-anchor="middle">Valid?</text>' +
      '<rect x="525" y="30" width="50" height="50" transform="rotate(45 550 55)" fill="none" stroke="#000"/>' +
      '<text x="550" y="60" text-anchor="middle">OK?</text>'),
    // diagram_guide Pattern 4: dot + label below it, end-anchored and rotated axis labels,
    // plus a timeline dot whose label is offset with dx
    svg('tradeoff', 680, 360,
      '<line x1="120" y1="280" x2="560" y2="280" stroke="#000"/>' +
      '<line x1="120" y1="280" x2="120" y2="80" stroke="#000"/>' +
      '<text x="560" y="306" text-anchor="end">higher throughput</text>' +
      '<text x="88" y="84" text-anchor="middle" transform="rotate(-90 88 84)">lower latency</text>' +
      '<circle cx="250" cy="210" r="8" fill="#c00"/>' +
      '<text x="250" y="235" text-anchor="middle">Approach A</text>' +
      '<circle cx="400" cy="120" r="5" fill="#000"/>' +
      '<text x="400" y="125" dx="12">v2 released</text>'),
  ].join(''));
  assert.equal(res, 'OK: no SVG text defects');
});

test('data-collision-ok still exempts a label collision', { skip }, async () => {
  const pair = attr => svg('pair', 300, 80,
    '<text x="20" y="40">Overlapping label</text>' +
    `<text x="24" y="42"${attr}>Overlapping again</text>`);
  const flagged = await check(pair(''));
  assert.equal(hits(flagged, 'pair', 'label collision').length, 1, JSON.stringify(flagged));
  assert.equal(await check(pair(' data-collision-ok')), 'OK: no SVG text defects');
});
