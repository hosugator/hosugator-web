---
created: 2026-06-10
updated: 2026-06-10
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - pkm
  - para
  - moc
  - obsidian
publish: true
---
## Context
Obsidian MOC 구조를 PARA 기반으로 운영하다 Home MOC에 대한 접근 자체가 거의 없는 것을 자각했다. 이는 현재의 시스템이 유용하지 못 하다는 증거다.
또한 Areas 하위가 13개로 늘어나면서 재편 논의가 시작됐다. Area와 Resource의 구분 기준을 여러 각도로 검토했지만 경계 사례 없는 기준을 찾지 못했다.

## Insight
### PARA의 Area/Resource 구분은 Obsidian 지식 관리에서 명확한 기준을 제공하지 못한다

Project는 "기한 + 목표"라는 이진 검사가 가능하다. 하지만 Area와 Resource는 시도한 기준 모두 경계 사례가 발생했다.
애시당초 PARA는 프로젝트 관리 + 파일 정리 시스템으로 설계됐다. 지식 관리에 적용하면 Area/Resource 경계가 흐려지는 건 개인 차이가 아니라 설계 한계다. 대안 framework(LYT, Zettelkasten, Johnny Decimal) 중 이를 해결한 사례 없음 — 대부분 계층 구분 자체를 없애는 방향으로 회피한다.

### Home 하위를 Projects + Subjects로 단순화하면 구분이 명료해진다

- Projects: 기한 + 목표 (기존 유지, 명확한 기준)
- Subjects: 모든 Topic MOC. Areas/Resources 구분 폐기.
- 폐지 Archive: status 기반 관리
- 폐지 Areas: Subject에 '즐겨찾기'가 필요할 경우 frontmatter로 구현 가능.

전환 조건: Subject MOC가 20개 이상으로 늘어나 '즐겨찾기' 필요성이 생기면 Areas 계층 재도입 검토.

## Related
- [[PARA over numbered folder taxonomy in pCloud keeps active areas shallow]] — pCloud PARA 구조 결정. Obsidian과 별도 저장소로 운영
- [[pkm-역할-재정의]] — PKM 역할 재정의. 이 결정의 상위 컨텍스트
