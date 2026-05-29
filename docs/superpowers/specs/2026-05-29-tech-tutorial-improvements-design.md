# tech-tutorial improvement pass — design spec

**Date:** 2026-05-29
**Status:** approved (design); pending implementation plan
**Scope:** the `tech-tutorial` plugin skill at `plugins/tech-tutorial/skills/tech-tutorial/`

## Motivation

`tech-tutorial` is mature (7-principle cognitive framework, 5-phase creation workflow,
grep-able audit gates, four reference docs). Four improvements were requested and approved,
spanning maintainability, correctness, capability, and coverage:

1. Slim `SKILL.md` from ~6,950 words to a ~4,000-word decision skeleton (progressive disclosure).
2. Fix concrete bugs and cross-file inconsistencies.
3. Add a lightweight "revise an existing tutorial" branch.
4. Tune triggers and expand eval coverage.

Two design decisions were resolved via the approved options:
- **Slimming = medium**: move reference-grade tables/commands out; keep the spine and the
  load-bearing / grep-coupled lists in the body.
- **Revise = lightweight branch** inside the existing skill — not a parallel 5-phase workflow,
  not a separate skill.

Two sub-questions resolved to their proposed defaults on "approve as-is":
- Markdown-fallback eval: **skipped** (net +3 evals).
- Anti-patterns table: **folded** into `references/tutorial_template.md`.

## Non-goals

- No change to the seven principles, the cognitive-science framework, the fixed visual identity
  (monochrome + vermilion), or the creation-mode phase structure.
- No rewrite of existing reference docs beyond the additive moves listed below.
- No push to remote as part of this pass unless separately requested.

## Direction 1 — Slim `SKILL.md`

Move reference-grade content out; keep every section header + a short pointer so the body stays a
navigable skeleton. Target **~4,000 words** (from ~6,950). If trimming a block would gut a
load-bearing explanation, stop short and flag it rather than hit the number blindly.

| Body section today | Stays in body | Moves to |
|---|---|---|
| Voice & tone | Hard rules; **forbidden-phrases table** (grep-coupled — sync note stays); first-person default one-liner; pointer | first-person table, before/after examples, "when to break the rules" → **new `references/voice_and_tone.md`** |
| Output format: HTML | 1 paragraph (standalone HTML, monochrome+vermilion, copy `layout-template.html`); file-structure trees; pointer | tech-stack table, Markdown→HTML mapping table, code-escaping rules → **new `references/html_output.md`** |
| Phase 5 audits | The checklist: each audit's name + what it verifies + pass criterion; pointer | the literal `grep`/`find`/`python3` one-liners → **new `references/audit_commands.md`** |
| Tooling Discipline | 3-line principle ("parallelize independent units, serialize dependent ones") + pointer | spawn-pattern table, worker rules, when-not-to-parallelize → fold into **`references/research_workflow.md`** |
| Anti-patterns table | 1-line pointer | the 12-row table → fold into **`references/tutorial_template.md`** |

**Invariant:** no content is deleted — only relocated. Every moved block must exist verbatim (or
losslessly reworded) in its target file, and the body pointer must resolve to it.

## Direction 2 — Bugs & consistency

- **Fence bug** `SKILL.md:421-427`: the closing ``` lands after the "Both greps require UTF-8…"
  note, trapping it inside the bash block. Close the fence right after `done` (≈L424) so the note
  renders as prose.
- Re-point every cross-reference touched by Direction 1's moves; confirm all `references/*.md`
  links in `SKILL.md` resolve to existing files.
- Verify the Phase 5 voice-grep regex still matches the forbidden-phrases table 1:1 ("kept in
  sync" claim holds after the table stays in body).
- Confirm mode/file-count claims are consistent between `SKILL.md` and `tutorial_template.md`
  (concept-focused = 4 files; hands-on = 7 files).

## Direction 3 — Revise-existing branch (lightweight)

A dedicated short section ("Revising an existing tutorial"), cross-referenced from Phase 1's scope
dialogue. Not a parallel workflow.

- **Trigger:** user points at an existing tutorial folder and asks to update / extend / tighten /
  fix it.
- **5 tight steps:**
  1. Detect & parse existing structure — chapters, concept map, learning-path breadcrumb,
     一句话本质, mode (concept-focused vs hands-on).
  2. Diagnose — the requested change + any Phase 5 audit gaps in the current files.
  3. Plan the **minimal diff** (which chapters/sections change) and get approval (reuse Phase 3's
     approval gate, scaled down).
  4. Apply targeted edits, preserving the fixed visual identity + voice.
  5. Re-run Phase 5 audits on touched files; report what changed.
- **Scope handled:** content/quality edits; add/remove a chapter (renumber + fix
  breadcrumb/TOC/prev-next links); re-scope. A full mode switch (concept-focused ↔ hands-on) is
  gated behind explicit user confirmation.
- **Discipline:** minimal diff; preserve content that already passes; keep the `<style>` block
  consistent across old + new chapters (flag drift, never silently diverge).

## Direction 4 — Triggers & evals

- **Description:** add revise triggers (`更新这份教程`, `改进/精简/扩写这份教程`,
  `update this tutorial`).
- **Evals (+3, in `evals/evals.json`):**
  1. **revise-existing** — point at a tutorial, ask to extend/tighten; expects targeted diff +
     re-audit, not a from-scratch rebuild.
  2. **non-interactive / assumptions mode** — no user available; expects defensible assumptions
     documented in an `index.html` "Assumptions" block.
  3. **negative trigger** — a debugging request that must **not** become a tutorial (skill defers
     to a debugging workflow / one-shot answer).

## Deliverables

- `SKILL.md`: slimmed to ~4,000 words; fence fixed; revise section added; description updated;
  cross-refs re-pointed.
- New: `references/voice_and_tone.md`, `references/html_output.md`, `references/audit_commands.md`.
- Extended: `references/research_workflow.md` (parallelism/tooling), `references/tutorial_template.md`
  (anti-patterns table).
- `evals/evals.json`: 3 → 6 evals.

## Acceptance criteria

- `wc -w SKILL.md` ≈ 4,000 (hard ceiling ~4,500, else a flagged justification).
- Content-preservation: every moved block present in its target file; every body pointer resolves.
- Fence audit: no prose trapped in a code block; fences balanced.
- Voice-grep regex ↔ forbidden-phrases table still 1:1.
- Revise section present with all 5 steps + scope + discipline; matching description trigger.
- `evals.json` is valid JSON with 6 well-formed evals.
- All `references/*.md` links in `SKILL.md` resolve.

## Risks

- **Over-slimming** removes a load-bearing rationale → mitigation: keep headers + pointers; stop
  short and flag rather than chase the word count.
- **Moving the forbidden-phrases table** would break the Phase 5 grep-sync coupling → mitigation:
  the table stays in the body; only its surrounding prose/examples move.
- **Revise section scope creep** → mitigation: keep it a branch, gate mode-switches behind
  explicit confirmation.
