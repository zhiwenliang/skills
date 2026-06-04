# Tutorial Template (HTML, Cognitive-Science Aligned)

This template operationalizes the seven design principles in SKILL.md. Each section's requirements trace back to a specific principle — when in doubt about whether something is required, check the principle.

The base HTML layout (hand-written CSS + Prism CDN + inline SVG utilities) is defined once in **`references/layout-template.html`**. Copy it into every chapter file. This template document focuses on per-chapter **content structure**, not boilerplate.

**Structure is a scaffold, not a fixed file list** (see SKILL.md "Output format" → "File structure"): `index.html` first, `NN-self-check.html` last, topical chapters in between named for the subject and sized by Phase 3's concept dependency graph (5–6 chapters typical). Two independent axes:

- **Content mode — concept-focused (default) vs hands-on.** Concept-focused fills chapters with scenario walkthroughs (no required runnable code); its self-check carries the cross-chapter discrimination scenarios (capstone surrogate). Hands-on adds a worked→partial→open progression (`0N-practice.html`), a `0N-pitfalls.html`, and a `0N-capstone.html` — the capstone carries discrimination, so self-check leans toward recall. Use the sections labeled "(hands-on extension)" only in hands-on mode.
- **Chapter decomposition — how many chapters.** `01-concepts` + `02-principles` anchor most tutorials; the rest of the dependency graph becomes topical chapters (`03-routing`, `04-replication`, …), each built with the "0N-<topic>.html — 主题章" template below. A fast-moving subject may add an optional `0N-frontier.html` before self-check (see the frontier-chapter template below).
  - **Quick primer** (≈30 min): collapse to a single `index.html` with `<h2>` per section.
  - **Deep dive**: split an anchor further (e.g., `01-concepts-core-model.html`, `01-concepts-data-flow.html`).

---

## Reusable HTML snippets (use these, don't reinvent)

### Chapter shell (the full `<article>` skeleton; paste into the body of `references/layout-template.html`)

```html
<article>

  <header class="chapter-opener">
    <p class="chapter-label">Chapter {{NN}}</p>
    <h1>{{chapter title}}</h1>
    <p class="recap">上一章建立了 {{prior schema}}——这章 {{what this chapter does}}。</p>
  </header>

  <section class="schema-panel">
    <p class="label">本章你将建立的 schema</p>
    <ul>
      <li>{{schema item 1}}</li>
      <li>{{schema item 2}}</li>
      <li>{{schema item 3}}</li>
    </ul>
  </section>

  <!-- Optional: a chapter-level architecture context figure goes here
       (Pattern 1 from diagram_guide.md) -->

  <!-- §1.1 ... §1.N content sections — see "Per-section content" snippets below -->

  <section class="self-check" id="self-check">
    <h2><span class="num">§</span><span>本章 self-check</span></h2>
    <p style="color: var(--ink-soft); font-style: italic; font-size: 15px;">
      先合上教程，把你能想到的答案写在纸上或编辑器里。
      写完再点开答案对照——直接点开等于把这一节当再读一遍。
    </p>
    <ol>
      <li>{{question 1}}</li>
      <li>{{question 2}}</li>
      <li>{{question 3 — at least 1 must be a design-level question, not just API}}</li>
    </ol>
    <details>
      <summary>答案（先做完再展开）</summary>
      <ol>
        <li>{{answer 1}}</li>
        <li>{{answer 2}}</li>
        <li>{{answer 3}}</li>
      </ol>
    </details>
  </section>

  <div class="challenge">
    <span class="label">进阶挑战 · 刚好够不着</span>
    <h3>{{title of the challenge}}</h3>
    <p>{{problem description that's slightly out of reach}}</p>
    <details>
      <summary>提示（卡住再展开）</summary>
      <p>{{a nudge, not a full answer}}</p>
    </details>
  </div>

  <footer class="references">
    <h3>本章参考</h3>
    <ul>
      <li><a href="{{url}}">{{source name}}</a>（官方）</li>
      <li><a href="{{url}}">{{source name}}</a>（设计文档 / 维护者博客）</li>
    </ul>
  </footer>

  <nav class="chapter-nav" aria-label="章节导航">
    <a href="0X-prev.html" class="prev">
      <span class="label">← 上一章</span>
      <span class="title">0X · {{prev title}}</span>
    </a>
    <a href="0Y-next.html" class="next">
      <span class="label">下一章 →</span>
      <span class="title">0Y · {{next title}}</span>
    </a>
  </nav>

</article>
```

### Per-section content: concept definition + worked example + observation

```html
<h2 id="s11"><span class="num">1.1</span><span>{{Concept name}}</span></h2>

<p class="one-liner">{{≤30 字的一句话定义。CSS 不强制 italic — 通过 `font-weight: 500` 和左边线区分于普通段落}}</p>

<div class="rationale">
  <span class="label">为什么需要它</span>
  <p>{{the specific problem this concept solves; what manual work would the engineer do without it}}</p>
</div>

<div class="callout insight">
  <span class="label">类比 · 带边界声明</span>
  <p>{{X 像 Y，但...类比失效之处...}}</p>
</div>
```

### Code block (with header + filename + copy button — Prism handles tokens)

```html
<div class="code-block">
  <div class="header">
    <span class="filename">{{snippet name}}.py</span>
    <span class="lang">Python</span>
    <button class="copy" data-copy-target="{{unique-id}}">复制</button>
  </div>
<pre id="{{unique-id}}"><code class="language-python"># 1 │ 完整可运行代码，HTML-escape &lt; &gt; &amp; if present
from dataclasses import dataclass

@dataclass
class ParsedInput:
    value: int

def parse(raw: str) -&gt; ParsedInput:
    return ParsedInput(value=int(raw))

print(parse("5").value)  # 5
</code></pre>
</div>
```

**Don't manually wrap tokens in `<span>`** — Prism (loaded via CDN in `layout-template.html`) handles syntax tokens automatically. You only need `class="language-python"` (or `language-bash`, `language-typescript`, etc.).

**HTML-escape inside `<pre><code>`**: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`. Otherwise the browser interprets `<script>` as a real tag.

### Predictive question + hidden answer

```html
<div class="predict">
  <span class="question-label">想一想</span>
  <p>{{the question — what will this print? what type comes out? when does it break?}}</p>
  <details>
    <summary>展开答案（先停 10 秒再点）</summary>
    <p>{{the answer}}</p>
    <p>{{the design insight this question pointed at}}</p>
  </details>
</div>
```

### Diagram (hand-drawn SVG — full templates in `references/diagram_guide.md`)

```html
<figure>
  <svg viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg" role="img"
       aria-label="{{what this diagram shows}}">
    <defs>
      <marker id="arrow-ink" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#0A0A0A"/>
      </marker>
    </defs>
    <!-- use .diagram-ink / .diagram-accent / .node-fill / .node-label etc. -->
    <!-- 5 ready-to-adapt patterns in diagram_guide.md -->
  </svg>
  <figcaption><span class="fig-num">图 N.M</span>{{one-line claim about the figure}}.
    <strong>注意</strong>：{{the ONE thing reader should notice}}.</figcaption>
</figure>
```

**Mandatory self-check rules before shipping a diagram** (see diagram_guide.md for full):
1. Text doesn't overflow nodes or viewBox
2. Connector lines do not cross other connector lines
3. Arrow endpoints sit on box EDGE or CORNER, never inside
4. Multi-arrow diagrams use consistent stop-policy across all directions

Verify visually with rendered screenshots — mental verification misses subtle issues.

### Callouts (4 types — pick the one that matches semantic)

```html
<div class="callout warning">
  <span class="label">陷阱</span>
  <p>{{specific failure mode the reader will hit if they ignore this}}</p>
</div>

<div class="callout tip">
  <span class="label">提示</span>
  <p>{{a small operational shortcut that saves time}}</p>
</div>

<div class="callout example">
  <span class="label">例</span>
  <p>{{a concrete instance making an abstract point land}}</p>
</div>

<div class="callout insight">
  <span class="label">洞察 · {{topic}}</span>
  <p>{{the load-bearing observation — pattern names, design tradeoffs, why-not-the-obvious}}</p>
</div>
```

### Comparison table (tradeoffs / 备选方案 / 痛点→设计回应)

```html
<table class="compare-table">
  <caption>表 N.M · {{caption}}</caption>
  <thead>
    <tr><th>方案</th><th>优势</th><th>为什么没选</th></tr>
  </thead>
  <tbody>
    <tr><td>{{alternative A}}</td><td>{{strength}}</td><td>{{why rejected}}</td></tr>
    <tr><td>{{alternative B}}</td><td>{{strength}}</td><td>{{why rejected}}</td></tr>
    <tr class="selected"><td>{{chosen approach}}</td><td>{{strength}}</td><td>选中</td></tr>
  </tbody>
</table>
```

`<tr class="selected">` highlights the chosen row with vermilion-soft bg and a ▸ marker.

### Reader-drawing prompt (mandatory ≥1 per tutorial — see Principle 3)

```html
<div class="callout example">
  <span class="label">亲手画一张图</span>
  <p>合上教程，在纸上或 Excalidraw 里画 {{X}}——只画 {{N}} 个 {{element type}} 就行。
     画完回到 §M 对照——你画的图里有没有 {{key thing to spot in your own diagram}}？</p>
</div>
```

Typical placement: at a key point in the final self-check chapter (`03-self-check` for concept-focused, `06-self-check` for hands-on); or in the capstone (hands-on only).

---

## index.html — 入口页

The first 60 seconds determine whether the reader stays. Answers three questions: *is this for me?*, *what's the shape of what I'm about to learn?*, *where do I start?*

Required sections (in order):

| Section | Element | Content |
|---|---|---|
| 头部信息 | `<header>` | 一句话定位、基于版本、阅读时间、代码验证状态 |
| 适合谁 | `<section>` | 3 条前置知识，具体到能力（"能调试 Python async" not "熟悉 Python"） |
| 不适合谁 | `<section>` | 给更基础/更资深读者的他山资源链接 |
| 读完之后你能做到什么 | `<section>` | 一段开头放 **Insight Check 的 USP 句**（来自 SKILL.md Phase 5：5-year engineer 能讲出而文档讲不出的那句话），verbatim 放在这里。后接 3-5 条**可验证**能力（动词开头，不写"理解 X"） |
| 一句话本质 | `<section class="schema-panel">` with `<p class="label">一句话本质</p>` + `<p>{{threshold concept sentence}}</p>` | Phase 3 锁定的 **threshold concept**（一句话）。Uses `.schema-panel` (thick black left border + mono uppercase label) — visually distinct from `.callout warning` (used by 流畅感警告) and the neutral `.callout` variants, so the core idea reads as a structural anchor rather than a tip-style aside |
| 现状速览（截至 <date>） | `<div class="callout">` 或短 `<section>` | Phase 3 的 frontier framing：一句话点明什么稳定、什么在快速变化、什么已被取代，**带日期**。让读者知道哪些是定论、哪些还在动，避免学到已被取代的旧做法。主题确实冻结时写一句"成熟稳定、近年无重大变化"——把"无变化"作为一个结论写出来，而不是省略。快速演进的主题（框架 / AI·ML / 年轻协议）尤其不能省 |
| 假设说明 | `<section>` | 仅非交互模式生成时填——列出 AI 做的假设 |
| 流畅感警告 | `.callout warning` | Principle 6：点名"我读得很顺/我做题很快/我没卡壳"三大假象 |
| 概念地图 | `<figure>` + 手画 SVG | 5-10 节点，边带标签。`<figcaption>` 指出 3 件读者要注意的事。详见 diagram_guide.md 的 Pattern 5 |
| 学习路径 | `<nav class="learning-path">` 顶部 breadcrumb | 顶部 breadcrumb 即学习路径（current 用朱红色 + bold 高亮，无下划线）。不需要单独 SVG，每章自然展示 |
| 学习路径建议 | `<ul>` | 至少 3 个分场景路径。**Concept-focused**：`只想理解` / `做选型` / `带读他人代码` 之类不依赖 `03-practice` 的场景。**Hands-on**：可以含 `动手写` 指向 `03-practice.html`。不要承诺当前模式不存在的章节 |
| 目录 | `<nav><ul>` | `<a href="01-concepts.html">` 链每个章节文件。**Concept-focused**：3 个链接（01-concepts / 02-principles / 03-self-check；index 本身不在目录里）。**Hands-on**：6 个链接（01..06；同样不含 index）。文件总数 = 链接数 + 1（index）|
| 学完之后 | `<section>` | 3-5 个下一步主题，每个一句话说明"它在你 schema 上加了什么" |
| 参考资料 | `<footer>` | 官方文档（必填）+ 2-3 设计文档/RFC + 2-3 高质量博客 |
| 相关教程（多教程库时）| `<section class="related-tutorials">` | **仅当同级目录存在兄弟教程时**：链 2-4 篇已在磁盘上验证存在的前置/延伸教程（见 SKILL.md「Building a knowledge library」）。一次性教程跳过此段 |

**index.html 自检**：
- [ ] 60 秒能判断是否适合自己？
- [ ] 适合谁 / 不适合谁 / 能做到什么 三段都有？
- [ ] `读完之后你能做到什么` 段首是 **Insight Check 的 USP 句**（来自 SKILL.md Phase 5）？
- [ ] **一句话本质**段存在，包含 Phase 3 锁定的 threshold concept（一句话）？
- [ ] **现状速览**段存在并带日期（主题确实冻结则写明"成熟稳定、近年无重大变化"，不留空）？
- [ ] 概念地图嵌入了，`<figcaption>` 是导读（不是描述图）？
- [ ] 学习路径 breadcrumb 嵌入并高亮当前章节？
- [ ] 流畅感警告嵌入了？
- [ ] 至少 3 个分场景路径选项（concept-focused 不含"动手写"）？

---

### 相关教程 block（multi-tutorial libraries only — 见 SKILL.md "Building a knowledge library"）

接在 `index.html` 的 参考资料 之后，**仅当**同级存在兄弟教程且已 `ls ../<sibling>/index.html` 验证：

```html
<section class="related-tutorials">
  <h2><span class="num">↗</span><span>相关教程</span></h2>
  <p class="label">前置（先学这些更顺）</p>
  <ul>
    <li><a href="../langchain/index.html">LangChain</a> —— {{它在你 schema 上铺了什么}}</li>
  </ul>
  <p class="label">延伸（学完往这走）</p>
  <ul>
    <li><a href="../multi-agent-patterns/index.html">Multi-Agent Patterns</a> —— {{下一步加什么}}</li>
  </ul>
</section>
```

只链已验证存在的兄弟；某个分组（前置 / 延伸）没有真实条目就整组省略——不要凑数。

---

## hub index.html — 知识库入口（multi-tutorial）

知识库根目录的 `index.html`（在各教程文件夹的上一层）。它不是教程，是教程的**主题目录**。复制布局 `<style>` 让它与整套视觉一致，然后：

```html
<article>
  <header><h1>学习库 · Learning</h1>
    <p class="one-liner">{{N}} 篇认知科学对齐的技术教程，按主题聚类。</p></header>

  <section class="theme-cluster">
    <h2>Agent / LLM 应用</h2>
    <ul class="tutorial-cards">
      <li><a href="langchain/index.html"><strong>LangChain</strong></a>
          <span class="schema">{{一句话本质，裁剪}}</span></li>
      <li><a href="langgraph/index.html"><strong>LangGraph</strong></a>
          <span class="schema">{{...}}</span></li>
    </ul>
  </section>

  <section class="theme-cluster">
    <h2>向量 / 检索</h2>
    <ul class="tutorial-cards">...</ul>
  </section>
  <!-- 数据存储 / 消息·中间件 / Web·前端·语言 / 工程基础 ... -->
</article>
```

**hub 自检**：
- [ ] 按主题聚类（不是字母序）？
- [ ] 每篇配一句话 schema 描述（不是裸链接）？
- [ ] 已有 hub 时是**增量更新**（保留旧条目 + 新增一张卡），不是整页重写？
- [ ] 每个链接的目标 `<tech>/index.html` 实际存在？

---

## 01-concepts.html — 核心概念

**目的**（principle 1 + 4）：教读者本技术的**词汇表**，并通过 worked example 在每个概念上建立 schema 锚点。

每个概念用如下结构（4-8 个概念为宜，超过 8 个拆章）：

```html
<section>
  <h2>概念 1：{{name}}</h2>
  <p><strong>一句话定义</strong>（≤30 字）：{{minimal form}}</p>
  <p><strong>为什么需要它</strong>：{{the specific problem it solves; what manual work without it}}</p>
  <p><strong>底层机制（比文档深一层）</strong>：{{how it works one level below where the docs stop — 例如"X 通过 Z 实现 Y，所以代价是 W、在 V 时失效"，而不是复述文档的"X 做 Y"。这是 depth lens 的落点}}</p>
  <p><strong>类比</strong>：{{X 像 Y，但... — must indicate where analogy breaks}}</p>

  <h3>Worked example（完整可运行）</h3>
  <pre><code class="language-python">{{escaped code with concept-mapping comments}}</code></pre>
  <p><strong>运行</strong>：<code>{{full command}}</code></p>
  <p><strong>预期输出</strong>：</p>
  <pre><code>{{exact output}}</code></pre>

  <h3>逐行解读（代码 → 概念，不是代码 → 语法）</h3>
  <ul>
    <li>第 N 行：体现 {{concept facet 1}}。这就是定义中"X"的含义。</li>
    <li>第 M 行：{{...}}</li>
  </ul>

  <!-- predictive question + details with answer -->

  <p><strong>与下一个概念的关系</strong>：{{explicit teaser}}</p>
</section>
```

**01 章自检**：
- [ ] 概念数量 ≤ 8？
- [ ] 每个概念都有 worked example？
- [ ] 每个 worked example 都有"逐行 → 概念"的映射？
- [ ] 每个核心概念都讲到"比文档深一层"的机制（how/why），而不是复述文档定义（depth lens；详见 SKILL.md Phase 5 Mechanism-depth check）？
- [ ] 至少 2 处预测式提问（`<details>` 内）？
- [ ] 概念依赖顺序：后面的概念只引用前面定义过的？
- [ ] 章末 self-check 答案在 `<details>` 里？
- [ ] 有"刚好够不着"的进阶挑战？

---

## 02-principles.html — 工作原理与设计权衡

**目的**（principle 4 + 6）：把读者从"会用"带到"理解"。这是大多数教程缺失的章节。

必填结构：

| 区块 | 形式 | 要求 |
|---|---|---|
| 整体架构图 | `<figure>` + hand-coded SVG | 组件、边界、数据流。`<figcaption>` 指出 3 件要注意的事——边界在哪、热路径在哪、数据如何流 |
| 每个机制（3-5 个）| `<section>` | 每节包含：① 一段话说运行方式 ② **备选方案对比表** ③ "带来的代价"段 ④ 预测式提问 + `<details>` 答案 |
| 跨概念综合 | `<section>` | Principle 7 interleaving。给具体场景，让读者梳理多个机制如何协同 |
| self-check | `<section>` + `<details>` | 含至少 1 道跨机制综合题 |

**备选方案表是本章核心**。如果你写不出至少 2 个被放弃的方案，说明你还没真正理解为什么这么设计——回去再研究。

**例外：单一特性 primer 可用「痛点 → 设计回应」替代「备选方案表」**。当主题是一个具体特性（如某个管道运算符、一个 CLI 标志、一个库方法），"放弃的方案" 常常是 "没有这个特性时的手写胶水"——逐条列出来比假想"备选方案"更接近真实：

```html
<table>
  <thead>
    <tr><th>没有这个特性时，工程师手动需要做什么</th><th>这个特性如何回应</th><th>副作用 / 代价</th></tr>
  </thead>
  <tbody>
    <tr><td>{{痛点 1}}</td><td>{{回应}}</td><td>{{代价}}</td></tr>
  </tbody>
</table>
```

要求依然是讲 **why**，不是 API tour。

**02 章自检**：
- [ ] 至少一张架构图？
- [ ] 每个机制有"备选方案对比表"或"痛点 → 设计回应"表？
- [ ] 每个机制有"带来的代价"段？
- [ ] 至少一个跨概念综合题？

---

## 0N-<topic>.html — 主题章（topical chapter）

中间章（`01-concepts` / `02-principles` 之后、self-check 之前）按**概念依赖图**切分，文件名取自主题（`03-routing` / `04-replication` / `03-attention`），不用通用槽位名。每个主题章**按 `02-principles` 的结构写**，scope 收到它那个子主题：

- 章首 `recap`（回忆上一章）+ `schema-panel`（本章建立什么）
- 该子主题的核心机制——讲到"比文档深一层"（how / why / 代价 / 何时失效），不是 API tour
- 备选方案对比表 或 痛点→设计回应表
- ≥1 张**本章专属** figure（不是复用 index 的概念地图）
- 预测式提问 + `<details>` 答案
- 章末 self-check + "刚好够不着"挑战 + 本章参考

满足 Principle 7：本章例子复用前面章定义过的概念，而不是只用本章新东西。

---

## 0N-frontier.html — 现状 / 前沿章（optional, recognized slot）

> Optional。当一个快速演进的主题（多数框架、所有 AI/ML、年轻协议）已经撑不下 `index.html` 里一段话的 `现状速览` 时，加这一章。主题确实冻结就别加——但要在 index 的现状速览写一句"成熟稳定、近年无重大变化"。本章是 index frontier framing 的**展开 + 带日期**，不是复制。

**目的**（depth · currency lens；SKILL.md Phase 5 Currency check）：把 Phase 2 的 frontier map 落成一章可教学内容——读者读完知道哪些是定论、哪些还在动、哪些别再学。

必填结构：

| 区块 | 形式 | 要求 |
|---|---|---|
| 现状全景图 | `<figure>` + hand-coded SVG | 时间轴 / 三态分区图（stable · in-flux · superseded），节点带日期 |
| 稳定核心 | `<section>` | 已成定论、放心学的部分。点明"自 <version/year> 稳定" |
| 正在变化（带日期）| `<section>` | 最近 6–12 月在动的部分，每条带 `截至 <date>`，配一手来源（release notes / RFC / 近 12 月论文或博客）|
| 已被取代 | `<section>` + 对照表 | 旧做法 → 新做法，点名让读者别再学旧的 |
| 往哪走 | `<section>` | 克制的前瞻：方向性判断，明确标"这是判断不是定论"，不炒作 |
| self-check | `<section>` + `<details>` | ≥1 道"X 现在还该用吗 / 该换成哪个"的辨别题 |

**反模式**：写成 changelog 流水账。重点是 why 这些变化发生、对读者**选型决策**意味着什么，不是罗列版本号。

---

## 03-practice.html — 上手实操（hands-on extension only）

> Skip in concept-focused mode. In concept-focused tutorials, worked examples already live in `01-concepts.html` as scenario walkthroughs; the practice scaffold below is only for tutorials that the user has explicitly asked to be code-progression-heavy.

**目的**（principle 4 — worked example scaffold）：worked → partial → exercise 三阶。

必填结构：

| 阶段 | 形式 | 要求 |
|---|---|---|
| 环境准备 | `<section>` + `<pre><code class="language-bash">` | 最小依赖、版本号、常见环境失败模式预防 |
| 示例 1：Hello World | `<section>` + 完整代码 | ≤ 5 分钟跑通。带"逐行映射回 01 章概念" |
| 示例 2：Partial example | `<section>` + 框架代码 + TODO | 留 1-2 个**关键决策点**让读者填（指向 01 章的 schema 选择），不是无关填空。`<details>` 给参考答案 + 决策路径 |
| 示例 3：开放练习 | `<section>` | 贴近真实工作。要求用到 01 章 N 个概念 + 02 章某权衡。`<details>` 给参考实现 + 关键决策说明 |
| self-check | `<section>` + `<details>` | 动手层面的题 |

**03 章自检**：
- [ ] 至少 1 个完整 worked example、1 个 partial example、1 个开放练习？
- [ ] 每个示例都明确指回 01 章的具体概念？
- [ ] partial example 的留白是"关键决策点"，不是无关填空？
- [ ] 所有代码都跑过（或明确标"未本地验证"）？

---

## 04-pitfalls.html — 常见陷阱与最佳实践（hands-on extension only）

> Skip in concept-focused mode. Concept-focused tutorials surface common misconceptions inline (within `01-concepts.html` and `02-principles.html`) rather than in a dedicated chapter.

**注意**：文件名可以叫 04-pitfalls（结构性标签），但**散文里用「陷阱 / 失败模式 / 常见错误」**，不要用「坑 / 踩坑」（voice 规则）。

```html
<section>
  <h2>陷阱 1：{{specific name, 不要写"性能问题"这种模糊标题}}</h2>
  <p><strong>症状</strong>：{{report/exception/observed behavior}}</p>
  <p><strong>根因</strong>：{{回到原理。通常违反了 02 章的 <a href="02-principles.html#mechanism-X">机制 X</a>}}</p>
  <h3>修复</h3>
  <pre><code class="language-python"># 错误写法
...
# 正确写法
...</code></pre>
  <p><strong>如何避免再次触发</strong>：{{设计层面的建议}}</p>
</section>
```

至少 5 个陷阱。加 3-5 个反模式 + "什么时候不要用这个技术"段（诚实回答）。

---

## 05-capstone.html — 综合项目（hands-on extension only）

> Skip in concept-focused mode. The principle-7 discrimination requirement is satisfied by the scenario questions in `03-self-check.html` (see below) — that is the capstone surrogate. **Only write this file** when the tutorial is hands-on; for hands-on tutorials it is mandatory.

**目的**：interleaving + discrimination。读者必须**判别**：这里该用第 1 章的 X 还是第 2 章的 Y？

```html
<section>
  <h2>项目背景</h2>
  <p>{{具体场景，如"为内部工具构建带权限过滤的查询服务"}}</p>
</section>

<section>
  <h2>设计任务（不是步骤实现，是判别决策）</h2>
  <table>
    <thead>
      <tr><th>决策点</th><th>备选</th><th>你应该选哪个？为什么？</th></tr>
    </thead>
    <tbody>
      <tr><td>检索方式</td><td>03 章的 {{方案 A}} / 04 章的 {{方案 B}}</td><td>这个场景下选？</td></tr>
      <tr><td>错误处理</td><td>02 章的 {{策略 X}} / 04 章的 {{策略 Y}}</td><td>...</td></tr>
    </tbody>
  </table>
  <p>必须包含至少 3 个判别点，每个判别点对应不同章节。</p>
</section>

<section>
  <h2>自己实现</h2>
  <p>{{场景 + 验收标准。不给参考实现先，让读者自己写}}</p>
  <h3>验收 checklist</h3>
  <ul><li>{{可观测的行为 1}}</li><li>{{可观测的行为 2}}</li></ul>
</section>

<details>
  <summary>参考实现（写完自己版本再展开）</summary>
  <pre><code class="language-python">{{完整代码 + 决策说明：为什么选 X 不选 Y}}</code></pre>
</details>

<!-- mandatory: at least one reader-drawing prompt here or in 06 -->
<div class="callout example">
  <strong>亲手画一张图</strong>：把你的实现链结构画出来——只画 3 个核心节点。
  对照本章的架构表，你画的图里有没有 {{key thing}}？
</div>

<section>
  <h2>反思问题</h2>
  <ol>
    <li>你的实现里，哪个决策最难做？回去看哪一章帮到了你？</li>
    <li>如果场景变成 {{slightly different scenario}}，你的哪些决策需要改？</li>
  </ol>
</section>
```

---

## 自测题库（教程最后一章）

**文件名**：始终是最后一章，命名 `NN-self-check.html`（NN = 章号）。最小 concept-focused 是 `03-self-check.html`，加了主题章就顺延（`05-` / `07-` …）；hands-on 默认 `06-self-check.html`。**后缀必须是 `-self-check`**，不要用 `discrimination` 之类别名——Phase 5 的校验脚本按文件名找它（实测有教程漂成 `05-discrimination.html` 导致漏检）。

**目的**（principle 5 testing effect + principle 7 transfer）：教程的最后一章，无论哪种模式。两种模式下自测的"重心"不同：

- **Concept-focused**: 应用判别层（跨 01 + 02 章的场景题）**承担 capstone 的 discrimination 职责**，必须 ≥3 道，否则没有 transfer 训练。
- **Hands-on**: 重 discrimination 已经由 `05-capstone.html` 承担，本章应用判别层 ≥1-2 道做强化即可，重心在 recall。

```html
<article>
  <header><h1>{{NN}} - 自测题库</h1>
    <p>总题目数：~15-20。三层梯度。</p></header>

  <section>
    <h2>概念层（对应 01 章）</h2>
    <ol>
      <li>{{question}} <small><a href="01-concepts.html#xxx">提示：参考 01 章 §xxx</a></small></li>
    </ol>
  </section>

  <section>
    <h2>原理层（对应 02 章）</h2>
    <ol>...</ol>
  </section>

  <section>
    <h2>应用判别层
      <small>concept-focused: 综合 01 + 02 ≥3 道；hands-on: 综合 03 + 04 + 05 ≥1-2 道</small>
    </h2>
    <ol>
      <li>在 {{场景 X}} 下，你应该用 {{方案 Y}} 还是 {{方案 Z}}？为什么？</li>
      <li>...</li>
    </ol>
  </section>

  <!-- Concept-focused 模式：本章是 reader-drawing prompt 的唯一着陆点（hands-on 模式也可放 capstone）-->
  <div class="callout example">
    <span class="label">亲手画一张图</span>
    <p>合上教程，在纸上画 {{key structure}}。
       画完回到 §X 对照——你画的图里有没有 {{key thing}}？</p>
  </div>

  <details>
    <summary>答案（先做完再展开）</summary>
    <h3>概念层</h3>
    <ol>...</ol>
    <h3>原理层</h3>
    <ol>...</ol>
    <h3>应用判别层</h3>
    <ol>...</ol>
  </details>
</article>
```

所有答案集中在文末一个 `<details>` 里。读者克制住"瞄一眼"的冲动才有意义。

**自测章自检**：
- [ ] 三层梯度都有：概念层 / 原理层 / 应用判别层？
- [ ] Concept-focused: 应用判别层 ≥3 道跨 01+02 场景题（capstone 替代，硬约束）？
- [ ] Hands-on: 应用判别层 ≥1-2 道（主 discrimination 在 capstone）？
- [ ] Concept-focused: 含 ≥1 处读者绘图提示（本章是唯一着陆点）？
- [ ] 所有答案集中在文末 `<details>` 内？

---

## 全教程完整性自检（30 项 checklist）

写完整份教程后过一遍。**不通过的项必须修，不是"以后再说"**。

### 结构（principle 1 + 2）
- [ ] index.html 60 秒能判断是否适合自己
- [ ] 目标读者 / 不适合谁 / 能做到什么 三段都写了
- [ ] 概念地图在 index.html 出现
- [ ] 学习路径 breadcrumb 在 index.html 出现，并在各章节高亮当前位置
- [ ] 流畅感警告（principle 6）出现在 index.html
- [ ] 每章 `<header>` 有"上一章建立了 X"的回顾句
- [ ] 每章 `<header>` 后有"本章你将建立的 schema"清单

### 视觉（principle 3）

**硬性条目**（每条都要 grep 通过，不要"以后再说"）：

- [ ] **每章 ≥1 张 `<figure>`**（含 SVG 或导入图） —— 用 SKILL.md Phase 5 的 `find ... grep -cE '<figure[ >]'` 命令检查（能匹配带 attribute 的 `<figure class="..."> / <figure id="...">`，旧的 `grep -c '<figure>'` 会漏）。`code-block` 和 `compare-table` 不算 figure —— 它们各自有重要作用，但**承载不了 dual coding 的空间关系编码**。
- [ ] **每个内容章 ≥1 张 figure（按章判定，不是按范式总数）**，概念/机制重的章 2-3 张。典型：index 1 张概念地图、`01-concepts` 2-3、`02-principles` 2-3、每个主题章 ≥1、self-check 1 张梯度图；hands-on 的 practice/pitfalls/capstone 各 ≥1；frontier 章 1 张现状图。floor 随章数自动放大（4 章 ≥5-7、6 章 ≥8-10）。Quick primer 例外：单文件 ≥3 张。
- [ ] 时序 / 状态 / 流程 / 关系都配了对应类型的图（参考 diagram_guide.md 的 5 patterns）
- [ ] 标签直接在图元素上（无"见图 X 中的 A"跨距离引用）
- [ ] 没有装饰性图（每张图都有信息增量）
- [ ] **至少 1 处让读者亲手画图**（concept-focused: 在 `03-self-check`；hands-on: 在 capstone 或 `06-self-check`）

**反陷阱**（AI writer 最常用的逃避路径）：

- ❌ "这一章是 pitfalls / 题库 / 实操，没必要画图" —— 错。陷阱章可以画"陷阱因果分类图"；题库可以画"梯度金字塔"；实操可以画"数据类型流"+"三阶训练进度"。**没有"不需要图"的章节，只有"作者没想清楚画什么"的章节**。
- ❌ "代码块 / 表格已经够多了，可以替代图" —— 错。code block 是顺序读的文字；compare-table 是结构化文字；都不是 dual coding 想买的"空间关系并行编码"。三者并存，缺一不可。
- ❌ "概念地图 + 学习路径已经有图了，就够了" —— 错。这两个是 index 章的图；其他每章还需要本章专属的图。

### 例题（principle 4）
- [ ] 01 每个概念有 worked example（concept-focused: 场景走查；hands-on: 完整可运行代码）
- [ ] *Hands-on only*: 03-practice 有完整 worked → partial → 开放 三阶
- [ ] *Hands-on only*: partial example 的留白是关键决策点
- [ ] *Hands-on only*: 例题:练习比例匹配目标读者水平

### 主动回忆（principle 5）
- [ ] 每章末有 self-check（`<details>` 包答案）
- [ ] 答案在 `<details>` 块或独立段落（不在题目正下方）
- [ ] 全文至少 3 处预测式提问
- [ ] 最终自测章题库存在（`03-self-check` 或 `06-self-check`）

### 难度（principle 6）
- [ ] 每章末有"刚好够不着"的进阶挑战
- [ ] 同一概念至少 2-3 种情境的例子
- [ ] 没有"这很简单 / 显然 / just / obviously"

### 长程（principle 7）
- [ ] 后续章节例子复用了前面的概念
- [ ] **Discrimination challenge 存在**（concept-focused: `03-self-check` 应用判别层 ≥3 道跨 01+02 场景题 — capstone 替代；hands-on: `05-capstone` 含 ≥3 个跨章判别决策点）
- [ ] 自测章应用判别层（两种模式都要，concept-focused 是主战场，hands-on 是强化）

### 外在负荷（principle 3 + extraneous load）
- [ ] 术语首次出现就地解释
- [ ] 代码块都能复制粘贴（无截断、无 "..." 省略）
- [ ] HTML 已 escape `<` `>` `&` inside `<pre><code>` blocks
- [ ] 没有"参见第 X 章某节"造成的跳跃阅读

### 语调（权威词表见 SKILL.md **Forbidden phrases** 表；grep 见 Phase 5；HTML 标签由 grader 自动 strip）

**不在此重复词表**——SKILL.md 的 Forbidden phrases 表是唯一信源，Phase 5 的 voice grep 是它的可执行镜像（改表必同步改 grep）。本 checklist 只逐项过**类别**，具体词条去表里查：

- [ ] cheerleader 类（`让我们` / `我们一起` / `let's` …）—— 0 命中
- [ ] filler 过渡（`接下来` / `我们来看` …）—— 0 命中
- [ ] hedging（`可能` / `也许` / `应该是` …）—— 0 命中（**例外**：描述被讲对象本身概率性的，见 SKILL.md「When to break the rules」）
- [ ] anesthetic（`这很简单` / `显然` / `just` …）—— 0 命中
- [ ] colloquial slang（散文里的 `坑` / `踩坑` / `撸代码` …）—— 0 命中
- [ ] AI 套话（`在当今...领域` / `本教程将带你` / `踏上...之旅` …）—— 0 命中
- [ ] 第一人称 `我` / `我们` 只剩三类合法用法（作者认识论说明、对读者动作邀请、流畅感三标签）
- [ ] 智能引号：Mac 把直引号换成 U+2019 弯引号；Phase 5 grep 已枚举两种形态，人工 review 也留意


### 完整性
- [ ] 每章都有"参考资料 / Further reading"
- [ ] 推荐了 3-5 个下一步学习主题
- [ ] 代码已运行（或明确标"未本地验证"）
- [ ] 每个 .html 文件都包含 SKILL.md 定义的 layout（Google Fonts + Prism CDN + `<style>` 块）
- [ ] **每个 .html 文件的 `<style>` 块都包含 SVG utility CSS 全套** —— `.diagram-ink`、`.diagram-accent`、`.diagram-soft`、`.node-fill`、`.node-fill-accent`、`.node-label`、`.node-label-accent`、`.edge-label`、`.branch-label`、`figure` + `figcaption` + `figcaption .fig-num`。<br/>失败模式：早期写的"无图"章节漏了这些 class；后期加图时所有 `<rect class="diagram-ink node-fill"/>` 都退化成纯黑填充。<br/>**grep 验证**：`grep -L '\.diagram-ink' *.html` —— 输出应为空（每个文件都要含）。
- [ ] 如果用户提供了方法论来源或内部学习理论文档，`Further reading` 链接了已验证存在的路径或 URL；没有用户提供来源时不要虚构本地路径

### 深度与时效（depth + currency）
- [ ] 每个核心概念都"比文档深一层"——讲了机制（how / why、代价、何时失效），不是复述文档的"是什么"（Marton 的 surface vs deep；SKILL.md Phase 5 Mechanism-depth check）
- [ ] index.html 有 **现状速览** 且带日期；快速演进的主题（框架 / AI·ML / 年轻协议）写明了什么稳定、什么在变、什么已被取代（SKILL.md Phase 5 Currency check）
- [ ] 对快速演进的主题，承重来源是近期的（>2 年的来源已剔除，除非生态成熟稳定）；正文在该标注时点出了"截至 <date>"
