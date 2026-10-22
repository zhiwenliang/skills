# Clear Technical Writing

Use this reference for the clarity pass in Phase 4 and semantic review in Phase 5. The core rules live in SKILL.md. This file explains how to apply them without losing technical depth.

## Research Comparison And Limits

Research checked: 2026-10-22. These sources address different problems; they are not interchangeable standards.

| Approach | What it contributes | Application here | Boundary |
|---|---|---|---|
| [ASD-STE100](https://www.asd-ste100.org/about_STE.html) | A controlled English standard combining writing rules and a dictionary, with provision for technical nouns and verbs. The official site identifies Issue 9, dated 2025-01-15, as current at this check. | Stable terms, explicit actors, clear conditions, and manageable sentences. | A few style rules do not establish compliance. Domain terms are not forbidden merely because they are outside the general dictionary. |
| [Controlled natural languages, Kuhn (2014)](https://aclanthology.org/J14-1005.pdf) | A research taxonomy distinguishes goals such as human communication, translation, and formal representation. | Select constraints for human understanding rather than maximizing restriction. | A language for formal reasoning is not automatically suitable tutorial prose. This survey is not evidence about current product support. |
| [Google Technical Writing: words](https://developers.google.com/tech-writing/one/words) | Consistent names, first-use definitions, and unambiguous pronouns. | Maintain a term table; repeat an object name when a pronoun is ambiguous. | Professional guidance, not a controlled vocabulary or a learning experiment. |
| [Google procedure guidance](https://developers.google.com/style/procedures) and [sentence structure](https://developers.google.com/style/sentence-structure) | Give context and applicable conditions before instructions; generally separate actions and describe useful results. | Prepare the reader before a command and make its outcome observable. | “One action” must not erase a required concurrent action or turn optional work into a requirement. |
| [Google sample-code guidance](https://developers.google.com/tech-writing/two/sample-code) | Explain setup, invocation, and results; test examples and prefer correctness over brevity. | State the example's execution requirements and validation status. | A short example can omit production concerns only when the simplification is explicit and does not teach an unsafe practice. |
| [Diátaxis tutorials](https://diataxis.fr/tutorials/) | Practical learning toward an achievable goal, with visible results and signals that reveal a wrong turn. | Keep the initial hands-on path followable; move lengthy rationale and alternatives outside its steps. | A documentation framework, not a language standard. This skill's concept-focused study path intentionally mixes explanation and practice. |

Learning science addresses a further question: can readers use and retain the ideas? Worked examples, retrieval, and expertise-based scaffolding remain necessary even when sentences are clear. Their evidence and limits are in `cognitive_principles.md`, linked directly from SKILL.md. Clear prose alone is not a learning-outcome measurement.

### STE Verification Boundary

The [official Issue 9 PDF](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf) returned HTTP 403 during this check. The official overview and selected PDF passages were checked through search-indexed text. Indexed rules 6.3 and 8.4 confirm the distinction between English descriptive sentences (25 words) and procedural sentences (20 words). A full rule-by-rule or dictionary audit was not performed. The dictionary is not reproduced here.

Those English limits are context, not this skill's pass/fail thresholds. Do not count Chinese characters as English words, invent a Chinese maximum, or declare STE compliance from sentence length. For a formal English compliance request, obtain the applicable official rules and dictionary and perform a separate review; disclose access gaps instead of certifying compliance.

## Apply Constraints Without Changing Meaning

Treat clarity revision as a semantic-preservation task. Before shortening a dense statement, identify who acts, what changes, under which conditions, with what modality, and what evidence supports the result.

| Preserve | Common damaging rewrite | Better decision |
|---|---|---|
| Necessary versus sufficient condition | Change “Only if P may Q” to “If P, do Q.” | Preserve P as a prerequisite and Q as permission, including any optionality. |
| Uncertainty and scope | Change “may fail in version 3; untested” to “fails.” | Keep probability, version, and verification limits where they affect interpretation. |
| Concurrent versus sequential action | Turn “Hold A while pressing B” into “Press A. Then press B.” | Retain the overlap explicitly. |
| Negation and quantifiers | Change “not all replicas” to “no replicas.” | Check exactly which cases the claim covers. |
| Causality versus correlation | Turn “X occurs with Y” into “X causes Y.” | Add a causal claim only when the source supports the mechanism. |
| Scenario versus general definition | Turn an example's chosen configuration into a universal prerequisite. | Label the choice as a teaching assumption and name the actual boundary. |

Use active voice when it identifies the actor. Do not invent an actor, cause, numerical threshold, or guarantee that the source does not establish. Present tense describes current behavior; it must not make a historical test sound current.

### Bilingual Revision Example

The following is a fictional specification for practicing meaning preservation, not instructions for a real device:

> Only after the local test succeeds may the operator optionally inspect the report. While holding Reset, press Start. The cache may be lost after a process restart; this was not tested on version 3.

Clear English:

> Inspecting the report is optional. The operator may inspect it only after the local test succeeds. Hold Reset while pressing Start. The cache may be lost after a process restart. Cache loss after restart was not tested on version 3.

Clear Chinese:

> 查看报告是可选操作。只有本地测试成功后，操作员才可以查看报告。按住 Reset 的同时，按下 Start。进程重启后，缓存可能丢失。版本 3 的重启缓存行为尚未测试。

Both versions retain the prerequisite, permission, optionality, concurrent action, possibility, and unverified scope. Shorter sentences are useful only if these relationships survive. For an ordinary subject tutorial, apply the principles without adding a boilerplate STE disclaimer to every chapter. Explain the adaptation boundary when the user requests STE or compliance.

## Explain A Mechanism In Connected Prose

Keep one main teaching point per sentence, then connect the points. Conjunctions such as “because”, “therefore”, “只有”, and “因此” can carry necessary reasoning. Removing them can make a technically correct list hard to understand.

Use one running scenario while it serves the concepts. Start with its state and assumptions, identify the actor and action, describe the resulting state, and connect the result to the mechanism. Change one relevant condition for a contrasting case. Reuse the same canonical terms in diagrams, code, prose, and answers. Domain changes are useful when testing transfer; unrelated examples should not obscure the initial causal chain.

For example, a hypothetical order model can define this rule: a shipped order cannot be cancelled directly. Explain that `Order.cancel()` checks shipment state before changing the order. Under that teaching rule, calling `Order.cancel()` on a shipped order rejects the change. Then ask which condition must change to permit cancellation. Do not present this business rule as a universal property of DDD or all ordering systems.

For Chinese, introduce an established Chinese term and its English counterpart when that helps recognition, then use the chosen form consistently. Preserve identifiers such as `Order.cancel()` exactly. Short sentences should form readable paragraphs, not one-line fragments with the causal links removed. Technical simplicity means explaining an essential term, not removing the mechanism that term names.

## Make A Hands-on Path Observable

Before a runnable example, identify the supported environment, relevant versions, working directory, dependencies, input state, and material side effects. Omit irrelevant setup details. Label a fragment as a fragment and identify what supplies its missing context.

At a meaningful step, give the learner:

1. The prerequisite or applicability condition, before the instruction.
2. An action with an explicit object and execution location.
3. An observable expected result and what it establishes.
4. A likely wrong-path signal and a targeted recovery check, where useful.

A result need not repeat every trivial UI reaction. Place checks at boundaries where the learner could otherwise continue with the wrong state. Separate the learner's action from the system's reaction. Keep necessary simultaneous actions together. Distinguish a predicted output from output actually observed during authoring, including the tested environment when relevant.

Long explanations belong before or after the procedure, with alternatives deferred until the reader has completed the initial path. A procedure inside a learning artifact does not turn the whole artifact into a work-oriented how-to guide.

## Review What Scripts Cannot Prove

The existing English prose scanner detects selected style patterns. It does not verify STE vocabulary, parse necessary conditions, review Chinese prose, or judge whether an example demonstrates its claimed mechanism.

Review the original claim against the revision, including hidden answers and diagram labels. If a scanner flags a supported uncertainty statement, preserve the uncertainty. Rephrase accurately or use the existing narrow, justified exemption mechanism; never hide an entire section merely to obtain a pass.

Evaluate the new cases in `evals/evals.json` by the meaning readers receive. Script success and agent examples provide regression evidence; neither establishes that human readers learn more or retain the material longer.
