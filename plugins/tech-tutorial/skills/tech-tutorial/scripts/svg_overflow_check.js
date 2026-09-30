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
 *        whose screenshot was skipped),
 *     4. any label that runs across a painted connector — <line>, <polyline>, <path>,
 *        or a marker arrowhead on one ('crosses connector'),
 *     5. any label that runs across the outline of a <rect>/<ellipse>/<circle>/<polygon>
 *        that is not its own node, e.g. a dashed lane or group frame ('crosses shape
 *        border'). 4 and 5 were added after a 2026-09 run in which an edge label ran into
 *        a frame border and another ran across an arrow, and this check still said OK.
 *   Text inside <foreignObject> is HTML layout that getBBox cannot see, so it is reported
 *   as 'not measured' instead of passing silently.
 *   Run it on every chapter before declaring the tutorial done — it is the GATE, not
 *   the eyeball.
 *
 * HOW TO RUN (use whatever browser-eval your environment has)
 *   1. Serve the tutorial and this scripts dir under ONE origin (background), so the
 *      page can fetch the checker. An MCP browser sandbox cannot read local files.
 *        mkdir -p /tmp/tt-serve && ln -sfn "$(cd <tutorial-dir> && pwd)" /tmp/tt-serve/t &&
 *        ln -sfn <plugin-root>/skills/tech-tutorial/scripts /tmp/tt-serve/s &&
 *        python3 -m http.server 8765 --directory /tmp/tt-serve
 *      (<plugin-root> = the absolute path SKILL.md Phase 5 gives; CLAUDE_PLUGIN_ROOT is
 *      substituted into SKILL.md text, not exported to the shell.)
 *   2. Open http://localhost:8765/t/<chapter>.html
 *   3. Evaluate (Playwright MCP browser_evaluate, chrome-devtools evaluate_script, or
 *      the DevTools console):
 *        async () => (0, eval)(await (await fetch('/s/svg_overflow_check.js')).text())()
 *      The file is a bare arrow function: evaluating its text yields the function
 *      uncalled, hence the trailing (). Headless Playwright from Node/Python instead:
 *      page.evaluate(`(${src})()`) with src read from this file.
 *   4. Result is "OK: no SVG text defects"  OR  an array of violations, each with:
 *        { fig, issue: 'past viewBox' | 'past box border', text, ... extents }
 *        { fig, issue: 'label collision', a, b, overlapX, overlapY, shorterLabelHeight }
 *        { fig, issue: 'crosses connector', text, connector: 'path.diagram-ink', at: [x, y],
 *          arrowhead?: true }
 *        { fig, issue: 'crosses shape border', text, shape: 'rect.diagram-soft', at: [x, y] }
 *        (at = where the crossing sits, in viewBox units)
 *        { fig, issue: 'not measured (foreignObject)', text }
 *   5. Fix each flagged item, reload, and re-run until it returns OK.
 *        - overflow: shorten / split to a 2nd line with <tspan dy> / widen the box /
 *          font-size 12. Multi-line <tspan> labels measure as the union of their lines
 *          (widest line wins), so the split fix converges.
 *        - label collision: the fix is usually layout, not nudging (move one label to
 *          its own edge, or re-flow the figure — diagram_guide.md Rules 3-5). A pair
 *          verified benign on a screenshot can be exempted by adding data-collision-ok
 *          to either <text>.
 *        - crosses connector / crosses shape border: move the label clear of the stroke
 *          (beside its edge, not on it), or reroute the edge / resize the frame. The same
 *          data-collision-ok on the <text> exempts a crossing verified benign on a
 *          screenshot (a legend-style title set on a frame border, a value over a grid
 *          line). One attribute on purpose: it means "this label's overlaps were checked
 *          by eye", whatever it overlaps. It does not exempt overflow or viewBox checks.
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
 *   - Crossings test the text bbox against the stroke's centerline: segments are exact
 *     for <line>, <polyline>, <polygon>, and <rect> (corner rounding ignored); <path>,
 *     <ellipse>, and <circle> are sampled every ~2px with getPointAtLength. The text box
 *     is shrunk by INSET and grown by half the stroke width, so a label resting on its
 *     edge is not flagged. Geometry with no painted stroke is skipped (a node shape also
 *     counts if its fill shows), as is anything inside <defs>/<marker>/etc. and anything
 *     invisible. Arrowheads come from marker-start/marker-end (orient, refX/refY,
 *     markerUnits, viewBox scaling). A connector or frame painted BEFORE the label's
 *     opaque container is under that node's fill, so it cannot cross the label and is
 *     skipped.
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
 *   INSET = 2 governs crossings. With the template's 11px edge-label on a 1.4px stroke,
 *   a label is flagged once its em-box overlaps the line by more than ~1.3px. That is
 *   where descenders (label above the line) or ascenders (label below it) start touching
 *   the stroke, so a label resting on its edge still passes.
 *
 * SCOPE
 *   Catches the five measurable text defects (past viewBox, past box border, label
 *   collision, crosses connector, crosses shape border) and flags <foreignObject> text
 *   it cannot measure. A node drawn as a <path> is not a container, so a label
 *   overflowing it is caught only if the label crosses the path's outline, which is then
 *   reported as 'crosses connector'. Not modeled: marker-mid, transforms on a marker's
 *   own children, <use>/<image> content, and label-over-fill with no edge in the label
 *   box. Labels deliberately set over grid or axis lines are flagged; exempt them. It does
 *   NOT check connector-vs-connector crossings, arrows piercing nodes, stop policy, or
 *   whether a label sits next to the thing it names. A label floating 55px from its edge
 *   passes every rule here. Those still need the rendered-screenshot pass
 *   (diagram_guide.md Rules 2-4).
 */
() => {
  const PAD = 4, EPS = 1, MIN_OVERLAP_RATIO = 0.45, EPS_X = 2, INSET = 2, out = [];
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
    // No ink: visibility is inherited, but opacity is not, so walk up to the <svg>.
    const inkless = (el) => {
      if (getComputedStyle(el).visibility === 'hidden') return true;
      for (let n = el; n && n !== svg; n = n.parentElement) {
        if (parseFloat(getComputedStyle(n).opacity) === 0) return true;
      }
      return false;
    };
    // Alpha of a computed fill/stroke: 0 for none or transparent, 1 for url(#gradient).
    const alpha = (paint, opacity) => {
      if (!paint || paint === 'none') return 0;
      const a = /rgba\([^)]*,\s*([\d.]+)\)/.exec(paint);
      return (a ? parseFloat(a[1]) : 1) * parseFloat(opacity);
    };
    const shapes = [...svg.querySelectorAll('rect, ellipse, circle, polygon')]
      .filter(s => !s.closest(NEVER_DRAWN))
      .map(el => {
        const b = bboxToRoot(el);
        if (!b) return null;
        const m = inv.multiply(el.getScreenCTM());
        const toLocal = m.inverse();
        const box = el.tagName.toLowerCase() === 'rect' && m.b === 0 && m.c === 0;
        const cs = getComputedStyle(el);
        return Object.assign(b, { el, box,
          // An opaque node hides whatever was painted before it (see crossings below).
          opaque: alpha(cs.fill, cs.fillOpacity) * parseFloat(cs.opacity) >= 0.9,
          inside: (x, y) => el.isPointInFill(new DOMPoint(x, y).matrixTransform(toLocal)) });
      }).filter(Boolean);
    // Painted geometry a label can run across, as root-space segments
    // [x1, y1, x2, y2, halfStrokeWidth, isArrowhead]. line/polyline/polygon/rect
    // outlines are exact (affine maps keep segments straight; rect corner rounding is
    // ignored); ellipse, circle and path are sampled every ~2 root px.
    const localPts = (el, scale) => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'line') {
        return { pts: [[el.x1.baseVal.value, el.y1.baseVal.value], [el.x2.baseVal.value, el.y2.baseVal.value]] };
      }
      if (tag === 'polyline' || tag === 'polygon') {
        const pl = el.points;
        return { pts: Array.from({ length: pl.numberOfItems }, (_, i) => [pl.getItem(i).x, pl.getItem(i).y]),
                 closed: tag === 'polygon' };
      }
      if (tag === 'rect') {
        const { x, y, width: w, height: h } = el.getBBox();
        return { pts: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], closed: true };
      }
      const len = el.getTotalLength();
      const n = Math.min(2000, Math.max(8, Math.ceil(len * scale / 2)));
      return { pts: Array.from({ length: n + 1 }, (_, i) => {
        const p = el.getPointAtLength(len * i / n);
        return [p.x, p.y];
      }), step: len * scale / n };
    };
    const toSegs = ({ pts, closed, step }, m, half, arrow) => {
      const r = pts.map(([x, y]) => new DOMPoint(x, y).matrixTransform(m));
      if (closed && r.length > 2) r.push(r[0]);
      const segs = [];
      for (let i = 1; i < r.length; i++) {
        const [a, b] = [r[i - 1], r[i]];
        // A chord far longer than its arc step is the jump between two subpaths of a
        // sampled <path>, not drawn geometry.
        if (step && Math.hypot(b.x - a.x, b.y - a.y) > 3 * step + 1) continue;
        segs.push([a.x, a.y, b.x, b.y, half, arrow]);
      }
      return segs;
    };
    const det = m => Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
    // Arrowheads: a marker is drawn at the first/last vertex, turned to the path
    // direction (orient auto / auto-start-reverse / fixed angle), scaled by the stroke
    // width (markerUnits=strokeWidth, the default) and its viewBox, with refX/refY on the
    // vertex. Marker children's own transforms and marker-mid are not modeled.
    const arrowheads = (el, cs, local, m) => {
      const p = local.pts, n = p.length, segs = [];
      if (n < 2) return segs;
      const ends = [['markerStart', p[0], p[1], true], ['markerEnd', p[n - 1], p[n - 2], false]];
      for (const [prop, [x, y], [ox, oy], start] of ends) {
        const id = /url\(["']?#([^"')]+)/.exec(cs[prop] || '');
        const mk = id && document.getElementById(id[1]); // url(#id) resolves page-wide
        if (!mk || mk.tagName.toLowerCase() !== 'marker') continue;
        const orient = mk.getAttribute('orient') || '0';
        const dir = Math.atan2(start ? oy - y : y - oy, start ? ox - x : x - ox) * 180 / Math.PI;
        const ang = /^auto/.test(orient)
          ? dir + (start && orient === 'auto-start-reverse' ? 180 : 0)
          : parseFloat(orient) || 0;
        const vbm = mk.viewBox.baseVal;
        const s = (mk.markerUnits.baseVal === SVGMarkerElement.SVG_MARKERUNITS_STROKEWIDTH
                     ? parseFloat(cs.strokeWidth) : 1) *
                  (vbm && vbm.width > 0 && vbm.height > 0
                     ? Math.min(mk.markerWidth.baseVal.value / vbm.width,
                                mk.markerHeight.baseVal.value / vbm.height) : 1);
        const mm = m.translate(x, y).rotate(ang).scale(s)
          .translate(-mk.refX.baseVal.value, -mk.refY.baseVal.value);
        mk.querySelectorAll('path, line, polyline, polygon, rect, circle, ellipse').forEach(c => {
          try { segs.push(...toSegs(localPts(c, det(mm)), mm, 0, true)); } catch (e) { /* no geometry */ }
        });
      }
      return segs;
    };
    const CONNECTOR = new Set(['line', 'polyline', 'path']);
    const crossables = [...svg.querySelectorAll('rect, ellipse, circle, polygon, line, polyline, path')]
      .filter(el => !el.closest(NEVER_DRAWN) && !inkless(el))
      .map(el => {
        const cs = getComputedStyle(el), tag = el.tagName.toLowerCase();
        let m, local;
        try { m = inv.multiply(el.getScreenCTM()); local = localPts(el, det(m)); } catch (e) { return null; }
        const stroked = alpha(cs.stroke, cs.strokeOpacity) > 0 && parseFloat(cs.strokeWidth) > 0;
        const connector = CONNECTOR.has(tag);
        // A connector counts only if its stroke shows; a node shape if stroke OR fill shows.
        const segs = (stroked || (!connector && alpha(cs.fill, cs.fillOpacity) > 0))
          ? toSegs(local, m, stroked ? parseFloat(cs.strokeWidth) * det(m) / 2 : 0, false) : [];
        if (connector) segs.push(...arrowheads(el, cs, local, m));
        if (!segs.length) return null;
        const cls = el.getAttribute('class');
        return { el, connector, segs, name: tag + (cls ? '.' + cls.trim().split(/\s+/).join('.') : '') };
      }).filter(Boolean);
    // Liang-Barsky: the midpoint of segment s clipped to box r, or null if it misses.
    const clip = (s, r) => {
      const [x1, y1, x2, y2] = s, dx = x2 - x1, dy = y2 - y1;
      let t0 = 0, t1 = 1;
      for (const [p, q] of [[-dx, x1 - r.left], [dx, r.right - x1], [-dy, y1 - r.top], [dy, r.bottom - y1]]) {
        if (p === 0) { if (q < 0) return null; continue; }
        const t = q / p;
        if (p < 0) { if (t > t1) return null; if (t > t0) t0 = t; }
        else { if (t < t0) return null; if (t < t1) t1 = t; }
      }
      const t = (t0 + t1) / 2;
      return [Math.round(x1 + t * dx), Math.round(y1 + t * dy)];
    };
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
      if (t.closest(NEVER_DRAWN) || inkless(t)) return; // never drawn in place / no ink
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
      // 3) crossings: the text bbox, shrunk by INSET (its ascender/descender padding is
      //    not ink) and grown by the stroke's half-width, meets a painted connector
      //    (line / polyline / path, plus its marker arrowheads) or the outline of a shape
      //    that is not this label's container (the container is check 2's job). Paint
      //    order matters: a geometry drawn BEFORE an opaque container is hidden under it
      //    (a center-to-center edge under its node, a frame border under a node).
      if (t.hasAttribute('data-collision-ok')) return;
      for (const g of crossables) {
        if (box && g.el === box.el) continue;
        if (box && box.opaque &&
            (g.el.compareDocumentPosition(box.el) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
        for (const s of g.segs) {
          const grow = s[4] - INSET;
          const r = { left: tb.left - grow, right: tb.right + grow,
                      top: tb.top - grow, bottom: tb.bottom + grow };
          if (r.left >= r.right || r.top >= r.bottom) continue;
          const at = clip(s, r);
          if (!at) continue;
          out.push(g.connector
            ? { fig, text: snippet, issue: 'crosses connector', connector: g.name,
                ...(s[5] ? { arrowhead: true } : {}), at }
            : { fig, text: snippet, issue: 'crosses shape border', shape: g.name, at });
          break; // one report per label and geometry
        }
      }
    });
    // 4) label-vs-label collision, ratio-thresholded (see TUNING)
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
