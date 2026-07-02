---
created: 2026-05-29
updated: 2026-05-29
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ai-workflow
  - management
  - cli
  - verification
publish: true
---

## Context

predict.py 쉐도잉 중 인지 부하가 소모되는 것을 체감하며, 멀티 터미널(A=실행, B=흐름파악, C=의문해소) 방식이 관리자 역량과 인지 부하 중 어느 쪽에 해당하는지 의문이 생겼다. CLI AI 시대에 어떤 능력을 키워야 하는지에 대한 논의에서 도출.

## Insight

### AI 관리자 역량은 조율 속도와 검증 깊이 두 축으로 구성된다

멀티 터미널로 여러 AI를 동시에 조율하는 것은 속도 축이다. AI가 낸 결과가 맞는지 판단하는 검증 능력은 깊이 축이다. 둘 중 하나만으로는 관리자로서 제대로 작동하지 않는다.

```
조율만 있고 검증 없음 → AI 결과를 그대로 신뢰 → 버그·오판 통과
검증만 있고 조율 없음 → 병렬화 불가 → 속도 이점 없음
```

### 검증 능력은 직접 해본 사람에게만 생긴다

`latest = CKPT_PATH / "latest.pth"` 같은 버그를 잡는 능력은 코드를 읽을 수 있기 때문이다. AI가 짠 코드를 검증하려면 그 코드가 무엇을 하는지 알아야 하고, 그 앎은 직접 써본 경험에서 온다. 쉐도잉은 속도가 아니라 이 검증 기반을 만드는 과정이다.

### skill/agent/harness는 서로 다른 두 축의 개념이다

skill → agent는 **자율성** 축이고, harness는 **트리거 방식** 축이라 직렬로 놓으면 틀린다.

| 축 | 스펙트럼 |
|---|---|
| **자율성** | copilot(사람 주도) → agent mode(AI 주도, 사람 감독) → autonomous agent(AI 자율) |
| **트리거** | 수동 호출 → 이벤트 자동 트리거(harness) |

harness 안에서 실행되는 것이 단순 스크립트일 수도 있고 autonomous agent일 수도 있다. 둘은 독립된 축이라 조합이 가능하다.

**실행 주도권**으로 구분하면 더 명확하다:
- skill: 사람이 명시적으로 호출 (`/pkm-management`)
- agent mode: AI가 판단해서 실행 ("pkm 해줘" → AI가 스킬 선택)
- harness: 이벤트가 자동 트리거 (파일 저장 시 hook 발동)

### 위임은 직접 수행 → 명세화 → 위임 → 검증 사이클로 확장한다

전환 기준은 "내가 틀렸을 때 알아챌 수 있냐"다. 설명할 수 있어야 명세를 쓸 수 있고, 명세가 있어야 검증 기준을 줄 수 있다. 순서가 반대면 명세를 못 쓰고 결과도 못 검증한다.

PKM·repo-doc·post를 직접 작성하다가 명세로 정의해 위임한 것이 이 사이클의 실제 사례다.

## Related

- [[Developer value shifts from code generation to code evaluation as AI generation cost approaches zero]] — 검증 능력이 AI 시대 핵심 역량이라는 동일 맥락
- [[CLI literacy for AI supervision means reading flow not memorizing syntax]] — AI 감독자의 핵심 역량 정의
- [[Context switching during AI wait time depletes cognitive resources faster than waiting]] — 분리된 맥락 전환 비용 노트
