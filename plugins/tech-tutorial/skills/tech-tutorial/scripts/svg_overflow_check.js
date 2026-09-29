/*
 * svg_overflow_check.js — deterministic SVG text-defect detector for tech-tutorial figures.
 *
 * WHY THIS EXISTS
 *   Hand-estimating label geometry is unreliable: real labels mix Han characters (~1em),
 *   Latin (~0.55em), digits (~0.6em), spaces (~0.25em) and punctuation, so the
 *   character-count formula is wrong often enough that text overflow keeps slipping
 *   through screenshot review. This measures the REAL rendered extent of every visible
 *   <text> via getBBox(), mapped through the element's full transform chain into the
 *   root <svg> coordinate system, and flags:
 *     1. any label that spills past its viewBox (gets clipped) — both axes,
 *     2. any label that spills past its containing <rect> border (overflows the box),
 *     3. any TWO labels whose rendered boxes overlap each other (label collision —
 *        added after a shipped 2026-06 defect: two labels collided in the one figure
 *        whose screenshot was skipped).
 *   Run it on every chapter before declaring the tutorial done — it is the GATE, not
 *   the eyeball.
 *
 * HOW TO RUN (use whatever browser-eval your environment has)
 *   1. Serve the tutorial:           python3 -m http.server 8765   (in the tutorial dir, background)
 *   2. Load a chapter in a browser:  http://localhost:8765/01-concepts.html
 *   3. Evaluate the function below against the page:
 *        - Playwright MCP:  browser_evaluate  with the trailing arrow function
 *        - headless Playwright (python):
 *            page.evaluate(open('<plugin-root>/skills/tech-tutorial/scripts/svg_overflow_check.js').read())
 *          (cwd is the tutorial dir, so use the absolute path SKILL.md Phase 5 gives, not a
 *          bare filename; CLAUDE_PLUGIN_ROOT is substituted into SKILL.md text, not exported
 *          to shell or Python processes, so os.environ has no such key)
 *        - DevTools console:  paste `const check = ` followed by the arrow function, then
 *          run check() (a bare body fails: its `return` is illegal at the top level)
 *   4. Result is "OK: no SVG text defects"  OR  an array of violations, each with:
 *        { fig, issue: 'past viewBox' | 'past box border', text, ... extents }
 *        { fig, issue: 'label collision', a, b, overlapX, overlapY, shorterLabelHeight }
 *   5. Fix each flagged item, reload, and re-run until it returns OK.
 *        - overflow: shorten / split to a 2nd line with <tspan dy> / widen the box /
 *          font-size 12. Multi-line <tspan> labels measure as the union of their lines
 *          (widest line wins), so the split fix converges.
 *        - label collision: the fix is usually layout, not nudging (move one label to
 *          its own edge, or re-flow the figure — diagram_guide.md Rules 3-5). A pair
 *          verified benign on a screenshot can be exempted by adding data-collision-ok
 *          to either <text>.
 *
 * MEASUREMENT NOTES
 *   - getBBox() is used instead of getComputedTextLength(): it respects text-anchor and
 *     measures multi-line <tspan> layout as a union, not an advance-width sum.
 *   - Every bbox is mapped from the element's local user space to the root <svg> user
 *     space via screen-CTM composition (all four corners, so rotated elements get their
 *     true axis-aligned envelope), and labels and rects inside nested
 *     <g transform="translate/scale/rotate(...)"> compare in one coordinate system.
 *   - Invisible text (visibility:hidden, or opacity:0 on the text or any ancestor inside
 *     the <svg> — e.g. a hidden draft label or a duplicate-text halo underlay) has no
 *     ink, so it is skipped entirely: it can neither overflow nor collide. display:none
 *     already yields no usable bbox. Text and rects inside <defs>, <symbol>, <clipPath>,
 *     <mask>, <marker>, or <pattern> are never drawn in place, so they are skipped too.
 *   - An <svg> without a viewBox attribute exposes viewBox.baseVal as an all-zero rect;
 *     the check falls back to clientWidth/Height (its user units ARE CSS px then).
 *
 * TUNING
 *   PAD = desired inner margin (px) between text and a box border, horizontal only —
 *   4 flags "cramped to the edge" as well as true overflow; set to 0 to flag only
 *   genuine spill-over. Vertical box overflow and viewBox spill use EPS-only (true
 *   spill), because vertical centering slack varies legitimately across box designs.
 *   MIN_OVERLAP_RATIO = 0.45 / EPS_X = 2 govern label collision: a CJK text bbox
 *   includes ascender/descender padding, so two-line labels written as two stacked
 *   <text> elements legitimately overlap em-boxes by 1-5px (~35% of glyph height at
 *   the tightest, measured across the tutorial corpus) without the ink touching,
 *   while a real collision overlaps ~half the glyph height or more (the 2026-06
 *   incident measured ≈60%). Both quantities scale with the rendered font, and the
 *   authored line step does not, so the ratio is stable across font stacks. Lower the
 *   ratio only with a new measured defect that slips under it.
 *
 * SCOPE
 *   Catches the three measurable text defects (past viewBox, past box border, label
 *   collision). It does NOT check connector crossings / arrow-piercing / stop-policy —
 *   those still need the rendered-screenshot pass (diagram_guide.md Rules 2-4).
 */
() => {
  const PAD = 4, EPS = 1, MIN_OVERLAP_RATIO = 0.45, EPS_X = 2, out = [];
  document.querySelectorAll('svg').forEach((svg, si) => {
    const rootCTM = svg.getScreenCTM();
    if (!rootCTM) return; // not rendered (e.g. display:none) — nothing measurable
    const inv = rootCTM.inverse();
    // Map an element-local bbox into the root <svg> user coordinate system, composing
    // the element's transform chain. All four corners are mapped — two opposite
    // corners underestimate the envelope of rotated elements.
    const bboxToRoot = (el) => {
      let b, ctm;
      try { b = el.getBBox(); ctm = el.getScreenCTM(); } catch (e) { return null; }
      if (!b || !ctm || (!b.width && !b.height)) return null;
      const m = inv.multiply(ctm);
      const pts = [
        [b.x, b.y], [b.x + b.width, b.y],
        [b.x, b.y + b.height], [b.x + b.width, b.y + b.height],
      ].map(([x, y]) => new DOMPoint(x, y).matrixTransform(m));
      const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
      return { left: Math.min(...xs), right: Math.max(...xs),
               top: Math.min(...ys), bottom: Math.max(...ys) };
    };
    // viewBox.baseVal is a truthy all-zero rect when the attribute is absent — fall back
    // to client size (without a viewBox, root user units are CSS px, so the spaces match).
    const vbRaw = svg.viewBox.baseVal;
    const vb = (vbRaw && vbRaw.width > 0)
      ? vbRaw
      : { x: 0, y: 0, width: svg.clientWidth, height: svg.clientHeight };
    const fig = (svg.getAttribute('aria-label') || ('svg#' + si)).slice(0, 40);
    // Rects inside <defs>/<clipPath>/<mask>/<marker>/<pattern>/<symbol> are never drawn
    // where they sit, so they are not boxes a label can overflow.
    const rects = [...svg.querySelectorAll('rect')]
      .filter(r => !r.closest('defs, clipPath, mask, marker, pattern, symbol'))
      .map(bboxToRoot).filter(Boolean);
    const area = r => (r.right - r.left) * (r.bottom - r.top);
    const labels = [];
    svg.querySelectorAll('text').forEach(t => {
      if (t.closest('defs, clipPath, mask, marker, pattern, symbol')) return; // never drawn in place
      // No ink: visibility is inherited, but opacity is not, so walk up to the <svg>.
      if (getComputedStyle(t).visibility === 'hidden') return;
      for (let n = t; n && n !== svg; n = n.parentElement) {
        if (parseFloat(getComputedStyle(n).opacity) === 0) return;
      }
      const tb = bboxToRoot(t);
      if (!tb) return;
      const snippet = (t.textContent || '').trim().slice(0, 28);
      labels.push({ snippet, b: tb, exempt: t.hasAttribute('data-collision-ok') });
      // 1) past the viewBox edge (either axis) → the label is visibly clipped
      if (vb.width > 0 && (tb.left < vb.x - EPS || tb.right > vb.x + vb.width + EPS ||
                           tb.top < vb.y - EPS || tb.bottom > vb.y + vb.height + EPS)) {
        out.push({ fig, text: snippet, issue: 'past viewBox',
          leftEdge: Math.round(tb.left), rightEdge: Math.round(tb.right),
          topEdge: Math.round(tb.top), bottomEdge: Math.round(tb.bottom),
          viewBoxX: [Math.round(vb.x), Math.round(vb.x + vb.width)],
          viewBoxY: [Math.round(vb.y), Math.round(vb.y + vb.height)] });
      }
      // 2) past the border of the innermost rect containing the text's center → overflows
      //    the box. Innermost = smallest: a lane, group frame, or background rect drawn
      //    earlier also contains the center and would hide a node-box overflow.
      //    (horizontal uses PAD = "cramped counts"; vertical uses EPS = true spill only)
      const cx = (tb.left + tb.right) / 2, cy = (tb.top + tb.bottom) / 2;
      const box = rects
        .filter(r => cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom)
        .reduce((best, r) => (!best || area(r) < area(best) ? r : best), null);
      if (box) {
        if (tb.left < box.left + PAD - EPS || tb.right > box.right - PAD + EPS ||
            tb.top < box.top - EPS || tb.bottom > box.bottom + EPS) {
          out.push({ fig, text: snippet, issue: 'past box border',
            textWidth: Math.round(tb.right - tb.left),
            boxInnerWidth: Math.round(box.right - box.left - 2 * PAD) });
        }
      }
    });
    // 3) label-vs-label collision, ratio-thresholded (see TUNING)
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        if (labels[i].exempt || labels[j].exempt) continue;
        const a = labels[i].b, b = labels[j].b;
        const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        const minH = Math.min(a.bottom - a.top, b.bottom - b.top);
        if (ox > EPS_X && oy > MIN_OVERLAP_RATIO * minH) {
          out.push({ fig, issue: 'label collision',
            a: labels[i].snippet, b: labels[j].snippet,
            overlapX: Math.round(ox), overlapY: Math.round(oy),
            shorterLabelHeight: Math.round(minH) });
        }
      }
    }
  });
  if (out.length) return out;
  // An SVG embedded as <img> (the Excalidraw fallback) has no DOM here to measure.
  const imgs = [...document.querySelectorAll('img')].filter(i => /\.svg(\?|#|$)/i.test(i.getAttribute('src') || ''));
  return 'OK: no SVG text defects' + (imgs.length
    ? ` in inline <svg>; ${imgs.length} <img> SVG(s) not measured: open each .svg file directly and run this check there`
    : '');
}
