---
created: 2026-05-26
updated: 2026-05-26
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
tags:
  - cli
  - ai-supervision
  - literacy
  - terminal
publish: true
---

## Context

Neovim에서 grep 대용 플러그인을 탐색하다가 `:grep`, `:cfdo`, `sed`, `xargs` 등 터미널 명령어들을 하나씩 짚어가는 과정에서 도출됐다. 명령어를 외워야 하는지, 필요할 때 찾아보면 되는지를 논의하다가 나온 통찰이다.

## Insight

### AI 감독자에게 필요한 건 암기가 아니라 흐름을 읽는 능력이다

CLI 명령어를 외울 필요는 없다. 하지만 **읽을 수 있는 것**과 **외우는 것**은 다르다.

AI가 `grep -rl "old" . | xargs sed -i 's/old/new/g'`를 실행할 때:
- 읽을 수 있으면 → "파일 찾아서 일괄 치환하는구나" → 결과를 검증할 수 있고, 잘못됐을 때 잡아낼 수 있다
- 모르면 → 결과만 보고 맞는지 판단하기 어렵다

### 궁금할 때마다 찾아보는 방식이 체계적 암기보다 효율적이다

자주 쓰는 명령어는 반복 노출로 자연스럽게 익혀진다. 나머지는 "이런 게 있다"는 감각만 있어도 충분하다. AI에게 "이 명령어가 뭐야?"라고 물으면 즉시 답을 얻을 수 있는 환경에서 사전 암기의 ROI는 낮다.

### CLI 명령어 이해는 AI 작업의 가시성을 높인다

도구의 작동 원리를 알수록 AI가 어떤 흐름으로 작업을 진행하는지 보인다. 이 가시성이 AI를 단순히 신뢰하는 것과 **검증하며 협업하는 것**의 차이를 만든다.

## Related

- [[agentic-ai_separate-agent-and-skill]] — AI 에이전트가 내부적으로 어떻게 동작하는지 구조적 이해
