# tech-tutorial terminology discipline — design spec

**Date:** 2026-05-29
**Status:** approved (design + scope); implementing directly (small, fully-specified change)
**Scope:** the `tech-tutorial` plugin skill at `plugins/tech-tutorial/skills/tech-tutorial/`
**Relation to other specs:** independent of `2026-05-29-tech-tutorial-improvements-design.md`
(slimming / bug-fix / revise-branch pass). Same skill, different concern.

## Motivation

In use, `tech-tutorial` coins its own vocabulary instead of using plain (通俗) and standard
(专业化) language. The user confirmed all four coinage failures are present:

1. **Invented concept labels** — promoting a self-coined name to a term (`引力中心`, `执行漏斗`,
   `三态收敛模型`). The `引力中心 → 一句话本质` rename (commit `7e6e80b`) already fought one
   instance; the source was never closed.
2. **Non-standard translation** — hard-translating an established term into a novel Chinese word
   (`closure → 闭合器`, `idempotent → 幂同性`, `backpressure → 逆压`).
3. **Pedagogy jargon in reader prose** — the cognitive scaffolding (cognitive load, desirable
   difficulty, schema, threshold concept, dual coding) leaking into the tutorial body.
4. **Literary / marketing flourish** — `蜕变之旅`, `打通任督二脉`, `一朝顿悟`.

Root cause: the **Voice and tone** section bans tone filler but has **no terminology rule**, and
the workflow **structurally invites coinage** at the Phase 3 `一句话本质` / threshold-concept step.

Key constraint: **a coined word is not greppable** (it is novel by definition). So the fix is a
*rule* + a *structural guard* + a *qualitative audit*, plus one mechanical grep for the only
greppable sub-case (pedagogy-jargon leak).

## The "通俗 + 专业化" formulation

The two halves are not in tension; they apply to different jobs:

- **Naming → 专业化.** Use the term the field actually uses. When practitioners keep the English
  (closure, idempotent, async/await, backpressure), keep the English; gloss once in plain language
  on first use. 专业化 means matching the field's usage, not maximizing Chinese coverage.
- **Explaining → 通俗.** Once named correctly, explain the mechanism in short, concrete, plain
  sentences. No flourish.

The failure mode is the inverse of both: an invented label nobody else uses, wrapped in literary
framing.

## Changes (all in `SKILL.md` unless noted)

### 1. New `Voice and tone` subsection: `Terminology discipline`
Inserted after `### Hard rules`, before `### Forbidden phrases`. Contains: the 命名/解释 split; a
four-row failure→fix table (one row per coinage failure above); the one test that catches all four
(*"would a working practitioner recognize this as the real term, or did I make it up?"*); the
analogy rule (mark it, never promote it to a term); three before/after examples.

### 2. Phase 3 `一句话本质` structural patch
Item 4 (threshold concept) gains a constraint: the `一句话本质` must be a **plain-language claim
built from the field's real terms** — a sentence about how the thing works, not a coined noun.
Positive/negative example inline. Locks the spot that produced `引力中心`.

### 3. Phase 5 audits (two new)
- **Terminology check** (qualitative, sibling of Insight check): list every bold/quoted concept
  name + every section/figure title; for each answer "standard term, or coined?"; coined ones get
  the real term or a marked analogy. This is the audit for failures 1 & 2 (grep can't find a word
  that didn't exist before it was written).
- **Pedagogy-jargon leak check** (mechanical grep): over HTML-stripped prose, grep a *narrow,
  stable* list — `认知负荷|cognitive load|内在/外在/相关负荷|germane/intrinsic/extraneous load|期望难度|desirable difficulty|门槛概念|threshold concept|双重编码|dual coding|提取练习|retrieval practice`.
  **Deliberately excludes** `schema` (legit subject term: DB/JSON/GraphQL schema — left to the
  qualitative check) and `fluency illusion / 流畅性错觉` (Principle 6 *mandates* a fluency-illusion
  warning in `index.html`). This grep is **separate** from the forbidden-phrases voice grep, so it
  does not touch the grep↔table 1:1 sync invariant.
- Add `terminology` to the Phase 5 parallel-audit fan-out list.

### 4. Phase 2 root-cause supply (B)
The official-docs worker also returns **the canonical term for each concept (and which terms the
community keeps in English)**. A lead-thread sentence carries these into Phase 4: drafting names
concepts with the real terms. Coinage usually happens because the author lacks the real word at
hand; this is the supply.

### 5. Eval (`evals/evals.json`, +1 → 4 total)
`no-invented-terminology`: a concept-heavy prompt (JS event loop / micro- & macro-task) that
naturally invites coinage. Asserts `uses_standard_terminology`, `no_invented_concept_labels`,
`no_pedagogy_jargon_in_prose` (same semantic-assertion style as existing `centers_on_why`).

### 6. Version bump
`0.2.0 → 0.3.0` in `plugin.json` and `.claude-plugin/marketplace.json`.

## Non-goals

- No change to the seven principles, the cognitive framework, the visual identity, or the phase
  structure.
- The pedagogy-jargon list does **not** go into the forbidden-phrases table (that table ↔ voice
  grep must stay 1:1; pedagogy terms are banned only in *reader prose*, not in `SKILL.md` itself or
  the reference docs).
- No remote push unless separately requested.

## Forward-compatibility with the slimming pass

When `references/voice_and_tone.md` is later created (the other spec's Direction 1), the
Terminology discipline **rule + failure table stay in the body** (load-bearing, like the
forbidden-phrases table); its three before/after examples move out with the other voice examples.

## Acceptance criteria

- `Terminology discipline` subsection present with the 命名/解释 split, four-row table, the one
  test, the analogy rule, and 3 before/after examples.
- Phase 3 `一句话本质` carries the plain-language-claim constraint + pos/neg example.
- Phase 5 has both new checks; `terminology` in the fan-out list.
- Pedagogy-jargon grep runs clean over a tutorial dir and excludes `schema` / fluency-illusion.
- Phase 2 official-docs worker output includes canonical terms; Phase 4 supply sentence present.
- `evals.json` valid JSON, 4 well-formed evals.
- Version `0.3.0` in both manifests.

## Risks

- **Over-broad pedagogy grep** flags legit subject terms → mitigation: narrow list, `schema` and
  fluency-illusion explicitly excluded; qualitative check carries the ambiguous remainder.
- **Rule ignored without supply** → mitigation: Phase 2 term capture (change 4) feeds the real
  terms in, so the model rarely needs to coin.
- **SKILL.md grows** (~+400 words over 6952) against the pending slimming target → accepted: these
  are load-bearing rules that stay in body anyway; examples move later.
