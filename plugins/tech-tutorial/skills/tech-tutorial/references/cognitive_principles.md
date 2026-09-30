# Cognitive Principles

This reference gives the research basis behind the seven tutorial-design rules in `SKILL.md`. The rules themselves live only in `SKILL.md` ("Learning Principles" and "Depth And Currency"); each section here names the rule it supports and explains why it exists, so the two files cannot drift into conflicting instructions.

## 1. Target Reader And Expertise Reversal

Supports: SKILL.md §1, the reader-level table.

Instruction that helps novices can slow or even harm experts, while expert-oriented material overwhelms novices. Kalyuga's expertise-reversal effect (Kalyuga, Ayres, Chandler & Sweller, 2003) is strongest for complex, high-element-interactivity material: full worked examples and step-by-step guidance become redundant for readers who already hold the schema, and processing the redundant guidance costs them. Declaring the audience is not enough; the scaffolding has to change with the level. For experts, asking for a prediction or a solution first (Kalyuga's rapid-assessment approach) both checks what they know and activates it.

Audience sections keep stable semantic markers so validation stays language-independent when the visible headings are localized.

## 2. Schema Anchoring

Supports: SKILL.md §2.

An advance organizer (Ausubel, 1960) helps only when it relates new material to something the reader already knows; a map made entirely of unfamiliar terms is a preview, not an anchor. Label concept-map nodes in plain words or tie them to the reader's existing background, and bring the map back at the end: redrawing it from memory in the final self-check turns the organizer into a retrieval target.

## 3. Dual Coding, Split Attention, And Redundancy

Supports: SKILL.md §3.

Paivio's dual-coding theory and Mayer's multimedia-learning work support combining verbal and visual channels when the visual carries structure. The benefit collapses when the reader must search between prose and diagram labels (split attention, contiguity principle), and when decoration competes with content (coherence principle).

Multiple representations help transfer (Ainsworth, 2006) when each adds information: a different scenario, view, or boundary case. The redundancy effect (Chandler & Sweller, 1991; Kalyuga, Chandler & Sweller, 1998) applies to self-contained repetition of the same information, such as prose that re-reads a figure's labels, and it hurts experts more than novices. That is why the rule says "complementary representations", not "the same idea three times".

Drawing a structure from memory (generative drawing) adds a retrieval and construction step on top of viewing.

## 4. Worked Examples And Fading

Supports: SKILL.md §4.

Sweller's cognitive-load work shows that novices learn better from worked examples before open problem solving; open exercises too early spend working memory on search rather than schema construction. The worked -> partial -> open progression is the fading or completion-problem approach (Renkl & Atkinson, 2003; van Merriënboer, 1990): remove steps gradually as the schema forms. The same effect reverses for experts (see §1), which is why the worked-example ratio scales with reader level.

## 5. Retrieval Practice And Pretesting

Supports: SKILL.md §5 and §6.

Roediger and Karpicke (2006) showed that retrieval improves retention compared with re-reading; Dunlosky et al. (2013) rate practice testing among the highest-utility study techniques. The first retrieval attempt matters, and repeated retrieval improves durability further. Hidden answers keep the attempt honest.

Answering before instruction also helps: pretesting improves later learning of the tested material even when the first answer is wrong (Richland, Kornell & Kao, 2009). A prediction placed before the explanation it tests gets this benefit, while one placed after the explanation only checks recall.

The concept-layer question standard (focused, precise, consistent, tractable, effortful) comes from Andy Matuschak's "How to write good prompts", written for spaced-repetition cards. It fits atomic recall questions. Mechanism and discrimination questions target Bloom's apply/analyze/evaluate levels and SOLO's relational level (see Depth Orientation), where good answers vary in wording, so they are judged by the reasoning they contain instead of consistency.

## 6. Desirable Difficulty And Fluency

Supports: SKILL.md §6.

Bjork's desirable-difficulty work distinguishes short-term fluency from durable learning: easy reading can feel like mastery while leaving the reader unable to transfer. Telling learners that fluency is misleading changes their behavior little (Yan, Bjork & Bjork, 2016); letting them experience a failed prediction does more. Challenges slightly beyond the chapter and delayed reveals keep effort in the reading.

Banning words such as `obviously` and `trivially` is a separate matter: those words shame confusion and hide prerequisites (SKILL.md "Voice And Terminology"), which is not a difficulty design choice.

## 7. Cumulative Revisit, Spacing, And Interleaving

Supports: SKILL.md §7.

Knowledge becomes durable when it is reactivated in new contexts. Two different effects are at work, and a tutorial read in one sitting gets only part of them:

- Spacing needs time between sessions to pay off (Cepeda et al., 2008). Revisiting earlier chapters within one reading is cumulative retrieval, not spacing. Only questions the reader returns to on a later day, such as the redo list at the end of the final self-check, create spacing.
- Interleaving trains discrimination: choosing which concept applies, not merely recalling one concept in isolation (Rohrer & Taylor, 2007). It helps once there are several concepts to tell apart; block practice while the reader is still acquiring brand-new syntax.

A chapter-opening recap that the author writes and the reader re-reads is re-reading. A recall question answered before the recap is retrieval.

## Misconceptions And Conceptual Change

Supports: SKILL.md "Depth And Currency", misconceptions first.

Learners with an existing wrong model tend to assimilate the correct explanation into it instead of replacing it (Posner, Strike, Hewson & Gertzog, 1982). Refutation text, which states the common belief, shows why it fails, and then gives the correct account, changes misconceptions more reliably than exposition alone (Tippett, 2010). A prediction that the wrong model gets wrong makes the conflict concrete.

## Depth Orientation

Supports: SKILL.md "Depth And Currency".

Learning structure can still be shallow. Four frameworks keep the tutorial oriented toward depth:

- Marton and Saljo: deep processing focuses on meaning and relations, not surface signs.
- Bloom's revised taxonomy: useful questions should move beyond recall into apply, analyze, and evaluate when appropriate.
- SOLO taxonomy: the target is relational understanding, not a bag of facts.
- Meyer and Land: threshold concepts change how the learner sees the domain.

Adding mechanism, cost, and failure boundary at once raises element interactivity; for novices, layering depth across chapters keeps intrinsic load manageable (§1).

## Voice Tradeoff

Mayer's personalization principle finds a small advantage for conversational style, mostly for novices on short lessons. The skill keeps second-person address and imperatives ("you", "run this") but bans author-first-person narration ("we", "let's"): those words carry little information in professional prose and blur who is claiming what. This is a deliberate tradeoff, not an oversight.

## Authoring Caveat

These cognitive-science terms are author tools. Do not leak them into reader-facing prose unless the tutorial subject itself is learning science. The reader should see domain concepts, examples, diagrams, and questions, not the scaffolding vocabulary used to design them.
