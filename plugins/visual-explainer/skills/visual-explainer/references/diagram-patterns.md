# Diagram Pattern Reference

Choose the pattern before drawing. Do not reuse a box-and-arrow template unless the concept is actually a sequence.

## Visual Grammar First

Visual grammar choices are not topic templates. They are transferable ways to turn an abstract concept structure into a picture. First identify the concept structure, then pick a visual grammar, then adapt labels, objects, and the micro-example to the topic.

| Concept structure | Visual grammar | Works for |
|---|---|---|
| Accumulation toward a threshold | `pressure` gauge, tank, stack, burn bar, risk meter | queue backlog, error budget, inflation pressure, anxiety, inflammation |
| Given X, find Y | `mapping` table, router, index cards, keyhole, coordinate grid | database index, DNS, tokenizer, lookup cache, matching markets |
| Crossing a trust or system edge | `boundary` lanes, gate, lock, checkpoint, membrane | OAuth, firewalls, approvals, cell membranes, immigration |
| Two forces or goals conflict | `tension` balance, rope pull, spring, split surface, fracture | procrastination, tradeoffs, CAP theorem, safety vs speed |
| Searching for a better point | `landscape` hill, valley, contour, path dots, slope | optimization, learning, product-market fit, route planning |
| Output changes future behavior | `control loop` dial, sensor, error gap, actuator, feedback ring | Kubernetes, thermostats, habit loops, policy feedback |
| Many causes shape one result | `causal field` force map, influence rings, pressure zones, weighted network | supply and demand, climate systems, adoption, immune signaling |
| One thing has meaningful parts | `cutaway` or anatomy, magnifier callouts, exploded parts, labeled layers | transformer layer, engine, immune system, organization design |

Pick one dominant grammar and one supporting grammar at most. If the visual grammar can be reused for a different domain without changing its structure, it is probably general enough.

## Pattern Selector

| Pattern | Use when the concept is about | Better than |
|---|---|---|
| `process-flow` | ordered steps, request lifecycle, pipeline | unordered boxes |
| `layered-system` | stacked transformations, architecture layers, representation stages | linear chains |
| `feedback-loop` | repeated improvement, control, monitoring, flywheels | one-way flows |
| `state-machine` | modes, transitions, valid/invalid state changes | prose lists |
| `comparison` | tradeoffs, before/after, two approaches | merged mixed diagrams |
| `causal-model` | cause, effect, bottleneck, propagation | generic arrows |
| `mapping` | lookup, routing, translation, key-value resolution | process diagrams |
| `optimization-landscape` | loss, search, slope, gradients, local/global minima | stacked boxes |
| `anatomy` | parts of one object/system and what each part does | timelines |
| `mental-model` | abstract idea that needs a simple spatial metaphor | literal flowcharts |

## Pattern Notes

### Process Flow

Use one main path. Each arrow verb should be concrete: "requests", "validates", "queues", "returns", not just "then".

Before choosing this pattern, ask whether the idea is truly ordered. If the real concept is pressure, mapping, boundary crossing, tension, landscape search, control, field influence, or cutaway structure, use that visual grammar instead of a horizontal chain.

### Layered System

Show layers as stacked or repeated transformations. Use color or grouping to separate representation, computation, and output.

Good visual grammars: `cutaway`, `nested layers`, `swimlanes`, `stacked transforms`. Avoid a flat row of same-size boxes when the important idea is depth, containment, or repeated refinement.

### Feedback Loop

Use a loop only when output changes future input or behavior. Label the feedback arrow with the thing being fed back.

Good visual grammars: `control loop`, sensor/dial/error gap, circular feedback ring, thermostat-like correction. Put the measurable gap or signal near the center so the viewer sees why the loop exists.

### State Machine

Use states as nodes and arrows as allowed transitions. Mark invalid or risky transitions with a different stroke or color.

When two transitions go between the same two states in opposite directions, offset them as parallel arrows or route them on different sides. Do not place opposite arrows on the same line.

Good visual grammars: state space, mode map, valid transition paths, forbidden gates. States should feel like regions or modes, not steps in a process.

### Comparison

Use parallel structure. Keep row labels consistent so the viewer compares the same dimension across both sides.

Good visual grammars: balance, matrix, split surface, before/after lens, tradeoff sliders. Use position and alignment to make the comparison visible before reading labels.

### Causal Model

Use arrows as cause verbs. Distinguish direct cause, amplifier, and constraint with stroke or label.

Good visual grammars: `causal field`, pressure zones, weighted influence map, amplifier loop, dampener/valve. Use arrows sparingly; distance, size, color intensity, and containment can show influence without turning the diagram into a process.

### Mapping

Use a central map/table/router object when the core idea is "given X, find Y." Show cache or fallback paths only if they are core.

Good visual grammars: `mapping` table, index cards, router board, key/value wall, keyhole, coordinate grid. The map is the main object; arrows only show lookup entry and returned result.

### Optimization Landscape

Use a curve, surface, or contour-like shape. Points show attempts; arrows show update direction. Text should explain what height, color, or position encodes.

Use concept labels such as "low loss" or "minimum"; avoid labels that describe the canvas itself, such as "screen lower."

Good visual grammars: `landscape`, contour map, path dots, slope marker, valley, basin. Use height, color, or distance as meaning; do not replace the landscape with training-step boxes.

### Anatomy

Use one large object with labeled parts. Avoid converting parts into a fake sequence.

Every part shown must either connect to another part or be explicitly declared as a visual anchor with a clear role. Remove decorative parts that do not teach the concept.

If the explanation uses three or more main relationship arrows in a time order, it is probably `process-flow`, not `anatomy`. For example, an immune response from pathogen detection to memory is a response process unless the drawing is centered on one immune-system object and its parts.

Good visual grammars: `cutaway`, magnifier callouts, exploded parts, layered cross-section, labeled subsystem map. The main visual should be one object or system, not several sequential blocks.

### Mental Model

Use one metaphor, then map each metaphor part to the real concept. Remove the metaphor if it adds another concept to learn.

If the metaphor has several exits or choices, connect each choice or mark it as a visual anchor. Do not leave a choice box floating without an incoming relationship.

Good visual grammars: `tension`, balance, spring, pressure release, fracture, lens, map. The metaphor should expose a hidden relationship, not decorate a normal flowchart.

## Anti-Patterns

| Bad habit | Replace with |
|---|---|
| Four generic boxes for every topic | Pattern selector above |
| Topic-specific template memory | Concept structure -> visual grammar -> topic adaptation |
| Arrow labels like "next" or "then" | Relationship verbs |
| Long explanatory paragraphs | Short labels plus visual encoding |
| Decorative icons with no role | A visible structure that carries meaning |
| Legend for everything | Labels near the thing they explain |
