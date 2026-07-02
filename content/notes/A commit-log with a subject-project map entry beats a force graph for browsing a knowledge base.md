---
created: 2026-07-02
updated: 2026-07-02
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Hosugator Web]]"
tags:
  - ux
  - information-architecture
  - dataviz
  - blog
publish: true
---
## Context
공개된 260개 지식 노트를 어떻게 시각화·탐색시킬지 결정해야 했다. 후보는 force-graph(노드 구름), 멀티 레인 스윔레인 그래프, 단일 레일 커밋 로그 + 별도 Map(subject→project 트리)이었다.

## Insight
### 기준은 "멋있음"이 아니라 "조망 → 탐색" 흐름이다
force-graph는 400+ 노드에서 회색 구름이 되어 판독·탐색 모두 실패한다. 스윔레인은 레인이 무엇을 의미하는지 읽히지 않는다. 사람은 "개요를 잡고 → 관심 축으로 필터된 목록을 훑는" 순서로 탐색한다.

## Decision
**git 커밋 로그 메타포**(단일 레일, 최신순, 브랜치색 점)를 탐색 뷰로, **Map(subject→project 트리)을 진입점**으로 삼는다. Map에서 subject/project를 클릭하면 필터된 로그로 드릴다운한다. force-graph와 멀티 레인 스윔레인은 기각.
- 엔지니어에게 즉시 읽히는 메타포라 온브랜드이고, 노트가 늘어도 필터로 스케일한다.
- **전환 조건**: 노트 간 실제 링크(관계)를 보여주는 게 핵심 가치가 되면 그래프 뷰를 보조로 재도입.

## Consequences
- 계층(개요 → 필터 로그)이 서면 피어 토글·브랜치 칩 같은 중복 컨트롤을 없앨 수 있다. 진입점이 곧 내비게이션이다.
- 시각화는 데이터 규모(여기선 편중된 대량 노트)를 먼저 보고 선택해야 한다 — 적은 데이터에서 멋진 것이 많은 데이터에서 무너진다.

## Related
- [[Engineer dashboard UX design requires information architecture beyond component knowledge]] — 컴포넌트가 아니라 IA(조망→탐색)가 먼저
- [[UX judgment is built through breadth of screens not depth of one screen]] — 여러 시각화를 실제로 만들어 비교
- [[Manageable hierarchy depth limit of three applies to both PKM and component trees]] — 얕은 계층 선호
