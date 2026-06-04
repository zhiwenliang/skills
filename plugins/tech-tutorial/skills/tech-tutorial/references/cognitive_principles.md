# Cognitive Principles Behind the Tutorial Template

The seven principles in SKILL.md are not aesthetic preferences. They are the operational form of empirical findings from cognitive science research. This file documents the *why* — read it when you find yourself wanting to bend a rule and need to know what the rule protects against.

If the user provides an organization-specific learning-theory note or methodology source, link that source from the tutorial's "Further reading" after verifying the path or URL exists. Do not assume any local path or repository-specific document exists.

## How the seven principles fit together

The seven principles are not a flat list. They form an **input × pivot × output** structure:

- **Input side** (Principles 1, 2, 3 — Expertise Reversal, Schema Anchoring, Dual Coding): how the material is presented so it lands in working memory without waste.
- **Pivot** (Principle 6 — Desirable Difficulty): the unifying mental model. Bjork's central claim — *current performance ≠ durable learning* — is what motivates the entire output side. Without this principle, the output-side rules look like masochism.
- **Output side** (Principles 4, 5, 7 — Worked-Example Scaffold, Testing Effect, Spaced + Interleaved): three concrete forms of desirable difficulty that drive the schema into long-term memory.

When you find yourself wanting to soften an output-side rule because "it makes the chapter feel less smooth," check yourself against Principle 6. Smoothness is the symptom of fluency illusion, not of good design. Input-side principles, by contrast, *should* feel smooth — that is their job (free up working memory). The two sides have opposite jobs and are not in tension; they trade off load *type*, not load *amount*.

## The cognitive load model

Sweller's Cognitive Load Theory (Sweller 1988; current canonical review: Sweller, van Merriënboer & Paas 2019) divides mental effort during learning into three categories:

| Type | Source | What the tutorial author should do |
|---|---|---|
| **Intrinsic load** | Inherent difficulty of the material | Decompose into a dependency-ordered sequence; don't fight intrinsic difficulty, *stage* it |
| **Extraneous load** | How the material is presented (jumping references, jargon walls, missing definitions, decorative noise) | Drive toward zero — every word, image, and layout choice that does not transmit information is theft from working memory |
| **Germane load** | Effort the reader spends building schema (the mental structure that turns facts into understanding) | *Protect* — leave deliberate retrieval space, hands-on moments, and "stop and think" beats |

Working memory holds about 4 chunks (Cowan, 2001). A tutorial that fills all four with extraneous load leaves zero for germane processing — the reader finishes feeling productive but builds no durable schema.

The author has three responsibilities, in priority order:

1. **Eliminate extraneous load.** Layout, terminology, references, diagrams.
2. **Stage intrinsic load.** Dependency graph, progressive worked examples, scaffolded difficulty.
3. **Protect germane load.** Force retrieval, vary contexts, interleave.

## Principle 1 — Expertise Reversal (Kalyuga, 2003)

Detailed worked examples accelerate novices but can burden advanced readers, who experience the verbose explanation as extraneous load (the effect is strongest for high-element-interactivity material and weaker on simple tasks). A single tutorial cannot optimize for both equally. Therefore: declare your target reader, calibrate scaffolding density to their level (see the worked:open ratio table under Principle 4), and accept the cost of not serving everyone at once.

**Operational rule**: every tutorial opens with explicit "适合谁 / 不适合谁 / 读完之后你能做到什么" sections. Anyone outside the target profile is routed elsewhere on page one.

## Principle 2 — Pre-training and Schema Anchoring (Mayer, multimedia learning)

If the reader sees a global structure first, every subsequent detail has a slot to attach to. Without that, details accumulate in working memory until overflow.

**Operational rule**: concept map and learning-path breadcrumb appear before chapter 1. The breadcrumb is re-shown at every chapter opener with the current location highlighted. This is also spaced revisit (principle 7).

## Principle 3 — Dual Coding (Paivio) + Split-Attention (Sweller, Chandler)

Words and images are processed by separate working-memory channels; combining them substantially increases retention (Paivio, 1971; magnitude varies by task and design — see Mayer, 2009). But if the reader has to mentally bind the diagram to a faraway caption ("see node A in figure 3.2 above"), the cross-reference cost wipes out the dual-coding gain (Sweller & Chandler, 1994).

**Operational rules**:
- At least one diagram per major section. A >300-line prose stretch without one counts as a Principle-3 failure.
- Labels go *on* diagram elements, not in surrounding prose.
- Decorative images (the brain icon, the rocket ship next to "let's launch into…") are pure extraneous load. Delete on sight.
- At least one reader-draw prompt per tutorial (typically in the capstone or self-check). Drawing forces the reader to construct the imagery channel themselves — a stronger encoding than passive viewing of the author's diagram. Converts dual coding from a one-way input into a retrieval loop.
- See [diagram_guide.md](diagram_guide.md) for the content-type → diagram-type mapping.

## Principle 4 — Worked Example Effect (Sweller & Cooper, 1985)

For novices, studying a complete worked example produces better learning *and* faster learning than attempting an equivalent open problem. The reason: the open problem forces means-ends search, which consumes working memory that should be building schema.

**Operational rule** — the three-step scaffold per concept (for novice-targeted chapters):

1. Complete worked example — fully explained
2. Partial example — structure given, 1-2 schema-building decisions blank
3. Open exercise — fresh problem, end-to-end

Ratio of example to exercise scales with reader level:

| Target reader | Worked example : Open exercise |
|---|---|
| Complete novice | 5 : 1 |
| Intermediate | 2 : 1 |
| Expert | 1 : 3 |

These are starting ratios, not constants — they operationalize the Expertise Reversal axis (Principle 1) and trace to Sweller & Cooper (1985) and Kirschner, Sweller & Clark (2006), which demolished the case for unguided "discovery learning" with novices. The optimal ratio also rises with task/example complexity: intricate domains (proof, protocol design) need more worked examples per exercise than procedural tasks.

## Principle 5 — Testing Effect (Roediger & Karpicke, 2006)

Their landmark study used three groups, all with the same time-on-task on a text passage:

| Group | Activity | 1-week retention |
|---|---|---|
| Re-read only | Read 4× | ~40% |
| Read + 1 test | Read 3× + test 1× | ~56% |
| Test-heavy | Read 1× + test 3× | ~61% |

The shape matters. Even one retrieval attempt captures most of the gain — there is a steep marginal return on the *first* test, then diminishing-but-still-positive returns on additional tests. **Passive reading is leakage.**

**Operational rules**:
- Every chapter ends with 2-4 self-check questions targeting the chapter's core schema.
- Answers go in a `<details>` block, an appendix, or a separate file. Never inline directly under the question. Physical separation is the entire point — answer-in-view collapses retrieval back to re-reading.
- Scatter predictive questions through the prose ("what do you think this will print?"). Each predictive question must precede the reveal by at least a paragraph or fold.
- **Atomic questions only.** A bundled question ("define X, explain why it matters, give an example") trains 1 retrieval attempt instead of 3 and lets the reader fudge partial answers. Split them.

**The five prompt properties (Matuschak).** Effective retrieval prompts satisfy five properties — *focused* (one detail), *precise* (unambiguous about what it asks), *consistent* (same answer at each retrieval, not "it depends"), *tractable* (almost always answerable correctly), *effortful* (genuine retrieval, not inference from the prompt's own wording). This is why broad-scope questions fail: they lose a focused target, give imprecise/inconsistent answers, and become intractable (Matuschak, "How to write good prompts," andymatuschak.org/prompts). Note the boundary against Principle 6: the "just out of reach" challenge is deliberately *not* tractable — it lives in the separate challenge block, never in the self-check, whose questions should be answerable. Caveat for an LLM author: auto-generated prompts are prone to "garbage in, garbage out" and over-decomposition (atomizing past the point of meaning) — generate, then prune to the few that carry the schema.

## Principle 6 — Desirable Difficulty (Bjork, 1994)

Bjork's central insight, made explicit: **current performance ≠ durable learning**. The conditions that produce the smoothest in-the-moment performance are *not* the conditions that produce the best long-term retention or transfer. A tutorial that feels effortless is producing illusion of mastery — the reader will fail on contact with reality.

This is the **pivot principle** of the seven — it is the *reason* the output-side rules (4, 5, 7) exist. Without it, those rules look like gratuitous friction.

Bjork names four operational forms of desirable difficulty:

| Form | Mechanism | Skill operationalization |
|---|---|---|
| **Spaced retrieval** | Re-encoding at lengthened intervals | Principle 7 (chapter-opener summaries, cross-chapter callbacks) |
| **Interleaving** | Forces discrimination across types | Principle 7 (mixed examples in late chapters; discrimination challenge at end) |
| **Active retrieval** | Retrieval itself is the encoding event | Principle 5 (self-check, predictive Qs, atomic questions) |
| **Variation of conditions** | Generalizes the schema beyond the trained shape | Principle 6's own surface rule: 2-3 different shapes per concept |

**Operational rules**:
- One "just out of reach" challenge per chapter (in the zone of proximal development — solvable with the chapter's concepts but requiring real thought).
- Vary problem contexts. Don't teach a concept with only the canonical example; show it in 2-3 different shapes.
- Delay the answer reveal. Buy think-time with formatting.
- **Forbidden anesthetic words**: "这很简单", "显然", "trivial", "obviously", "just". They tell the confused reader their confusion is shameful. They also lie — if it really were trivial, the tutorial wouldn't need to cover it.
- **Surface the fluency-illusion trap to the reader**: in the `index.html` "how to use this tutorial" note, warn explicitly — "我读得很顺" (familiarity ≠ learning), "我做题很快" (probably stock problem types), "我没卡壳" (probably not touching the schema). Giving the reader these labels lets them self-diagnose.

## Principle 7 — Spaced Repetition + Interleaving (Ebbinghaus; Rohrer; Bjork)

Two distinct findings, both about long-term durability.

**Spaced repetition**: information re-activated at intervals enters long-term memory more reliably than information reviewed in one block. Forgetting curve (Ebbinghaus, 1885) shows that retrieval *just as you're starting to forget* produces the most durable encoding. Cepeda et al. (2006), meta-analysis of 184 studies: spaced practice produces ~2-3× the long-term retention of equivalent massed practice.

**Interleaved practice** (Rohrer, 2007 onwards): blocked practice (drill chapter 3 problems, then drill chapter 4 problems) feels productive but produces worse transfer than interleaved practice (mix problems from chapters 3 and 4). The mechanism — interleaving forces the learner to first **identify** which approach applies, then apply it; blocked practice skips the identification step. Identification is the step real-world use actually requires, so blocked practice trains a phantom skill.

**Operational rules**:
- Each chapter opens with a one-sentence summary of the prior chapter's contribution. This is forced retrieval, not redundancy.
- Examples in chapter N use concepts from chapters 1..N-1, not just N's new concept.
- The tutorial ends with a **discrimination challenge** — the reader must choose between approaches from multiple prior chapters. "Should you use the chapter 1 approach or the chapter 2 approach here?" In a concept-focused tutorial this lives as scenario questions in `03-self-check.html`; in a hands-on tutorial it lives as a project in `05-capstone.html`. Either form is acceptable; the discrimination *function* is what matters.
- A tutorial without a discrimination challenge has trained recall but not transfer.

**Boundary — when interleaving hurts.** Interleaving trains discrimination, which presupposes the reader can already execute each approach individually. During the *acquisition* phase of a brand-new motor / syntactic skill (first encounter with the language's async syntax, first 30 min with a new API surface), the reader has nothing to discriminate between yet — interleaving just adds load on top of confusion. Block first, interleave later. In tutorial terms: early exercises or scenario questions can be blocked; late items and the final discrimination challenge should be interleaved.

## Depth of processing — orthogonal to the seven principles

The seven principles cover *how* learning encodes (intrinsic / extraneous / germane load, scaffolded retrieval, dual coding, etc.). They do not enforce *what depth* of content the author chose to write at. A tutorial can pass every retrieval / diagram / scaffold check and still be a glossy paraphrase of the docs. Four converging research lines describe the depth dimension. SKILL.md exposes them as *author orientation* (not as audit gates); the research basis lives here.

### Deep vs surface processing (Marton & Säljö, 1976)

The Gothenburg studies asked university students to read a passage on a complex topic, then categorized how they engaged with it:

- **Surface processors** focused on signs — terminology, phrases, "what will the test ask?". They read the text as something to be reproduced.
- **Deep processors** focused on what was signified — the argument, relationships between ideas, the author's claim. They read the text as evidence to be evaluated.

A week later, surface processors retained ~10-15% of meaning; deep processors retained ~50-60%. The *gap* (the depth-of-processing effect) replicates robustly; the absolute percentages are specific to that one-week-delay single-passage task. **Depth of processing, not time spent, was the dominant retention predictor.**

For tutorial writers: the author's framing forces the reader into one or the other. "X is a Y" triggers surface processing (sign equivalence). "X enables / prevents / makes Z possible" triggers deep processing (signified meaning). Notice which one you wrote in each concept introduction.

### Bloom's revised taxonomy (Anderson & Krathwohl, 2001)

The revised taxonomy orders cognitive demand from least to most demanding. Each level subsumes the prior:

| Level | What it asks of the reader |
|---|---|
| Remember | Recognize / recall — "What is X?" |
| Understand | Explain — "Explain X in your own words" |
| Apply | Use in a new situation — "Apply X to scenario S" |
| Analyze | Decompose, find relationships — "Why does Y depend on Z?" |
| Evaluate | Judge tradeoffs — "Which approach for scenario S, A or B? Defend." |
| Create | Generate new work — "Design a system that..." (typically capstone-scope) |

A Remember question takes the reader ~10 seconds and trains weak encoding. An Evaluate question takes minutes and trains transfer. Tutorials should weight toward higher levels even though they're more work to design.

This is an **orientation**, not a quota. SKILL.md does *not* require "≥1 Analyze + ≥1 Evaluate per chapter" — that gameable count would train the author to relabel Remember questions, not to think harder. Instead: notice where your questions cluster, and rewrite the cluster if it's at the bottom.

### SOLO taxonomy (Biggs & Collis, 1982)

Structure of Observed Learning Outcomes — describes the *organization* of the learner's mental representation after instruction:

| Level | What the learner has built |
|---|---|
| Prestructural | Misses the point |
| Unistructural | One isolated fact |
| Multistructural | Multiple facts, unconnected |
| **Relational** | Facts integrated into a coherent structure |
| **Extended abstract** | Generalization of the structure to new domains |

A shallow tutorial leaves the reader at multistructural — a bag of unconnected definitions. The Principle-2 concept map is the *mechanism* for moving the reader from multistructural to relational: the edges between concepts (not the concepts themselves) carry the relational information. An unlabeled edge in a concept map shows that things connect without saying *how* — the same SOLO state as no map at all.

Operational consequence: if you can label every edge with a relationship type (`calls` / `depends on` / `alternative to` / `degrades to` / domain-specific), you have relational understanding of that connection. If you can't, you don't — go back to Phase 2 material and dig until you do.

### Threshold concepts (Meyer & Land, 2003)

A *threshold concept* is a portal in a discipline that, once passed through, transforms the learner's perception of the field. Threshold concepts have five empirically-distinguished properties:

- **Transformative** — changes how the learner sees other concepts in the domain.
- **Irreversible** — once internalized, the learner can't return to the prior view.
- **Integrative** — reveals previously hidden connections between separately-held ideas.
- **Bounded** — marks the edges of the discipline.
- **Troublesome** — often counterintuitive; resists surface absorption.

Every domain has 1-3 such concepts, usually framed as *mechanism*, not vocabulary. Examples:

- SQL: *joins are set operations, not loops*.
- React: *state belongs where ownership requires, not where the closest UI sits*.
- TCP: *backpressure lives in the protocol, not in the application*.
- Git: *commits are immutable snapshots; branches are mutable pointers to them*.
- Distributed systems: *every "real-time" guarantee is bounded — name the bound or you don't have one*.

A tutorial without an identified threshold concept covers ground rather than transforming understanding. The primary upstream act of the tutorial author is to find which one(s) the tutorial targets, then center the structure on it. SKILL.md surfaces this in Phase 3 alongside the outline approval.

### The Feynman technique (informal, attributed to Richard Feynman)

Not a formal theory; a practiced discipline. Before claiming to understand a concept, write a 50-word explanation in plain language with no jargon, as if explaining to an intelligent non-specialist. The places you stall are precisely the places your understanding is shallow.

For tutorial writers: the agent runs this on itself before writing each concept introduction. Stalls during the Feynman test predict surface-paraphrase prose if you write anyway. Stop, go back to source material, then write — much cheaper than fixing the prose later.

### Why all four frameworks together

Each framework addresses a different facet of depth:

- **Marton & Säljö** — depth of the *reader's mental activity* during reading.
- **Bloom** — depth of the *cognitive demand* the author places on the reader.
- **SOLO** — depth of the *resulting mental structure*.
- **Meyer & Land** — depth of the *target concept* the tutorial centers on.
- **Feynman** — diagnostic test for whether the *author* has the depth required to produce it.

The author works on all five simultaneously: trigger deep processing (Marton), demand high-Bloom thinking, produce relational structure (SOLO), center on the threshold concept (Meyer & Land), pass the Feynman test before writing (diagnostic).

### Why orientation, not audit

Operationalizing depth as a checklist ("≥3 quantitative claims", "≥1 Evaluate-level question per chapter") trains the author to game the count rather than to think harder. Same trap as "X test cases per function" producing shallow tests. The vocabulary (sign vs signified, Bloom levels, multistructural vs relational, threshold concepts, Feynman stall) belongs *in front of the author before writing*, as a way of noticing — not after writing, as a grep.

### Citations

- Marton, F. & Säljö, R. (1976). "On Qualitative Differences in Learning—I: Outcome and Process." *British Journal of Educational Psychology*, 46, 4-11.
- Anderson, L. W. & Krathwohl, D. R. (2001). *A Taxonomy for Learning, Teaching, and Assessing: A Revision of Bloom's Taxonomy of Educational Objectives*. Longman.
- Bloom, B. S. (1956). *Taxonomy of Educational Objectives, Handbook I: Cognitive Domain*. McKay.
- Biggs, J. B. & Collis, K. F. (1982). *Evaluating the Quality of Learning: The SOLO Taxonomy*. Academic Press.
- Meyer, J. H. F. & Land, R. (2003). "Threshold Concepts and Troublesome Knowledge: Linkages to Ways of Thinking and Practising within the Disciplines." *Improving Student Learning — Ten Years On*, OCSLD, Oxford.
- Feynman, R. P. (1985). *Surely You're Joking, Mr. Feynman!* — for the spirit. The "Feynman technique" as a learning method was popularized later (e.g., Gleick 1992, *Genius*).

## The voice and tone rule (less a principle than a corollary)

Several of the above principles cash out as voice constraints:

- **Expertise reversal** → no cheerleader voice that condescends to professional readers ("let's discover…", "我们一起踏上…").
- **Extraneous load** → no filler, no AI-tutorial intros ("在当今快速发展的技术领域…"), no unnecessary hedges ("可能", "也许", "大概").
- **Desirable difficulty** → no anesthetic words ("这很简单", "显然", "just").
- **Cognitive economy** → one concept per sentence; specific numbers/versions beat hedges.

The reader is a working professional and the tutorial respects their time. Tone is **professional, declarative, specific**.

## The four-phase writing process (operational)

The principles map onto a writing workflow:

1. **Reader modeling** (principle 1) — write the target reader profile before anything else.
2. **Dependency decomposition** (principles 2, 4) — concept graph, then chapter sequence that obeys it.
3. **Unit design** (principles 3, 4, 5, 6) — per-chapter, scaffold examples + diagrams + self-checks.
4. **Verification** (principle 7 + cross-cutting) — discrimination challenge, density check, retrieval-separation check, voice check.

## When you want to break a rule

If a specific situation makes one of the seven principles awkward, ask: *what cognitive function was the rule protecting?* If you can protect that function another way, fine. If not, do not break the rule.

Examples of legitimate adaptation:
- **Quick primer** (under 30 min): collapse to a single file; you can drop the cross-chapter callback rule because there are no chapters. You cannot drop self-checks — retrieval still matters in a 20-page document.
- **Reference-style cheat sheet** (different goal entirely): not a tutorial. Don't use this skill.
- **Expert reader** explicitly stated: skip step 1 of the worked-example scaffold. Don't skip retrieval.

Examples of *illegitimate* adaptation (cargo-cult shortcuts):
- "The reader probably knows this" — that's exactly when you're failing expertise-reversal; if you assumed it, declare the assumption.
- "Self-checks feel like a school worksheet" — they do; that is the testing effect working.
- "The diagram is obvious from the code" — for *you*, who wrote the code. Re-read principle 3.

## Further reading (research sources)

- Sweller, J. (1988). "Cognitive load during problem solving: Effects on learning." *Cognitive Science*.
- Sweller, J., van Merriënboer, J. & Paas, F. (2019). "Cognitive Architecture and Instructional Design: 20 Years Later." *Educational Psychology Review*, 31, 261-292. (current canonical CLT review by the theory's originators)
- Sweller, J. & Cooper, G. (1985). "The use of worked examples as a substitute for problem solving in learning algebra." *Cognition and Instruction*.
- Kirschner, P., Sweller, J. & Clark, R. (2006). "Why minimal guidance during instruction does not work." *Educational Psychologist*.
- Kalyuga, S. (2003). "Expertise reversal effect." *Educational Psychologist*.
- Roediger, H. & Karpicke, J. (2006). "Test-enhanced learning." *Psychological Science*.
- Matuschak, A. "How to write good prompts: using spaced repetition to create understanding." andymatuschak.org/prompts. (the five prompt properties; note: a practitioner essay, partly outside the peer-reviewed literature)
- Bjork, R. (1994). "Memory and metamemory considerations in the training of human beings." In *Metacognition: Knowing about Knowing*.
- Rohrer, D. & Taylor, K. (2007). "The shuffling of mathematics problems improves learning." *Instructional Science*.
- Paivio, A. (1971). *Imagery and Verbal Processes*.
- Mayer, R. (2009). *Multimedia Learning* (2nd ed.).
- Cowan, N. (2001). "The magical number 4 in short-term memory." *Behavioral and Brain Sciences*.
