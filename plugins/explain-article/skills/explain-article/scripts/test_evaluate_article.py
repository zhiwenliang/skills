#!/usr/bin/env python3
"""Regression tests for evaluate_article.py."""

from __future__ import annotations

import tempfile
from pathlib import Path

from evaluate_article import evaluate, transfer_question_count


def write_tmp(text: str) -> Path:
    handle = tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".md", delete=False)
    with handle:
        handle.write(text)
    return Path(handle.name)


SHALLOW_ARTICLE = """# 区块链是什么

<!-- explain-article:audience -->
## 适合谁读
这篇写给初学者。

<!-- explain-article:core-claim -->
## 核心想法
区块链是很多人一起维护的记录。

<!-- explain-article:map -->
## 地图
```mermaid
flowchart LR
  A[数据] --> B[区块] --> C[链]
```

<!-- explain-article:mechanism -->
## 它怎样工作
区块链把数据放进区块，再把区块连起来。这样它比较安全、透明、可靠。

```mermaid
flowchart TD
  A[用户] --> B[交易] --> C[记录]
```

<!-- explain-article:example -->
## 例子
小王给小李转账，系统记录下来。

<!-- explain-article:boundary -->
## 边界
区块链不是万能的。

<!-- explain-article:check -->
## 检查
1. 区块链是什么？
2. 它为什么有用？
3. 它是不是比特币？

<!-- explain-article:sources -->
## 来源
- [NIST](https://www.nist.gov/publications/blockchain-technology-overview)
"""


DEEP_ARTICLE = """# 区块链为什么难改历史记录

<!-- explain-article:audience -->
## 适合谁读
这篇写给知道数据库但不懂区块链的读者。

<!-- explain-article:core-claim -->
## 核心想法
区块链通过把新区块绑定到旧历史、让多方复制和验证记录，降低单点篡改成功率。

<!-- explain-article:map -->
## 地图
```mermaid
flowchart LR
  A[旧区块哈希] --> B[新区块]
  B --> C[网络验证]
  C --> D[共同历史]
```

<!-- explain-article:mechanism -->
## 机制
新区块包含前一区块的哈希。旧内容被改动时，哈希会变，后续区块引用会断开。

```mermaid
flowchart TD
  A[改旧区块] --> B[哈希变化]
  B --> C[后续引用失效]
  C --> D[节点拒绝]
```

<!-- explain-article:depth-probes -->
## 深度探针
- 机制链：旧区块内容变化会改变哈希，哈希变化让后续区块的引用不匹配。
- 约束和权衡：复制验证降低单点篡改，但带来吞吐、延迟和协调成本。
- 反事实：如果区块不引用前一区块哈希，攻击者改旧记录时就不会破坏后续引用。
- 模型对比：普通中心化数据库依赖管理员权限边界，公链还依赖公开验证和共识规则。
- 证据细节：NIST 的概览把哈希链、分布式账本和共识机制分开描述，说明难篡改来自多层机制组合，而不是单个密码学名词。

<!-- explain-article:example -->
## 例子
如果攻击者改一笔旧交易，就必须同步修复后续引用并让网络接受新历史。

<!-- explain-article:boundary -->
## 边界
难篡改不等于数据真实。链上记录只能证明记录存在，不能自动证明输入事实正确。

<!-- explain-article:check -->
## 检查
1. 为什么改旧区块会影响后续区块？
2. 如果没有前一区块哈希，会失去什么保护？
3. 难篡改为什么不等于数据一定真实？

<!-- explain-article:sources -->
## 来源
- [NIST](https://www.nist.gov/publications/blockchain-technology-overview)
- [Bitcoin white paper](https://bitcoin.org/bitcoin.pdf)
"""


FAKE_DEEP_ARTICLE = """# 区块链是什么

<!-- explain-article:audience -->
## 适合谁读
这篇写给初学者。

<!-- explain-article:core-claim -->
## 核心想法
区块链是很多人一起维护的记录。

<!-- explain-article:map -->
## 地图
```mermaid
flowchart LR
  A[数据] --> B[区块] --> C[链]
```

<!-- explain-article:mechanism -->
## 它怎样工作
区块链把数据放进区块，再把区块连起来。这样它比较安全、透明、可靠。

```mermaid
flowchart TD
  A[用户] --> B[交易] --> C[记录]
```

<!-- explain-article:depth-probes -->
## 深度探针
- 机制链：区块链有机制。
- 约束和权衡：区块链有权衡。
- 反事实：如果没有区块链，就没有区块链。
- 模型对比：区块链和普通数据库不同。

<!-- explain-article:example -->
## 例子
小王给小李转账，系统记录下来。

<!-- explain-article:boundary -->
## 边界
区块链不是万能的。

<!-- explain-article:check -->
## 检查
1. 区块链是什么？
2. 它为什么有用？
3. 它是不是比特币？

<!-- explain-article:sources -->
## 来源
- [NIST](https://www.nist.gov/publications/blockchain-technology-overview)
"""


NO_EVIDENCE_DEPTH_ARTICLE = """# 区块链为什么难改历史记录

<!-- explain-article:audience -->
## 适合谁读
这篇写给知道数据库但不懂区块链的读者。

<!-- explain-article:core-claim -->
## 核心想法
区块链通过把新区块绑定到旧历史、让多方复制和验证记录，降低单点篡改成功率。

<!-- explain-article:map -->
## 地图
```mermaid
flowchart LR
  A[旧区块哈希] --> B[新区块]
  B --> C[网络验证]
  C --> D[共同历史]
```

<!-- explain-article:mechanism -->
## 机制
新区块包含前一区块的哈希。旧内容被改动时，哈希会变，后续区块引用会断开。

```mermaid
flowchart TD
  A[改旧区块] --> B[哈希变化]
  B --> C[后续引用失效]
  C --> D[节点拒绝]
```

<!-- explain-article:depth-probes -->
## 深度探针
- 机制链：旧区块内容变化会改变哈希，哈希变化让后续区块的引用不匹配，节点因此能发现历史被改写。
- 约束和权衡：复制验证降低单点篡改，但带来吞吐、延迟和协调成本，系统必须在安全和效率之间取舍。
- 反事实：如果区块不引用前一区块哈希，攻击者改旧记录时就不会破坏后续引用，历史一致性保护会弱很多。
- 模型对比：普通中心化数据库依赖管理员权限边界，公链还依赖公开验证和共识规则，信任位置不同。

<!-- explain-article:example -->
## 例子
如果攻击者改一笔旧交易，就必须同步修复后续引用并让网络接受新历史。

<!-- explain-article:boundary -->
## 边界
难篡改不等于数据真实。链上记录只能证明记录存在，不能自动证明输入事实正确。

<!-- explain-article:check -->
## 检查
1. 为什么改旧区块会影响后续区块？
2. 如果没有前一区块哈希，会失去什么保护？
3. 难篡改为什么不等于数据一定真实？

<!-- explain-article:sources -->
## 来源
- [NIST](https://www.nist.gov/publications/blockchain-technology-overview)
- [Bitcoin white paper](https://bitcoin.org/bitcoin.pdf)
"""


RECALL_ONLY_CHECKS_ARTICLE = """# 区块链为什么难改历史记录

<!-- explain-article:audience -->
## 适合谁读
这篇写给知道数据库但不懂区块链的读者。

<!-- explain-article:core-claim -->
## 核心想法
区块链通过把新区块绑定到旧历史、让多方复制和验证记录，降低单点篡改成功率。

<!-- explain-article:map -->
## 地图
```mermaid
flowchart LR
  A[旧区块哈希] --> B[新区块]
  B --> C[网络验证]
  C --> D[共同历史]
```

<!-- explain-article:mechanism -->
## 机制
新区块包含前一区块的哈希。旧内容被改动时，哈希会变，后续区块引用会断开。

```mermaid
flowchart TD
  A[改旧区块] --> B[哈希变化]
  B --> C[后续引用失效]
  C --> D[节点拒绝]
```

<!-- explain-article:depth-probes -->
## 深度探针
- 机制链：旧区块内容变化会改变哈希，哈希变化让后续区块的引用不匹配，节点因此能发现历史被改写。
- 约束和权衡：复制验证降低单点篡改，但带来吞吐、延迟和协调成本，系统必须在安全和效率之间取舍。
- 反事实：如果区块不引用前一区块哈希，攻击者改旧记录时就不会破坏后续引用，历史一致性保护会弱很多。
- 证据细节：NIST 的概览把哈希链、分布式账本和共识机制分开描述，说明难篡改来自多层机制组合，而不是单个密码学名词。

<!-- explain-article:example -->
## 例子
如果攻击者改一笔旧交易，就必须同步修复后续引用并让网络接受新历史。

<!-- explain-article:boundary -->
## 边界
难篡改不等于数据真实。链上记录只能证明记录存在，不能自动证明输入事实正确。

<!-- explain-article:check -->
## 检查
1. 区块链是什么？
2. 哈希是什么？
3. 节点是什么？

<!-- explain-article:sources -->
## 来源
- [NIST](https://www.nist.gov/publications/blockchain-technology-overview)
- [Bitcoin white paper](https://bitcoin.org/bitcoin.pdf)
"""


ONE_SOURCE_ARTICLE = """# 区块链为什么难改历史记录

<!-- explain-article:audience -->
## 适合谁读
这篇写给知道数据库但不懂区块链的读者。

<!-- explain-article:core-claim -->
## 核心想法
区块链通过把新区块绑定到旧历史、让多方复制和验证记录，降低单点篡改成功率。

<!-- explain-article:map -->
## 地图
```mermaid
flowchart LR
  A[旧区块哈希] --> B[新区块]
  B --> C[网络验证]
  C --> D[共同历史]
```

<!-- explain-article:mechanism -->
## 机制
新区块包含前一区块的哈希。旧内容被改动时，哈希会变，后续区块引用会断开。

```mermaid
flowchart TD
  A[改旧区块] --> B[哈希变化]
  B --> C[后续引用失效]
  C --> D[节点拒绝]
```

<!-- explain-article:depth-probes -->
## 深度探针
- 机制链：旧区块内容变化会改变哈希，哈希变化让后续区块的引用不匹配，节点因此能发现历史被改写。
- 约束和权衡：复制验证降低单点篡改，但带来吞吐、延迟和协调成本，系统必须在安全和效率之间取舍。
- 反事实：如果区块不引用前一区块哈希，攻击者改旧记录时就不会破坏后续引用，历史一致性保护会弱很多。
- 证据细节：NIST 的概览把哈希链、分布式账本和共识机制分开描述，说明难篡改来自多层机制组合，而不是单个密码学名词。

<!-- explain-article:example -->
## 例子
如果攻击者改一笔旧交易，就必须同步修复后续引用并让网络接受新历史。

<!-- explain-article:boundary -->
## 边界
难篡改不等于数据真实。链上记录只能证明记录存在，不能自动证明输入事实正确。

<!-- explain-article:check -->
## 检查
1. 为什么改旧区块会影响后续区块？
2. 如果没有前一区块哈希，会失去什么保护？
3. 难篡改为什么不等于数据一定真实？

<!-- explain-article:sources -->
## 来源
- [NIST](https://www.nist.gov/publications/blockchain-technology-overview)
"""


SHORT_ARTICLE = """# 区块链是什么

<!-- explain-article:audience -->
## 适合谁读
写给初学者。

<!-- explain-article:core-claim -->
## 核心想法
区块链是很多人一起维护、互相验证的记录。

<!-- explain-article:map -->
## 地图
```mermaid
flowchart LR
  A[数据] --> B[区块] --> C[链]
```

<!-- explain-article:mechanism -->
## 它怎样工作
新区块包含前一区块的哈希，改旧记录会让后续引用断开。

<!-- explain-article:example -->
## 例子
小王给小李转账，系统记录下来。

<!-- explain-article:boundary -->
## 边界
难篡改不等于数据真实。

<!-- explain-article:check -->
## 检查
1. 为什么改旧区块会影响后续区块？
2. 如果没有前一区块哈希，会失去什么保护？
3. 难篡改为什么不等于数据一定真实？

<!-- explain-article:sources -->
## 来源
- [NIST](https://www.nist.gov/publications/blockchain-technology-overview)
"""


def test_shallow_article_fails_depth_check() -> None:
    failures, warnings = evaluate(write_tmp(SHALLOW_ARTICLE))
    assert any("depth" in failure for failure in failures), (failures, warnings)


def test_depth_labels_without_content_fail() -> None:
    failures, warnings = evaluate(write_tmp(FAKE_DEEP_ARTICLE))
    assert any("substantive" in failure for failure in failures), (failures, warnings)


def test_depth_requires_source_backed_probe() -> None:
    failures, warnings = evaluate(write_tmp(NO_EVIDENCE_DEPTH_ARTICLE))
    assert any("source-backed" in failure for failure in failures), (failures, warnings)


def test_understanding_checks_must_transfer() -> None:
    failures, warnings = evaluate(write_tmp(RECALL_ONLY_CHECKS_ARTICLE))
    assert any("transfer" in failure for failure in failures), (failures, warnings)


def test_full_articles_need_two_sources() -> None:
    failures, warnings = evaluate(write_tmp(ONE_SOURCE_ARTICLE))
    assert any("source links" in failure for failure in failures), (failures, warnings)


def test_deep_article_passes() -> None:
    failures, warnings = evaluate(write_tmp(DEEP_ARTICLE))
    assert failures == [], (failures, warnings)


def test_short_article_skips_depth_probes() -> None:
    failures, warnings = evaluate(write_tmp(SHORT_ARTICLE), short=True)
    assert failures == [], (failures, warnings)


def test_short_article_requires_depth_probes_in_full_mode() -> None:
    failures, warnings = evaluate(write_tmp(SHORT_ARTICLE))
    assert any("depth-probes" in failure for failure in failures), (failures, warnings)


def test_inline_questions_counted_separately() -> None:
    section = (
        "<!-- explain-article:check -->\n"
        "## 检查\n"
        "1. 为什么会这样？ 如果没有它会怎样？ 在什么情况下会失效？\n"
    )
    assert transfer_question_count(section) >= 3


if __name__ == "__main__":
    test_shallow_article_fails_depth_check()
    test_depth_labels_without_content_fail()
    test_depth_requires_source_backed_probe()
    test_understanding_checks_must_transfer()
    test_full_articles_need_two_sources()
    test_deep_article_passes()
    test_short_article_skips_depth_probes()
    test_short_article_requires_depth_probes_in_full_mode()
    test_inline_questions_counted_separately()
    print("test_evaluate_article.py: PASS")
