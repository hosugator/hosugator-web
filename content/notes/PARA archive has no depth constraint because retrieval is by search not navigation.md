---
created: 2026-05-22
updated: 2026-05-22
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Edge AI LMR]]"
tags:
  - pkm
  - para
  - file-management
publish: true
---
## Context

pCloud 파일 구조를 번호 체계(00-04)에서 PARA로 전환하면서, 기존에 정리되지 않은 채 archive로 던지는 것이 맞는지 고민했다. "내부 구조가 엉망인 채로 넣으면 나중에 찾을 수 있나?"라는 의문에서 출발.

## Insight

### Archive는 browse가 아닌 search로 접근하기 때문에 내부 depth가 의미 없다

PARA의 폴더 depth 제한(이상 4레벨 이내)은 매일 탐색하는 공간에만 적용된다. Projects와 Areas는 자주 browse하므로 얕은 구조가 인지 비용을 낮춘다. Archive는 다르다. 필요할 때 파일명으로 검색해서 찾는 공간이다. 7레벨 깊이의 구조도 검색 결과엔 동등하게 나온다.

### 구조화 비용 vs. 접근 빈도의 트레이드오프

archive 내부를 정리하는 것은 "거의 열지 않을 공간을 위해 지금 비용을 쓰는 것"이다. PARA가 명시적으로 허용하는 이유가 이것이다 — 비활성화 시 내부 구조 그대로 이동, 재구성 없음.

이 원칙은 파일 시스템 외에도 적용된다: **검색으로 접근하는 공간에 탐색 구조를 강요하지 않는다.**

## Related
- [[PARA over numbered folder taxonomy in pCloud keeps active areas shallow]] · 
- [[Freeze system by default and review only on repeated friction]] · 
- [[AI replaces Zettelkasten retrieval but not personal context or decision log]]
