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

Sweller's Cognitive Load Theory (1988, refined through the 2010s) divides mental effort during learning into three categories:

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

Detailed worked examples accelerate novices but actively slow experts (who experience the verbose explanation as extraneous load). A single tutorial cannot optimize for both. Therefore: declare your target reader and accept the cost of not serving everyone.

**Operational rule**: every tutorial opens with explicit "适合谁 / 不适合谁 / 读完之后你能做到什么" sections. Anyone outside the target profile is routed elsewhere on page one.

## Principle 2 — Pre-training and Schema Anchoring (Mayer, multimedia learning)

If the reader sees a global structure first, every subsequent detail has a slot to attach to. Without that, details accumulate in working memory until overflow.

**Operational rule**: concept map and learning-path breadcrumb appear before chapter 1. The breadcrumb is re-shown at every chapter opener with the current location highlighted. This is also spaced revisit (principle 7).

## Principle 3 — Dual Coding (Paivio) + Split-Attention (Sweller, Chandler)

Words and images are processed by separate working-memory channels; combining them roughly doubles retention (Paivio, 1971). But if the reader has to mentally bind the diagram to a faraway caption ("see node A in figure 3.2 above"), the cross-reference cost wipes out the dual-coding gain (Sweller & Chandler, 1994).

**Operational rules**:
- At least one diagram per major section.
- Labels go *on* diagram elements, not in surrounding prose.
- Decorative images (the brain icon, the rocket ship next to "let's launch into…") are pure extraneous load. Delete on sight.
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

This is calibrated from Kirschner, Sweller & Clark (2006), which famously demolished the case for unguided "discovery learning" with novices.

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

## Principle 6 — Desirable Difficulty (Bjork, 1994)

Bjork's central insight, made explicit: **current performance ≠ durable learning**. The conditions that produce the smoothest in-the-moment performance are *not* the conditions that produce the best long-term retention or transfer. A tutorial that feels effortless is producing illusion of mastery — the reader will fail on contact with reality.

This is the **pivot principle** of the seven — it is the *reason* the output-side rules (4, 5, 7) exist. Without it, those rules look like gratuitous friction.

Bjork names four operational forms of desirable difficulty:

| Form | Mechanism | Skill operationalization |
|---|---|---|
| **Spaced retrieval** | Re-encoding at lengthened intervals | Principle 7 (chapter-opener summaries, cross-chapter callbacks) |
| **Interleaving** | Forces discrimination across types | Principle 7 (mixed examples in late chapters, capstone) |
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
- The tutorial ends with a **capstone** that requires the reader to discriminate between approaches from multiple prior chapters. "Should you use the chapter 3 approach or the chapter 7 approach here?"
- A tutorial without a capstone has trained recall but not transfer.

**Boundary — when interleaving hurts.** Interleaving trains discrimination, which presupposes the reader can already execute each approach individually. During the *acquisition* phase of a brand-new motor / syntactic skill (first encounter with the language's async syntax, first 30 min with a new API surface), the reader has nothing to discriminate between yet — interleaving just adds load on top of confusion. Block first, interleave later. In tutorial terms: early exercises in a chapter can be blocked; late-chapter exercises and the capstone should be interleaved.

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
4. **Verification** (principle 7 + cross-cutting) — capstone, density check, retrieval-separation check, voice check.

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
- Sweller, J. & Cooper, G. (1985). "The use of worked examples as a substitute for problem solving in learning algebra." *Cognition and Instruction*.
- Kirschner, P., Sweller, J. & Clark, R. (2006). "Why minimal guidance during instruction does not work." *Educational Psychologist*.
- Kalyuga, S. (2003). "Expertise reversal effect." *Educational Psychologist*.
- Roediger, H. & Karpicke, J. (2006). "Test-enhanced learning." *Psychological Science*.
- Bjork, R. (1994). "Memory and metamemory considerations in the training of human beings." In *Metacognition: Knowing about Knowing*.
- Rohrer, D. & Taylor, K. (2007). "The shuffling of mathematics problems improves learning." *Instructional Science*.
- Paivio, A. (1971). *Imagery and Verbal Processes*.
- Mayer, R. (2009). *Multimedia Learning* (2nd ed.).
- Cowan, N. (2001). "The magical number 4 in short-term memory." *Behavioral and Brain Sciences*.
