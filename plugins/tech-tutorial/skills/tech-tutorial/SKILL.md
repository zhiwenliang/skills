---
name: tech-tutorial
description: Use when the user wants to learn, understand, or build a systematic knowledge base around a technology, framework, library, protocol, tool, or technical concept. Triggers include "教我 X", "我想学 X", "帮我搞懂 X", "X 入门", "X 怎么用", "写一篇关于 X 的教程", "整理成系统笔记", "I want to learn X", "help me understand X", "give me a primer", or when the user asks to turn pasted docs/links into a tutorial.
---

# Tech Tutorial Writer

A tutorial that doesn't build the reader's mental model is just a longer version of the docs. This skill turns "我想学 X" into a tutorial designed around **how humans actually learn**: cognitive load management, dual coding, worked examples, retrieval practice, spaced revisit, and interleaving.

The output looks like a careful course, not a Medium post.

## The premise this skill operates on

Working memory holds ~4 chunks. Every word, diagram, and code block either steals that space (extraneous load), takes it necessarily (intrinsic), or builds durable structure (germane). The seven principles below are operational rules for managing those three loads — translations of empirical cognitive-science research (Sweller, Bjork, Mayer, Roediger). For research detail, the four-form Bjork table, the Roediger numbers, the worked-example ratio derivation, and citations, see [references/cognitive_principles.md](references/cognitive_principles.md). When the user provides their own methodology source, cite that instead — never assume a local path exists.

## When this skill applies

Apply when the user asks to **learn** or **systematize understanding of** a specific technology, framework, library, protocol, tool, or concept. Examples:

- "教我一个新框架"
- "我想搞懂某个协议里的核心概念"
- "帮我把这几个链接整理成一份系统教程"
- "某个分布式系统我学不进去，能写个教程吗"

It does **not** apply when:
- The user wants debugging help on existing code (use a debugging workflow instead).
- The user wants a one-shot answer ("某个 API 是什么?" — just answer).
- The user wants to *write code* using a tech, not learn it.

When in doubt, ask: *"Do you want me to build something, or to teach you something?"*

**Why these boundaries (Diátaxis).** The four-mode documentation framework (Diátaxis: *tutorial* / *how-to* / *reference* / *explanation*) names what this gate is doing. This skill owns the two **study-oriented** modes — *explanation* (the why/mechanism, = the concept-focused default) and *tutorial* (learning-by-doing, = hands-on mode) — and routes away the two **work-oriented** modes: *how-to* (debugging, "accomplish task X") and *reference* (one-shot "what is this API"). Use the vocabulary as a **diagnostic to classify intent**, not as a rule to emit four separate files: a single learning artifact legitimately blends explanation + tutorial (and a little reference) because it is one learning *journey*, not a documentation *system*. (Diátaxis, [diataxis.fr](https://diataxis.fr) — a widely-adopted taxonomy; its mode-separation is a design heuristic, not an empirically-measured learning gain.)

## How the seven principles fit together

The seven principles form an **input × pivot × output** structure, not a flat list:

```
INPUT  (1, 2, 3) — present material with zero extraneous load (frictionless on purpose)
PIVOT  (6)       — desirable difficulty: current performance ≠ durable learning
OUTPUT (4, 5, 7) — engineer productive friction so the schema sticks
```

When two principles seem to conflict, name which layer each operates on. If you find yourself softening an output-side rule "to make a chapter feel smoother," you are trading long-term learning for short-term fluency — the failure mode Bjork named. Don't, without naming the tradeoff explicitly.

Input and output sides are partners, not in tension: input reduces load on things that *don't* teach so the load on things that *do* teach lands cleanly. Full motivation, with research citations, is in [references/cognitive_principles.md](references/cognitive_principles.md).

## The seven design principles (mandatory)

Every tutorial section must be designed against these. The completeness checklist in [references/tutorial_template.md](references/tutorial_template.md) makes them auditable; the research behind each rule lives in [references/cognitive_principles.md](references/cognitive_principles.md).

### 1. Declare the target reader (Expertise Reversal)

The same teaching style helps novices and bores experts; trying to serve both serves neither (Kalyuga's boundary condition: the effect is strongest for complex, high-element-interactivity material and weaker on simple tasks). Open every tutorial with three explicit lists: **适合谁** (required prior knowledge, tooling, versions), **不适合谁** (route elsewhere), **读完之后你能做到什么** (concrete verifiable capabilities). Anyone outside the target is routed away on page one.

### 2. Map before territory (Schema Anchoring)

Working memory is empty when the reader opens chapter 1. Give them anchors first:

- A **concept map** showing every major abstraction and how they relate.
- A **learning-path breadcrumb** showing the chapter sequence.
- **Re-show the breadcrumb at every chapter opener**, current step highlighted. Doubles as spaced revisit (principle 7).

### 3. Image + labels + reader-draw (Dual Coding + Split-Attention)

Words and images take separate working-memory channels; together they substantially increase retention (the magnitude varies by task and design — see [references/cognitive_principles.md](references/cognitive_principles.md)). Cross-references ("see node A in figure 3.2 above") destroy that gain by forcing the eye to ping-pong.

- **≥1 diagram per major section.** A >300-line prose stretch without one is a Principle-3 failure.
- **Labels go on the diagram elements**, never in surrounding prose.
- **Delete decorative images** (brain icons, rocket ships next to "let's launch into…"). Pure load, zero information.
- **≥1 reader-draw prompt per tutorial** — typically in capstone or self-check ("without scrolling up, draw the architecture from §2.1"). Drawing makes the reader construct the imagery channel themselves; a stronger encoding than passive viewing.

See [references/diagram_guide.md](references/diagram_guide.md) for the content-type → diagram-type matrix.

### 4. Worked → Partial → Open (Worked Example Effect)

For each new concept in a novice-targeted chapter, lead with a worked example. The form depends on tutorial mode:

- **Concept-focused (default)**: worked example = **scenario walkthrough** in `01-concepts.html`. Pick a concrete situation, walk through what happens, name each step's underlying concept. Retrieval moves to `03-self-check.html` as scenario discrimination questions.
- **Hands-on**: full three-step **code progression** in `03-practice.html`:
  1. **Complete worked example** — fully explained line-by-line.
  2. **Partial example** — structure given, 1-2 *schema-building* decision points blank (not trivial fill-ins).
  3. **Open exercise** — fresh problem, end-to-end.

  Worked-example-to-exercise ratio scales with reader level: roughly novice 5:1, intermediate 2:1, expert 1:3 — adjust up for higher-complexity material.

### 5. Force retrieval (Testing Effect)

Passive re-reading retains ~40% at one week; one test pushes that to ~56%; multiple tests to ~61% (Roediger & Karpicke 2006). The marginal effect of the *first* retrieval is largest — always add at least one self-check; more still pays out.

Every chapter must end with **2-4 self-check questions** + scattered predictive questions in prose. Hard constraints:

- **Atomic questions only.** A bundled question ("define X, explain why, give an example") trains 1 retrieval attempt instead of 3 and lets the reader fudge partial answers. Split into 3.
- **Each question meets five properties** (Matuschak's prompt-writing spec): *focused* (one fact — same as atomic above), *precise* (unambiguous about what it asks), *consistent* (same answer every time, not "it depends"), *tractable* (the reader can almost always answer it — keep "just out of reach" for the separate challenge block, **not** the self-check), *effortful* (requires genuine retrieval, not a trivial inference from the question's own wording). A question failing *precise* or *consistent* trains a fuzzy schema; one failing *tractable* demoralizes instead of teaching. Research basis + the AI-generated-question caveat: [references/cognitive_principles.md](references/cognitive_principles.md).
- **Answers in `<details>` or a separate file**, never inline. "Answer is right below" defeats retrieval and collapses back to re-reading.
- Predictive questions in prose ("what do you think this will print?") must precede the reveal by at least one paragraph or fold.

### 6. Engineer desirable difficulty (Bjork) — the pivot

**Current performance ≠ durable learning.** Smoothness is the symptom of fluency illusion, not of good teaching — a tutorial that feels effortless is producing illusion of mastery; the reader will fail on contact with reality. Output-side principles 4/5/7 are three of Bjork's four operational forms (active retrieval, spacing, interleaving). The fourth — **variation of conditions** — is the one tutorials most often skip:

- **Show every concept in 2-3 different shapes** (different domains, surrounding code, input scales). Don't teach with only the canonical example.
- **One "just out of reach" challenge per chapter** — in the reader's zone of proximal development.
- **Delay the answer reveal** — buy 30 seconds of think-time via `<details>`, fold, or "scroll past this image first."
- **Anesthetic words are forbidden** — `这很简单 / 显然 / trivially / obviously / just`. They tell the confused reader their confusion is shameful, and they lie (if it really were trivial the tutorial wouldn't need to cover it).
- **Warn the reader about fluency illusion** in `index.html`. Quote three self-talk labels verbatim so the reader can self-diagnose: `我读得很顺` (familiarity, not learning), `我做题很快` (probably stock problem types), `我没卡壳` (probably not touching the schema).

### 7. Interleave and revisit (Spaced + Interleaved Practice)

Knowledge becomes durable when re-activated in new contexts. Required structures:

- **Each chapter opens** with one sentence summarizing the prior chapter's contribution to the current one. Forced retrieval, not redundancy.
- **Examples in chapter N use concepts from chapters 1..N-1**, not just the new one. This is interleaving.
- **Discrimination at the end** — the tutorial ends with a forced choice between approaches from ≥2 prior chapters ("should you use the chapter 1 approach or the chapter 2 approach here?"). Form depends on mode: in concept-focused tutorials, this lives as **scenario discrimination questions** inside `03-self-check.html` (typically 3-5 scenarios, each tagging which chapters' concepts apply); in hands-on tutorials, it lives as a **capstone project** in `05-capstone.html`. Either form trains transfer, not just recall — not optional for full tutorials.

**Boundary — block first, interleave later.** During acquisition of brand-new syntax (first time touching async, first 30 min with a new API), the reader has nothing to discriminate between yet — interleaving just adds load on top of confusion. Apply when designing exercises (hands-on `03-practice`) or scenario questions (concept-focused `03-self-check`): early items can be blocked; late items must mix.

## Depth orientation (orthogonal to the seven principles)

The seven principles govern *how* learning encodes. They don't decide *how deep* the content goes. A tutorial can pass every retrieval / diagram / scaffold check and still be a glossy paraphrase of the docs — Marton & Säljö's classic name for that failure: **surface processing** (focus on signs — terminology, syntax), as opposed to **deep processing** (focus on what is signified — mechanism, relationship, transferable structure).

**Don't operationalize depth as a checklist** (count quantitative claims, count Bloom-level questions per chapter). That trains the author to game the count without changing what's underneath — the same trap "X test cases per function" falls into. Instead, carry these four frameworks as **author orientation** before and during writing:

- **Marton & Säljö (1976) — deep vs surface processing.** Every concept sentence either anchors a sign ("X is a Y") or a signified ("X enables / prevents / makes possible Z"). Notice which one you're writing. In the original one-week single-passage study, surface processors retained ~10-15% vs ~50-60% for deep processors — the *gap* replicates robustly; the absolute percentages are specific to that task.
- **Bloom's revised taxonomy (Anderson & Krathwohl 2001).** Every question you ask the reader sits somewhere on Remember → Understand → Apply → Analyze → Evaluate → Create. Surface tutorials cluster at 1-2; deep tutorials weight toward 3-5. Notice where your questions cluster — if 90% are Remember/Understand, you're shipping a recall manual.
- **SOLO taxonomy (Biggs & Collis 1982).** The reader's mental state after reading is *multistructural* (a bag of unconnected facts) or *relational* (an integrated structure where facts know how they connect). Concept-map edges carry the relational information — if you can't label an edge, you don't have relational understanding of that connection.
- **Threshold concepts (Meyer & Land 2003).** Every domain has 1-3 concepts that, once internalized, *transform* the reader's view of the field (irreversible, integrative, troublesome). A tutorial without an identified threshold concept lacks a core idea; it covers ground instead of transforming understanding. Find it explicitly.

Those four describe depth; two lenses make it actionable while writing. **Both are diagnostic questions you ask yourself, not counts you hit** (a count would just train relabeling, the same trap as "X test cases per function"):

- **One level below the docs — the depth lens.** Official docs answer *what it is* and *how to call it*, then stop at the API surface; that is their job. Surface paraphrase stops at the same line — which is exactly why it reads like "a longer version of the docs." For each core concept ask: *can I explain the mechanism one level below where the docs stop?* "X does Y" must become "X does Y **by** doing Z — which is why it costs W and fails when V." The threshold-concept examples above are all this move (`joins are set operations, not loops`; `backpressure lives in the protocol`; `commits are immutable snapshots, branches are pointers`). If the best available sentence is a restatement of the doc line, the section is not earned yet — return to Phase 2 (design rationale, source, RFCs, maintainer talks) until the mechanism has a name. This is the single highest-leverage move against shallow output.
- **Where the field is now — the currency lens.** For anything not frozen — most frameworks, every AI / ML topic, fast-moving protocols — depth includes *currency*: what is **stable**, what is **actively changing** (roughly the last 6–12 months), what is **superseded / deprecated**. A tutorial pinned to the docs' baseline can be mechanically deep and still hand the reader an approach the field moved past last quarter; on a moving topic, being current *is* part of being deep. Name the frontier and date it — "this is the settled core; this part is in flux as of <month year>; the old <approach> is now <new>" is a truer model than "it's all equally fixed." Phase 2's frontier worker feeds this; if it surfaced nothing recent, the topic is either genuinely frozen (say so explicitly) or the research stopped too early.

The workflow operationalizes all of this as lightweight moves, most of them agent-internal: **(1)** Phase 2 workers track *surprises* (gaps between prior model and what they found — depth raw material) **and run a dedicated frontier sweep** (recent releases, emerging approaches, deprecations); **(2)** Phase 3 names the *threshold concept* and a one-line dated *frontier framing* alongside the outline (inside the existing approval gate, no new round-trip); **(3)** before writing each concept, Phase 4 runs the *Feynman test* (50 words, zero jargon) **and the "one level below the docs" probe** — a stall in either means the understanding is still too shallow to write, so go back to source first; **(4)** Phase 5 runs an *insight check* (what a 5-year engineer leaves with that the docs don't give) **and a currency check** (frontier framing present and dated). The agent-internal moves don't multiply user dialog.

Research basis and citations: [references/cognitive_principles.md](references/cognitive_principles.md).

## Voice and tone

The reader is a working professional, not a child. Treat the tone as a load-bearing engineering decision, not as decoration — casual prose forces the reader to filter out chatter to reach the signal, which costs working memory (extraneous load, principle 3). Professional prose is the cheapest extraneous-load reduction available.

### Hard rules

- **Active voice, present tense, imperative for instructions.** "The parser returns a typed record." / "Set `timeout_ms=5000`." Not "we'll be parsing here" or "you might want to set a timeout."
- **One concept per sentence.** Long sentences with multiple clauses blow working memory.
- **Specific numbers, names, versions** beat hedges. "Default timeout is 30 seconds" beats "the timeout has a reasonable default."

### Terminology discipline — name precisely, explain plainly

"通俗 + 专业化" is not a tension; the two halves do different jobs. **Naming** is where you are precise and standard (专业化). **Explaining** is where you are plain and concrete (通俗). The failure mode is the inverse of both: an invented label nobody else uses, wrapped in literary framing.

Four coinage failures, all banned:

| Failure | Looks like | Fix |
|---|---|---|
| **Invented concept label** | Promoting a self-coined name to a term: `这就是它的引力中心` `所谓执行漏斗` `三态收敛模型` | Use the name the field actually uses. If no standard name exists, describe the thing in plain words — don't crown a noun. |
| **Non-standard translation** | Hard-translating an established term into a novel Chinese word: `closure → 闭合器` `idempotent → 幂同性` `backpressure → 逆压` | Use the community's actual term. When practitioners keep the English (closure, idempotent, async/await, backpressure), keep the English; gloss it once in plain language on first use. 专业化 means matching the field's usage, not maximizing Chinese coverage. |
| **Pedagogy jargon in reader prose** | The cognitive scaffolding leaking out: `先降低你的认知负荷` `这是本教程的门槛概念` `利用双重编码` | That vocabulary (cognitive load / 认知负荷, desirable difficulty / 期望难度, schema, threshold concept / 门槛概念, dual coding / 双重编码) is the **author's** design tool. It never appears in the tutorial body. Exception: the mandated fluency-illusion self-talk labels in Principle 6 (`我读得很顺` etc.) — plain reader speech, not jargon. Second exception: when the tutorial's *subject* genuinely is one of these terms (e.g. a tutorial about cognitive load theory), it is subject matter, not leak. |
| **Literary / marketing flourish** | `踏上 X 的蜕变之旅` `带你打通任督二脉` `一朝顿悟` | Already half-covered by the AI-intros ban; the sharper test here: delete any phrase whose job is to sound profound rather than to carry a mechanism. |

**The one test that catches all four:** for every concept name in bold or quotes, and every section/figure title, ask — *would a working practitioner in this field recognize this as the real term, or did I make it up?* If made up: replace with the real term, or demote it to a clearly-marked analogy (`可以类比成…，但它真正的名字是 X`). An analogy is a teaching aid, never a term you then reuse as if it were established; drop it once the real concept is in place.

This rule is **not** in the Forbidden-phrases table below and **not** in the Phase 5 voice grep — a coined word is novel by definition, so grep cannot find it. Enforcement is a pipeline instead: Phase 2's **term table** supplies the real words up front, `scripts/extract_terms.py` enumerates every shipped name deterministically, and the Phase 5 *Terminology check* judges each against the table (in a fresh context, with external verification for suspects). The *pedagogy-jargon leak* grep separately catches the third row's fixed vocabulary.

Before / after (coined → standard + plain):

| Before (coined) | After (standard term + plain explanation) |
|---|---|
| 理解这个执行漏斗是关键 | 理解调用栈（call stack）如何逐层压入、弹出是关键。 |
| 我们把它叫做闭合器，它能记住变量 | 这是闭包（closure）：函数连同它定义时所在的作用域一起被保留下来。 |
| 这一节帮你建立对响应式的认知锚点 | 这一节给出响应式渲染的最小心智模型：state 改变，依赖它的视图自动重新计算。 |

### Forbidden phrases (delete on sight, no exceptions)

| Category | Banned | Why it costs working memory |
|---|---|---|
| Cheerleader | `我们一起` `让我们` `咱们` `让我们一起` `let's` `we'll` `together we'll` `you'll discover` `你会发现` | Forces the reader to filter "addressed-to-me" framing out of every sentence. |
| Filler transitions | `接下来` `接下来让我们` `我们来看` `我们来试试` `下面我们` `Now we're going to` | Empty connective tissue. The next paragraph already implies "next." |
| Hedges / mush | `可能` `也许` `兴许` `大概` `差不多` `应该是` `roughly` `kind of` `sort of` | Tells the reader you don't know. If you don't, say so explicitly. If you do, commit. |
| Anesthetic words | `这很简单` `很简单` `显然` `trivially` `obviously` `just` | Tells the confused reader they're dumb. They also lie — if it were trivial the tutorial wouldn't need it. |
| Colloquial tech slang | `坑` (in prose) `踩坑` `搞起来` `撸代码` `玩一下` | Prefer `陷阱` / `常见错误` / `失败模式` / "implement" / "use." `坑` is OK as a structural label (file name `04-pitfalls.html`, header `## 常见陷阱`) but not in flowing prose. **This includes 04-pitfalls' own intro paragraph** — when *writing about* pitfalls is the chapter's topic, the prose still uses 陷阱 / 失败模式, not 踩坑. The trap to watch: phrases like `踩坑路径`, `第一年的坑`, `这个坑` in the chapter opener — AI writers reach for them naturally because the chapter is "about" pitfalls. They are still casual prose. |
| AI-tutorial intros | `在当今快速发展的技术领域` `本教程将带你深入` `踏上...的旅程` `开启...之旅` | Filler that signals "AI-generated." |

### First-person constraint

Default to **no first person.** First-person plural (`我们`) implies an author-reader pair journeying together, which is the cheerleader frame the forbidden list already bans. First-person singular (`我`) places the author on stage when the subject should be the system.

| Instead of | Write |
|---|---|
| 我们把输入转成 JSON | 解析器把输入转成 JSON 对象 |
| 我们调用验证函数 | 验证函数接收对象后返回错误列表 |
| 我会展示一个例子 | 下面的例子展示了 X |
| 让我们看看会发生什么 | 运行后输出如下： |
| 接下来我们要解决的问题是 | 下一节解决的问题是 |

The natural subject is almost always the *system* (the parser, the validator, the runtime), the *reader* (engineer, user), or the *behavior* (the call returns…). When a sentence reaches for `我们`, look for the real subject — it is usually already in the sentence.

### Before / after examples

Casual → professional, holding meaning constant:

| Before (casual) | After (professional) |
|---|---|
| 接下来我们来看一下这个机制是怎么工作的 | 该机制的工作方式如下。 |
| 我们大概可能需要先做一下预处理 | 预处理是流水线的第一步：把原始输入转换成后续组件接受的结构。 |
| 这个坑我自己也踩过，挺烦的 | 常见失败模式：错把组件输入的数据形状当成另一种类型。 |
| 这一章替你把第一年的踩坑路径走过一遍 | 这一章把第一年最常击中工程师的 8 个失败模式按根因排序。 |
| 别担心，这其实很简单 | （删除整句。如果要传递难度判断，写："这一步只涉及一个 API 调用，不需要状态管理"。） |
| 大家都知道 timeout 很重要 | timeout 影响失败恢复：太短会误杀慢请求，太长会拖住资源释放。下文给出 3 种典型场景的取值。 |

### When to break the rules

The rules above target **author prose** — the visible text the reader reads. They do not apply inside:

- **HTML markup itself**: `<div>`, `<a href>`, `class="..."`, attribute values, etc. are structure, not voice. The grader strips tags before checking.
- **`<pre><code>` blocks**: code comments like `# 应该是 ProductReview` are predictive assertions about runtime values, not author hedges. LLM prompt strings inside code can contain `"let's please be concise"` or first-person quotes without violating voice — they're program content, not your voice.
- **`<details>` answer blocks**: factual predictions like "正确答案应该是 X" / "the expected output is roughly 4000 tokens" are *answers*, not commitments-to-the-reader the way prose is. Hedge-shaped wording is the natural English/Chinese form of "the value should equal X." Don't twist these to avoid 应该是 / should-be.
- **Quoted user material**: when you literally quote the reader's question or a user-facing message ("用户原话：..."), the quoted content keeps its original voice.
- **Prose reporting the subject's own probability/randomness** (not author uncertainty): `单跑一次的"通过"可能纯属运气`、`命中率大概落在 70-90%` are claims *about how the system behaves* — the same category as a `<details>` expected-value answer, not the author waffling. The hedge ban targets the author hedging their *own* claim (`这个配置应该是对的吧`), not prose precisely stating an outcome is probabilistic. When the uncertainty belongs to the domain, name it precisely (give the condition or distribution) instead of deleting the word. The `可能` hedge is the one most often misfired on — ~28 of its real uses across the corpus were legitimate domain-probability statements, not hedges.

The only legitimate first-person uses in **prose**:

- **Author's epistemic note**, clearly marked: "我没在生产环境验证过这个配置，仅在 4000-token 文档上测过" — signals an explicit boundary the reader should respect.
- **Reader-addressed action prompt** in self-check / capstone — `合上教程，自己写一遍` is fine because the subject IS the reader. `让我们一起合上教程` is not.
- **The three fluency-illusion labels** required by Principle 6 (`我读得很顺` / `我做题很快` / `我没卡壳`) — these are quoted reader self-talk, mandated verbatim.

If the user explicitly asks for a casual tone, honor that — but the default is professional.

## Output format: HTML (not Markdown)

Tutorials produced by this skill are **HTML files**, not Markdown. The reason is pedagogical, not aesthetic: HTML's higher visual ceiling (sticky TOC, syntax-highlighted code, styled callouts, hand-drawn SVG figures, native `<details>` with custom styling) directly serves Principle 3 (dual coding) and Principle 5 (retrieval separation) better than Markdown can. If the user or host project explicitly requires Markdown, keep the same cognitive structure and adapt the rendering primitives; otherwise default to standalone HTML.

The visual identity is fixed: **minimalist monochrome + single vermilion accent** — white background, Noto Sans SC body, neutral grays for hierarchy, a single warm-red accent used sparingly (warning callouts, current breadcrumb, code keywords, selected table row, link hover, predict / challenge labels). Don't redesign per-tutorial; the consistency is part of the brand. Why this aesthetic: it prioritizes information density (more on-screen content per scroll) and tight scanning rhythm, while restraining decoration so the reader's attention lands on prose and diagrams instead of the page itself. See `references/layout-template.html` for the rationale baked into comments.

### Tech stack (fixed — copy from `references/layout-template.html`)

| Layer | Tool | Notes |
|---|---|---|
| **Fonts** | Google Fonts CDN: Noto Sans SC + JetBrains Mono | One `<link>` tag, all weights needed |
| **Code highlighting** | Prism.js v1.29 (autoloader) | Drops grammar on demand. Theme overridden in `<style>` block to match palette |
| **Styling** | Hand-written CSS in `<style>` block | Zero CSS framework. Identical across chapters; the canonical block lives in `references/layout-template.html` |
| **Diagrams** | Hand-drawn `<svg>` with utility classes (`.diagram-ink`, `.node-fill`, etc.) | No Mermaid, no JS render libs. See `references/diagram_guide.md` |
| **JS** | ~40 lines inline: progress bar, sticky-TOC active highlight, code copy | No frameworks |

**No build step, no bundler, no external CSS file.** Every chapter is a self-contained `.html` that opens in any browser.

### Layout template — the authoritative source

**Don't reproduce CSS in your head — read `references/layout-template.html` and copy it.** That file is the canonical layout. Start every chapter by copying its full contents, then:

1. Update `<title>` (chapter-specific)
2. Update `.learning-path` breadcrumb (mark current chapter with `class="current"`)
3. Fill in `<article>` body using snippets from `references/tutorial_template.md`
4. Update `.toc-sidebar > ul` to anchor IDs in your `<article>`
5. (last chapter only) update prev/next at bottom

The `<style>` block is identical across chapters. **Don't try to "improve" it per file** — consistency is the point.

### Format mapping (Markdown idiom → v1 HTML form)

| Idiom | HTML form |
|---|---|
| `# H1` `## H2` `### H3` | `<h1>` / `<h2><span class="num">N</span><span>Title</span></h2>` / `<h3>` |
| Fenced code block | `<div class="code-block"><div class="header">…</div><pre id="x"><code class="language-python">…</code></pre></div>` (Prism handles tokens) |
| Mermaid block | **Removed** — draw `<svg>` by hand following `references/diagram_guide.md` |
| `**bold**` `*italic*` | `<strong>` `<em>` |
| Markdown link | `<a href="01-concepts.html">text</a>` |
| Markdown table | `<table class="compare-table">` (with optional `<tr class="selected">` for current choice) |
| Markdown callout / admonition | `<div class="callout warning">` / `tip` / `example` / `insight` |
| `<details><summary>...</summary>` | Same syntax; styled by the template |
| One-line definition | `<p class="one-liner">definition...</p>` (renders with `font-weight: 500` + left border; not italic in v2) |
| 为什么需要它 paragraph | `<div class="rationale"><span class="label">…</span><p>…</p></div>` |
| Predictive question | `<div class="predict"><span class="question-label">想一想</span><p>...</p><details>...</details></div>` |
| `[[wiki-link]]` | **Forbidden** — use plain `<a href="...html">` (HTML doesn't render wiki syntax) |

### Code escaping inside `<pre><code>`

HTML-escape special characters when writing example code: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`. Prism reads the escaped text and renders it correctly. **Don't manually wrap tokens in `<span class="tok-kw">` etc.** — Prism does that. You just write clean escaped source code.

### File structure — a scaffold, not a fixed file list

Two files are invariant: **`index.html` first, `NN-self-check.html` last.** Everything between is **topical chapters derived from the concept dependency graph** (Phase 3) — their number and names follow the subject, not a fixed template. Real tutorials average 5–6 chapters; 3 for a tight primer, up to ~8 before splitting deeper.

```
<tech-name>/
├── index.html            # entry page — invariant, always first
├── 01-concepts.html      # core vocabulary (anchor; almost always present)
├── 02-principles.html    # how it works + tradeoffs (anchor; usually present)
├── 0N-<topic>.html       # topical chapters, NAMED FOR THE SUBJECT
│                         #   e.g. 03-routing / 04-replication / 05-mvcc
└── 0X-self-check.html    # invariant, always last — discrimination scenarios
```

`01-concepts` and `02-principles` anchor most tutorials; past them, name each chapter after what it teaches (`03-streaming`, not a generic `03-extra`). Don't pad to a canonical file count, and don't force a broad subject into 4 files — the dependency graph decides the count. The `<style>` block inside each HTML is the source of truth — no shared `style.css`. Each chapter is a standalone artifact.

**Content mode is orthogonal to chapter count.** *Concept-focused* (default) fills chapters with scenario walkthroughs and needs no runnable-code progression; *hands-on* adds a worked→partial→open progression plus a capstone. Mode decides the *kind* of content and whether a capstone file exists; the dependency graph decides *how many* chapters. The two compose — a broad hands-on tutorial has both topical chapters and a capstone. Per-file purposes and the optional `frontier` chapter are in **Phase 4**.

## Tooling Discipline (Environment-Agnostic)

A tutorial is too much work for a single linear thread. The phases below have natural parallelism — research surfaces split cleanly by source type, chapter drafts split cleanly by topic, verification splits cleanly by audit dimension. **Use whatever parallel research / task / browser / shell tools are available in the current agent environment instead of serializing independent work.** If no parallel worker or task tool exists, keep the same phase boundaries and execute serially.

### When to spawn parallel workers (default to yes; justify "no")

| Situation | Spawn pattern |
|---|---|
| Phase 2 research surface ≥3 angles (official docs / design rationale / pitfalls / competitors) | 1 worker per angle, then synthesize the summaries |
| Phase 4 drafting 3+ independent chapters after outline locked | 1 worker per chapter with the locked concept-spec + dependency context; lead thread does coherence merge |
| Phase 5 audits across independent dimensions (voice, diagram density, retrieval separation, runnability, citations) | 1 worker per dimension, in parallel |
| Heavy code generation that may take >2 min (e.g., capstone reference implementation) | Background worker so the lead thread continues on other chapters |

Worker rules:
- **Launch independent workers together** when the platform supports it; launching them one after another serializes the work.
- **Brief each worker like a colleague who walked in cold.** Each prompt is self-contained: goal, what to read, format of output, where to save. Don't push synthesis to the worker ("based on your findings, decide…") — pull findings back and decide in the lead thread.
- **Cap worker output length** when you don't need the raw work — "report in under 200 words" keeps the main context clean.

### Other tools to prefer

| Tool capability | Use it for | Don't use it for |
|---|---|---|
| **Current documentation lookup** | Library/framework docs for any named technology | Generic programming concepts or debugging your own code |
| **Local file read/search** | User-provided files, existing project examples, known paths | Replacing authoritative docs for library behavior |
| **Broad codebase exploration** | "Where in this codebase is concept X handled?" multi-file search | Single exact-string lookup |
| **Web search/fetch** | Authoritative sources you can name (official docs, GitHub URL, RFC, vendor blog) | First-pass answers when a dedicated docs tool exists |
| **Task tracking** | Multi-chapter drafts and independent audit dimensions | Trivial 2-3 step work |
| **Background command execution** | Long-running installs, sample execution, test suites, local static server | One-shot commands that finish in seconds |

### When *not* to parallelize

Parallelism has overhead (context priming for each worker, merge cost in the lead thread). Skip it when:

- **Sequential dependency exists.** Don't draft chapter 3 in parallel with chapter 2 if chapter 3's worked examples reuse chapter 2's API.
- **The work is small.** A 200-word "what is X" lookup is not worth a separate worker.
- **You have not locked the outline yet.** Parallel chapter draft on an unstable outline produces wasted work — finalize Phase 3 first.

The principle: **maximize concurrency among independent units, never among dependent ones**. The outline phase is what makes the chapter phase independent.

## The workflow

### Phase 1 — Scope (ask only what the prompt hasn't already answered)

Lock down five things before researching — but **ask only what the prompt hasn't already answered.** First extract any of the five the prompt already gives; ask only about the genuinely-missing ones. A rich prompt may need zero questions; a bare "教我 X" / "give me a primer on X" may need one. Never turn a one-shot request into a five-question interview.

| Question | Why it matters |
|---|---|
| **What exactly?** Whole framework, or specific area? | Scope determines depth and structure. |
| **Why now?** Evaluating, building, or curious? | Evaluators need decision criteria; builders need runnable code; curious readers need narrative. |
| **What's their existing background?** | Drives expertise-reversal calibration and analogies. |
| **Concept-focused or hands-on?** | The content-mode axis. Default concept-focused (scenario walkthroughs for mental-model building; discrimination lives in self-check). Choose hands-on (adds a worked→partial→open code progression, pitfalls, and a capstone) only when the user explicitly needs runnable code. Decides content *kind*, not chapter *count*. |
| **How deep / how broad?** Primer (30 min), full (2 hr), deep-dive (half day)? | Sets depth and breadth, which feeds how many topical chapters the Phase 3 dependency graph yields (primer ≈ 3, full ≈ 5–6, deep-dive ≈ 7–8) and the example-to-exercise ratio. Don't promise a fixed file count here — the concept map decides it. |

If the conversation is non-interactive (no user available), **or the user gave a minimal one-shot prompt** (e.g. "给我一份关于 X 的入门" / "give me a primer on X") and plainly isn't expecting an interview, make defensible assumptions (default: primer depth ≈ 3 chapters, concept-focused, infer background from the prompt) and **document them near the top of `index.html`** in an "Assumptions" block so the reader can spot misfits.

### Phase 2 — Research (parallelize aggressively)

Use a current documentation lookup tool first when available, then web search for rationale, pitfalls, and comparisons. Boundaries and source-evaluation playbook live in [references/research_workflow.md](references/research_workflow.md).

For any tech with research surface ≥3 angles, **fan out in one message**. Typical fan-out:

| Worker | Sources | Output it returns |
|---|---|---|
| **Official-docs** | Current docs lookup → official docs → API reference | Concept list, version notes, official examples, **the canonical term for each concept (and which terms the community keeps in English)** |
| **Design-rationale + mechanism** | Vendor blog posts, conference talks, design RFCs, GitHub discussions, source | Why-bank entries (alternatives considered, tradeoffs taken) **plus the mechanism one level below the API surface** — how each core concept actually works, not just what it does. This is the depth-lens supply. |
| **Pitfalls / real-world** | GitHub issues, Stack Overflow top answers, post-mortems | Concrete pitfall list (not "be careful with performance") |
| **Competitors / alternatives** | Comparison posts, "X vs Y" articles, switcher stories | Discrimination context for the capstone |
| **Frontier / recent state** | Release notes & changelogs, project roadmap / RFCs, recent conf talks, arXiv (for AI/ML), `"<tech>" <current-year>`, deprecation notices | What shipped in roughly the last 6–12 months, what's emerging / experimental, what's been superseded — **each with a date**. This is the currency-lens supply. For a small or frozen topic, fold this into the competitors worker; for a fast-moving one it earns its own worker. |

Cap each worker at ~400 words of structured findings. **Add to every worker's brief: "Reserve the final 50-80 words for a `## Surprises` section — bullet list, one line each, listing the gaps between your prior model of this tech and what you found. This section is mandatory; if no surprises, say so explicitly."** Surprise is the depth signal; the things that surprised the researcher will surprise the reader. Make the section a separate header so the lead thread can grep it back deterministically — not a free-floating note that gets pruned to fit the 400-word cap.

**Add to the official-docs worker's brief**: end with a mandatory `## Terminology` section — one line per concept, fixed format: `<concept> | <canonical term> | <中文处理: keep-English / 通行译名「…」> | <one-phrase plain gloss>`. Same extraction discipline as `## Surprises`: a separate header the lead thread greps back deterministically; if the header is missing, re-prompt the worker.

The lead thread then assembles the following artifacts (don't pin a count here — counts go stale):

- The **concept dependency graph**: which concept must be defined before which?
- The **why bank**: for each design choice, what alternatives existed and what got sacrificed?
- The **pitfall list**: concrete things that bite newcomers.
- The **surprise list**: from each worker's output, locate the line matching `^## Surprises\b` (regex `^## Surprises`, case-sensitive) and extract every bullet line that follows until the next heading or end-of-output. Concatenate the extracted bullets verbatim into a flat list, prefixed with the worker name (e.g., `[official-docs] no implicit await on the close call`). Dedup obvious overlaps but keep the original framing intact. This becomes the candidate-pool for Phase 3's threshold concept and the "what would surprise the reader" hooks for Phase 4 concept introductions. **If a worker omits the `## Surprises` header, treat its surprise contribution as missing and re-prompt that worker. If the assembled list ends up empty or pure restatement of the docs, Phase 2 is not done — send workers back to dig deeper.**
- The **term table**: from the official-docs worker, locate `^## Terminology` and extract the lines that follow (same rule as the surprise list — header missing means re-prompt). Four columns: concept | canonical term | 中文处理 (keep-English / established translation) | first-use plain gloss. This is the supply that prevents coinage (Terminology discipline: coinage happens when the author lacks the real word at hand) **and the diff baseline for Phase 5's terminology audit** — shipped prose that names a concept outside this table needs a registered reason, not silence.
- The **frontier map**: from the frontier worker, sort findings into three dated buckets — **stable** (the settled core, teach it plainly), **in flux** (changed in roughly the last 6–12 months, teach it with the date attached), **superseded / deprecated** (name it so the reader doesn't learn the old way). Keep the date on each. This drives Phase 3's frontier framing and the index `现状速览`. If the topic is genuinely frozen, record that as the finding ("stable since <version/year>, nothing material in flux") rather than leaving the bucket empty by omission.

Carry the **term table** into Phase 4 — drafting names concepts with these real terms, not freshly-coined labels (see Terminology discipline). A concept the table doesn't cover gets named with a verified standard term and added to the table (registered), or described in plain words — never crowned with a fresh noun.

If research surface is small (a single feature like a CLI flag or one API method), one combined search is fine — don't manufacture parallelism.

### Phase 3 — Outline + concept map + learning path + threshold concept

Produce five artifacts and **show to the user for approval** before drafting prose (single approval pass — not five):

1. **Flat chapter outline**, each chapter with a one-line "what schema this builds."
2. **Concept map** showing all major abstractions and their relationships.
3. **Learning-path breadcrumb** showing the chapter sequence (this is what will be re-shown at every chapter opener).
4. **Threshold concept** — the 1-3 concepts that, once internalized, *transform* the reader's view of the domain (Meyer & Land 2003; see [references/cognitive_principles.md](references/cognitive_principles.md)). Drawn from Phase 2's surprise list. Present as: *"This tutorial's core idea is `<one-sentence threshold concept>`. Push back if that's not what you wanted."* State it as a **plain-language claim built from the field's real terms** — a sentence about how the thing works, not a coined noun. `React 的核心：UI 是 state 的纯函数` qualifies; a label like `响应式渲染漏斗` does not (see Terminology discipline). This is the step that most invites coinage — keep the name standard.
5. **Frontier framing** — one dated sentence from the Phase 2 frontier map: what's stable vs in flux vs superseded. E.g. *"核心 API 自 2.x 稳定；`<feature>` 截至 2026-06 仍在快速变化；旧的 `<approach>` 已被 `<new>` 取代。"* This becomes the index `现状速览`. Skip only if the topic is genuinely frozen — and then say so in one line ("成熟稳定协议，近年无重大变化") rather than omitting it, so the reader knows the absence is a finding, not a gap.

A tutorial without an identified threshold concept lacks a core idea; an unredirected wrong one produces a coherent-looking but off-target tutorial. The user's redirect, if any, happens inside the existing approval pass — no extra round-trip.

Once approved, the threshold concept must be rendered into `index.html` as a dedicated `一句话本质` section (see the index.html spec in [references/tutorial_template.md](references/tutorial_template.md)) — the section is mandatory in Phase 4 output, and Phase 5 audits its presence via the `index.html 自检` checklist that lives in `tutorial_template.md` (Phase 5 transitively runs every checklist in that file).

Getting alignment here costs minutes and saves hours.

### Phase 4 — Draft per template (parallelize chapters when independent)

Write per [references/tutorial_template.md](references/tutorial_template.md). The template is a completeness checklist for the seven principles, not a rigid form.

**Feynman test before each concept introduction** (agent-internal — does not interrupt user). Before writing a concept's intro paragraph, draft a 50-word jargon-free explanation in scratch space. If you stall, the gap is what the reader will hit too — go back to Phase 2's surprise list / source material, or do a targeted docs lookup, until you can do it. Then write the chapter's intro. Skipping this is the cheapest way for surface paraphrase to ship.

**Parallelism rule**: once Phase 3's outline is locked and the concept dependency graph is finalized, **chapters that don't reuse each other's worked examples can be drafted in parallel**. Assign one worker per such chapter when parallel workers are available. The shared inputs each worker needs:

- The locked chapter spec (one-line schema-builds + section list)
- The full concept dependency graph (so it doesn't redefine upstream concepts)
- The concept map + learning-path breadcrumb (so cross-references stay consistent)
- The Phase 2 **term table** (so every concept gets its canonical term; a name outside the table needs a one-line registered reason in the worker's notes back to the lead thread — silent coinage is what the Phase 5 audit will catch and bounce)
- The chapter's specific worked-example / partial-example / open-exercise contract

The lead thread then does a coherence merge pass: re-show the learning-path breadcrumb at each chapter opener with current chapter highlighted, verify cross-chapter callbacks land on actual prose in earlier chapters, deduplicate any concept that got accidentally redefined in two chapters.

Chapters that **must stay sequential**: any pair where chapter N's worked example builds on chapter N-1's output, or where N's "上一章" recap names a specific paragraph in N-1.

- **Concept-focused**: `01-concepts` + `02-principles` + any independent topical chapters parallelize once the dependency graph is locked; a `frontier` chapter parallelizes with them; the trailing `self-check` follows everything (it needs all chapter content for discrimination scenarios).
- **Hands-on**: same, plus `pitfalls` can fan out from the locked concepts, `practice` follows the concepts it scaffolds, and `capstone` follows everything.

If the tutorial is small (≤3 chapters) or chapters are tightly entangled, draft serially — parallelism overhead exceeds the gain.

Concrete file structure assembles from the scaffold (see "Output format" above): `index.html` first, `NN-self-check.html` last, topical chapters between, each named for what it teaches.

**Minimal concept-focused** (tight scope, ≈3 chapters):

```
<tech-name>/
├── index.html            # Target reader, motivation, concept map, 一句话本质, 现状速览, learning-path
├── 01-concepts.html      # Core abstractions; each anchored with a scenario walkthrough
├── 02-principles.html    # How it works + design tradeoffs (备选方案 tables required)
└── 03-self-check.html    # Self-test bank + cross-chapter discrimination scenarios (capstone surrogate)
```

**Typical concept-focused** (full scope, 5–6 chapters): keep `01-concepts` + `02-principles` as anchors, then split the rest of the dependency graph into topical chapters before self-check:

```
├── 03-<topic-a>.html     # e.g. 03-routing / 03-attention / 03-mvcc — named for the subject
├── 04-<topic-b>.html     # e.g. 04-replication / 04-scheduling
├── 05-frontier.html      # OPTIONAL recognized slot — see below
└── 0N-self-check.html    # always last
```

Build each topical chapter like `02-principles`: mechanism one level below the docs, a 备选方案 / 痛点→设计回应 table, predictive questions, ≥1 figure, and a chapter self-check — scoped to its sub-topic. The anchor names `01-concepts` / `02-principles` are conventional, not mandatory; a deep-dive may run `01-concepts-core` / `01-concepts-data-flow`.

**Hands-on** (a content mode, not a chapter count): insert a worked→partial→open progression chapter (`0N-practice.html`), a `0N-pitfalls.html`, and a `0N-capstone.html` before self-check. The capstone carries discrimination, so self-check leans toward recall. These coexist with topical chapters — a broad hands-on tutorial has both.

**Frontier chapter (optional, recognized slot).** Fast-moving topics (most frameworks, all AI/ML, young protocols) often outgrow the index's one-paragraph `现状速览`. When they do, add `0N-frontier.html` (or `0N-landscape.html`) just before self-check: what's **stable**, what's **in flux (dated)**, what's **superseded**, plus a forward "where this is heading." Built from Phase 2's frontier map — the index `现状速览` expanded into a teachable chapter, deepened not duplicated. Seven tutorials in real use grew this chapter unprompted; it is a first-class option.

**Quick primer**: collapse to a single `index.html` with all sections as `<h2>`.

### Phase 5 — Cross-link, verify, finalize (parallelize audits)

**Author's fluency illusion warning.** You wrote this. Of course it reads fluently *to you* — every concept was load-bearing in your head before the sentence landed on the page. That fluency is exactly the illusion Bjork named (Principle 6), now firing for the author instead of the reader. The audit below exists because your "this looks fine" feeling is not evidence. Run the checks even when nothing seems wrong; especially when nothing seems wrong.

**Parallel audit pattern**: the verification dimensions below are independent and read-only. If the platform supports parallel workers, assign one dimension to each worker — each gets the tutorial directory path and the one audit it owns. The lead thread collects findings and fixes. A serial single-thread audit takes 5-10× the wall time and is more likely to miss things because the auditor's attention dilutes across dimensions.

Suggested fan-out: voice / density / retrieval-separation / cross-chapter callbacks / discrimination coverage / citations / terminology. Each worker prompt is small ("scan these files for this one thing, report violations").

Before declaring done, audit against the checklist in [references/tutorial_template.md](references/tutorial_template.md). Specifically:

- **Density check**: open every chapter and confirm no >300-line stretch of prose without a diagram or worked example.
- **Retrieval separation check**: open every self-check section and confirm answers are in `<details>` blocks or a separate file, never inline.
- **Cross-chapter callback check**: every chapter after the first should textually reference at least one earlier concept by name. Grep for the earlier chapter's key terms in the current chapter; they should appear.
- **Discrimination check**: ≥1 prompt (ideally 3-5) that forces the reader to *choose between* approaches from ≥2 prior chapters. Lives in the trailing `*-self-check.html` (concept-focused) or `*-capstone.html` (hands-on) — the chapter number varies with how many topical chapters precede it, so locate it by the `-self-check` / `-capstone` **suffix**, not a fixed number.
- **Structural gates — run the bundled script (the only executable form of the next five gates)**: `bash "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/verify_structure.sh" <tutorial-dir>` (or `bash scripts/verify_structure.sh <dir>` from the skill dir). One run covers **self-check naming + position, audience-fit pair, figure coverage, SVG-utility-CSS presence, and the reader-drawing prompt** — it exits non-zero and prints which gate failed. It auto-detects the **quick-primer single-file mode** (a lone `index.html`) and skips the self-check-naming gate there; for a **Markdown-fallback** tutorial the gates don't apply mechanically — hand-check the same five rules against the `.md` output. If your system lacks `en_US.UTF-8`, set `TECH_TUTORIAL_LC_ALL` to any installed UTF-8 locale; otherwise the script keeps your locale when it is already UTF-8. The five bullets below are the authoritative spec + rationale (why each gate exists, the failure stories); the commands live only in the script — don't maintain a second copy by hand. It does **not** cover voice / pedagogy-jargon (kept inline below, table-coupled) or SVG overflow (needs a browser).
- **Self-check naming check (hard — script gate 1)**: exactly one chapter named `*-self-check.html`, and it must be the **last** chapter. A tutorial that ships its question bank as `05-discrimination.html` or similar is missing the convention the other checks key on (seen in real use); rename it. Appending a chapter after the self-check (e.g. `04-frontier` behind `03-self-check`) breaks the "retrieval comes last" invariant — renumber so self-check keeps the highest prefix.
- **Audience-fit pair check (hard — script gate 2)**: `index.html` must contain BOTH 适合谁 and 不适合谁 — the pair silently degrades to one half (seen in real tutorials shipped with only one) — plus 读完之后你能做到什么. Because `适合谁` is a substring of `不适合谁`, the gate counts occurrences and requires a standalone 适合谁 beyond the 不适合谁 ones.
- **Voice check (run as actual grep, not eyeball scan)**: from the tutorial dir, strip HTML markup + `<pre><code>` + `<details>` content first with the bundled `scripts/strip_prose.py` (the single home for the stripping rules — all three prose greps pipe through it, so they always scan the same text), then grep. The voice grep pattern is kept in sync with the **Forbidden phrases** table at the top of this document — if you add a banned phrase there, update this regex too. The per-file loop prefixes each line with the filename so grep hits are actionable; `find` is zsh-safe, the file passes via `sys.argv[1]` (apostrophe-in-filename safe), `grep -inE` is case-insensitive (catches `Let's` / `We'll` / `Roughly`), and `[''`]` character classes make smart quotes (`'` U+2019, the macOS autocorrect default) match alongside straight ASCII `'`:

  ```bash
  STRIP="${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/strip_prose.py"
  find . -maxdepth 1 -name '*.html' | while read -r f; do
    python3 "$STRIP" "$f" | LC_ALL="${TECH_TUTORIAL_LC_ALL:-en_US.UTF-8}" grep -inHE --label="$f" "我们一起|让我们|咱们|你会发现|接下来|我们来看|我们来试试|下面我们|Now we('|’)re going to|you('|’)ll discover|together we('|’)ll|let('|’)s|we('|’)ll|这很简单|很简单|显然|trivially|obviously|(^|[^a-zA-Z])just|可能|也许|兴许|大概|差不多|应该是|(^|[^a-zA-Z])roughly|(^|[^a-zA-Z])kind of|(^|[^a-zA-Z])sort of|踩坑|搞起来|撸代码|玩一下|在当今.*?领域|本教程将带你|踏上.*?旅程|开启.*?之旅"
  done
  ```

  Plus a separate first-person scan over the same stripped text:

  ```bash
  STRIP="${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/strip_prose.py"
  find . -maxdepth 1 -name '*.html' | while read -r f; do
    python3 "$STRIP" "$f" | LC_ALL="${TECH_TUTORIAL_LC_ALL:-en_US.UTF-8}" grep -nHE --label="$f" "(^|[^a-zA-Z])(我|我们)"
  done
  ```

  Both greps pin a UTF-8 locale so the curly-apostrophe and Chinese-character alternations match regardless of the caller's locale (a bare `LC_ALL=C` breaks codepoint-level alternation, not byte-level). If your system lacks `en_US.UTF-8` (common on minimal Linux/CI images), set `TECH_TUTORIAL_LC_ALL` to any installed UTF-8 locale (`locale -a | grep -i utf`) — the same variable `verify_structure.sh` honors.

  Every hit in **stripped prose** needs a fix or a justification (epistemic note / reader-addressed action / mandated fluency-illusion label / reporting the subject's genuine probability — see "When to break the rules"). Don't ship with raw hits.
- **Pedagogy-jargon leak check (hard, run as grep)**: the cognitive-framework vocabulary is the author's design tool and must not surface in reader prose (Terminology discipline, row 3). Over the same `strip_prose.py`-stripped prose, from the tutorial dir:

  ```bash
  STRIP="${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/strip_prose.py"
  find . -maxdepth 1 -name '*.html' | while read -r f; do
    python3 "$STRIP" "$f" | LC_ALL="${TECH_TUTORIAL_LC_ALL:-en_US.UTF-8}" grep -inHE --label="$f" "认知负荷|认知负载|cognitive load|内在负荷|外在负荷|相关负荷|germane load|intrinsic load|extraneous load|期望难度|合意困难|desirable difficulty|门槛概念|阈限概念|threshold concept|双重编码|dual coding|提取练习|retrieval practice"
  done
  ```

  Hits in reader prose are leaks — rename to the subject's own terms or delete. The list is **deliberately narrow**: it omits `schema` (legit subject term — DB / JSON / GraphQL schema; left to the qualitative Terminology check) and `流畅性错觉 / fluency illusion` (Principle 6 *mandates* a fluency-illusion warning in `index.html`). The seven-principle vocabulary is stable, so this list rarely changes. This grep is **separate from the forbidden-phrases voice grep** and does not touch the grep↔table 1:1 sync.
- **Diagram coverage check (hard — script gate 3)**: every chapter file must contain ≥1 `<figure>` (the gate matches `<figure>` with or without attributes). **`code-block` and `compare-table` do NOT count as figures** — they are sequential text and structured text; neither carries the spatial / parallel relationship that dual coding (Principle 3) is buying. All three (figures + code blocks + tables) coexist; figures are not optional just because other visual elements are present.

  Per-chapter targets — the rule is **per chapter**, not a canon-wide total (a 9-chapter tutorial and a 4-chapter one are both judged chapter-by-chapter):
  - **index.html**: ≥1 (the concept map).
  - **Every content chapter** (`01-concepts`, `02-principles`, every topical chapter, plus `practice` / `pitfalls` / `capstone` / `frontier` when present): ≥1, with concept-heavy and mechanism chapters typically 2–3.
  - **self-check**: ≥1 (e.g. a difficulty-gradient pyramid or a discrimination-scenario map).

  This floor scales with chapter count automatically: a 4-chapter concept tutorial lands ≥5–7 figures, a 6-chapter one ≥8–10, with no hardcoded canon total to maintain. The old fixed totals (≥7 / ≥10) were pinned to the two canons that <1/4 of real tutorials actually follow.

  **Common rationalization to refuse**: "this chapter is pitfalls / question bank / hands-on, doesn't need diagrams." False — pitfalls can show causal links between failure modes; question banks can show difficulty gradient and chapter mapping; hands-on can show type flow and scaffold progression. *Every chapter has a figure-worthy shape; if you can't find one, the chapter outline isn't clear yet.*

- **SVG utility CSS presence check (hard — script gate 4)**: every chapter file's `<style>` block must include the SVG utility classes — otherwise `<rect class="diagram-ink node-fill"/>` degrades to **solid black fill** (default SVG `fill` is black) when CSS is missing. If the gate lists a file, paste the canonical SVG utility block (defined at the end of `references/layout-template.html`'s `<style>`) into its `<style>`.

  **Failure mode this prevents**: an early-drafted chapter without figures shipped with no SVG utility CSS; later iteration adds figures that pass coordinate math but render as opaque black rectangles in the deployed file. *Seen in real tutorials. Always run the gate before declaring done.*
- **Reader-drawing check (hard, not soft — script gate 5)**: at least one explicit "draw it yourself" prompt must exist in the tutorial — typically in the self-check chapter (or the capstone, if hands-on). Zero hits means dual coding is still one-way; add the prompt (e.g. `亲手画一张图`) before declaring done.
- **SVG visual self-verify (hard — run BOTH the defect script and a screenshot pass)**: hand-coded SVG fails in 5 specific ways — text overflow (past a box border / past the viewBox), **label collision** (two free-floating labels rendered on top of each other), connector crossings, arrow piercing into nodes, asymmetric stop policy. Text overflow and label collision (diagram_guide.md Rules 1 and 5) are caught *deterministically by measurement*; the other three (Rules 2-4) need the eye on a rendered screenshot. For each chapter:
  1. `python3 -m http.server 8765` (from the tutorial folder, in background)
  2. Open `http://localhost:8765/<chapter>.html` via browser automation / headless browser / manual browser
  3. **Run the bundled defect script against the page** — read it from `"${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/svg_overflow_check.js"` (the cwd here is the tutorial folder, so a bare `scripts/...` relative path won't resolve) and evaluate it via Playwright `browser_evaluate`, headless `page.evaluate`, or the DevTools console. It returns `"OK: no SVG text defects"` or the exact violations: labels that spill past a box border / the viewBox (fix: shorten / split to a 2nd line / widen the box / font-size 12) and **label collisions** (fix: usually the layout, not nudging the label — see diagram_guide.md Rule 5 for the per-case remedy; a pair verified benign on a screenshot can be exempted with `data-collision-ok`). **Re-run until OK.** Do not eyeball text width — the character-count estimate is unreliable for mixed CJK+Latin and is why overflow keeps recurring.
  4. Capture each figure (`article > figure:nth-of-type(N)`) as a screenshot **saved as `<chapter>-figN.png` into one scratch dir** (e.g. `/tmp/<tech>-shots/01-memory-fig2.png`), and inspect it for the spatial defects the script can't see: connector lines crossing other connectors; a line passing through a label that isn't its own; arrow tips inside target boxes; arrows on different sides of a center node touching with inconsistent gaps; viewBox cropping content.
  5. Fix any defect in the SVG source, then re-run the script **and** re-screenshot to confirm.
  6. **Prove coverage mechanically**: re-run `verify_structure.sh <tutorial-dir> <scratch-dir>` — the optional gate 6 counts fresh screenshots per chapter against its `<figure>` count and fails on any figure that was never captured (or whose screenshot predates the last html edit). This is what makes "every figure" enforceable instead of remembered.

  See `references/diagram_guide.md` "SVG self-verification rules" for the 5 failure modes and fixes. Never declare a tutorial done without the defect script returning OK **and** a rendered screenshot pass on every figure. **"Every figure" has no exceptions — including figures the lead thread draws itself after auditing the workers' chapters** (e.g. the index concept map written last). The last-written figure is the least-reviewed figure; a real 2026-06 incident shipped a label collision in exactly that figure because the lead ran the script on it but skipped its screenshot — gate 6 exists to make that skip fail loudly instead of silently.
- **Runnability check**: run each code example if a runtime is available; otherwise mark "未在本机验证" at the top.
- **Citations check**: each chapter footer has a "Further reading" with 2-5 sources. If the user provides an organization-specific methodology note or internal source, link it only after verifying the path or URL exists.
- **Terminology check** (the audit for Terminology discipline rows 1-2 — mechanical enumeration, independent judgment, external verification): grep can't find a word that didn't exist before you wrote it, so the audit splits the work into what can be mechanized and what can't:
  1. **Enumerate candidates deterministically**: `python3 "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/extract_terms.py" <tutorial-dir>` dumps every bold/quoted concept name, section title, and figure caption/label with its location. Judge over this complete list, never over what catches your eye — eye-collection is the same fatigue trap the structural gates were bundled to avoid.
  2. **Judge each candidate against the Phase 2 term table, in a fresh context**: when parallel workers are available, assign this audit to an independent worker that did *not* write the prose — the author that coined a label is the least likely to flag it. Verdict per candidate: *in the table* / *standard but missing from the table* / *suspected coined or non-standard translation*.
  3. **Verify suspects externally**: for each suspect, check the term against official docs or a web search. A "term" with zero community usage is coined — replace it with the real term, or demote it to a clearly-marked analogy (`可以类比成…，但它真正的名字是 X`). A non-standard translation gets the community's actual term (keep English where the community keeps English). A standard term that was merely missing from the table gets added to the table — registered, not silently waved through.

  Run it even when the prose reads fine; the judgment step stays qualitative on purpose (a hard table-match gate would punish legitimate subject terms Phase 2 didn't anticipate).
- **Insight check** (one qualitative self-answer, not a grep): in one sentence, name what a 5-year-experience engineer in this domain would leave with after reading — that they couldn't get from the official docs alone. If you can't write that sentence, the tutorial is still at sign level (Marton's surface processing). Go back: either Phase 2 to surface more surprise material, or Phase 3 to re-pick the threshold concept. Once you can write the sentence, it goes into `index.html`'s "读完之后你能做到什么" section verbatim as the tutorial's USP.
- **Mechanism-depth check** (qualitative, like the insight check — *not* a count, per the no-checklist rule): walk the core concepts and ask of each, *does the prose go one level below where the official docs stop, or does it restate the doc sentence?* Restatement is surface processing (Marton) — the "longer version of the docs" failure. A concept that only restates goes back to Phase 2 for its mechanism before shipping. Read for the move; don't tally a number (a tally just trains relabeling).
- **Currency / frontier check**: is the `现状速览` frontier framing present in `index.html` and **dated**? For a fast-moving topic, are the load-bearing sources recent (reject >2-year-old sources for fast-moving tech, per research_workflow.md), and does the prose flag what's in flux vs settled where it matters? If the tutorial reads as if the field is frozen and it is not, the Phase 2 frontier sweep was skipped or too shallow — go back. (For a genuinely frozen topic, the one-line "stable since <year>" note satisfies this.)

- **Library integration check** (only when sibling tutorials exist in the destination): is the hub `index.html` at the library root updated with this tutorial's card under the right theme cluster, and does this tutorial's `index.html` carry a **verified** 相关教程 block? See "Building a knowledge library" below. Skip for a one-off tutorial in an empty/unrelated directory.

## Anti-patterns (audit your draft for these)

Drawn directly from the cognitive-science anti-pattern list. If your draft does any of these, fix it before showing the user.

| Anti-pattern | Why it fails | Fix |
|---|---|---|
| Statements throughout, zero questions | No retrieval → reader retains ~40% | Add chapter-end self-check |
| Decorative images | Pure extraneous load | Delete |
| "See node A in figure 3.2 above" | Split-attention destroys working memory | Move label onto the diagram element |
| Open exercise before worked example | Cognitive load disaster for novices | Show complete example first |
| One tutorial for everyone | Expertise reversal — helps no one | Pick a target reader, declare it |
| Final chapter = harder version of chapter N | Blocked practice, no transfer | End with discrimination — scenario questions that mix concepts from ≥2 chapters |
| "这很简单" / "显然" / "just" | Tells the confused reader they're dumb | Delete |
| Jumping ahead, undefined terms | Working memory overflow | Define on first use or link back |
| Answer right under the question | No retrieval — re-reading in disguise | Wrap answer in `<details>` |
| API tour disguised as tutorial | Reference, not schema-building | Build progression around concepts, not endpoints |
| Casual cheerleader voice | Disrespects reader's time | Professional declarative voice |
| Diagrams for already-clear 3 steps | Zero information gain | Replace with prose or delete |
| Walls of prose with no diagrams | Single-channel encoding | Add diagram or split the section |

## Working Inside Repositories Or Static Archives

When the output lands inside a workspace, documentation repository, or static archive, the tutorial remains **a folder of self-contained `.html` files** that the reader opens with a browser (double-click `index.html`, `open index.html`, or serve the folder locally). Do not assume the host app renders HTML inline.

Conventions:

- Place tutorials wherever the user asks, or create a neutral `<tech-name>/` folder in the current working directory when no destination is specified.
- **No app-specific wiki links** such as `[[wiki-link]]` unless the requested output format explicitly supports them. Use plain `<a href="01-concepts.html">` for inter-chapter links. Use plain relative links for cross-note references only after verifying the target exists.
- **No `![[image.png]]`** — use `<img src="assets/image.png">` and put images in an `assets/` subdirectory.
- **Methodology links** in `index.html` should point to user-provided sources only. Do not invent local paths.
- **Excalidraw fallback**: complex hand-drawn concept maps can stay as editable source files in the same folder, with the HTML embedding the exported SVG: `<img src="concept-map.svg">`. See `references/diagram_guide.md` for details.

If the user requests Markdown instead of HTML, adapt the same structure to Markdown and use Mermaid or exported SVG only when the target renderer supports it.

## Building a knowledge library (multi-tutorial)

A single tutorial builds one mental model; a *library* of them builds a connected one. When tutorials accumulate in one directory, the reader's real payoff is in the **edges between them** — `milvus-rag` only makes sense next to `milvus`, `vector-database`, `pgvector`; `langgraph` builds on `langchain`. Two lightweight artifacts turn a pile of folders into a navigable system. Both are **opt-in by context**: do them when the output lands in a directory that already holds sibling tutorials (or the user is clearly building a library), skip them for a one-off tutorial in an empty directory.

### 1. Hub index at the library root

When the destination directory already contains ≥1 sibling tutorial (each a folder with its own `index.html`), create or update a single **hub `index.html` at the library root** (one level above the tutorial folders). It:

- **Clusters tutorials by theme**, not alphabetically — the reader scans by domain (e.g. `Agent / LLM 应用`, `向量 / 检索`, `数据存储`, `消息 / 中间件`, `Web / 前端 / 语言`, `工程基础`). Reuse a hub's existing clusters if one already exists; add a new theme only when a tutorial fits none.
- Gives each entry a **one-line "what schema it builds"** (the tutorial's 一句话本质, trimmed), so the hub itself teaches the shape of the library rather than being a bare link list.
- Uses the **same visual identity** as the tutorials (copy the layout `<style>`), so it reads as part of the set.

**Update, don't clobber.** If a hub `index.html` already exists, read it, add the new tutorial's card to the right theme cluster, and preserve everything else. Regenerate from scratch only when the user asks.

### 2. "相关教程" cross-links in each tutorial

A tutorial's `index.html` ends with a **相关教程** block (after 参考资料) linking 2-4 sibling tutorials the reader should hit before or after this one — group as `前置`（prerequisite）and `延伸`（follow-on）when both apply (`langgraph` → 前置 `langchain`; `milvus-rag` → 前置 `milvus` / `vector-database`).

**Verify before linking** (same rule as methodology links — never invent a path): only link a sibling whose `../<sibling>/index.html` actually exists on disk. `ls ../<sibling>/index.html` before writing each `<a href>`. Relative form: `<a href="../<sibling>/index.html">`. This is hub-and-spoke *plus* a few spoke-to-spoke edges — exactly the "连进已有知识网" that lets a reader retain a domain instead of isolated topics.

### When to skip

- One-off tutorial in an empty or unrelated directory → no hub, no cross-links (nothing to connect to).
- The user explicitly wants a standalone artifact → respect that.
- The host format has its own navigation (a docs site, a wiki) → integrate with the host's index mechanism instead of dropping a second `index.html`. In an Obsidian-style vault the host may prefer its own MOC/index note — ask rather than assume.

See `references/tutorial_template.md` for the hub `index.html` and 相关教程 snippets.

## What to read next

- [references/cognitive_principles.md](references/cognitive_principles.md) — the cognitive-science research behind the seven principles, with author + year citations. Read this if you find yourself wanting to bend a rule and need to know what the rule is protecting.
- [references/tutorial_template.md](references/tutorial_template.md) — chapter-by-chapter template with mandatory sections, examples, and a completeness checklist.
- [references/research_workflow.md](references/research_workflow.md) — current-docs + web orchestration, source evaluation, when each source wins.
- [references/diagram_guide.md](references/diagram_guide.md) — content-to-diagram-type matrix, Mermaid vs Excalidraw decision tree, Split-Attention rule examples.
