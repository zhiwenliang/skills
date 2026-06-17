# Cognitive Principles

This reference gives the research basis behind the seven tutorial-design rules in `SKILL.md`. The skill body contains the operational workflow; this file explains why those rules exist.

## 1. Target Reader And Expertise Reversal

Instruction that helps novices can bore or slow experts, while expert-oriented material overwhelms novices. Kalyuga's expertise-reversal effect is strongest for complex, high-element-interactivity material.

Operational rule: open with audience-fit sections for "who this is for", "who this is not for", and "what the reader can do after reading". In non-English output, localize the visible headings but keep stable semantic markers so validation remains language-independent.

## 2. Schema Anchoring

Working memory starts with no domain structure. A concept map and learning-path breadcrumb give the reader a scaffold before details arrive.

Operational rule: show the concept map in `index.html`; show the learning path in every chapter with the current step highlighted.

## 3. Dual Coding And Split Attention

Paivio's dual-coding theory and Mayer's multimedia-learning work support combining verbal and visual channels when the visual material carries structure. The benefit collapses when the reader must search between prose and diagram labels.

Operational rules:

- Use diagrams for structure, flow, state, hierarchy, and comparison.
- Put labels directly on diagram elements.
- Delete decorative images.
- Ask the reader to sketch at least one key structure from memory.

## 4. Worked Example Effect

Sweller's cognitive-load work shows that novices learn better from worked examples before open problem solving. Open exercises too early force the learner to spend working memory on search rather than schema construction.

Operational rule: teach new concepts with worked examples first. In hands-on mode, use worked -> partial -> open progression.

## 5. Retrieval Practice

Roediger and Karpicke (2006) showed that retrieval improves retention compared with re-reading. The first retrieval attempt matters, and repeated retrieval improves durability further.

Operational rules:

- End every chapter with self-check questions.
- Hide answers in `<details>` or a separate answer section.
- Use predictive questions before reveals.
- Keep questions focused, precise, consistent, tractable, and effortful.

## 6. Desirable Difficulty

Bjork's desirable-difficulty work distinguishes short-term fluency from durable learning. Easy reading can feel like mastery while leaving the reader unable to transfer.

Operational rules:

- Add one challenge per chapter.
- Vary examples across contexts.
- Delay answer reveal.
- Warn the reader that fluency is not mastery.
- Delete language that shames confusion, such as `obviously` or `trivially`.

## 7. Spacing And Interleaving

Knowledge becomes durable when it is reactivated in new contexts. Interleaving trains discrimination: choosing which concept applies, not merely recalling one concept in isolation.

Operational rules:

- Each chapter recalls the prior chapter's contribution.
- Later examples reuse earlier concepts.
- The final self-check or capstone forces choices between approaches from multiple chapters.
- Block early syntax acquisition; interleave once there are multiple concepts to compare.

## Depth Orientation

Learning structure can still be shallow. Four frameworks keep the tutorial oriented toward depth:

- Marton and Saljo: deep processing focuses on meaning and relations, not surface signs.
- Bloom's revised taxonomy: useful questions should move beyond recall into apply, analyze, and evaluate when appropriate.
- SOLO taxonomy: the target is relational understanding, not a bag of facts.
- Meyer and Land: threshold concepts change how the learner sees the domain.

Operational lenses:

- **One level below docs**: explain the mechanism, cost, and failure boundary behind API statements.
- **Current field state**: for moving subjects, state what is stable, in flux, and superseded with dates.

## Authoring Caveat

These cognitive-science terms are author tools. Do not leak them into reader-facing prose unless the tutorial subject itself is learning science. The reader should see domain concepts, examples, diagrams, and questions, not the scaffolding vocabulary used to design them.
