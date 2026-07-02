---
created: 2026-06-01
updated: 2026-06-04
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ai-workflow
  - shadowing
  - cognitive-control
  - learning
publish: true
---
## Context
align-ai 쉐도잉(train.py, predict.py, dataset.py)을 진행하면서, 이 방법이 [[Agentic AI가 일으키는 out of the loop.md]]의 "의도적 감속" 구현으로 적합한지 검토했다.
쉐도잉은 AI가 제거한 마찰을 복원하는 데는 유효하지만, 노트가 말하는 인지 주도권과 가역성 판단 능력을 완전히 커버하지 못함을 발견했다.

## Insight
### 쉐도잉만으로는 이해했다는 착각이 생긴다
쉐도잉은 이미 동작하는 코드를 이해하는 과정이다. 실패가 없고, 설계 결정을 내리지 않으며, 코드를 읽고 재현하는 것이 목표다. 이 과정에서 "알 것 같다"는 감각은 생기지만 실제로 설계할 수 있는지, 틀린 입력을 예측할 수 있는지는 확인되지 않는다.
현업에서 명세는 코드보다 먼저 존재해야 한다. 하지만 주니어 수준에서는 완전한 명세를 독립적으로 작성하기 어렵기 때문에, 작은 명세 초안 → 에이전트 보완 → 구현 순서가 된다. 이 과정에서 에이전트가 완성한 명세에 대한 완전한 이해가 이루어지지 않은 채 코드가 존재하게 된다.
완전한 사이클은 명세 재작성–쉐도잉–검증이다

### 세 단계가 각각 다른 역량을 단단하게 만든다

| 단계                  | 단단해지는 역량             |
| ------------------- | -------------------- |
| 명세 0에서 재작성          | 설계 역량 — 무엇을 만들어야 하는가 |
| 쉐도잉                 | 구현 역량 — 어떻게 동작하는가    |
| 경계값 데이터 작성 + I/O 검증 | 검증 역량 — 어디서 실패하는가    |

세 역량 모두를 한 번씩 통과하면 "현업 수준의 이해가 한 번 이루어졌다"는 체크포인트다. 완전한 숙달이 아니라 한 사이클 완주의 기준이다.

### 각 단계는 에이전트 검증과 직렬로 연결된다

```
명세 재작성   →  에이전트 검증  →
쉐도잉        →  에이전트 검증  →
경계값 테스트  →  에이전트 검증
```

에이전트는 각 단계에서 **검증자**로 쓰인다. 에이전트가 먼저 만들고 사람이 검토하는 일반적인 AI 보조 흐름의 역전이다. 사람이 먼저 시도하고, 에이전트가 갭을 짚는다.

### 에이전트 검증은 갭 리포트여야 한다

pass/fail("틀렸어")은 결과 판정이다. 갭 리포트("에러 핸들링이 빠졌어 — 파일이 없을 때 이 함수가 어떻게 동작해야 하는지 정의가 없어")는 이해 공백의 진단이다.
갭 리포트를 받고 이해하는 과정이 생략되면 다음 단계로 넘어가도 공백이 그대로 남는다. "교정"(에이전트가 고쳐줌)과 "검증"(사람이 갭을 이해함)의 차이다.

## Verification

2026-06-04: evaluate.py + export_onnx.py + predict_onnx.py 쉐도잉 1사이클 완주. scale 인덱스 오류(evaluate.py), model.eval() 오해(export_onnx.py), INTER_NEAREST/float32 이유(predict_onnx.py) 등 adversarial review에서 이해 공백 발견. align-ai src/ 전체 쉐도잉 완료 (dataset, train, predict, evaluate, export_onnx, predict_onnx).

## Related

- [[Agentic AI가 일으키는 out of the loop.md]] — 의도적 감속과 가역성 판단 능력의 원칙
- [[Effective AI management requires both orchestration speed and verification depth]] — 검증 깊이가 AI 관리자 역량의 한 축
- [[Developer value shifts from code generation to code evaluation as AI generation cost approaches zero]] — 검증 능력이 AI 시대 핵심 역량
- [[Context switching during AI wait time depletes cognitive resources faster than waiting]] — 인지 자원 보존 원칙
