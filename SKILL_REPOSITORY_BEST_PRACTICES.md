# Skill 仓库最佳实践

这份文档总结 Cursor Agent Skills、Anthropic/Claude Skills、Agent Skills 开放规范、Microsoft Agent Framework，以及常见公开 skill 仓库的共性做法。目标是把 skill 仓库维护成可复用、可审查、可版本化的能力库，而不是零散提示词集合。

## 核心定位

Skill 是面向 agent 的可执行工作流包。一个好的 skill 让 agent 在特定任务中更稳定地遵循流程、读取必要背景、运行确定性脚本，并留下可验证结果。

优先把 skill 写成流程，而不是百科：

- 好：`code-review` 指定审查顺序、输出格式、证据要求和验证清单。
- 差：`code-review` 只罗列“关注质量、安全、可维护性”等泛泛建议。

## 推荐仓库结构

独立 skill 仓库建议使用一个顶层 `skills/` 目录，每个 skill 一个目录：

```text
skills/
  skill-name/
    SKILL.md
    references/
      reference.md
    examples/
      example.md
    scripts/
      validate.py
```

项目内使用时，可根据目标 agent 放在对应目录：

- Cursor: `.agents/skills/`、`.cursor/skills/`、`~/.agents/skills/`、`~/.cursor/skills/`
- Claude Code: `.claude/skills/`、`~/.claude/skills/`
- Codex: `.codex/skills/`、`~/.codex/skills/`

Cursor 支持递归发现 skill。monorepo 可以把局部 skill 放在子项目目录下，例如 `apps/web/.cursor/skills/deploy-web/SKILL.md`，让它自然只服务该子树。

## 单个 Skill 结构

`SKILL.md` 是唯一必需文件，必须包含 YAML frontmatter 和 Markdown 正文：

```markdown
---
name: code-review
description: Reviews code for correctness, security, maintainability, and test coverage. Use when reviewing pull requests, inspecting code changes, or when the user asks for a code review.
---

# Code Review

## When to Use

Use when reviewing code changes, pull requests, or diffs.

## Workflow

1. Inspect changed behavior.
2. Identify correctness, security, regression, and test risks.
3. Report findings first, ordered by severity.
4. Ground each finding in code evidence.

## Verification

- [ ] Findings cite concrete code or behavior.
- [ ] Test coverage and residual risk are stated.
```

### Frontmatter

必需字段：

- `name`: 小写字母、数字、连字符，最长 64 字符，必须和父目录名一致。
- `description`: 最长 1024 字符，必须同时说明“做什么”和“什么时候用”。

常用可选字段：

- `paths`: Cursor 支持。用 glob 限定触发文件范围，例如 `**/*.svelte`。
- `disable-model-invocation: true`: 只允许显式 `/skill-name` 调用，不让模型自动触发。
- `license`: skill 许可证。
- `compatibility`: 运行环境要求，例如需要 `git`、`docker`、网络访问或特定 agent。
- `metadata`: 作者、版本等自定义信息。
- `allowed-tools`: Agent Skills 规范中的实验字段，不同 agent 支持程度不同。

### Description 写法

`description` 是 agent 决定是否加载 skill 的关键索引。写法要求：

- 使用第三人称或客观描述。
- 第一部分写能力，第二部分写触发条件。
- 包含用户可能说出的关键词、文件类型、任务名。
- 不要把完整步骤写进去，否则 agent 可能只跟随摘要而不读取正文。

好例子：

```yaml
description: Generates cognitive-science-aligned technical tutorials with diagrams, retrieval practice, and worked examples. Use when the user asks to learn a technology, write a tutorial, or turn links into a structured learning guide.
```

差例子：

```yaml
description: Helps write tutorials.
```

## 渐进披露

主流实现都采用三层加载模型：

1. Metadata: `name` 和 `description` 常驻上下文。
2. Instructions: skill 被触发后加载整个 `SKILL.md`。
3. Resources: `references/`、`examples/`、`assets/`、`scripts/` 只在需要时读取或执行。

因此，`SKILL.md` 应该像入口页，不像完整手册。建议：

- `SKILL.md` 保持在 500 行以内，理想情况下 100-200 行。
- 超过 100 行的参考材料移入 `references/`。
- 大模板、示例输出、配置样板移入 `assets/` 或 `examples/`。
- 从 `SKILL.md` 直接引用一层文件，如 `references/api.md`，避免多层跳转。
- 不在 `SKILL.md` 和参考文件中重复同一内容。

## 正文写作准则

Skill 正文应修改 agent 行为，而不是传递通用知识。每一段都应能回答：“删掉这段会不会改变 agent 的行为？”

推荐章节：

- `When to Use`: 适用场景和不适用场景。
- `Workflow`: agent 必须遵循的步骤。
- `Decision Points`: 需要分支判断时列清条件。
- `Examples`: 1-3 个高质量输入输出示例。
- `Red Flags`: 说明 agent 正在偏离流程的迹象。
- `Verification`: 可用证据证明的完成标准。
- `References`: 按需读取的补充文件。

写作要求：

- 用动词开头的指令句，少写愿景句。
- 明确命令、文件、输出格式和失败处理。
- 用具体动作替代抽象要求。
- 给复杂流程配检查清单。
- 给容易被跳过的步骤写反例或红旗。

避免：

- “确保质量好”“遵循最佳实践”这类不可验证表述。
- 解释模型已知的基础概念。
- 过多选项而不给默认路径。
- 时间敏感规则散落正文；旧模式应单独放 `Deprecated` 或 `Legacy` 小节。
- 空的 `scripts/`、`examples/`、`references/` 目录。

## 脚本和资源

当操作确定、重复、容易出错时，优先写脚本，而不是让 agent 每次生成代码：

- frontmatter 校验。
- manifest 或路径检查。
- 模板生成。
- 固定格式解析。
- 测试、lint、构建、发布前检查。

脚本要求：

- 自包含，或在 README/正文中清楚声明依赖。
- 错误信息可操作。
- 默认不做破坏性操作。
- 不默认联网。
- 不读取无关敏感文件。
- 不做全局包安装。
- 需要权限、凭据、网络或外部服务时，在 `compatibility` 和正文中明确写出。

参考资料要求：

- 一个文件只服务一个主题。
- 长文件顶部给目录。
- 文件名小写并使用连字符。
- 大型 schema、模板、示例放资源文件，不塞进 `SKILL.md`。

## 安全与供应链

把第三方 skill 当作软件依赖审查：

- 阅读 `SKILL.md`，确认描述和实际行为一致。
- 检查 `scripts/` 是否访问网络、读取敏感文件、执行破坏性命令。
- 检查外部 URL，避免远程内容注入恶意指令。
- 优先使用项目级 skill，降低全局安装的影响范围。
- 对关键团队 workflow 使用版本固定、代码审查和 release tag。
- 不安装来源不明、权限过宽、脚本不透明的 skill。

## 质量门槛

合并或发布一个 skill 前，至少检查：

- [ ] `name` 与目录名一致。
- [ ] `description` 包含能力和触发条件。
- [ ] `SKILL.md` 不超过 500 行。
- [ ] 正文包含明确工作流。
- [ ] 文件引用存在且不深度跳转。
- [ ] 长参考资料已移出 `SKILL.md`。
- [ ] 示例具体，不是抽象占位。
- [ ] 脚本有清晰错误输出。
- [ ] 脚本不执行未声明的网络、凭据或破坏性操作。
- [ ] 验证清单能被证据证明。

## 仓库治理

README 应包含：

- 仓库用途。
- 安装方式。
- skill 列表和简短说明。
- 支持的 agent。
- 贡献规范。
- 安全审查提示。
- 许可证。

贡献流程建议：

1. 新 skill 先写 `description`，确认触发边界。
2. 再写核心 workflow。
3. 超过 100 行的背景材料移到 `references/`。
4. 为确定性操作补脚本。
5. 本地运行校验。
6. 通过 PR 审查 description、正文、脚本和安全影响。

版本管理建议：

- 项目专用 skill 跟项目代码一起提交。
- 通用 skill 用独立仓库和 release tag 维护。
- 对外发布时保留 changelog。
- 避免一次安装大量 skill；即使正文按需加载，所有 skill 的 `name` 和 `description` 仍会占用启动上下文。

## 资料来源

- [Cursor Docs: Agent Skills](https://cursor.com/docs/skills)
- [Agent Skills Specification](https://agentskills.io/specification)
- [Anthropic Claude Docs: Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Microsoft Learn: Agent Framework Skills](https://learn.microsoft.com/en-us/agent-framework/agents/skills)
- [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills)
- [`anthropics/claude-code`](https://github.com/anthropics/claude-code)
- 常见 `awesome-agent-skills` / `awesome-claude-skills` 仓库
