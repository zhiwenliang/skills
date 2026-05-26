---
name: tech-tutorial
description: Use when the user wants to learn, understand, or build a durable knowledge system around a technology, framework, library, protocol, tool, or technical concept. Triggers include "教我 X", "我想学 X", "帮我搞懂 X", "X 入门", "X 怎么用", "写一篇关于 X 的教程", "整理成系统笔记", "I want to learn X", "help me understand X", "give me a primer", or pasted docs/links that should become a tutorial.
---

# Tech Tutorial Writer

A tutorial that doesn't build the reader's mental model is just a longer version of the docs. This skill turns "我想学 X" into a tutorial designed around **how humans actually learn**: cognitive load management, dual coding, worked examples, retrieval practice, spaced revisit, and interleaving.

The output looks like a careful course, not a Medium post.

## The premise this skill operates on

A reader's working memory holds about **4 chunks** at any moment. Every word, every diagram, every code block either (a) competes for that space (extraneous load — bad), (b) takes space necessarily (intrinsic load — manage it), or (c) helps the reader build durable structure (germane load — protect it). Most tech tutorials fail because they pile on extraneous load (jargon walls, jumping references, unlabeled diagrams) and skip germane load entirely (no retrieval, no progressive scaffolding, no interleaving).

This skill is the antidote. The principles below are not stylistic preferences — they are translations of empirical findings from cognitive science research (Sweller, Bjork, Mayer, Roediger) into concrete writing rules.

For details on each principle's research basis, see [references/cognitive_principles.md](references/cognitive_principles.md). If the user provides their own learning-theory note or methodology source, cite that source in the tutorial's "Further reading"; never assume a local path exists.

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

## How the seven principles fit together (not a flat list)

The seven principles below are not parallel rules. They form an **input × pivot × output** structure. Knowing the shape lets you reason about tradeoffs instead of blindly applying rules — when two principles seem to conflict, you can ask which layer each operates on.

```
INPUT-SIDE (how to present material)
  Principle 1 — Expertise Reversal     → who you are writing for
  Principle 2 — Schema Anchoring       → give the map before the territory
  Principle 3 — Dual Coding            → image + word, labels on the image

PIVOT (the unifying mental model)
  Principle 6 — Desirable Difficulty   → performance ≠ learning
                                          (the reason the output-side rules exist)

OUTPUT-SIDE (how to make it stick — three forms of desirable difficulty)
  Principle 4 — Worked → Partial → Open  (scaffolded retrieval)
  Principle 5 — Force Retrieval           (testing effect)
  Principle 7 — Interleave & Revisit      (spaced + interleaved)
```

**The pivot is Principle 6.** The reason 4/5/7 work is that they make the reader *struggle just enough* to encode durably. If you find yourself wanting to "make a chapter feel smoother" by removing self-checks or shortening the scaffold, you are trading long-term learning for short-term fluency — the exact failure mode Bjork named. Don't do it without naming the tradeoff.

The input side (1/2/3) has the opposite job: make presentation as frictionless as possible so that all of working memory is free for the productive difficulty on the output side. Reducing extraneous load on the input side is not in tension with desirable difficulty — they are partners. You reduce load on the things that *don't* teach, so the load on the things that *do* teach lands cleanly.

## The seven design principles (mandatory)

These are derived from the cognitive science foundations. Every tutorial section must be designed against them. The completeness checklist in [references/tutorial_template.md](references/tutorial_template.md) makes them auditable.

### 1. Declare the target reader explicitly (Expertise Reversal)

The same teaching style helps novices and bores experts. Tutorials that try to serve both serve neither. Open every tutorial with three explicit lists:

- **适合谁**: required prior knowledge, tooling, version assumptions.
- **不适合谁**: who should read something else first, who should skip this and read something deeper.
- **读完之后你能做到什么**: concrete, verifiable capabilities.

This is a contract with the reader and a forcing function on you: you cannot write well if you do not know who you are writing for.

### 2. Give the map before the territory (reduce initial intrinsic load)

The reader's working memory is empty when they open the tutorial. Before the first chapter, give them **two diagrams**:

- A **concept map** showing every major abstraction and how it relates to the others.
- A **learning-path breadcrumb** showing the chapter sequence and where they currently are.

Re-show the breadcrumb at the start of every chapter with the current step highlighted. This is also spaced revisit (principle 7).

### 3. Image before text — and labels on the image (Dual Coding + Split-Attention)

Words and images take separate paths through working memory; together they roughly double retention (Paivio's picture-superiority effect, 1.5-2× on free recall; Mayer's multimedia studies, 50-100% gain on transfer). The skill's [diagram_guide.md](references/diagram_guide.md) defines the content-to-diagram-type mapping you must follow. Rule of thumb: **at least one diagram per major section**; if a section runs >300 lines of prose without a diagram, you have failed dual coding.

**Split-Attention rule**: labels go *on the diagram elements*, not "see node A in figure 3.2 above." Cross-referencing forces the reader's eye to ping-pong, exploding extraneous load.

Decorative images (the brain icon next to "learning") increase load without information gain. Delete them.

**Ask the reader to draw, at least once per tutorial.** Drawing forces the reader to construct the imagery channel themselves — a stronger encoding than passively consuming your diagram (the source theory's "手画 > 看现成图"). One good place: a chapter-end challenge that says "Without scrolling up, draw the architecture diagram from §2.1 from memory, then check." Another: ask the reader to draw a *new* diagram (e.g., "Sketch how data flows in your own use case"). This converts dual coding from a one-way input into a retrieval-practice loop.

### 4. Worked example before exercise (Worked Example Effect)

Sweller & Cooper (1985): for novices, a complete worked example **beats** an open exercise on every metric. Open exercises drown the new learner in load before they have a schema to hang the problem on.

For each new concept in a novice-targeted chapter, follow this three-step scaffold:

1. **Complete worked example** — full code, fully explained line-by-line at the level of "what concept does this line illustrate."
2. **Partial example** — give the structure, leave 1-2 *decision points* blank for the reader. Not trivial fill-ins — the actual schema-building decisions.
3. **Open exercise** — a fresh problem the reader solves end-to-end.

Ratio of example to exercise depends on reader level: novice = 5:1 worked-example-to-exercise, intermediate = 2:1, expert = 1:3. Pick from the target reader profile.

### 5. Force retrieval (Testing Effect)

Roediger & Karpicke (2006) — three groups, same total study time on a text passage:

| Group | Activity | 1-week retention |
|---|---|---|
| Re-read only | Read 4× | **40%** |
| Read + 1 test | Read 3× + test 1× | 56% |
| Test-heavy | Read 1× + test 3× | **61%** |

Two things to notice. **First**, even one retrieval attempt buys ~16 points over pure re-reading — the cheapest retrieval intervention has the largest marginal effect, so always add at least *some* self-check. **Second**, more retrieval keeps paying out — chapters that bake in multiple retrieval moments beat chapters that gate it all to one end-of-chapter quiz.

Every chapter must end with:

- **2-4 self-check questions** covering the chapter's core schema.
- **Answers in a `<details>` block or in a separate section** — never adjacent to the question. Physical separation is required; "answer is right below" defeats retrieval.

In addition, scatter **predictive questions** through the prose ("what do you think this will print?"). Make the reader stop before revealing the answer.

**Atomic questions only.** A self-check question that bundles 3 sub-questions ("define X, explain why it matters, and give an example") trains 1 retrieval attempt instead of 3, and lets the reader fudge partial answers. Split into 3 separate questions.

### 6. Engineer desirable difficulty (Bjork)

Bjork's core distinction: **current performance ≠ durable learning**. Conditions that make the reader look smoothest *right now* (re-reading, blocked practice, immediate worked-example access) actively *worsen* long-term retention and transfer. A tutorial that feels effortless is producing illusion of mastery — the reader will fail on contact with reality.

Bjork names **four forms** of desirable difficulty. Each one degrades short-term performance to buy long-term learning:

| Form | What it costs the reader | What it buys |
|---|---|---|
| **Spaced retrieval** (Principle 7) | Concepts feel half-forgotten when revisited | Stronger consolidation per recall |
| **Interleaving** (Principle 7) | Every problem requires identifying the type first | Discrimination ability — the real-world skill |
| **Active retrieval** (Principle 5) | Recall is effortful, sometimes painful | The retrieval act *is* the encoding event |
| **Variation of conditions** | Each example looks different from the last | Transfer to novel contexts, not just the trained one |

The "variation" form is the one tutorials most often skip. The fix:

- **Vary the problem context** — don't teach a concept with only the canonical example. Show it in 2-3 different shapes (different domains, different surrounding code, different input scales).
- **At least one "just out of reach" challenge per chapter** — in the reader's zone of proximal development.
- **Delay the answer** — buy 30 seconds of think-time with formatting (a `<details>` block, a "scroll past this image first" beat).

**Anesthetic words are forbidden** — "这很简单", "显然", "trivial", "obviously", "just". They tell the confused reader their confusion is shameful. They also lie: if it really were obvious, the tutorial wouldn't need to cover it. Delete on sight.

**Reader-side fluency illusion warning to surface in the prose**: somewhere in the tutorial (a "how to use this tutorial" note near the top of `index.html` is a good place), explicitly warn the reader that *feeling smooth ≠ learned*. Specifically name the three traps from the source theory: "我读得很顺" (just familiarity), "我做题很快" (probably stock problem types), "我没卡壳" (probably not touching the schema). Giving the reader these labels lets them self-diagnose.

### 7. Interleave and revisit (Spaced Repetition + Interleaved Practice)

Knowledge becomes durable when it is re-activated in new contexts. Cepeda et al. (2006), meta-analysis of 184 studies: spaced practice produces ~2-3× the long-term retention of equivalent massed practice. Required structures:

- **Every chapter opens** with one sentence summarizing the prior chapter's contribution to the current one. This is forced retrieval, not redundancy.
- **Examples in chapter N use concepts from chapters 1..N-1**, not just the new concept. This is interleaving.
- **The tutorial ends with a capstone** that requires the reader to *discriminate* between concepts — "should you use the chapter 3 approach or the chapter 7 approach here?" Discrimination is what transfer means. The mechanism: interleaving forces the reader to first *identify* which approach applies before applying it. Blocked practice ("all chapter-3 problems in a row") trains application but skips identification — which is the step real-world use actually requires.

The capstone is not optional for full-depth tutorials. A tutorial without a capstone has trained recall but not transfer.

**Interleaving boundary — when *not* to interleave.** Interleaving trains discrimination, which is what helps when the reader must choose between similar approaches. It hurts when the reader is in the *acquisition* phase of a single new motor / syntactic skill — e.g., first time touching the language's syntax for async, first 30 minutes with a new API surface. There, block first ("write 5 simple async functions before mixing them with sync"), interleave later. Apply this judgment when designing 03-practice: early exercises in a chapter can be blocked, later exercises should mix.

## Voice and tone

The reader is a working professional, not a child. Treat the tone as a load-bearing engineering decision, not as decoration — casual prose forces the reader to filter out chatter to reach the signal, which costs working memory (extraneous load, principle 3). Professional prose is the cheapest extraneous-load reduction available.

### Hard rules

- **Active voice, present tense, imperative for instructions.** "The parser returns a typed record." / "Set `timeout_ms=5000`." Not "we'll be parsing here" or "you might want to set a timeout."
- **One concept per sentence.** Long sentences with multiple clauses blow working memory.
- **Specific numbers, names, versions** beat hedges. "Default timeout is 30 seconds" beats "the timeout has a reasonable default."

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

The only legitimate first-person uses in **prose**:

- **Author's epistemic note**, clearly marked: "我没在生产环境验证过这个配置，仅在 4000-token 文档上测过" — signals an explicit boundary the reader should respect.
- **Reader-addressed action prompt** in self-check / capstone — `合上教程，自己写一遍` is fine because the subject IS the reader. `让我们一起合上教程` is not.
- **The three fluency-illusion labels** required by Principle 6 (`我读得很顺` / `我做题很快` / `我没卡壳`) — these are quoted reader self-talk, mandated verbatim.

If the user explicitly asks for a casual tone, honor that — but the default is professional.

## Output format: HTML (not Markdown)

Tutorials produced by this skill are **HTML files**, not Markdown. The reason is pedagogical, not aesthetic: HTML's higher visual ceiling (sticky TOC, syntax-highlighted code, styled callouts, hand-drawn SVG figures, native `<details>` with custom styling) directly serves Principle 3 (dual coding) and Principle 5 (retrieval separation) better than Markdown can. If the user or host project explicitly requires Markdown, keep the same cognitive structure and adapt the rendering primitives; otherwise default to standalone HTML.

The visual identity is fixed: **editorial scholarly notebook** — warm paper background, Noto Serif SC body, vermilion accent. Don't redesign per-tutorial; the consistency is part of the brand. Why this aesthetic: it deliberately differentiates from generic Bootstrap / Material / AI-template look that engineers reflexively distrust. See `references/layout-template.html` for the rationale baked into comments.

### Tech stack (fixed — copy from `references/layout-template.html`)

| Layer | Tool | Notes |
|---|---|---|
| **Fonts** | Google Fonts CDN: Noto Serif SC + Noto Sans SC + Spectral + Fraunces + JetBrains Mono | One `<link>` tag, all weights needed |
| **Code highlighting** | Prism.js v1.29 (autoloader) | Drops grammar on demand. Theme overridden in `<style>` block to match palette |
| **Styling** | Hand-written CSS in `<style>` block | Zero CSS framework. ~360 lines, identical across chapters |
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
| One-line definition | `<p class="one-liner">italic definition...</p>` |
| 为什么需要它 paragraph | `<div class="rationale"><span class="label">…</span><p>…</p></div>` |
| Predictive question | `<div class="predict"><span class="question-label">想一想</span><p>...</p><details>...</details></div>` |
| `[[wiki-link]]` | **Forbidden** — use plain `<a href="...html">` (HTML doesn't render wiki syntax) |

### Code escaping inside `<pre><code>`

HTML-escape special characters when writing example code: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`. Prism reads the escaped text and renders it correctly. **Don't manually wrap tokens in `<span class="tok-kw">` etc.** — Prism does that. You just write clean escaped source code.

### File structure

```
<tech-name>/
├── index.html          # entry page
├── 01-concepts.html
├── 02-principles.html
├── 03-practice.html
├── 04-pitfalls.html
├── 05-capstone.html
└── 06-self-check.html
```

`index.html` is the entry per web convention. The `<style>` block inside each HTML is the source of truth — no shared `style.css`, no `style/` directory. This keeps each chapter a standalone artifact.

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

### Phase 1 — Scope (mandatory dialogue, never skip)

Lock down four things with the user before researching:

| Question | Why it matters |
|---|---|
| **What exactly?** Whole framework, or specific area? | Scope determines depth and structure. |
| **Why now?** Evaluating, building, or curious? | Evaluators need decision criteria; builders need runnable code; curious readers need narrative. |
| **What's their existing background?** | Drives expertise-reversal calibration and analogies. |
| **How deep?** Primer (30 min), full (2 hr), deep-dive (half day)? | Determines file structure and example-to-exercise ratio. |

If the conversation is non-interactive (no user available), make defensible assumptions and **document them near the top of `index.html`** in an "Assumptions" block so the reader can spot misfits.

### Phase 2 — Research (parallelize aggressively)

Use a current documentation lookup tool first when available, then web search for rationale, pitfalls, and comparisons. Boundaries and source-evaluation playbook live in [references/research_workflow.md](references/research_workflow.md).

For any tech with research surface ≥3 angles, **fan out in one message**. Typical fan-out:

| Worker | Sources | Output it returns |
|---|---|---|
| **Official-docs** | Current docs lookup → official docs → API reference | Concept list, version notes, official examples |
| **Design-rationale** | Vendor blog posts, conference talks, design RFCs, GitHub discussions | Why-bank entries: alternatives considered, tradeoffs taken |
| **Pitfalls / real-world** | GitHub issues, Stack Overflow top answers, post-mortems | Concrete pitfall list (not "be careful with performance") |
| **Competitors / alternatives** | Comparison posts, "X vs Y" articles, switcher stories | Discrimination context for the capstone |

Cap each worker at ~400 words of structured findings. The lead thread then assembles three artifacts:

- The **concept dependency graph**: which concept must be defined before which?
- The **why bank**: for each design choice, what alternatives existed and what got sacrificed?
- The **pitfall list**: concrete things that bite newcomers.

If research surface is small (a single feature like a CLI flag or one API method), one combined search is fine — don't manufacture parallelism.

### Phase 3 — Outline + concept map + learning path

Produce three artifacts and **show to the user for approval** before drafting prose:

1. **Flat chapter outline**, each chapter with a one-line "what schema this builds."
2. **Concept map** showing all major abstractions and their relationships.
3. **Learning-path breadcrumb** showing the chapter sequence (this is what will be re-shown at every chapter opener).

Getting alignment here costs minutes and saves hours.

### Phase 4 — Draft per template (parallelize chapters when independent)

Write per [references/tutorial_template.md](references/tutorial_template.md). The template is a completeness checklist for the seven principles, not a rigid form.

**Parallelism rule**: once Phase 3's outline is locked and the concept dependency graph is finalized, **chapters that don't reuse each other's worked examples can be drafted in parallel**. Assign one worker per such chapter when parallel workers are available. The shared inputs each worker needs:

- The locked chapter spec (one-line schema-builds + section list)
- The full concept dependency graph (so it doesn't redefine upstream concepts)
- The concept map + learning-path breadcrumb (so cross-references stay consistent)
- The chapter's specific worked-example / partial-example / open-exercise contract

The lead thread then does a coherence merge pass: re-show the learning-path breadcrumb at each chapter opener with current chapter highlighted, verify cross-chapter callbacks land on actual prose in earlier chapters, deduplicate any concept that got accidentally redefined in two chapters.

Chapters that **must stay sequential**: any pair where chapter N's worked example builds on chapter N-1's output, or where N's "上一章" recap names a specific paragraph in N-1. For a typical 6-chapter full tutorial, parallelizable: 01 + 02 (independent foundations), 04 (pitfalls) and 06 (self-check bank) can fan out from 01-03 once locked. Sequential: 03 (practice) follows 01-02; 05 (capstone) follows everything.

If the tutorial is small (≤3 chapters) or chapters are tightly entangled, draft serially — parallelism overhead exceeds the gain.

Default file structure for a full tutorial (all HTML — see "Output format" section above for the required layout template each file must use):

```
<tech-name>/
├── index.html            # Target reader, motivation, concept map, learning-path breadcrumb, TOC
├── 01-concepts.html      # Core abstractions; each concept has worked example
├── 02-principles.html    # How it works + design tradeoffs (备选方案 tables required)
├── 03-practice.html      # Hands-on: worked → partial → exercise progression
├── 04-pitfalls.html      # Concrete pitfalls (not "pay attention to performance")
├── 05-capstone.html      # Mixed-concept project requiring discrimination
└── 06-self-check.html    # Bank of self-test questions with answers in <details>
```

For **quick primers**: collapse to a single `index.html` with all sections as `<h2>`.

### Phase 5 — Cross-link, verify, finalize (parallelize audits)

**Author's fluency illusion warning.** You wrote this. Of course it reads fluently *to you* — every concept was load-bearing in your head before the sentence landed on the page. That fluency is exactly the illusion Bjork named (Principle 6), now firing for the author instead of the reader. The audit below exists because your "this looks fine" feeling is not evidence. Run the checks even when nothing seems wrong; especially when nothing seems wrong.

**Parallel audit pattern**: the verification dimensions below are independent and read-only. If the platform supports parallel workers, assign one dimension to each worker — each gets the tutorial directory path and the one audit it owns. The lead thread collects findings and fixes. A serial single-thread audit takes 5-10× the wall time and is more likely to miss things because the auditor's attention dilutes across dimensions.

Suggested fan-out: voice / density / retrieval-separation / cross-chapter callbacks / capstone discrimination / citations. Each worker prompt is small ("scan these files for this one thing, report violations").

Before declaring done, audit against the checklist in [references/tutorial_template.md](references/tutorial_template.md). Specifically:

- **Density check**: open every chapter and confirm no >300-line stretch of prose without a diagram or worked example.
- **Retrieval separation check**: open every self-check section and confirm answers are in `<details>` blocks or a separate file, never inline.
- **Cross-chapter callback check**: every chapter after the first should textually reference at least one earlier concept by name. Grep for the earlier chapter's key terms in the current chapter; they should appear.
- **Capstone check**: the capstone project requires the reader to *choose between* approaches from at least 2 prior chapters.
- **Voice check (run as actual grep, not eyeball scan)**: from the tutorial dir, strip HTML markup + `<pre><code>` + `<details>` content first, then grep. One-liner:

  ```bash
  for f in *.html; do
    python3 -c "import re,sys; t=open('$f').read(); t=re.sub(r'<pre><code.*?</code></pre>','',t,flags=re.S); t=re.sub(r'<details>.*?</details>','',t,flags=re.S|re.I); t=re.sub(r'<[^>]+>','',t); print(t)"
  done | grep -nE "我们一起|让我们|咱们|接下来|我们来看|我们来试试|我们将|let'?s|we'?ll|together we'?ll|这很简单|很简单|显然|trivially|obviously|just |可能|也许|兴许|大概|差不多|应该是|踩坑|搞起来|撸代码|在当今.*?领域|本教程将带你|踏上.*?旅程|开启.*?之旅"
  ```

  Plus a separate first-person scan over the same stripped text:

  ```bash
  # (same strip loop) | grep -nE "(^|[^a-zA-Z])(我|我们)"
  ```

  Every hit in **stripped prose** needs a fix or a justification (epistemic note / reader-addressed action / mandated fluency-illusion label). Don't ship with raw hits.
- **Diagram coverage check (hard, run as grep)**: every chapter file must contain ≥1 `<figure>`. From the tutorial dir:

  ```bash
  for f in *.html; do
    n=$(grep -c '<figure>' "$f")
    [ "$n" -lt 1 ] && echo "MISSING figure in: $f"
  done
  ```

  Output should be empty. **`code-block` and `compare-table` do NOT count as figures** — they are sequential text and structured text; neither carries the spatial / parallel relationship that dual coding (Principle 3) is buying. All three (figures + code blocks + tables) coexist; figures are not optional just because other visual elements are present.

  Per-chapter targets: index 1 (concept map), 01 2-3, 02 2-3, 03 1-2 (e.g. data type flow + training progression), 04 1 (e.g. pitfall taxonomy), 05 1-2 (architecture + decision tree), 06 1 (e.g. gradient pyramid). Total ≥10 for a full tutorial.

  **Common rationalization to refuse**: "this chapter is pitfalls / question bank / hands-on, doesn't need diagrams." False — pitfalls can show causal links between failure modes; question banks can show difficulty gradient and chapter mapping; hands-on can show type flow and scaffold progression. *Every chapter has a figure-worthy shape; if you can't find one, the chapter outline isn't clear yet.*

- **SVG utility CSS presence check (hard, run as grep)**: every chapter file's `<style>` block must include the SVG utility classes — otherwise `<rect class="diagram-ink node-fill"/>` degrades to **solid black fill** (default SVG `fill` is black) when CSS is missing. From the tutorial dir:

  ```bash
  grep -L '\.diagram-ink' *.html
  ```

  Output should be empty (every file must include `.diagram-ink`). If a file is listed, paste the canonical SVG utility block (defined at the end of `references/layout-template.html`'s `<style>`) into its `<style>`.

  **Failure mode this prevents**: an early-drafted chapter without figures shipped with no SVG utility CSS; later iteration adds figures that pass coordinate math but render as opaque black rectangles in the deployed file. *Seen in real tutorials. Always grep before declaring done.*
- **Reader-drawing check (hard, not soft)**: at least one explicit "draw it yourself" prompt must exist in the tutorial — typically in the capstone or 06-self-check. Run `grep -nE "(自己画|亲手画|手画|画一画|画一张|sketch|Draw the)" *.html` from the tutorial dir. Zero hits means dual coding is still one-way; add the prompt before declaring done.
- **SVG visual self-verify (hard, must render screenshots)**: hand-coded SVG fails in 4 specific ways (text overflow / connector crossings / arrow piercing into nodes / asymmetric stop policy). Mental coordinate math catches obvious cases but misses subtle ones. For each chapter:
  1. `python3 -m http.server 8765` (from the tutorial folder, in background)
  2. Use browser automation, a headless browser, or a manual browser screenshot to open `http://localhost:8765/01-concepts.html`
  3. Capture each figure (`article > figure:nth-of-type(N)`) as a screenshot
  4. Inspect every screenshot — look for: text wrapping / extending past viewBox; connector lines crossing other connector lines; arrow tips visibly inside target boxes; arrows on different sides of a center node touching with different gaps; viewBox cropping content
  5. Fix any defect in the SVG source, re-screenshot to confirm

  See `references/diagram_guide.md` "SVG self-verification rules" for the 4 specific failure modes and how to fix each. This is the ONLY reliable way to catch SVG defects — never declare a tutorial done without rendered screenshot verification of every figure.
- **Runnability check**: run each code example if a runtime is available; otherwise mark "未在本机验证" at the top.
- **Citations check**: each chapter footer has a "Further reading" with 2-5 sources. If the user provides an organization-specific methodology note or internal source, link it only after verifying the path or URL exists.

## Anti-patterns (audit your draft for these)

Drawn directly from the cognitive-science anti-pattern list. If your draft does any of these, fix it before showing the user.

| Anti-pattern | Why it fails | Fix |
|---|---|---|
| Statements throughout, zero questions | No retrieval → reader retains ~40% | Add chapter-end self-check |
| Decorative images | Pure extraneous load | Delete |
| "See node A in figure 3.2 above" | Split-attention destroys working memory | Move label onto the diagram element |
| Open exercise before worked example | Cognitive load disaster for novices | Show complete example first |
| One tutorial for everyone | Expertise reversal — helps no one | Pick a target reader, declare it |
| Final chapter = harder version of chapter N | Blocked practice, no transfer | Build a capstone that interleaves |
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

## What to read next

- [references/cognitive_principles.md](references/cognitive_principles.md) — the cognitive-science research behind the seven principles, with author + year citations. Read this if you find yourself wanting to bend a rule and need to know what the rule is protecting.
- [references/tutorial_template.md](references/tutorial_template.md) — chapter-by-chapter template with mandatory sections, examples, and a 30-item completeness checklist.
- [references/research_workflow.md](references/research_workflow.md) — current-docs + web orchestration, source evaluation, when each source wins.
- [references/diagram_guide.md](references/diagram_guide.md) — content-to-diagram-type matrix, Mermaid vs Excalidraw decision tree, Split-Attention rule examples.
