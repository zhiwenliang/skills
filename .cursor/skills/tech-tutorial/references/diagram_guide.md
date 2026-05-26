# Diagram Guide

A diagram earns its space by carrying information prose cannot carry as compactly: structure, parallel relationships, sequence, hierarchy, state transitions. A tutorial without diagrams forces single-channel verbal encoding and loses ~50% of long-term retention compared to dual-coded material (Paivio).

This guide makes diagram choice **deterministic**, not aesthetic.

## How diagrams render in this skill's HTML output

Tutorials produced by this skill use **hand-drawn SVG embedded inline in HTML**. No Mermaid, no JS rendering libs, no external image files (with the rare exception of Excalidraw exports for very complex maps).

**Why hand-drawn SVG instead of Mermaid?**
- Mermaid's default style clashes with the editorial scholarly visual identity defined in `layout-template.html`
- Mermaid needs JS bootstrap to render — adds a runtime dependency that occasionally breaks
- Hand-drawn SVG gives full control over layout (avoid the "auto-layout tangle" failure mode for >12 nodes)
- SVG inlined in HTML is editable by anyone reading the source

**The cost** — coordinates must be computed by the author. The skill provides utility CSS classes + self-verification rules to make this manageable.

### Every diagram is wrapped in `<figure>`

```html
<figure>
  <svg viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg"
       role="img" aria-label="what this shows">
    <!-- shapes + lines + text -->
  </svg>
  <figcaption><span class="fig-num">图 1.0</span>One-line claim about the diagram.
    <strong>注意</strong>：the ONE thing the reader should notice.</figcaption>
</figure>
```

The `<figcaption>` is mandatory and carries the directed claim (see "Every diagram needs a caption" section below).

## The SVG drawing system (utility classes)

All SVG drawings use utility classes pre-defined in `layout-template.html`'s `<style>` block. **Use these classes — don't re-declare stroke/fill/font on every element.**

### Stroke classes

| Class | Stroke | Width | Use for |
|---|---|---|---|
| `.diagram-ink` | `var(--ink)` ink black | 1.5px | Primary structure: rectangles, default arrows |
| `.diagram-accent` | `var(--vermilion)` vermilion | 1.8px | Emphasized edges, central node borders, key relationship arrows |
| `.diagram-soft` | `var(--ink-faint)` light gray | 1.2px dashed | Secondary / "may also" edges, async/optional flows |

All have `stroke-linecap="round" stroke-linejoin="round"` baked in for the hand-drawn feel.

### Fill classes

| Class | Fill | Use for |
|---|---|---|
| `.node-fill` | `var(--paper)` paper bg | Default node fill — same as page background, makes node "embedded" |
| `.node-fill-accent` | `vermilion-soft` (8% vermilion) | Emphasized / "this chapter's protagonist" node |

### Text classes

| Class | Font / size / weight | Use for |
|---|---|---|
| `.node-label` | Noto Sans SC 13px / 500 / ink | Default node name |
| `.node-label-accent` | Noto Sans SC 13px / 700 / vermilion | Emphasized node name |
| `.edge-label` | JetBrains Mono 11px / ink-soft | Edge labels, type signatures, secondary annotations |
| `.branch-label` | JetBrains Mono 11px / 700 / vermilion | Branch labels in decision trees ("是" / "否"), key call-outs |

### Arrow markers (define once per SVG, inside `<defs>`)

```svg
<defs>
  <marker id="arrow-ink" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="8" markerHeight="8" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#1F1B16"/>
  </marker>
  <marker id="arrow-vermilion" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="8" markerHeight="8" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#B73B2F"/>
  </marker>
</defs>
```

Apply with `marker-end="url(#arrow-ink)"` on `<line>` or `<path>`. `refX="9"` means the arrowhead's TIP sits at the line endpoint (important — see "Arrow piercing" rule below).

### Node sizing conventions

| Shape | Use for | Default size |
|---|---|---|
| `<rect rx="6">` rounded corner box | Concepts, components | width 140 × height 44 (single label) or × 60 (label + sublabel) |
| `<polygon>` diamond | Decision in flowchart | diamond spanning 200 × 140 |
| `<ellipse>` | Start / end of flow | rx=60, ry=22 |

Center text inside boxes with `text-anchor="middle"` and a y-coordinate at box-vertical-center + 5 (visual centering for typical fonts).

## SVG self-verification rules (mandatory before declaring a diagram done)

Three failure modes appear repeatedly when an author hand-codes SVG. Catch them before shipping.

### Rule 1 — Text-overflow check

A text label rendered inside or near a node can exceed the node's box (or even the SVG viewBox) if it's too long for its font size.

**Mental check**: for a centered label of `N` characters at font-size `S`, the rendered width is approximately `N × S × 0.55` for ASCII / `N × S` for CJK. Compare to the available width (node width, or `viewBox-width × 0.85` for free-floating text).

If `text_width > available_width`:
- Shorten the label (drop secondary terms)
- Split into 2 `<text>` lines with `y` offset
- Or widen the node

**Common trap**: long horizontal lists like `| · A · B · C · D · E · F` exceed boxes when rendered. Trim or truncate with `...`.

### Rule 2 — Connector-crossing check

Connector crossings are a hard failure in hand-coded SVG. A reader should never need to untangle "which line belongs to which label."

**Fix**:
- Prefer orthogonal routes (`<polyline>`) over long diagonals when a connector spans quadrants.
- In hub-and-spoke diagrams, arrows point to the hub only. Secondary relationships either stay local, route around the outside, or move to a separate figure/table.
- Keep edge labels on short, uncrossed segments. If a label would sit near an intersection, the route is wrong.

### Rule 3 — Arrow-piercing check

When drawing a line from node A to node B with `marker-end`, the arrowhead's TIP sits at the line's `x2/y2` endpoint. **If `(x2, y2)` is inside node B, the arrowhead pierces into the box** — looks like an arrow stabbing into the wall instead of meeting it at the edge.

**Fix**: line endpoints must be on node B's EDGE or CORNER, never inside.

For a rectangle at `x=x0, y=y0, width=w, height=h`:
- top edge: any `(x, y0)` with `x ∈ [x0, x0+w]`
- bottom edge: `(x, y0+h)`
- left edge: `(x0, y)`
- right edge: `(x0+w, y)`
- top-left corner: `(x0, y0)`, top-right: `(x0+w, y0)`, etc.

When line is diagonal (e.g., from corner box to central box), end at the appropriate CORNER of the central box. This looks intentional and clean.

### Rule 4 — Arrow-asymmetry check

In a diagram with multiple arrows pointing at the same node from different directions (like a "protocol radiates 4 ways" diagram), every arrow should follow the SAME stopping policy:

- Either all arrows touch the target box edge (line endpoint = box edge coordinate)
- Or all arrows leave a consistent N-pixel gap

Inconsistency (left/right touch, top/bottom 6px short) is visible to the reader as sloppiness.

### Self-verify with rendered screenshots (the only reliable way)

Mental verification catches obvious errors. To catch subtle layout / overflow / piercing issues, **render and screenshot**:

```bash
# from any directory containing the .html file:
python3 -m http.server 8765 &
# use browser automation, a headless browser, or a manual browser screenshot:
#   open http://localhost:8765/01-concepts.html
#   screenshot article > figure:nth-of-type(N)
```

Inspect the screenshot. Common issues spotted via screenshot but missed in mental verification:
- Text wrapping or going off-edge
- Arrows visibly piercing into nodes
- Asymmetric stop-policy
- viewBox cropped too tight (some content cut off)

**Phase 5 verify mandates this for every SVG in the tutorial** — see SKILL.md.

## Content-type → diagram-type matrix (mandatory)

Each section content type → required diagram type (all rendered as hand-drawn SVG):

| Content in the section | Required diagram | Implementation notes |
|---|---|---|
| Sequence of calls / messages between components | **Sequence diagram** | Vertical lifelines (`<line>`) + horizontal arrows. Hand-drawn SVG sequences over ~6 messages get tangled — consider Excalidraw fallback or split into 2 figures |
| State transitions of an entity over its lifecycle | **State machine diagram** | `<ellipse>` states + curved `<path>` arrows. Same complexity caveat as sequences |
| Component relationships, dependencies | **Dependency / component diagram** | `<rect rx="6">` nodes + `<line>` arrows |
| Data flow through a pipeline | **Flowchart** | Horizontal row of `<rect>` boxes + arrows with type-signature `<text>` labels on/under each arrow |
| Concept relationships / mental model | **Concept map** | `<rect>` nodes radially arranged around a central concept; edges labeled. See "concept map specifics" below |
| Architecture (modules + boundaries + data direction) | **Architecture diagram** | Layered `<rect>` rows OR boxes grouped by function. See "architecture diagrams" below |
| Decision tree (when to use X vs Y) | **Decision flowchart** | `<polygon>` diamonds for decisions + `<rect>` for terminal nodes + branch labels |
| Comparison across N options on M dimensions | **Comparison table** | `<table class="compare-table">`. Table IS the diagram here — don't draw a chart |

**If a section has the content but lacks the diagram, the section is incomplete.** Add the diagram.

**Complexity ceiling**: when a sequence / state / concept-map diagram needs >12 nodes or >15 edges, hand-coding becomes unreliable. Drop to Excalidraw fallback (see below).

## Density rule (extraneous load protection)

Walls of prose force linear sequential reading and overload working memory. Required, in order of strictness:

1. **Each chapter has ≥1 `<figure>`** — *hard*, grep-enforced in Phase 5. No exceptions for "pitfalls / question bank / hands-on" chapters (see below).
2. **Each major H2 section has ≥1 figure or worked example** — figures and code count here. Tables alone don't.
3. **At most ~300 lines of prose without a visual break** — figures, code blocks, comparison tables all count for this looser breaking rule.
4. **A full tutorial totals ≥10 figures**, distributed across chapters.

**Figures, code blocks, and comparison tables are NOT interchangeable.** Each does a different job:

| Element | What it encodes well | What it doesn't |
|---|---|---|
| **`<figure>` + SVG** | Spatial relationships, parallel structure, topology, decision branches, flow | Detailed implementation, character-level syntax |
| **`<pre><code>`** | Sequential transformations, exact syntax, runnable example | Parallel relationships, "what depends on what" |
| **`<table class="compare-table">`** | Tabular comparison across rows × columns, "this vs that" | Spatial topology, sequence flow |

When in doubt: **if you can imagine the content as a hand-drawn whiteboard sketch, draw the SVG**. If it's a list of "type X has property Y", that's a table. If it's "exact code that runs", that's a code block. The three coexist; missing any one is a content-shape mistake.

**Common rationalizations to refuse**:

- *"Pitfalls is a list, doesn't need a figure"* → No. Draw the **causal links** between failure modes (which pitfall makes which other pitfall more likely), or a 2D categorization (axis 1: where in the stack, axis 2: severity). Both are figure-worthy.
- *"Question bank is just questions"* → No. Draw the **difficulty gradient** (pyramid: recall → understand → discriminate) or the **chapter mapping** (which question tests which chapter). Both reinforce the schema the questions probe.
- *"Hands-on is code"* → No. Draw the **data type flow** through the worked chain (`raw input → parsed object → validated request → response`), or the **scaffold-decrease progression** across the worked → partial → open sequence. The reader's eye finds these spatial patterns the code itself can't show in linear text.
- *"Capstone is decisions, just use a table"* → No. The capstone gets two figures: **overall architecture** (where each decision point lives in the system) and **decision tree** (the discrimination path the reader walks). The table lists choices; the figures show structure.

If a section ends up text-heavy:
1. Add a diagram that the prose was implicitly describing
2. Split the section into two
3. Convert a list-heavy paragraph into a `<table class="compare-table">`

## The Split-Attention rule (Sweller & Chandler 1994)

When an image's labels are physically separated from the image, the reader's eye ping-pongs between them, and the cross-reference cost wipes out the dual-coding benefit.

❌ **Wrong**:
- "Refer to node A in figure 3.2" (labels in prose)
- A diagram followed by numbered list explaining each arrow
- Diagram with cryptic node labels (`n1`, `n2`) explained only in the caption

✅ **Right**:
- Every label sits **on the diagram element** (inside the node, on the arrow)
- Caption is 1-2 sentences pointing out what the reader should notice
- Captions never substitute for on-diagram labels

## 5 patterns with copy-able SVG templates

These five patterns cover ~80% of tutorial diagrams. Adapt coordinates to your content.

### Pattern 1 — Layered architecture (4-5 horizontal layers)

```html
<figure>
  <svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" role="img"
       aria-label="System layers from APP down to integrations">
    <defs>
      <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#5C544A"/>
      </marker>
    </defs>

    <!-- Layer labels in left gutter -->
    <text x="20" y="48" class="edge-label" font-weight="700">APP</text>
    <text x="20" y="123" class="edge-label" font-weight="700">MID</text>
    <text x="20" y="203" class="edge-label" font-weight="700" fill="#B73B2F">CORE</text>
    <text x="20" y="285" class="edge-label" font-weight="700">IMPL</text>

    <!-- 4 stacked layer rectangles -->
    <rect x="100" y="20" width="560" height="48" rx="4" class="diagram-ink node-fill"/>
    <text x="380" y="49" text-anchor="middle" class="node-label">your code</text>

    <rect x="100" y="92" width="560" height="56" rx="4" class="diagram-ink node-fill"/>
    <text x="380" y="120" text-anchor="middle" class="node-label">middle layer</text>

    <!-- Highlighted center layer -->
    <rect x="100" y="172" width="560" height="62" rx="4" class="diagram-accent node-fill-accent"/>
    <text x="380" y="200" text-anchor="middle" class="node-label-accent">THIS CHAPTER's TOPIC</text>

    <rect x="100" y="258" width="560" height="50" rx="4" class="diagram-ink node-fill"/>
    <text x="380" y="285" text-anchor="middle" class="node-label">concrete impls</text>

    <!-- Connector arrows -->
    <line x1="200" y1="68" x2="200" y2="90" stroke="#5C544A" stroke-width="1.5" marker-end="url(#ar)"/>
    <line x1="200" y1="148" x2="200" y2="170" stroke="#5C544A" stroke-width="1.5" marker-end="url(#ar)"/>
    <line x1="560" y1="234" x2="560" y2="256" stroke="#5C544A" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#ar)"/>
  </svg>
  <figcaption><span class="fig-num">图 N</span>{{one-line claim}}. <strong>注意</strong>：{{the one thing to notice}}.</figcaption>
</figure>
```

### Pattern 2 — Protocol contract (central concept + 4 spokes)

```html
<figure>
  <svg viewBox="0 0 680 380" xmlns="http://www.w3.org/2000/svg" role="img"
       aria-label="Central concept with 4 radiating capabilities">
    <defs>
      <marker id="rad" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#B73B2F"/>
      </marker>
    </defs>

    <!-- Central node -->
    <rect x="270" y="160" width="140" height="60" rx="6" class="diagram-accent node-fill-accent" stroke-width="2"/>
    <text x="340" y="186" text-anchor="middle" class="node-label-accent">CENTER</text>
    <text x="340" y="206" text-anchor="middle" class="edge-label">(label)</text>

    <!-- Top spoke (terminates AT top box's bottom edge, y=94) -->
    <line x1="340" y1="160" x2="340" y2="94" class="diagram-accent" marker-end="url(#rad)"/>
    <rect x="240" y="44" width="200" height="50" rx="4" class="diagram-ink node-fill"/>
    <text x="340" y="65" text-anchor="middle" class="node-label">.method1</text>
    <text x="340" y="83" text-anchor="middle" class="edge-label">what it does</text>

    <!-- Right spoke (terminates AT right box's left edge, x=490) -->
    <line x1="410" y1="190" x2="490" y2="190" class="diagram-accent" marker-end="url(#rad)"/>
    <rect x="490" y="160" width="180" height="60" rx="4" class="diagram-ink node-fill"/>
    <text x="580" y="184" text-anchor="middle" class="node-label">.method2</text>
    <text x="580" y="200" text-anchor="middle" class="edge-label">what it does</text>

    <!-- Bottom spoke (terminates AT bottom box's top edge, y=284) -->
    <line x1="340" y1="220" x2="340" y2="284" class="diagram-accent" marker-end="url(#rad)"/>
    <rect x="240" y="284" width="200" height="60" rx="4" class="diagram-ink node-fill"/>
    <text x="340" y="306" text-anchor="middle" class="node-label">.method3</text>

    <!-- Left spoke (terminates AT left box's right edge, x=190) -->
    <line x1="270" y1="190" x2="190" y2="190" class="diagram-accent" marker-end="url(#rad)"/>
    <rect x="10" y="160" width="180" height="60" rx="4" class="diagram-ink node-fill"/>
    <text x="100" y="184" text-anchor="middle" class="node-label">.method4</text>
  </svg>
  <figcaption><span class="fig-num">图 N</span>{{claim about the contract}}. <strong>注意</strong>：{{insight}}.</figcaption>
</figure>
```

**Symmetry check**: in this pattern, all 4 spoke endpoints touch their respective box edges. Top spoke ends at y=94 (top box bottom). Bottom spoke ends at y=284 (bottom box top). Left/right spokes end at x=190 and x=490 (the respective box edges). This is Rule 4 (consistent stop policy) in practice.

### Pattern 3 — Horizontal data flow with type signatures

```html
<figure>
  <svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" role="img"
       aria-label="Data flow with type labels on each edge">
    <defs>
      <marker id="flow" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="8" markerHeight="8" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#1F1B16"/>
      </marker>
    </defs>

    <text x="14" y="100" class="edge-label" font-weight="700">FORM</text>
    <text x="14" y="170" class="edge-label" font-weight="700">TYPE</text>

    <!-- 5 stages in a row -->
    <rect x="100" y="74" width="100" height="50" rx="6" class="diagram-ink node-fill"/>
    <text x="150" y="103" text-anchor="middle" class="node-label">Input</text>
    <text x="150" y="170" text-anchor="middle" class="edge-label" font-family="JetBrains Mono">dict</text>

    <line x1="200" y1="99" x2="240" y2="99" class="diagram-ink" marker-end="url(#flow)"/>

    <rect x="240" y="74" width="110" height="50" rx="6" class="diagram-ink node-fill"/>
    <text x="295" y="103" text-anchor="middle" class="node-label">Stage A</text>
    <text x="295" y="170" text-anchor="middle" class="edge-label" font-family="JetBrains Mono">TypeA</text>

    <!-- ...repeat for stages B, C, etc.... -->
  </svg>
  <figcaption><span class="fig-num">图 N</span>...</figcaption>
</figure>
```

### Pattern 4 — Decision tree (diamonds + terminals)

```html
<figure>
  <svg viewBox="0 0 660 460" xmlns="http://www.w3.org/2000/svg" role="img"
       aria-label="Decision tree for choosing between A, B, C">
    <defs>
      <marker id="dec" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#1F1B16"/>
      </marker>
    </defs>

    <!-- Start -->
    <ellipse cx="330" cy="40" rx="60" ry="22" class="diagram-ink node-fill"/>
    <text x="330" y="46" text-anchor="middle" class="node-label">开始</text>

    <!-- Decision diamond -->
    <polygon points="330,80 440,150 330,220 220,150" class="diagram-ink node-fill"/>
    <text x="330" y="146" text-anchor="middle" class="node-label">Q1: condition?</text>
    <line x1="330" y1="62" x2="330" y2="80" class="diagram-ink" marker-end="url(#dec)"/>

    <!-- No branch -->
    <line x1="220" y1="150" x2="100" y2="150" class="diagram-ink" marker-end="url(#dec)"/>
    <text x="160" y="142" text-anchor="middle" class="branch-label">否</text>
    <rect x="20" y="128" width="80" height="44" rx="6" class="diagram-ink node-fill"/>
    <text x="60" y="155" text-anchor="middle" class="node-label">用 A</text>

    <!-- ...continue Yes branch with more diamonds and terminals... -->
  </svg>
  <figcaption><span class="fig-num">图 N</span>{{when-to-use claim}}. <strong>注意</strong>：...</figcaption>
</figure>
```

### Pattern 5 — Concept map (5-10 nodes radially arranged)

A central concept with related concepts orbiting it. Same node-arrows-to-center geometry as Pattern 2, but emphasize **labeled edges** (depends-on / produces / is-a / wraps).

Hard constraints:
- Use a clean hub-and-spoke layout for the primary relationship. Do not draw freeform diagonals across the map.
- Keep secondary relationships short and local. If "A also feeds B" would cross the hub spokes, either route it around the outside with a `<polyline>` or move it into a separate figure.
- Do not put edge labels at connector intersections. Labels must sit on a clear segment with whitespace around them.

When > 10 nodes, >12 edges, or any secondary edge would need to cross the map: switch to Excalidraw.

## Excalidraw fallback (when SVG hand-coding fails)

Use Excalidraw when:
- Diagram needs > 12 nodes or > 15 edges
- Concept map with freeform groupings, hand-drawn aesthetic
- You've drawn it twice and the layout still looks tangled

Workflow:
1. Author in Excalidraw or another diagram editor (`.excalidraw.md` can live in the same tutorial folder when supported by the user's editor)
2. File → Export as SVG → save `concept-map.svg` in the tutorial folder
3. Embed: `<figure><img src="concept-map.svg" alt="..."> <figcaption>...</figcaption></figure>`

The image inherits no styles from the page CSS, so the Excalidraw export needs to visually match — pick a similar palette (warm paper, vermilion accents) when designing.

## The concept map specifically

The concept map is the most important diagram in any tutorial. Reader hangs every subsequent detail on it.

**Mandatory properties**:
- **5-10 nodes** (more → Excalidraw)
- **Edges are labeled** ("depends on", "produces", "is a", "wraps")
- **Visual grouping by domain** — cluster related concepts (use proximity or `<g>` grouping)
- **Clear entry point** — reader's eye lands on the central abstraction (usually the unique concept the technology introduces)
- **Every node is defined somewhere in the tutorial prose**
- **Every prose-defined concept appears on the map**

## The learning-path breadcrumb (re-shown each chapter)

Smaller than the concept map — shows the linear chapter sequence, not concept relationships.

In v1 design the learning path lives in the top breadcrumb `<nav class="learning-path">`, not as an SVG figure. Each chapter marks the current step with `<span class="current">` (vermilion underline). No separate SVG needed.

This **is** still forced retrieval (re-encountering the chapter list every page) and orientation (reader always knows where they are) — just rendered as text breadcrumb instead of SVG.

## Architecture diagrams

Architecture diagrams in `02-principles.html` show **components and their interactions**. Conventions:

- **`<rect>` boxes** = components / processes
- **`<rect>` with `<ellipse>` motif** = storage (or use `<rect>` and label "DB")
- Solid arrows = sync calls / direct data flow
- Dashed arrows (`.diagram-soft`) = async / events
- **Arrow labels are required** (`<text>` next to the line) — what's being sent
- Group by trust / process boundary — outer `<rect>` with dashed stroke around inner nodes
- **One diagram per major mechanism**, not one giant diagram

## Every diagram needs a caption

Caption lives in `<figcaption>` directly under the SVG (zero spatial gap by design).

1. State what the diagram shows (one phrase)
2. Point out the **one thing the reader should notice** that isn't obvious from a glance — usually the load-bearing asymmetry, the unusual edge, the boundary between "what's special here" and "what's standard"

A diagram without a directed caption is interpreted however the reader feels, which is usually wrong.

## Reader-drawn diagrams (at least once per tutorial)

Paivio's dual coding gets stronger when the reader *constructs* the imagery channel themselves. Source theory: "手画 > 看现成图" — drawing turns dual coding into retrieval practice for spatial content.

At least once per tutorial, prompt the reader to draw. Two patterns:

**Pattern A — recall draw** (end-of-chapter retrieval):
> 不看教程，在纸上画出 §2.1 的架构图。然后翻回去对照，你把缓存画在 API 边界的哪一侧？

**Pattern B — extension draw** (transfer):
> 把数据流套到你自己的应用上画一遍。这一章的哪些组件对应到你已有的系统？哪些是新加的？

Put these at chapter boundaries, in the capstone, or in `06-self-check` — places where the reader is already in active mode.

## Anti-patterns (delete on sight)

- **Decorative imagery**: brain icon next to "learning", lightbulb next to "tip" — pure extraneous load
- **Reformatted lists**: a 3-step linear process drawn as a flowchart is worse than the 3-step list. Diagrams are for parallel / branching / spatial, not linear
- **Cryptic labels with caption decoder**: `n1, n2` defined in caption forces remote binding (split-attention)
- **Diagram that restates a code snippet**: just show the code
- **Wall of text with one decorative banner image**: banner is not a diagram

## Verification checklist

For every SVG in every chapter, before publishing:

### Self-check (mental + math)
- [ ] viewBox dimensions match content extent (no cropping, no excess whitespace > 30%)
- [ ] All text labels fit inside their nodes (Rule 1: `chars × font-size × 0.55 < node-width`)
- [ ] No connector crosses another connector except at a shared node edge (Rule 2)
- [ ] No arrow endpoint is inside a target box (Rule 3: `(x2, y2)` on EDGE or CORNER, never interior)
- [ ] Multi-arrow diagrams have consistent stop policy (Rule 4: all touch edges, or all leave consistent gap)
- [ ] Every node has a label on it (no `n1`/`n2` codes)
- [ ] Every edge with semantic meaning has a label

### Visual check (rendered screenshot)
- [ ] Render the chapter HTML via `python3 -m http.server` + browser automation or a manual browser screenshot for `article > figure:nth-of-type(N)`
- [ ] Scan each figure for: text overflow, arrow piercing, viewBox crop, label collision
- [ ] Fix any issue found by the screenshot that mental verification missed

### Coverage check
- [ ] Every major H2 section has ≥1 diagram, code block, or comparison table
- [ ] No prose stretch >300 lines without a visual break
- [ ] Every concept defined in prose has a corresponding map node (and vice versa)
- [ ] At least one reader-drawing prompt exists in the tutorial (Principle 3 hard requirement)

### Caption check
- [ ] Every `<figure>` has a `<figcaption>` with `.fig-num` + directed claim
- [ ] No caption is "this diagram shows X" — instead "**注意**：the one unusual thing"

A failing item is a draft-blocking issue, not a "ship and fix later" — diagram errors are extra cognitive load on every reader who follows.
