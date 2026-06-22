---
name: explain-article
description: Writes researched explanatory articles that help a target reader understand a concept, mechanism, event, theory, system, or product idea. Use when the user asks to explain something, write an explanatory article, make a concept understandable, teach with prose and diagrams, or turn research into a clear Markdown article. Triggers include "explain X", "write an article explaining X", "help people understand X", "用文章解释", "解释一下", and requests for visual explanation in article form.
---

# Explain Article

Create Markdown articles that build understanding, not long paraphrases. The default output is a readable article with clear reader fit, a causal model, concrete examples, default Mermaid diagrams, boundaries, and understanding checks.

Use the user's requested language. If none is specified, match the user's prompt language. Keep stable HTML comment markers in English so validation can work across languages.

## Scope Gate

Use this skill for explanation-oriented article writing.

Do not use it for:

- Step-by-step task instructions. Route to a how-to workflow.
- Full course/tutorial sites. Route technical learning paths to `tech-tutorial`.
- One standalone diagram without article prose. Route to `visual-explainer`.
- Unresearched hot takes. Research first or state that the answer is a quick draft.

Diataxis framing: this skill owns explanation. It answers "why", "how it works", "what changes what", "what people misunderstand", and "how to think about it".

## Required Article Shape

Every finished article must include these semantic markers, with localized visible headings if useful:

1. `<!-- explain-article:audience -->` - target reader, assumptions, and promised capability.
2. `<!-- explain-article:core-claim -->` - one plain thesis sentence for the whole explanation.
3. `<!-- explain-article:map -->` - a short map of the concept using a default Mermaid diagram.
4. `<!-- explain-article:mechanism -->` - the causal or structural explanation below surface labels.
5. `<!-- explain-article:depth-probes -->` - visible deeper-model checks: at least three substantive bullet probes, including one source-backed detail, across mechanism chain, constraint/tradeoff, counterfactual, and model comparison.
6. `<!-- explain-article:example -->` - at least one concrete worked example or contrasting case.
7. `<!-- explain-article:boundary -->` - limits, common misconceptions, failure modes, or where the analogy breaks.
8. `<!-- explain-article:check -->` - 3-5 understanding questions or prediction prompts.
9. `<!-- explain-article:sources -->` - sources, or a note that source verification was not requested/performed.

Short answers (under about 500 words, validated with `--short`) may omit the `depth-probes` section and use one diagram and one source. All other markers stay required.

## Workflow

1. **Scope the reader**
   - Identify the reader's likely background, goal, and confusion.
   - If missing information blocks accuracy or tone, ask one concise question. Otherwise make a visible assumption.

2. **Research before drafting**
   - For current, specialized, medical, legal, financial, or disputed topics, verify with reliable sources.
   - Use at least two reliable sources for normal-length researched articles. Use one source only for short answers or when the user supplies the authoritative source.
   - Build a scratch model: core claim, key parts, causal chain, constraint/tradeoff, counterfactual, source-backed detail, example, misconception, boundary.

3. **Choose the explanation pattern**
   - Read [references/article-patterns.md](references/article-patterns.md) when selecting structure or visuals.
   - Use mechanism-first for systems, contrast-first for confused categories, story-to-model for abstract ideas, or misconception-repair for topics with common false beliefs.

4. **Add useful visuals**
   - Include at least two Mermaid diagrams for normal-length articles. Use one only for short answers under about 500 words.
   - Use Mermaid's default/original style. Do not add `%%{init}`, `theme`, `look`, `config`, or hand-drawn styling unless the user explicitly asks.
   - Pick diagram types by job: `flowchart` for mechanisms, `graph` for concept relations, `sequenceDiagram` for interactions, `stateDiagram-v2` for state changes. The evaluator also accepts `mindmap`, `timeline`, `classDiagram`, `erDiagram`, and `quadrantChart` when they fit the content.
   - Keep diagram labels short. Put explanation in prose around the diagram.

5. **Draft the article**
   - Start with the core claim early — aim for the first ~150 words; the evaluator warns only if it lands later than 180 words in.
   - Explain mechanism before terminology piles up.
   - Add a depth-probes section that shows why the mechanism is necessary, what tradeoff it creates, what would break without it, how it differs from a tempting simpler model, and one non-obvious detail learned from sources.
   - Use concrete examples before abstract generalization when the reader is likely new.
   - Use analogies only as temporary scaffolds, and state where they break.
   - Avoid filler, cheerleading, and "obvious/just/simply" language.

6. **Verify and revise**
   - Run `python3 "${CLAUDE_PLUGIN_ROOT}/skills/explain-article/scripts/evaluate_article.py" <article.md>` when the article is saved to a file.
   - For short answers (under about 500 words), add `--short` so the one-diagram/one-source shape and the omitted `depth-probes` section are accepted instead of failed.
   - Use `--allow-unverified-note` only when the user explicitly asked for a quick, source-light draft.
   - To see the rendered Mermaid diagrams, run `python3 "${CLAUDE_PLUGIN_ROOT}/skills/explain-article/scripts/preview_article.py" <article.md>` to build a self-contained HTML view and open it in the browser. Add `--no-open` for headless/CI. This needs internet for the diagram libraries.
   - Fix any failed required checks unless the user requested an intentionally shorter answer.
   - Review manually for factual accuracy, reader fit, diagram usefulness, misconception coverage, and source quality.
   - For high-stakes, long-form, or eval work, use [references/evaluation-rubric.md](references/evaluation-rubric.md).

## Quality Bar

An acceptable article lets the target reader reconstruct the idea without copying wording. It should:

- Name the reader and promise a concrete capability.
- Explain the mechanism one level below labels.
- Include explicit depth probes, not only smooth prose.
- Show structure visually, not decorate the page.
- Use examples that reveal boundaries, not only happy paths.
- Call out common wrong models.
- End with questions that test transfer, prediction, contrast, or boundary judgment; at least two questions must require reasoning beyond recall.
- Cite sources or clearly mark the limits of verification.

## References

- [references/explanation-principles.md](references/explanation-principles.md) - research-backed explanation principles.
- [references/article-patterns.md](references/article-patterns.md) - article structures, diagram choices, and revision moves.
- [references/evaluation-rubric.md](references/evaluation-rubric.md) - manual review rubric for article quality.
