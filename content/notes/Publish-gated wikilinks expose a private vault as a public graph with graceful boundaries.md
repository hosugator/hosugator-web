---
created: 2026-07-03
updated: 2026-07-03
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Hosugator Web]]"
tags:
  - pkm
  - publishing
  - wikilink
  - frontmatter
publish: true
---
## Context
발행된 노트 본문에는 이미 `[[백링크]]`가 많은데, 블로그에선 순수 텍스트로 렌더돼 죽은 링크였다. 한편 사이트에는 `publish: true` 노트만 sync된다(비공개: 이력서·면접 준비 등).

## Insight
`[[링크]]`를 클릭 가능하게 만들되, **공개된 집합에 대해서만 해석**한다. 대상이 발행되지 않았으면 죽은 링크나 존재 노출 대신 "비공개 노트" 팝업을 띄운다. 이렇게 하면 publish 게이팅이 단순 필터가 아니라 **1급 UX 경계**가 된다 — 공개 그래프는 살아있고, 비공개 노트는 우아하게 차단된다.

## Decision
본문 `[[Target]]`/`[[Target|Alias]]`를 링크로 변환 → 커스텀 렌더러가 처리. 파일명 basename/제목 정규화 매칭으로 공개 노트면 이동, 아니면 팝업.

## Verification
- 기술 함정: react-markdown 기본 URL sanitizer가 미지의 프로토콜(`wiki:`)을 제거한다. **`#wiki:` 프래그먼트 스킴**으로 우회했다 — `#`가 맨 앞이면 sanitizer가 스킴으로 보지 않아 통과. 커스텀 `a` 렌더러가 `#wiki:` 접두사를 감지해 버튼으로 렌더.
- 실측: 공개 백링크 다수 → 정상 이동, 미발행 노트("My Zettelkasten Principles…") → 비공개 팝업 확인.

## Related
- [[A publish flag with frontmatter turns a flat PKM into a curated public site without folder duplication]] — publish 게이팅의 상위 결정
- [[Markup Language]]
