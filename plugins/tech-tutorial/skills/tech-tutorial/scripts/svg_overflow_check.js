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
 *     2. any label that spills past its node's border (overflows the box) — nodes are
 *        <rect>, <ellipse>, <circle>, and <polygon> (e.g. diamond decision nodes),
 *     3. any TWO labels whose rendered boxes overlap each other (label collision —
 *        added after a shipped 2026-06 defect: two labels collided in the one figure
 *        whose screenshot was skipped).
 *   Text inside <foreignObject> is HTML layout that getBBox cannot see, so it is reported
 *   as 'not measured' instead of passing silently.
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
 *        { fig, issue: 'not measured (foreignObject)', text }
 *   5. Fix each flagged item, reload, and re-run until it returns OK.
 *        - overflow: shorten / split to a 2nd line with <tspan dy> / widen the box /
 *          font-size 12. Multi-line <tspan> labels measure as the union of their lines
 *          (widest line wins), so the split fix converges.
 *        - label collision: the fix is usually layout, not nudging (move one label to
 *          its own edge, or re-flow the figure — diagram_guide.md Rules 3-5). A pair
 *          verified benign on a screenshot can be exempted by adding data-collision-ok
 *          to either <text>.
 *        - not measured (foreignObject): rewrite the label as SVG <text>/<tspan> so it
 *          can be measured.
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
 *   - A label belongs to the innermost (smallest) node holding its center OR either
 *     anchored end (rendered start of the first glyph / end of the last). A start- or
 *     end-anchored label that overflows far enough leaves its center outside its node,
 *     but its anchored end stays inside. A free label with none of those points inside
 *     any node (edge label, caption beside a dot) has no node and is not box-checked.
 *   - An axis-aligned <rect> is checked by bbox (PAD horizontally, EPS vertically).
 *     Ellipse, circle, polygon, and rotated/skewed rect nodes are checked by testing all
 *     four text-bbox corners (inset by EPS) against the true outline with isPointInFill,
 *     so a label that fits a diamond's bounding box but crosses its slanted edge is
 *     still flagged. <path> is never treated as a node (it is usually a connector).
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
 *   collision) and flags <foreignObject> text it cannot measure. A node drawn as a
 *   <path> is not a container, so a label overflowing it is not caught. It does NOT
 *   check connector crossings / arrow-piercing / stop-policy — those still need the
 *   rendered-screenshot pass (diagram_guide.md Rules 2-4).
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
    // Node shapes a label can overflow. Shapes inside <defs>/<clipPath>/<mask>/<marker>/
    // <pattern>/<symbol> are never drawn where they sit, so they are not boxes. An
    // axis-aligned rect keeps the bbox test (PAD-aware); ellipse, circle, polygon and
    // rotated/skewed rects are tested against their true outline via isPointInFill.
    const NEVER_DRAWN = 'defs, clipPath, mask, marker, pattern, symbol';
    const shapes = [...svg.querySelectorAll('rect, ellipse, circle, polygon')]
      .filter(s => !s.closest(NEVER_DRAWN))
      .map(el => {
        const b = bboxToRoot(el);
        if (!b) return null;
        const m = inv.multiply(el.getScreenCTM());
        const toLocal = m.inverse();
        const box = el.tagName.toLowerCase() === 'rect' && m.b === 0 && m.c === 0;
        return Object.assign(b, { box,
          inside: (x, y) => el.isPointInFill(new DOMPoint(x, y).matrixTransform(toLocal)) });
      }).filter(Boolean);
    const inBBox = (r, p) => p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom;
    const contains = (s, p) => inBBox(s, p) && (s.box || s.inside(p.x, p.y));
    const area = r => (r.right - r.left) * (r.bottom - r.top);
    // Where the author anchored the label, in root space: the rendered start of its first
    // glyph and end of its last (dx/dy and text-anchor already applied). A start- or
    // end-anchored label that overflows its node leaves its center outside the node, but
    // its anchored end stays inside.
    const anchors = (t) => {
      try {
        const n = t.getNumberOfChars();
        if (!n) return [];
        const m = inv.multiply(t.getScreenCTM());
        return [t.getStartPositionOfChar(0), t.getEndPositionOfChar(n - 1)]
          .map(p => new DOMPoint(p.x, p.y).matrixTransform(m));
      } catch (e) { return []; }
    };
    // Text in <foreignObject> is HTML layout, which getBBox does not see — say so rather
    // than pass it silently.
    svg.querySelectorAll('foreignObject').forEach(fo => {
      if (fo.closest(NEVER_DRAWN) || !bboxToRoot(fo)) return;
      const snippet = (fo.textContent || '').trim().slice(0, 28);
      if (snippet) out.push({ fig, text: snippet, issue: 'not measured (foreignObject)' });
    });
    const labels = [];
    svg.querySelectorAll('text').forEach(t => {
      if (t.closest(NEVER_DRAWN)) return; // never drawn in place
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
      // 2) past the border of the innermost shape holding the label's center or either
      //    anchored end → overflows the node. Innermost = smallest: a lane, group frame,
      //    or background rect drawn earlier also holds those points and would hide a
      //    node-box overflow. A free label (every point outside every node) is not checked.
      //    Axis-aligned rect: horizontal uses PAD = "cramped counts", vertical uses
      //    EPS = true spill only. Other shapes: every text-bbox corner (inset by EPS)
      //    must lie inside the outline.
      const pts = [new DOMPoint((tb.left + tb.right) / 2, (tb.top + tb.bottom) / 2), ...anchors(t)];
      const box = shapes
        .filter(s => pts.some(p => contains(s, p)))
        .reduce((best, s) => (!best || area(s) < area(best) ? s : best), null);
      if (box) {
        const spills = box.box
          ? (tb.left < box.left + PAD - EPS || tb.right > box.right - PAD + EPS ||
             tb.top < box.top - EPS || tb.bottom > box.bottom + EPS)
          : [[tb.left + EPS, tb.top + EPS], [tb.right - EPS, tb.top + EPS],
             [tb.left + EPS, tb.bottom - EPS], [tb.right - EPS, tb.bottom - EPS]]
              .some(([x, y]) => !box.inside(x, y));
        if (spills) {
          out.push({ fig, text: snippet, issue: 'past box border',
            textWidth: Math.round(tb.right - tb.left),
            boxInnerWidth: Math.round(box.right - box.left - (box.box ? 2 * PAD : 0)) });
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
