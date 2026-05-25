---
created: 2026-04-23 09:53
updated: 2026-04-24 11:47
type: insight
status: 1-draft
subject: "[[MOC - Engineering Log]]"
project:
tags:
  - documentation
  - information-architecture
  - ssot
  - knowledge-management
  - software-engineering
---

## 핵심 명제

문서 계층 간 내용 중복은 SSOT 위반이 아니다. 각 계층이 **서로 다른 질문**에 답하고 있다면, 그것은 중복이 아닌 관심사 분리다.

**각 계층의 생명주기 성격:**

| 계층 | 성격 | 종결 방식 |
|:---|:---|:---|
| **SPEC (Domain Docs)** | Living — 시스템이 바뀔 때마다 갱신 | 종결 없음. 항상 현재 상태가 SSOT |
| **ADR (Process Records)** | Closed — 결정이 실행되면 역할 완료 | 영구 보존되나 append-only. 수정 없음 |
| **RFC/Brief (Communication Artifacts)** | Closed — 피드백 수렴 후 종결 | SPEC 반영 완료 시 `closed` |

세 계층 모두 "삭제하지 않는다"는 공통 원칙을 갖지만, **ADR과 RFC는 소비 후 닫히고 SPEC만 살아있다.**

---

## 3계층 구조

| 계층 | 대표 폴더 | 답하는 질문 | 문서 성격 | 작성 언어 |
|:---:|:---|:---|:---:|:---:|
| **1. SPEC (Domain Docs)** | `domain/`, `data/`, `ml/` 등 | 시스템이 지금 어떻게 생겼는가 | Living · SSOT | 기술어 |
| **2. ADR (Process Records)** | `adr/` (Task Manifest) | 왜 이렇게 결정했고 어떻게 실행했는가 | Closed · Audit Trail | 기술어 |
| **3. RFC/Brief (Communication Artifacts)** | `briefs/` | 이해관계자와 무엇을 협의했고 어떤 피드백을 받았는가 | Closed · 협의 도구 | 독자 언어 |

각 계층은 자신의 질문에 대해서만 SSOT다. 계층 간 내용이 겹쳐 보여도, 보존하는 진실의 종류가 다르다.

---

## 지식 흐름 방향

```
RFC/Brief               →  ADR                  →  SPEC
(협의·피드백 수렴 → closed)   (결정 기록 → closed)    (시스템 상태 갱신 · living)
```

각 계층은 다음 계층으로 흐르고 닫힌다. **SPEC만이 유일하게 열려 있는 문서다.**

- RFC/Brief가 stale해지는 것은 지식이 ADR과 SPEC에 흡수된 신호다. 동기화 대상이 아니라 소비된 것이다.
- ADR은 결정이 실행되면 역할이 끝난다 — 이후로는 Audit Trail이며 레퍼런스가 아니다.
- SPEC은 ADR의 Consequences가 반영되어야 완결된다. ADR의 "갱신 대상 Spec" 항목이 이 연결을 명시적으로 만든다.

---

## ADR을 SSOT로 삼으려는 함정

ADR(혹은 Google Design Doc)을 시스템 상태의 레퍼런스로 삼으려는 시도가 자주 나타난다. 이는 두 가지 혼동에서 비롯된다.

**혼동 1 — "영구 보존 = 레퍼런스"**  
ADR은 삭제하지 않는다. 그러나 영구 보존의 이유는 "지금도 읽어야 해서"가 아니라 "왜 그때 그 결정을 했는지 소급 추적하기 위해서"다. Audit Trail은 영구적이지만 SSOT가 아니다.

**혼동 2 — "결정이 곧 현재 상태"**  
ADR이 결정된 시점의 설계를 담고 있어 마치 현재 상태처럼 보인다. 그러나 ADR은 결정 당시의 스냅샷이고, 이후 새로운 ADR이 쌓이면 ADR들을 모두 순서대로 읽어야 현재 상태를 재구성할 수 있다. 이것이 SPEC이 필요한 이유다.

**결론:** ADR은 "왜 SPEC이 지금 이 모습인가"를 설명하는 맥락 계층이다. SPEC은 "지금 시스템이 어떻게 생겼는가"를 직접 보여주는 상태 계층이다.


---

## 프로젝트 복수 언어 환경에서의 의의

기술 팀과 비기술 팀이 공존하는 프로젝트(제조, 의료, 금융 등)에서는 동일한 사실을 두 개의 언어로 표현해야 하는 순간이 반드시 온다. 이 구조는 그 이중 언어 필요성을 "SSOT 위반"이 아닌 "계층 분리"로 정당화하는 프레임을 제공한다.

---

## 관련 노트

- [[Document Architecture]] — 물리적 폴더 구조와 계층 간 의존 방향
- [[기술 결정 공유를 위한 Brief 포맷]] — Communication Artifact의 구체적 작성 포맷
- [[Task Manifest 문서를 활용한 SSOT 전략]] — Process Records 계층의 운용 패턴
- [[Docs-as-Code 원칙]] — 이 구조를 지탱하는 파일 불변 원칙
