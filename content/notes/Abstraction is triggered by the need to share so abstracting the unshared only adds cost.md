---
created: 2026-07-30
updated: 2026-08-03
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - abstraction
  - architecture
  - naming
  - methodology
publish: true
---
## Context
버전 태그가 언제 필요한지를 정리하다가, 태그의 필요가 저장소 밖의 사람에게서 온다는 데 도달했다. 그리고 그 구조가 같은 날 정리한 개발 모델(상태 소유·인터페이스 주입)과 같다는 것을 알아챘다.
세 번째 사례가 전혀 다른 영역에 있어서 이것이 우연이 아님을 확인할 수 있었다 — 시 제목을 고르는 문제였다.

## Insight
### 추상화의 요구는 외부에서 온다 

| 영역    | 구체적인 것     | 추상          | 요구가 어디서 오나        |
| ----- | ---------- | ----------- | ----------------- |
| 시     | 본문         | 제목          | 다른 제목들 사이에서의 변별력  |
| 버전 관리 | 커밋 해시      | 태그          | 저장소 없는 사람이 지목해야 함 |
| 모듈 설계 | 직접 참조·하드코딩 | 인터페이스(시그니처) | 밖에서 호출하는 쪽        |

본문과 가장 정합적인 제목("봄")이 다른 "봄"들 사이에서 변별력이 없어 미완성이었다. 완성도의 눈금이 내부에만 설정돼 있었던 것.
커밋 해시도 같다. 해시는 완전한 식별자다 — 내부적으로는 아무 문제가 없다. 부족한 것은 사람이 말로 옮길 수 있느냐이고, 그 요구는 저장소 밖에서 온다.
"나중에 필요할 것 같아서"는 근거가 아니다.

### 판별 시점은 소비자가 둘이 되는 순간이다

소비자 1개  →  구체적인 것으로 충분. 이름도 인터페이스도 필요 없다
소비자 2개  →  둘이 같은 것을 가리켜야 한다 → 추상이 필요해진다

### 추상화는 비용이다 

정리하면 추상화는 그 자체로 좋은 것이 아니다.
그래서 판단은 "이것이 잘 추상화됐는가"가 아니라 "이것이 공유되는가"를 먼저 묻는 것이 된다.

## Related
- [[A title's completeness includes external distinctiveness not just internal coherence]] — 같은 구조를 시 제목에서 발견한 사례. 영역이 달라 원리임을 확인해준다
- [[Shared state belongs at the lowest common ancestor of its consumers]] — 공유가 생긴 뒤의 배치 규칙. 이 원리의 특수 사례
- [[Software abstraction repeatedly extracts structure from values at increasing scales, a fractal pattern]] — 규모를 바꿔 반복되는 현상. 이 노트는 그 촉발 조건
- [[Separability and reusability are opposite directions of coupling so one test cannot show both]] — 인터페이스가 어느 방향의 결합을 다루는지
- [[Encapsulation exists to protect an invariant so state without a rule should not be owned]] — 소유의 판별과 같은 형태의 기준
- [[Roll back the deployment not the history]] — 태그가 이 원리의 사례가 되는 맥락
- [[Place the seam where the data crossing it is small and cold]] — 경계를 어디에 그을지
