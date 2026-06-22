---
name: visual-explainer
description: Use when the user wants a one-topic visual explanation, concept diagram, explanatory SVG, or Excalidraw scene that teaches a concept through diagram design. Applies to requests such as "explain X with an image", "make an SVG explainer", "show this concept visually", or "make an Excalidraw-style diagram".
---

# Visual Explainer

Design one-topic explanation diagrams first, then render them as editable Excalidraw scenes and exported SVGs. The `.excalidraw` file is the source of truth; the SVG is the portable output.

Core principle: Excalidraw is the renderer, not the goal. A good result should teach the concept through structure, visual encodings, and semantic arrows before it looks hand-drawn.

## Workflow

1. Reduce the request to one teachable target:
   - topic
   - central question
   - one-sentence answer
   - 3 viewer takeaways
   - one micro-example
2. Choose a diagram pattern before drawing. Read [references/diagram-patterns.md](references/diagram-patterns.md) when the pattern is not obvious.
3. Draft a thumbnail plan in text before creating scene JSON:
   - concept structure, such as pressure, mapping, boundary, tension, landscape, control loop, causal field, or cutaway
   - transferable visual grammar, not a topic-specific template
   - selected `diagramPattern`
   - primary visual anchors
   - arrow verbs
   - visual encodings such as color, position, grouping, height, size, or shape
   - why this visual grammar explains the topic better than a generic box flow
4. Read [references/excalidraw-style.md](references/excalidraw-style.md) for Excalidraw renderer and scene-style rules.
5. Create a `.excalidraw` scene JSON. Include top-level `visualExplainer` design metadata matching the contract below.
6. Validate before export:

```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/visual-explainer/scripts/validate_visual_explainer_scene.mjs" path/to/diagram.excalidraw
```

If validation fails, revise the `.excalidraw` source. Do not bypass the validator with a handmade SVG or a decorative sketch.

7. Export SVG through the bundled renderer:

```bash
npm install --prefix "${CLAUDE_PLUGIN_ROOT}/skills/visual-explainer/scripts"
node "${CLAUDE_PLUGIN_ROOT}/skills/visual-explainer/scripts/render_excalidraw_svg.mjs" --input path/to/diagram.excalidraw --output path/to/diagram.svg
```

If the renderer cannot find Chrome or bundled Chromium, run:

```bash
npm run --prefix "${CLAUDE_PLUGIN_ROOT}/skills/visual-explainer/scripts" install-browser
```

8. Verify the SVG is real Excalidraw output: it contains `svg-source:excalidraw`, scene metadata, Excalifont text, and rough path geometry.
9. Review with [references/evaluation-rubric.md](references/evaluation-rubric.md). Revise and re-render when the diagram scores weakly.

## Design Metadata Contract

Every scene must include a top-level `visualExplainer` object:

```json
{
  "visualExplainer": {
    "version": 1,
    "topic": "gradient descent",
    "diagramPattern": "optimization-landscape",
    "conceptStructure": "searching for a lower-loss point",
    "visualGrammar": "landscape",
    "centralQuestion": "How does the model know which way to change weights?",
    "oneSentenceAnswer": "It estimates the loss slope, then repeatedly steps toward lower error.",
    "whyThisPattern": "A loss landscape makes slope, direction, and repeated improvement visible.",
    "readerTakeaways": [
      "Loss height represents error.",
      "The gradient points toward the steepest change.",
      "Training repeats small downhill updates."
    ],
    "microExample": "If prediction is too high, the update nudges weights toward lower loss.",
    "visualAnchors": [
      { "elementId": "loss-curve", "role": "loss landscape" },
      { "elementId": "point-a", "role": "high-loss starting point" },
      { "elementId": "point-b", "role": "lower-loss step" },
      { "elementId": "rule-box", "labelElementId": "rule-text", "role": "update rule" }
    ],
    "semanticArrows": [
      { "elementId": "arrow-1", "labelElementId": "arrow-1-label", "verb": "steps downhill", "from": "high-loss point", "to": "lower-loss point" }
    ],
    "visualEncodings": [
      { "channel": "height", "meaning": "more vertical means more loss" },
      { "channel": "point color", "meaning": "red to green means improving error" }
    ]
  }
}
```

Allowed `diagramPattern` values: `process-flow`, `layered-system`, `feedback-loop`, `state-machine`, `comparison`, `causal-model`, `mapping`, `optimization-landscape`, `anatomy`, `mental-model`.

Use `conceptStructure` and `visualGrammar` as planning metadata when they help future review. They are not shape-count rules. They record why the drawing uses a gauge, map, boundary, tension metaphor, landscape, control loop, causal field, cutaway, or another transferable strategy.

Each arrow element must have a matching `semanticArrows` entry, and every entry needs `elementId`, `verb`, `from`, and `to`. Main relationship arrows additionally need `labelElementId` pointing to a visible text label near the arrow. Use `"kind": "callout-pointer"` for a short pointer from a note to the thing it annotates: it omits only the visible `labelElementId`, but still requires `verb`/`from`/`to` (for example `"verb": "annotates"`). An entry missing `verb`/`from`/`to` is ignored, and its arrow then fails validation as a missing entry. Treat arrows as relationship verbs, not connectors.

Each primary visual shape must have a `visualAnchors` entry with an `elementId` and `role`. Add `labelElementId` when the anchor has a visible text label. This prevents orphaned boxes, dots, or example panels that look important but do not participate in the explanation.

### Validator limits

`validate_visual_explainer_scene.mjs` enforces these bounds; design within them to avoid avoidable failures:

- 28–70 visible word-equivalents total, and at most 18 per text element.
- 5–18 text elements; at least one title element with `fontSize` ≥ 28.
- At least 4 primary shapes (rectangle/diamond/ellipse), each with a `visualAnchors` entry.
- 1–9 arrows; bent arrows only in `feedback-loop`, `state-machine`, or `causal-model` patterns.
- At least 3 `readerTakeaways` and 2 `visualEncodings`.
- `anatomy` diagrams allow at most 2 main (non-pointer) semantic arrows.

## Output Contract

- Always preserve the `.excalidraw` scene next to the exported SVG.
- Use SVG as the final image format unless the user explicitly asks for a bitmap preview.
- Keep visible text compact: usually 28-70 word equivalents total, with no paragraph-like text blocks.
- Prefer structural visuals over decorative icons. Add a metaphor only when it clarifies the mechanism.
- Do not default to a 4-box left-to-right flow unless the chosen pattern is truly `process-flow`.
- Do not reuse topic-specific templates. Reusable structure is good; copying "Kubernetes uses loop" or "psychology uses scale" without rechecking the concept is not.
- Make the first visible structure match the concept structure: pressure, map, boundary, tension, landscape, control loop, causal field, cutaway, or another explicit visual grammar.
- Use Chinese labels as short phrases when the user asks for Chinese; do not translate English paragraphs into Chinese blocks.
- If the renderer cannot launch a browser, report the exact dependency failure and keep the `.excalidraw` source. Do not replace the output with a handmade sketch imitation.

## Quality Checklist

- [ ] The diagram explains one thing, not a whole tutorial.
- [ ] The diagram pattern matches the topic's structure.
- [ ] The visual grammar is transferable across topics with the same concept structure.
- [ ] The scene includes valid `visualExplainer` design metadata.
- [ ] Every primary visual shape has a declared role in `visualAnchors`.
- [ ] The scene passes `scripts/validate_visual_explainer_scene.mjs`.
- [ ] Every arrow has a semantic verb and a visible reason to exist.
- [ ] Main arrows have visible labels; arrow meaning is not hidden only in metadata.
- [ ] It includes one micro-example and a clear takeaway.
- [ ] It uses Excalidraw-native scene properties and renderer output.
- [ ] It avoids fake roughening filters, manual jittered paths, shadows, gradients, and generic sketch styling.
- [ ] Text fits inside blocks at the intended size.
- [ ] The exported SVG opens in a browser and contains the expected labels.
- [ ] The source scene remains editable in Excalidraw.
- [ ] A fast viewer can answer: what is it, what changes, why it matters.

## Example

Use [assets/latest-style-demo.excalidraw](assets/latest-style-demo.excalidraw) and [assets/latest-style-demo.svg](assets/latest-style-demo.svg) as the current style reference.
