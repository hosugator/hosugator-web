---
created: 2026-05-29
updated: 2026-05-29
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ai-workflow
  - cognitive-load
  - focus
publish: true
---

## Context

predict.py 쉐도잉 중 멀티 터미널 방식으로 AI 대기 중 다른 창으로 이탈하는 습관이 인지 부하를 가중하는지 논의에서 도출.

## Insight

### AI 대기 중 맥락 이탈은 생산성이 아니라 인지 비용이다

```
AI 실행 중 대기 → 인지 비용 0  (휴식)
AI 결과 검증   → 인지 비용 발생
맥락 전환      → 인지 비용 발생 (이동 + 재로딩)
```

"기다리는 게 낭비"라는 직관이 틀렸다. 독립적인 병렬 작업이 명확히 있을 때만 멀티 터미널이 유리하고, 그렇지 않으면 맥락 내에 머무는 게 인지 자원을 보존한다. 막연한 이탈은 생산적으로 보이지만 실제로는 인지 자원을 더 빠르게 고갈시킨다.

### 대기 시간은 맥락 안에서 다음을 준비하는 데 쓴다

- **능동적 예측** — AI가 뭘 할지, 결과가 어떻게 나올지 머릿속으로 먼저 그려본다. 결과가 나왔을 때 검증이 더 빠르고 깊어진다.
- **검증 기준 정리** — "이 결과에서 뭘 확인할 거지?"를 대기 중에 생각해두면 결과가 나오는 즉시 판단할 수 있다.
- **질문 큐잉** — 다음에 물어볼 것, 궁금한 것을 메모해둔다. 지시 → 대기 → 검증 → 다음 지시 흐름이 끊기지 않는다.

세 가지 모두 같은 맥락 안에서 앞을 준비하는 행위다. 멍하니 기다리는 것과의 차이는 다음 검증·지시를 위한 준비가 되어 있다는 것.

### 멀티 터미널은 역할이 명확하고 작업이 독립적일 때만 유효하다

역할이 분리된 멀티 터미널(실행/흐름파악/의문해소)은 전환 비용이 낮다. 역할이 섞이거나 창이 너무 많아지면 오히려 부하가 가중된다.

## Related

- [[Effective AI management requires both orchestration speed and verification depth]] — AI 관리자 역량의 조율·검증 두 축
- [[Every work activity except reading draws from a finite daily cognitive budget]] — 인지 예산 유한성 원칙
