/*
 * svg_overflow_check.js — deterministic SVG text-overflow detector for tech-tutorial figures.
 *
 * WHY THIS EXISTS
 *   Hand-estimating label width is unreliable: real labels mix Han characters (~1em),
 *   Latin (~0.55em), digits (~0.6em), spaces (~0.25em) and punctuation, so the
 *   character-count formula is wrong often enough that "文字溢出框线" keeps slipping
 *   through screenshot review. This measures the REAL rendered extent of every <text>
 *   via getBBox(), mapped through the element's full transform chain into the root
 *   <svg> coordinate system, and flags any label that spills past its viewBox (gets
 *   clipped) or past its containing <rect> border (overflows the box).
 *   Run it on every chapter before declaring the tutorial done — it is the GATE, not
 *   the eyeball.
 *
 * HOW TO RUN (use whatever browser-eval your environment has)
 *   1. Serve the tutorial:           python3 -m http.server 8765   (in the tutorial dir, background)
 *   2. Load a chapter in a browser:  http://localhost:8765/01-concepts.html
 *   3. Evaluate the function below against the page:
 *        - Playwright MCP:  browser_evaluate  with the trailing arrow function
 *        - headless Playwright (python):
 *            page.evaluate(open(os.environ['CLAUDE_PLUGIN_ROOT'] + '/skills/tech-tutorial/scripts/svg_overflow_check.js').read())
 *          (cwd is the tutorial dir, so use the plugin-root path, not a bare filename)
 *        - DevTools console:  paste the body of the arrow function, then call it
 *   4. Result is "OK: no SVG text overflow"  OR  an array of violations, each with:
 *        { fig, text, issue: 'past viewBox' | 'past box border', ... extents }
 *   5. Fix each flagged label (shorten / split to a 2nd line with <tspan dy> / widen the
 *      box / font-size 12), reload, and re-run until it returns OK. Multi-line <tspan>
 *      labels measure as the union of their lines (widest line wins), so the split fix
 *      converges.
 *
 * MEASUREMENT NOTES
 *   - getBBox() is used instead of getComputedTextLength(): it respects text-anchor and
 *     measures multi-line <tspan> layout as a union, not an advance-width sum.
 *   - Every bbox is mapped from the element's local user space to the root <svg> user
 *     space via screen-CTM composition, so labels and rects inside nested
 *     <g transform="translate/scale(...)"> compare in one coordinate system. Rotated
 *     elements are bounded by their axis-aligned envelope (slightly conservative).
 *   - An <svg> without a viewBox attribute exposes viewBox.baseVal as an all-zero rect;
 *     the check falls back to clientWidth/Height (its user units ARE CSS px then).
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
    const rootCTM = svg.getScreenCTM();
    if (!rootCTM) return; // not rendered (e.g. display:none) — nothing measurable
    const inv = rootCTM.inverse();
    // Map an element-local bbox into the root <svg> user coordinate system,
    // composing the element's transform chain (handles nested <g transform>).
    const bboxToRoot = (el) => {
      let b, ctm;
      try { b = el.getBBox(); ctm = el.getScreenCTM(); } catch (e) { return null; }
      if (!b || !ctm || (!b.width && !b.height)) return null;
      const m = inv.multiply(ctm);
      const p1 = new DOMPoint(b.x, b.y).matrixTransform(m);
      const p2 = new DOMPoint(b.x + b.width, b.y + b.height).matrixTransform(m);
      return { left: Math.min(p1.x, p2.x), right: Math.max(p1.x, p2.x),
               top: Math.min(p1.y, p2.y), bottom: Math.max(p1.y, p2.y) };
    };
    // viewBox.baseVal is a truthy all-zero rect when the attribute is absent — fall back
    // to client size (without a viewBox, root user units are CSS px, so the spaces match).
    const vbRaw = svg.viewBox.baseVal;
    const vb = (vbRaw && vbRaw.width > 0)
      ? vbRaw
      : { x: 0, y: 0, width: svg.clientWidth, height: svg.clientHeight };
    const fig = (svg.getAttribute('aria-label') || ('svg#' + si)).slice(0, 40);
    const rects = [...svg.querySelectorAll('rect')].map(bboxToRoot).filter(Boolean);
    svg.querySelectorAll('text').forEach(t => {
      const tb = bboxToRoot(t);
      if (!tb) return;
      const snippet = (t.textContent || '').trim().slice(0, 28);
      // 1) past the viewBox edge → the label is visibly clipped
      if (vb.width > 0 && (tb.left < vb.x - EPS || tb.right > vb.x + vb.width + EPS)) {
        out.push({ fig, text: snippet, issue: 'past viewBox',
          leftEdge: Math.round(tb.left), rightEdge: Math.round(tb.right),
          viewBoxX: [Math.round(vb.x), Math.round(vb.x + vb.width)] });
      }
      // 2) past the border of the rect containing the text's center → overflows the box
      const cx = (tb.left + tb.right) / 2, cy = (tb.top + tb.bottom) / 2;
      const box = rects.find(r => cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom);
      if (box) {
        if (tb.left < box.left + PAD - EPS || tb.right > box.right - PAD + EPS) {
          out.push({ fig, text: snippet, issue: 'past box border',
            textWidth: Math.round(tb.right - tb.left),
            boxInnerWidth: Math.round(box.right - box.left - 2 * PAD) });
        }
      }
    });
  });
  return out.length ? out : 'OK: no SVG text overflow';
}
