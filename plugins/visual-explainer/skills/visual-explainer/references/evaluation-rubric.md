# Evaluation Rubric

Use this after rendering. If a diagram fails any blocking check, revise the `.excalidraw` source and export again.

## Blocking Checks

- The selected `diagramPattern` fits the concept.
- The first visible structure expresses a transferable visual grammar, not a topic-specific template.
- A viewer can identify the main idea from the title and first visual group.
- Every important shape, dot, panel, or example has a role in the explanation.
- Every main arrow has a visible relationship label and points in the direction of that relationship.
- Visible text is phrase-like, not paragraph-like.
- Labels sit near the visual object they describe.
- Opposite-direction state transitions are visually separated.
- Explanatory labels describe the concept, not the screen or drawing mechanics.
- The micro-example is concrete and does not introduce a second topic.
- The SVG is exported by Excalidraw, not hand-coded to imitate it.

## Scorecard

Score each item 0-2.

| Item | 0 | 1 | 2 |
|---|---|---|---|
| Concept fit | generic template | partially matched pattern | pattern reveals the concept |
| Visual grammar | box-arrow default | useful but weak metaphor | structure such as map, pressure, boundary, tension, landscape, control loop, causal field, or cutaway carries meaning |
| Fast scan | hard to parse | main idea visible after reading | main idea visible in 5 seconds |
| Arrow semantics | unlabeled or misleading | mostly clear | every main arrow is a visible verb |
| Visual encoding | colors/shapes decorative | some encoding | color/position/size/grouping carry meaning |
| Text density | paragraphs or clutter | acceptable but wordy | compact phrases and examples |
| Example | missing or abstract | present but weak | concrete and clarifying |
| Stability | one-off output | passes validator | passes validator and visual review |

Target score: 13+ out of 16, with no blocking check failures.

## Revision Moves

| Symptom | Revision |
|---|---|
| Looks like a slide | Remove prose, convert claims into positions, arrows, groups, and labels |
| Looks like a generic flowchart | Re-select the diagram pattern and rebuild around the concept's real structure |
| Pattern name is right but picture is still boxes | Choose a visual grammar from concept structure: pressure, mapping, boundary, tension, landscape, control loop, causal field, or cutaway |
| Important box is not connected | Add it to `visualAnchors`, connect it, or remove it |
| Arrows feel wrong | Rewrite each arrow as "A verb B"; remove arrows that cannot be phrased this way |
| Arrow labels are missing | Add compact labels such as "cache miss", "steps downhill", "success restores" |
| Opposite state arrows overlap | Separate them as parallel arrows or route them on different sides of the states |
| Label explains the canvas | Replace it with a domain label such as "low loss", "cache hit", or "recovered" |
| Too simple | Add one concrete micro-example or hidden-state callout, not more decorative boxes |
| Too much text | Split long sentences into visual anchors and 1-3 word labels |
| Chinese labels feel heavy | Use short noun/verb phrases; avoid full translated English sentences |
