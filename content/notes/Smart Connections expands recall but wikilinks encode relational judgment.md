---
created: 2026-05-22
updated: 2026-05-22
type: insight
status: 2-stable
subject: "[[PKM]]"
tags:
  - pkm
  - zettelkasten
  - wikilink
  - smart-connections
  - embedding
publish: true
---

## Context

sc_search(임베딩 유사도 탐색)를 PKM 파이프라인에 도입하는 과정에서 Smart Connections와 수동 위키링크의 역할이 어떻게 다른지를 검토했다. sc_search가 위키링크를 대체할 수 있는지, 아니면 보완재인지가 쟁점이었다.

## Insight

### Smart Connections와 위키링크는 다른 정보를 인코딩한다

SC는 두 노트의 내용 유사도를 측정한다 — "이 둘이 얼마나 비슷한가." 위키링크는 "**이 맥락에서, 이 방향으로, 이 이유로** 내가 연결했다"를 인코딩한다. 후자가 담는 정보가 더 많다.

SC의 유사도 점수는 양방향 대칭이다. 위키링크는 어느 노트에서 어느 노트로 연결되었는지, 본문의 어느 위치에 놓였는지가 모두 의미를 가진다. 이 방향성과 배치가 관계의 이유를 암시한다.

### 유사도가 낮은 위키링크일수록 더 가치 있는 연결일 수 있다

SC가 자동으로 보여줄 만큼 높은 유사도(0.80+)인 연결은 "놓치지 않게 하는" 기능이다. 반면 유사도 0.65 수준에서 명시적으로 링크를 달았다는 사실은 "이 비명백한 연결을 내가 판단했다"는 메타정보를 담는다. 그 판단 자체가 인사이트다.

### 제텔카스텐의 맥락·로그 용도에서는 유사도 기반이 구조적으로 작동하지 않는다

제텔카스텐의 핵심 가치는 내용이 아니라 **개인 맥락(언제, 어떤 상황, 어떤 결정)**을 보존하는 것이다([[AI replaces Zettelkasten retrieval but not personal context or decision log]] 참조). 맥락과 인과 관계는 내용 유사도로 포착되지 않는다. "이 실패 이후 이 결정을 내렸다"는 관계는 두 노트의 텍스트가 아무리 달라도 연결해야 하는 경우다.

### SC는 회상 범위를, 위키링크는 관계의 이유를 인코딩한다

- **SC(sc_search)**: 작성자가 생각하지 못했거나 표현이 달라서 놓친 연결 후보를 발견하는 도구. 회상 범위 확장.
- **위키링크**: 연결 판단 자체를 지식 그래프에 영구 기록. 이유와 방향이 담긴 선언.

둘은 대체재가 아니라 상호 보완재다.

---

[[AI replaces Zettelkasten retrieval but not personal context or decision log]] · [[sc_search two-tier threshold separates link candidates from read candidates]] · [[My Zettelkasten Principles; Hybrid Approach]]
