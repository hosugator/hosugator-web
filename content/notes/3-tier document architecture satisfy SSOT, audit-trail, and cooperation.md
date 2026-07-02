---
created: 2026-04-23 09:53
updated: 2026-06-23
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - documentation
  - information-architecture
  - ssot
  - knowledge-management
  - software-engineering
publish: true
---
## Context
ADR(혹은 Google Design Doc)을 시스템 상태의 레퍼런스로 삼으려고 해봤다.
이는 SSOT 관리 측면에서는 가장 유용하나, 하나의 문서로 여러 계층/관심사의 내용을 모두 담아야 하기에 문서가 비대해지고, 청자 모두를 만족시키기 어려운 용어들이 혼재한다.
또한 문서가 Flat한 형태로 존재하여 트리 형태로 접근하기가 어렵고, 이는 곧 문서 간 호출을 통해 접근해야 함을 의미하여 문서 시스템 자체에 대한 러닝 커브가 존재한다.

## Insight
### 문서를 관심사별로 분리한다 

문서 계층 간 내용 중복이 반드시 SSOT 위반이 아니다. 각 계층이 **서로 다른 질문**에 답하고 있다면, 그것은 중복이 아닌 관심사 분리다.

| 계층        | 핵심 질문             | 성격                      | 종결 방식                      |
| :-------- | :---------------- | :---------------------- | :------------------------- |
| **SPEC**  | 지금 시스템이 어떻게 생겼는가? | Living — 시스템이 바뀔 때마다 갱신 | 종결 없음. 항상 현재 상태가 SSOT      |
| **ADR**   | 왜 그런 결정을 내렸는가?    | Closed — 결정이 실행되면 역할 완료 | 영구 보존되나 append-only. 수정 없음 |
| **Comms** | 이해관계자와 무엇을 협의했는가? | Closed — 피드백 수렴 후 종결    | SPEC 반영 완료 시 closed        |

세 계층 모두 "삭제하지 않는다"는 공통 원칙을 갖지만, **ADR과 Comms는 소비 후 닫히고 SPEC만 살아있다.**

### Comms는 협업 시 필요 청자를 대상으로 작성하는 번역 문서이다 

기술 팀과 비기술 팀이 공존하는 프로젝트(제조, 의료, 금융 등)에서는 동일한 사실을 두 개의 언어로 표현해야 하는 순간이 반드시 온다. 
이 구조는 그 이중 언어 필요성을 "SSOT 위반"이 아닌 "계층 분리"로 정당화하는 프레임을 제공한다.

### ADR은 현재 상태처럼 보이나, 결정 당시의 스냅샷이다.

DR이 결정된 시점의 설계를 담고 있어 마치 현재 상태처럼 보인다. 그러나 ADR은 결정 당시의 스냅샷이고, 이후 새로운 ADR이 쌓이면 ADR들을 모두 순서대로 읽어야 현재 상태를 재구성할 수 있다. 이것이 SPEC이 필요한 이유다.
다시 말해, ADR은 "왜 SPEC이 지금 이 모습인가"를 설명하는 맥락 계층이다. SPEC은 "지금 시스템이 어떻게 생겼는가"를 직접 보여주는 상태 계층이다.

## Related
- [[Project document hierarchy architecture starts from domain to all]] — 물리적 폴더 구조와 계층 간 의존 방향
- [[Version control the Docs as Code]] — 이 구조를 지탱하는 파일 불변 원칙
