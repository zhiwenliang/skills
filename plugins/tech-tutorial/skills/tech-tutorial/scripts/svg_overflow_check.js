/*
 * svg_overflow_check.js — deterministic SVG text-overflow detector for tech-tutorial figures.
 *
 * WHY THIS EXISTS
 *   Hand-estimating label width is unreliable: real labels mix Han characters (~1em),
 *   Latin (~0.55em), digits (~0.6em), spaces (~0.25em) and punctuation, so the
 *   character-count formula is wrong often enough that "文字溢出框线" keeps slipping
 *   through screenshot review. This measures the REAL rendered width of every <text>
 *   via the browser's getComputedTextLength() and flags any label that spills past its
 *   viewBox (gets clipped) or past its containing <rect> border (overflows the box).
 *   Run it on every chapter before declaring the tutorial done — it is the GATE, not
 *   the eyeball.
 *
 * HOW TO RUN (use whatever browser-eval your environment has)
 *   1. Serve the tutorial:           python3 -m http.server 8765   (in the tutorial dir, background)
 *   2. Load a chapter in a browser:  http://localhost:8765/01-concepts.html
 *   3. Evaluate the function below against the page:
 *        - Playwright MCP:  browser_evaluate  with the trailing arrow function
 *        - headless Playwright (python):  page.evaluate(open('svg_overflow_check.js').read())
 *        - DevTools console:  paste the body of the arrow function, then call it
 *   4. Result is "OK: no SVG text overflow"  OR  an array of violations, each with:
 *        { fig, text, issue: 'past viewBox' | 'past box border', ... extents }
 *   5. Fix each flagged label (shorten / split to a 2nd line / widen the box / font-size 12),
 *      reload, and re-run until it returns OK.
 *
 * TUNING
 *   PAD = desired inner margin (px) between text and box border. 4 flags "cramped to the
 *   edge" as well as true overflow; set to 0 to flag only genuine spill-over.
 *
 * SCOPE
 *   Catches the two visible overflow modes (past viewBox, past box border). It does NOT
 *   check connector crossings / arrow-piercing / stop-policy — those still need the
 *   rendered-screenshot pass (Rules 2-4).
 */
() => {
  const PAD = 4, EPS = 1, out = [];
  document.querySelectorAll('svg').forEach((svg, si) => {
    const vb = svg.viewBox.baseVal || { x: 0, y: 0, width: svg.clientWidth, height: svg.clientHeight };
    const fig = (svg.getAttribute('aria-label') || ('svg#' + si)).slice(0, 40);
    const rects = [...svg.querySelectorAll('rect')].map(r => ({
      x: +r.getAttribute('x'), y: +r.getAttribute('y'),
      w: +r.getAttribute('width'), h: +r.getAttribute('height')
    })).filter(r => r.w && r.h);
    svg.querySelectorAll('text').forEach(t => {
      let len;
      try { len = t.getComputedTextLength(); } catch (e) { return; }
      if (!len) return;
      const x = t.x.baseVal.length ? t.x.baseVal[0].value : +(t.getAttribute('x') || 0);
      const y = t.y.baseVal.length ? t.y.baseVal[0].value : +(t.getAttribute('y') || 0);
      const anchor = t.getAttribute('text-anchor') || 'start';
      let left = x, right = x + len;
      if (anchor === 'middle') { left = x - len / 2; right = x + len / 2; }
      else if (anchor === 'end') { left = x - len; right = x; }
      const snippet = (t.textContent || '').trim().slice(0, 28);
      // 1) past the viewBox edge → the label is visibly clipped
      if (left < vb.x - EPS || right > vb.x + vb.width + EPS) {
        out.push({ fig, text: snippet, issue: 'past viewBox',
          rightEdge: Math.round(right), viewBoxRight: Math.round(vb.x + vb.width) });
      }
      // 2) past the border of the rect that contains the text anchor → overflows the box
      const box = rects.find(r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
      if (box) {
        const innerL = box.x + PAD, innerR = box.x + box.w - PAD;
        if (left < innerL - EPS || right > innerR + EPS) {
          out.push({ fig, text: snippet, issue: 'past box border',
            textWidth: Math.round(len), boxInnerWidth: Math.round(box.w - 2 * PAD) });
        }
      }
    });
  });
  return out.length ? out : 'OK: no SVG text overflow';
}
