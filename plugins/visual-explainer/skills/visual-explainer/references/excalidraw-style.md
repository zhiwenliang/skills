# Excalidraw Rendering Reference

Use Excalidraw's scene model and exporter as the rendering source. Do not approximate the look with SVG filters or handcrafted jitter.

This file is about rendering and surface style only. Choose the diagram structure from [diagram-patterns.md](diagram-patterns.md) before applying these rules.

Research anchors:

- Programmatic elements: https://docs.excalidraw.com/docs/%40excalidraw/excalidraw/api/excalidraw-element-skeleton
- SVG export utilities: https://docs.excalidraw.com/docs/%40excalidraw/excalidraw/api/utils/export
- Scene element properties: https://docs.excalidraw.com/docs/%40excalidraw/excalidraw/api/props/excalidraw-api
- Excalifont: https://plus.excalidraw.com/excalifont

## Default Element Style

| Property | Default |
|---|---|
| `strokeColor` | `#1e1e1e` |
| `backgroundColor` | OpenColor-like pastels such as `#ffec99`, `#d0ebff`, `#d3f9d8`, `#eebefa` |
| `fillStyle` | `solid`; use `hachure` for one or two emphasis blocks |
| `strokeWidth` | `2` |
| `strokeStyle` | `solid` |
| `roughness` | `1` |
| `opacity` | `100` |
| `fontFamily` | `5` for Excalifont |
| `fontSize` | 20-36 depending on hierarchy |
| `roundness` | `{ "type": 3, "value": 24-32 }` for rounded rectangles |

## Composition Rules

- Use a white background and enough whitespace around the scene.
- Start with a short title that answers "what am I looking at?"
- Use the selected diagram pattern to decide shape placement.
- Put labels on shapes and arrows, not in a legend.
- Use arrows for causal, sequential, dependency, feedback, transition, or update relationships. Each main arrow must have both a semantic verb in scene metadata and a compact visible label near the arrow.
- Keep colors varied but soft; avoid a one-hue palette.
- Keep hachure sparse. Too much hachure makes the diagram noisy.
- Use a wide canvas when the concept needs detail, typically about 1100-1400px wide and 700-950px tall before export.
- Include one concrete micro-example when it helps the concept become tangible.
- Keep visible text compact: usually 28-70 word equivalents total, with no single text element becoming a paragraph.

## Arrow Composition

- Main flow patterns: use clean directional arrows, usually 2-6.
- Feedback/state/causal patterns: bent or looping arrows are allowed only when the loop is the point, and the semantic verb explains the loop.
- Optimization patterns: use lines or curves for the landscape; use arrows only for update direction.
- Callouts: visually attach with placement first; use a short gray pointer only if needed.
- Avoid arrows crossing through blocks or text.
- If the viewer must trace an arrow twice to understand it, simplify the layout.

## Renderer Rules

- Render with `scripts/render_excalidraw_svg.mjs`.
- The script uses `@excalidraw/utils` and Playwright/Chrome to call Excalidraw's `exportToSvg`.
- Run `npm install --prefix scripts` once before the first render.
- The renderer first tries local Chrome, then bundled Chromium. If neither exists, run `npm run --prefix scripts install-browser`.
- Pass `--browser <channel>` to force a specific Playwright Chromium channel.
- Treat the generated SVG as disposable output. Edit the `.excalidraw` source, then regenerate.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Hand-coded rough SVG paths | Build an Excalidraw scene and export it |
| SVG filter roughening | Remove the filter; Excalidraw creates rough paths itself |
| Too many blocks | Split into multiple one-topic diagrams |
| Text outside shapes | Reduce text, widen shape, or lower font size |
| Missing `.excalidraw` file | Recreate the scene source before delivering |
| Sparse 3-box diagram | Add a thesis, 2-3 callouts, a concrete example, and a takeaway, then run the scene validator |
| Dense wall of text | Replace paragraphs with short labels, tiny examples, and visual grouping |
| Messy arrows | Assign each arrow a verb; remove arrows that cannot be explained |
| Arrow meaning hidden in metadata | Add a visible arrow label and reference it with `labelElementId` |
| Same layout for every topic | Re-select the diagram pattern before editing style |
