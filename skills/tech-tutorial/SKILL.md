---
name: tech-tutorial
description: Use when the user wants to learn, understand, or build a durable knowledge system around a technology, framework, library, protocol, tool, or technical concept. Triggers include "教我 X", "我想学 X", "帮我搞懂 X", "X 入门", "X 怎么用", "写一篇关于 X 的教程", "整理成系统笔记", "I want to learn X", "help me understand X", "give me a primer", or pasted docs/links that should become a tutorial.
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

Every tutorial section must be designed against these. The 30-item completeness checklist in [references/tutorial_template.md](references/tutorial_template.md) makes them auditable; the research behind each rule lives in [references/cognitive_principles.md](references/cognitive_principles.md).

### 1. Declare the target reader (Expertise Reversal)

The same teaching style helps novices and bores experts; trying to serve both serves neither. Open every tutorial with three explicit lists: **适合谁** (required prior knowledge, tooling, versions), **不适合谁** (route elsewhere), **读完之后你能做到什么** (concrete verifiable capabilities). Anyone outside the target is routed away on page one.

### 2. Map before territory (Schema Anchoring)

Working memory is empty when the reader opens chapter 1. Give them anchors first:

- A **concept map** showing every major abstraction and how they relate.
- A **learning-path breadcrumb** showing the chapter sequence.
- **Re-show the breadcrumb at every chapter opener**, current step highlighted. Doubles as spaced revisit (principle 7).

### 3. Image + labels + reader-draw (Dual Coding + Split-Attention)

Words and images take separate working-memory channels; together they roughly double retention. Cross-references ("see node A in figure 3.2 above") destroy that gain by forcing the eye to ping-pong.

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

  Worked-example-to-exercise ratio scales with reader level: novice 5:1, intermediate 2:1, expert 1:3.

### 5. Force retrieval (Testing Effect)

Passive re-reading retains ~40% at one week; one test pushes that to ~56%; multiple tests to ~61% (Roediger & Karpicke 2006). The marginal effect of the *first* retrieval is largest — always add at least one self-check; more still pays out.

Every chapter must end with **2-4 self-check questions** + scattered predictive questions in prose. Hard constraints:

- **Atomic questions only.** A bundled question ("define X, explain why, give an example") trains 1 retrieval attempt instead of 3 and lets the reader fudge partial answers. Split into 3.
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
| One-line definition | `<p class="one-liner">italic definition...</p>` |
| 为什么需要它 paragraph | `<div class="rationale"><span class="label">…</span><p>…</p></div>` |
| Predictive question | `<div class="predict"><span class="question-label">想一想</span><p>...</p><details>...</details></div>` |
| `[[wiki-link]]` | **Forbidden** — use plain `<a href="...html">` (HTML doesn't render wiki syntax) |

### Code escaping inside `<pre><code>`

HTML-escape special characters when writing example code: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`. Prism reads the escaped text and renders it correctly. **Don't manually wrap tokens in `<span class="tok-kw">` etc.** — Prism does that. You just write clean escaped source code.

### File structure

```
<tech-name>/                  # default: concept-focused (4 files)
├── index.html                # entry page
├── 01-concepts.html
├── 02-principles.html
└── 03-self-check.html        # includes cross-chapter discrimination scenarios
```

`index.html` is the entry per web convention. The `<style>` block inside each HTML is the source of truth — no shared `style.css`, no `style/` directory. Each chapter is a standalone artifact.

For the hands-on extension structure (adds `03-practice` / `04-pitfalls` / `05-capstone`, renumbers self-check to `06-self-check`) and per-file purposes, see **Phase 4** below. Phase 1's mode-selection dialog determines which structure applies.

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
| **Concept-focused or hands-on?** | Default is concept-focused (4 chapters: concepts + principles + self-check with discrimination scenarios) for building mental models. Choose hands-on (adds practice + pitfalls + capstone) only when the user explicitly needs runnable code progression. |
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

Chapters that **must stay sequential**: any pair where chapter N's worked example builds on chapter N-1's output, or where N's "上一章" recap names a specific paragraph in N-1.

- **Concept-focused tutorial** (default, 4 files): 01 + 02 parallelizable; `03-self-check` follows everything (needs all chapter content for discrimination scenarios).
- **Hands-on tutorial** (6 files): 01 + 02 parallelizable; 04 (pitfalls) and 06 (self-check) can fan out from 01-03 once locked; 03 (practice) follows 01-02; 05 (capstone) follows everything.

If the tutorial is small (≤3 chapters) or chapters are tightly entangled, draft serially — parallelism overhead exceeds the gain.

Default file structure for a full **concept-focused** tutorial (all HTML — see "Output format" section above for the required layout template):

```
<tech-name>/
├── index.html            # Target reader, motivation, concept map, learning-path breadcrumb, TOC
├── 01-concepts.html      # Core abstractions; each concept anchored with a scenario walkthrough
├── 02-principles.html    # How it works + design tradeoffs (备选方案 tables required)
└── 03-self-check.html    # Self-test bank + cross-chapter discrimination scenarios (capstone surrogate)
```

For **hands-on tutorials**, extend with three chapters between principles and self-check (self-check renumbers to 06):

```
├── 03-practice.html      # Worked → partial → exercise code progression
├── 04-pitfalls.html      # Concrete pitfalls (not "pay attention to performance")
├── 05-capstone.html      # Mixed-concept project requiring discrimination
└── 06-self-check.html    # Question bank, answers in <details>
```

For **quick primers**: collapse to a single `index.html` with all sections as `<h2>`.

### Phase 5 — Cross-link, verify, finalize (parallelize audits)

**Author's fluency illusion warning.** You wrote this. Of course it reads fluently *to you* — every concept was load-bearing in your head before the sentence landed on the page. That fluency is exactly the illusion Bjork named (Principle 6), now firing for the author instead of the reader. The audit below exists because your "this looks fine" feeling is not evidence. Run the checks even when nothing seems wrong; especially when nothing seems wrong.

**Parallel audit pattern**: the verification dimensions below are independent and read-only. If the platform supports parallel workers, assign one dimension to each worker — each gets the tutorial directory path and the one audit it owns. The lead thread collects findings and fixes. A serial single-thread audit takes 5-10× the wall time and is more likely to miss things because the auditor's attention dilutes across dimensions.

Suggested fan-out: voice / density / retrieval-separation / cross-chapter callbacks / discrimination coverage / citations. Each worker prompt is small ("scan these files for this one thing, report violations").

Before declaring done, audit against the checklist in [references/tutorial_template.md](references/tutorial_template.md). Specifically:

- **Density check**: open every chapter and confirm no >300-line stretch of prose without a diagram or worked example.
- **Retrieval separation check**: open every self-check section and confirm answers are in `<details>` blocks or a separate file, never inline.
- **Cross-chapter callback check**: every chapter after the first should textually reference at least one earlier concept by name. Grep for the earlier chapter's key terms in the current chapter; they should appear.
- **Discrimination check**: ≥1 prompt (ideally 3-5) that forces the reader to *choose between* approaches from ≥2 prior chapters. Lives in `03-self-check.html` (concept-focused) or `05-capstone.html` (hands-on).
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

  Per-chapter targets:
  - **Concept-focused (default)**: index 1 (concept map), 01 2-3, 02 2-3, 03-self-check 1 (e.g. gradient pyramid or discrimination scenario map). Total ≥7 for a full concept tutorial.
  - **Hands-on**: index 1, 01 2-3, 02 2-3, 03-practice 1-2 (e.g. data type flow + training progression), 04-pitfalls 1 (e.g. pitfall taxonomy), 05-capstone 1-2 (architecture + decision tree), 06-self-check 1 (e.g. gradient pyramid). Total ≥10 for a full hands-on tutorial.

  **Common rationalization to refuse**: "this chapter is pitfalls / question bank / hands-on, doesn't need diagrams." False — pitfalls can show causal links between failure modes; question banks can show difficulty gradient and chapter mapping; hands-on can show type flow and scaffold progression. *Every chapter has a figure-worthy shape; if you can't find one, the chapter outline isn't clear yet.*

- **SVG utility CSS presence check (hard, run as grep)**: every chapter file's `<style>` block must include the SVG utility classes — otherwise `<rect class="diagram-ink node-fill"/>` degrades to **solid black fill** (default SVG `fill` is black) when CSS is missing. From the tutorial dir:

  ```bash
  grep -L '\.diagram-ink' *.html
  ```

  Output should be empty (every file must include `.diagram-ink`). If a file is listed, paste the canonical SVG utility block (defined at the end of `references/layout-template.html`'s `<style>`) into its `<style>`.

  **Failure mode this prevents**: an early-drafted chapter without figures shipped with no SVG utility CSS; later iteration adds figures that pass coordinate math but render as opaque black rectangles in the deployed file. *Seen in real tutorials. Always grep before declaring done.*
- **Reader-drawing check (hard, not soft)**: at least one explicit "draw it yourself" prompt must exist in the tutorial — typically in the self-check chapter (or the capstone, if hands-on). Run `grep -nE "(自己画|亲手画|手画|画一画|画一张|sketch|Draw the)" *.html` from the tutorial dir. Zero hits means dual coding is still one-way; add the prompt before declaring done.
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

## What to read next

- [references/cognitive_principles.md](references/cognitive_principles.md) — the cognitive-science research behind the seven principles, with author + year citations. Read this if you find yourself wanting to bend a rule and need to know what the rule is protecting.
- [references/tutorial_template.md](references/tutorial_template.md) — chapter-by-chapter template with mandatory sections, examples, and a 30-item completeness checklist.
- [references/research_workflow.md](references/research_workflow.md) — current-docs + web orchestration, source evaluation, when each source wins.
- [references/diagram_guide.md](references/diagram_guide.md) — content-to-diagram-type matrix, Mermaid vs Excalidraw decision tree, Split-Attention rule examples.
