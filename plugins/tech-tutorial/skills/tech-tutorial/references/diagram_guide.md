# Diagram Guide

A diagram earns space only when it carries information prose cannot carry as compactly: structure, sequence, hierarchy, state, comparison, or flow. Decorative figures add extraneous load and must be deleted.

Tech-tutorial output uses inline hand-authored SVG in standalone HTML. Use Mermaid only in Markdown fallback mode when the host renderer supports it.

## Why Inline SVG

- Matches the minimal monochrome visual identity.
- Gives exact control over labels, arrows, and spacing.
- Avoids runtime rendering dependencies.
- Keeps each chapter self-contained.

The cost is coordinate discipline. Use the CSS utilities from `layout-template.html` and verify every figure in a browser.

## CSS Utility Classes

The layout template defines these SVG classes:

| Class | Use |
|---|---|
| `.diagram-ink` | Primary strokes. |
| `.diagram-accent` | Sparse red accent strokes. |
| `.diagram-soft` | Secondary strokes. |
| `.node-fill` | Neutral node fill. |
| `.node-fill-accent` | Accent node fill. |
| `.node-label` | Default node name. |
| `.node-label-accent` | Emphasized node name. |
| `.edge-label` | Edge or annotation label. |
| `.branch-label` | Small branch label. |

Every HTML file must contain the SVG utility CSS, even if the first draft of that chapter has no figure. Later-added figures otherwise render as black rectangles.

## Diagram Selection Matrix

| Content | Diagram type |
|---|---|
| Concepts and relationships | Concept map. |
| Request lifecycle, protocol exchange, pipeline | Sequence or flow diagram. |
| Internal architecture | Layered component diagram. |
| State transitions | State machine. |
| Alternatives and tradeoffs | Decision table or comparison map. |
| Error causes | Cause-and-effect map. |
| Hands-on progression | Scaffold progression diagram. |
| Self-check chapter | The reference answer to the reader-drawing prompt (usually the index concept map), inside the answer `<details>`. |

Do not use a diagram for three already-clear linear steps. Use prose or a table.

## Base Figure Pattern

```html
<figure>
  <svg viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg" role="img"
       aria-label="How requests move through the system">
    <defs>
      <marker id="arrow-ink-1" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#0A0A0A"/>
      </marker>
    </defs>

    <rect x="40" y="120" width="140" height="64" rx="6"
          class="diagram-ink node-fill"/>
    <text x="110" y="148" text-anchor="middle" class="node-label">Client</text>
    <text x="110" y="168" text-anchor="middle" class="edge-label">sends request</text>

    <line x1="180" y1="152" x2="280" y2="152"
          class="diagram-ink" marker-end="url(#arrow-ink-1)"/>
  </svg>
  <figcaption><span class="fig-num">Fig. 1.1</span>The request becomes explicit at the boundary.
    <strong>Notice</strong>: the boundary owns validation.</figcaption>
</figure>
```

Give each figure its own marker id (`arrow-ink-1`, `arrow-ink-2`, ...): `url(#id)` resolves to the first element with that id on the page, so a shared id borrows another figure's marker, and every later arrowhead disappears when that first copy sits inside a closed `<details>`.

## Layout Rules

### 1. Fit Text To Nodes

Choose the label first, then size the node to the rendered text plus padding. Do not cram long labels into fixed boxes.

Start with these rough budgets at 13px:

- 140px node: about 16 ASCII characters.
- 200px node: about 24 ASCII characters.
- Long labels should split into a name line and a smaller explanatory line.

Mixed digits, punctuation, and code-like names make estimates unreliable. The browser measurement script is the gate.

### 2. Stop Arrows At Edges

Arrow tips touch the target edge or corner. They do not pierce the node interior.

For left-to-right flow:

```html
<line x1="{{sourceRight}}" y1="{{sourceMidY}}"
      x2="{{targetLeftMinusGap}}" y2="{{targetMidY}}"
      marker-end="url(#arrow-ink-{{N}})" class="diagram-ink"/>
```

Keep a consistent gap policy across a diagram.

### 3. Avoid Connector Crossings

If connectors cross, change the layout instead of adding bends as decoration. Typical fixes:

- Move from a radial layout to rows.
- Group related nodes.
- Use swimlanes.
- Split a dense concept map into two figures.

### 4. Keep Labels Attached

Edge labels should sit near their edge, not float in open space. Free-floating labels collide easily and create split attention.

### 5. Verify Label Collisions

Two labels that do not overlap in source order can overlap after transforms or responsive scaling. Run the script and inspect screenshots. Fix a collision with layout (move a label to its own edge, or re-flow the figure) rather than by nudging it a few pixels. A pair verified benign on a screenshot can be exempted with `data-collision-ok` on either `<text>`.

## Common Patterns

Each pattern shows only the `<svg>`. Wrap it in the Base Figure Pattern's `<figure>` with a `<figcaption>`: `verify_structure.sh` counts `<figure>` elements, not bare `<svg>`.

### Pattern 1 - Layered Architecture

Use when explaining boundaries or ownership.

```html
<svg viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Three-layer architecture">
  <rect x="70" y="60" width="540" height="70" rx="8" class="diagram-ink node-fill"/>
  <text x="340" y="100" text-anchor="middle" class="node-label">Interface layer</text>

  <rect x="70" y="150" width="540" height="70" rx="8" class="diagram-ink node-fill"/>
  <text x="340" y="190" text-anchor="middle" class="node-label">Domain layer</text>

  <rect x="70" y="240" width="540" height="70" rx="8" class="diagram-ink node-fill"/>
  <text x="340" y="280" text-anchor="middle" class="node-label">Storage layer</text>
</svg>
```

### Pattern 2 - Sequence

Use for protocols, request lifecycles, and async order.

```html
<svg viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Sequence across three actors">
  <line x1="120" y1="60" x2="120" y2="300" class="diagram-soft"/>
  <line x1="340" y1="60" x2="340" y2="300" class="diagram-soft"/>
  <line x1="560" y1="60" x2="560" y2="300" class="diagram-soft"/>
  <text x="120" y="40" text-anchor="middle" class="node-label">Client</text>
  <text x="340" y="40" text-anchor="middle" class="node-label">Server</text>
  <text x="560" y="40" text-anchor="middle" class="node-label">Store</text>
</svg>
```

### Pattern 3 - State Machine

Use for lifecycle, retries, scheduling, and protocol states.

```html
<svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="State transition diagram">
  <rect x="70" y="120" width="130" height="60" rx="30" class="diagram-ink node-fill"/>
  <text x="135" y="155" text-anchor="middle" class="node-label">Pending</text>
  <rect x="275" y="120" width="130" height="60" rx="30" class="diagram-ink node-fill"/>
  <text x="340" y="155" text-anchor="middle" class="node-label">Running</text>
  <rect x="480" y="120" width="130" height="60" rx="30" class="diagram-ink node-fill"/>
  <text x="545" y="155" text-anchor="middle" class="node-label">Complete</text>
</svg>
```

### Pattern 4 - Tradeoff Map

Use when the tutorial needs the reader to discriminate between approaches.

```html
<svg viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Tradeoff map">
  <line x1="120" y1="280" x2="560" y2="280" class="diagram-ink"/>
  <line x1="120" y1="280" x2="120" y2="80" class="diagram-ink"/>
  <text x="560" y="306" text-anchor="end" class="edge-label">higher throughput</text>
  <text x="88" y="84" text-anchor="middle" class="edge-label" transform="rotate(-90 88 84)">lower latency</text>
  <circle cx="250" cy="210" r="8" class="diagram-accent node-fill-accent"/>
  <text x="250" y="235" text-anchor="middle" class="node-label">Approach A</text>
</svg>
```

### Pattern 5 - Concept Map

Use in `index.html`. Keep it to 5-10 nodes. If you need more, split the map.

Each edge label should be a relationship verb such as "owns", "produces", "invalidates", "schedules", or "persists". If you cannot label an edge, the relation is unclear.

## Self-Verification

Run both automated and visual checks.

### Automated Text Defect Check

Serve the tutorial and evaluate `"${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/svg_overflow_check.js"` in the page context (the working directory is the tutorial folder, so a bare `scripts/...` path does not resolve). It reports:

- SVG text that spills outside its node. Nodes are `<rect>`, `<ellipse>`, `<circle>`, and `<polygon>` (diamond decision nodes); a label belongs to the innermost node holding its center or its anchored end, so a left- or right-anchored label that runs far past a narrow box is still caught. Curved, polygon, and rotated nodes are checked against their real outline, not their bounding box. A node drawn as `<path>` is not checked.
- SVG text that spills outside the viewBox.
- Free-floating label collisions.
- `crosses connector`: a label runs across a stroked `<line>`, `<polyline>`, or `<path>`, or across an arrowhead drawn by `marker-start`/`marker-end`. Move the label beside its edge, not onto it. A label resting on the edge passes: the check ignores the empty em-box padding above and below the glyphs.
- `crosses shape border`: a label runs across the outline of a shape that is not its own node, such as a dashed lane or group frame (`diagram-soft`) whose border cuts through an edge label.
- Crossings hidden under an opaque node are skipped. For example, a connector drawn center-to-center before the nodes that cover it is not reported.
- Text inside `<foreignObject>`, as `not measured (foreignObject)`: the script cannot measure HTML layout, so write figure labels as SVG `<text>`/`<tspan>`.

`data-collision-ok` on a `<text>` exempts that label from collisions and from both crossing checks. Use it only after a screenshot shows the overlap is intended, as with a title set on a frame border or a value over a grid line. It does not exempt overflow. The script cannot tell whether a label sits next to the thing it names, so a label floating far from its edge passes. Screenshot inspection must catch that (Rule 4).

Fix and rerun until the script reports:

```text
OK: no SVG text defects
```

### Screenshot Inspection

Capture every figure as `<chapter>-figN.png` (for example `01-concepts-fig2.png`) and inspect:

- Connector crossings.
- Lines through unrelated labels.
- Arrow tips inside boxes.
- Inconsistent arrow gaps.
- Cropped content.
- Labels that visually collide even if intentionally exempted.

Then prove coverage:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/verify_structure.sh" <tutorial-dir> <screenshot-dir>
```

Screenshots must be newer than the HTML files.

## Excalidraw Fallback

Use Excalidraw or another editable drawing source only for unusually complex maps where hand-authored SVG would become unmaintainable. Export SVG, embed it with `<img src="concept-map.svg">`, and keep the source file beside the export.

Do not use this fallback to avoid ordinary SVG layout work.
