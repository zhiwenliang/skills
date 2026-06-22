# Evaluation Rubric

Use this rubric after `scripts/evaluate_article.py` passes. The script checks structure; this rubric checks whether the article actually explains.

Score each category as `pass`, `needs revision`, or `fail`.

## Reader Fit

- The target reader is explicit.
- Assumptions match the language, depth, and examples.
- The promised capability is testable.

Fail if the article tries to serve beginners and experts with the same path.

## Factual Accuracy And Source Quality

- Core claims are supported by reliable sources.
- Normal-length researched articles cite at least two sources unless the user supplied the authoritative source.
- Current or disputed topics are dated or scoped.
- Medical, legal, financial, and safety-sensitive topics avoid overclaiming.
- Sources are primary, official, textbook-grade, or otherwise defensible.

Fail if the article makes confident factual claims that are unsupported or likely stale.

## Mechanism Depth

- The article explains what changes what.
- It shows the sequence, structure, constraint, or tradeoff behind labels.
- The core claim can be restated as "X works by Y, which solves Z but costs W" when applicable.
- The depth-probes section includes at least three substantive probes, not labels pasted onto shallow bullets.
- One depth probe uses source-backed detail to change or sharpen the explanation.

Fail if the article mostly defines terms without showing causal or structural relations.

## Visual Usefulness

- Each Mermaid diagram makes a relation, process, hierarchy, state, or contrast easier to understand.
- Diagram labels are short.
- The prose tells the reader what to notice before or after the diagram.
- Mermaid uses default style unless the user requested another style.

Fail if visuals are decorative, redundant, too dense, or missing for visualizable structure.

## Example Quality

- At least one example walks through the mechanism.
- Contrasting cases or non-examples expose boundaries when the concept is often confused.
- Examples are specific enough to be remembered.

Fail if examples are generic placeholders that do not test the explanation.

## Misconceptions And Boundaries

- Common wrong models are named and repaired.
- The article states where the explanation stops applying.
- Analogies include a break point when used.

Fail if the article leaves the reader with a useful but false simplification.

## Prose Quality

- The prose is direct, concrete, and ordered.
- New terms are introduced near first use.
- Paragraphs are short enough to scan.
- Filler and oversimplifying words are removed.

Fail if smooth wording hides missing mechanism or unsupported claims.

## Understanding Checks

- Questions require prediction, contrast, boundary judgment, or paraphrase.
- At least two questions require transfer beyond recall.
- They cannot be answered only by copying a phrase.
- They align with the promised capability.

Fail if the checks are trivia or recall-only.

## Stability Signal

Treat the skill as stable for a tested topic set only when:

- every generated article passes the structural script;
- every article is `pass` or minor `needs revision` in this rubric;
- any repeated `needs revision` category has been converted into a skill rule, reference, or script check;
- a second test round does not reveal the same category of failure.
