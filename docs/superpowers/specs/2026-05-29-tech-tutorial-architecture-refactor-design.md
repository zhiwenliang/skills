# tech-tutorial deep architecture refactor — design spec (B′)

**Date:** 2026-05-29
**Status:** revised after adversarial review; pending user review → implementation plan
**Scope:** the `tech-tutorial` plugin skill at `plugins/tech-tutorial/skills/tech-tutorial/`
**Approach:** **B′ — Consolidate + re-slice, inventory-first, enforcement stays at point-of-use**

## What changed from B → B′ (after adversarial review)

The original B made a new `rules.md` table the *runtime* single source and exiled enforcement to a
separate `audit_commands.md`. An adversarial review (verified) showed that backfires:

- **Phase 5 is the point-of-use for enforcement.** By the same logic that keeps principles inline,
  the *executable* checklist must stay inline — not behind a `rules.md` → `audit_commands.md` hop at
  the most-skipped gate. → **Enforcement stays local; no separate `audit_commands.md`.**
- **The merge is not lossless dedup.** Measured: 14 anti-patterns + 14 Phase-5 checks + **73**
  template checklist items (SKILL.md mislabels this "30-item" in two places — a pre-existing bug);
  several anti-patterns have no checklist twin. Merging *adds* rules. → **A canonical rule inventory
  is step 0;** structure is decided from its real shape, not pre-committed to "one clean table."
- **Voice is point-of-use too** (every sentence). → **A compressed voice rule-card stays inline;**
  only examples/rationale move out.
- **The concept "collapse" contradicted the source doc** (Bloom = question demand; SOLO = resulting
  structure; Feynman = author diagnostic — distinct axes). → **Compress prose, keep the distinctions.**
- **SKILL.md rewrite was a one-shot big-bang.** → **Rewrite section-by-section, verified against the
  inventory.**

## Motivation — four goals, one root cause

User goals: (1) cut conceptual redundancy / over-design; (2) single source of truth; (3) re-slice
file/chapter structure; (4) improve execution reliability. A three-agent architectural map found one
root cause — **no single source of truth**: every rule is written 3–4× (principle / Phase-5 audit /
template checklist / anti-pattern), with hand-sync directives as evidence. Concept surface ~11–12
constructs with real overlaps. SKILL.md (7,795w) is ~65% three sections; "The workflow" bundles
process + parallelism (4×) + a wall of bash scripts; "Voice and tone" is a style manual living in the
orchestration doc.

## Target architecture (B′)

### DRY vs. locality (refined)

Point-of-use stays local — **and Phase 5 enforcement is point-of-use, not just Phases 1–4.** So:
- **Principle statements** stay inline in SKILL.md (where the agent designs).
- **The executable enforcement checklist** (rule + its command) stays inline at Phase 5 (where the
  agent verifies).
- **Single-source applies to the maintenance representation**, not the runtime point-of-use: each
  rule has exactly one *authoritative* statement; other mentions reference it instead of restating.

### Step 0 — canonical rule inventory (the linchpin, build FIRST)

Enumerate every rule from all current homes and tag each:

| Field | Values |
|---|---|
| source(s) today | anti-patterns row / Phase-5 check / template checklist item / principle / voice table |
| grain | draft-smell (prose guidance) / presence-check / per-chapter `自检` instance |
| enforcement | `grep` (command text) / qualitative self-check |
| principle | P1–P7 / depth / voice |
| mode-gate | all / concept-focused / hands-on |

Expected ~40–55 distinct rules across 2 grain-levels. **The structure of everything downstream is
decided from this inventory** — it is also the content-preservation checklist for the final audit.

### Single source, made concrete

- **Phase 5's checklist becomes the canonical enforcement list** — each entry carries the rule, its
  grep/qualitative check, and its command *inline*. This is the runtime source.
- The template's per-chapter `自检` blocks and the anti-pattern *failure-phrasings* **reference**
  those entries (by short ID) rather than restating them; the anti-patterns table stops being a
  standalone table (its phrasing becomes a "failure mode" note on the relevant entries).
- A separate **`rules.md` maintenance index is created only if** the inventory shows a cross-touch map
  earns its keep (rule-ID → where-stated / where-enforced). Default leaning: lightweight index, or
  none. **No `audit_commands.md`.**

### File structure after refactor

| File | Role | Change |
|---|---|---|
| `SKILL.md` | lean spine: premise; when-applies; 7 principles (inline, point-of-use); 5-phase workflow incl. **the inline executable Phase-5 checklist**; **compressed voice rule-card** (forbidden table + first-person default + terminology rule); one-line input/pivot/output note; pointers | 7,795 → **~4,500w** (ceiling 5,000) — a *moderate, deliberate* slim; point-of-use content stays |
| `references/voice_and_tone.md` | **NEW** — voice *rationale + examples*: before/after tables, when-to-break, first-person table. The canonical banned-phrase list is the inline rule-card; the voice grep references it | new; rule-card stays inline |
| `references/html_output.md` | **NEW** — tech-stack table, Markdown→HTML mapping, code-escaping, file-structure trees, mode→fileset matrix | new |
| `references/research_workflow.md` | **EXTENDED** — sole home of parallelism/tooling guidance + the surprise-protocol (dedupe the two copies that exist today) | dedup |
| `references/cognitive_principles.md` | **TRIMMED** — keep unique material (load tables, quantitative tables, citations, domain examples); stop restating input/pivot/output + operational bullets; depth-framework prose compressed (distinctions kept) | trim ~60% overlap |
| `references/tutorial_template.md` | **TRIMMED** — keep HTML snippets + per-chapter specs; checklist items reference Phase-5 entry IDs instead of restating; fix the "30→73" mislabel at its source | checklist → references |
| `references/diagram_guide.md` | remove figure-count duplication (point to the Phase-5 entry) | minor |
| `references/layout-template.html` | unchanged | none |
| (`references/rules.md`) | optional maintenance index — **only if step-0 inventory justifies it** | conditional |

### Conceptual compression (keep distinctions, cut words)

- **Depth orientation:** Bloom (question demand) and SOLO (resulting structure) become **two labeled
  rows under one "depth ladder" heading** — prose compressed, distinction kept. **Feynman stays the
  standalone Phase-4 author gate** (it is opposed to Marton's reader-activity framing, not a subset).
  Net: fewer words, same constructs.
- **Seven principles — KEPT AT SEVEN.** Only change: resolve **P6's double-duty** — P6 stays a flat
  principle owning its concrete rules (variation of conditions + anesthetic ban + fluency-illusion
  warning); the input/pivot/output framing is a single one-line orientation note in SKILL.md (stated
  once, not in two files).

### Centralization (with honest scope)

- **Parallelism/tooling:** one home (`research_workflow.md`); phase headers keep only their specific
  worker assignment.
- **Surprise-protocol:** dedupe the two existing copies (SKILL Phase 2 + `research_workflow.md`) to
  one home in `research_workflow.md`; Phase 2 keeps a one-line pointer.
- **Mode:** one canonical **mode→fileset** matrix (`html_output.md`). Note: per-file *content*
  conditionals (worked-example form, discrimination location, figure targets) legitimately remain in
  the per-chapter specs — a matrix can't absorb those, and the spec won't pretend it can.

## Invariants

- **Same kind of artifact out** (same pedagogy, same monochrome+vermilion identity, same file
  structures). This refactors the skill doc, not its output.
- Seven principles remain seven; cognitive-science citations remain.
- 5-phase workflow stays.
- The just-committed `0.3.0` terminology work survives intact (rule-card inline; pedagogy grep in the
  Phase-5 checklist; Phase-2 term-capture; the eval).
- **No rule deleted** — every entry in the step-0 inventory lands in exactly one authoritative home.

## Decisions taken

1. Seven-principles framing → **keep seven, resolve only P6** (your low-regret default; widen on request).
2. DRY vs. locality → **threaded, enforcement counted as point-of-use** (stays inline).
3. `0.3.0` terminology work → **committed first** (done: `2957456`), so this refactor is a clean
   separate change.
4. Version → **`0.4.0`** in both manifests.

## Deferred (separate pass)

Revise-existing-tutorial branch + trigger tuning + extra evals (old spec Directions 3–4).

## Acceptance criteria

- Step-0 inventory exists and is the audit checklist; every rule in it maps to exactly one
  authoritative home; no restated rule prose remains elsewhere (references only).
- Anti-patterns table no longer standalone; its phrasing lives as failure-notes on Phase-5 entries.
- Banned-phrase list exists once (inline rule-card); the voice grep references it; no "hand-sync"
  directive remains.
- Parallelism, surprise-protocol, mode→fileset each exist once.
- "30-item" mislabel fixed at source; depth orientation keeps Bloom+SOLO (distinct) + Feynman + Marton
  + Meyer & Land, prose compressed.
- `SKILL.md` ≈ 4,500w (ceiling 5,000, else flagged justification); rewritten section-by-section,
  each section diffed against the inventory before moving on.
- All `references/*` links resolve.
- **Output-invariance check (honest):** no eval runner exists in-repo, so verification = (a) the
  step-0 inventory cross-check + (b) a manual spot-check, optionally (c) manually running 1–2 eval
  prompts through the revised skill. Not claimed as an automated suite.
- Version `0.4.0` in `plugin.json` + `marketplace.json`.

## Risks

- **Indirection hurts compliance** → mitigated: enforcement + voice rule-card stay inline; only
  rationale/maintenance moves out.
- **Merge loses or bloats rules** → mitigated: step-0 inventory done first; merge treated as
  reconciliation, not concatenation.
- **Big-bang rewrite drops content** → mitigated: section-by-section rewrite, each diffed vs inventory.
- **Over-slim guts a rationale** → mitigated: stop short and flag rather than chase the number;
  principles' *why* stays inline.

## Build order

1. **Canonical rule inventory** (step 0) — enumerate + tag all rules; decide final structure from it.
2. Build the inline canonical Phase-5 checklist (rule + command + failure-note per entry).
3. Create `voice_and_tone.md` (rationale/examples out; rule-card stays inline).
4. Create `html_output.md` (format tables + file trees + mode→fileset matrix).
5. Extend `research_workflow.md` (parallelism + surprise-protocol, single home).
6. Trim `cognitive_principles.md` + `tutorial_template.md` + `diagram_guide.md` (dedup; checklist →
   references; compress depth prose; fix "30→73").
7. Rewrite `SKILL.md` **section-by-section** as the lean spine; resolve P6; one-line input/pivot/output
   note; re-point cross-refs; each section diffed vs inventory.
8. Bump `0.4.0`; run the content-preservation (vs inventory) + link + word-count audit + manual
   spot-check.
