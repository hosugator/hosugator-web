---
created: 2026-05-22
updated: 2026-05-22
type: insight
status: 2-stable
subject: "[[PKM]]"
tags:
  - pkm
  - embedding
  - search
publish: true
---

## Context

Claude CLI가 새 PKM 노트를 작성하기 전에 기존 관련 노트를 찾는 방식이 `grep -l keyword` 기반이었다. 키워드가 파일 안에 그 단어 그대로 있어야만 잡히는 방식이라, 표현이 다른 의미적 연관 노트를 구조적으로 놓쳤다.

Smart Connections 플러그인 설치 후 Obsidian이 볼트 전체를 `TaylorAI/bge-micro-v2` 모델로 임베딩하여 `~/zettelkasten/.smart-env/multi/*.ajson`에 벡터를 저장한다는 것을 확인했다. 이 인덱스를 CLI에서 직접 활용할 수 있는 구조다.

## Decision

`~/.dotfiles/scripts/sc_search.py` 스크립트를 작성하여 기존 grep을 대체한다.

- Smart Connections와 동일한 `TaylorAI/bge-micro-v2` 모델로 쿼리를 임베딩
- `.ajson` 인덱스의 `smart_sources` 벡터와 코사인 유사도 계산
- 출력: `score\t/절대경로.md` — Claude의 `Read` 도구에 바로 넘길 수 있는 형태
- 기본 min-score 0.65로 노이즈 필터 (→ [[sc_search two-tier threshold separates link candidates from read candidates]])
- `uv` 기반 실행으로 별도 환경 구성 없이 의존성 자동 관리
- `~/.local/bin/sc_search` 심링크로 어디서나 호출 가능

## Consequences

**개선**
- 표현이 달라도 의미적으로 연관된 노트를 발견할 수 있다
- 새 노트 작성 시 연결 누락이 줄어들 것으로 예상

**제약**
- Smart Connections가 Obsidian 내에서 인덱싱하므로, 새 노트는 Obsidian을 열어야 인덱스에 반영된다
- `bge-micro-v2`는 경량 모델(384차원, ~22MB)로 한국어 기술 용어 쿼리에서 노이즈가 발생한다. 영어 혼용 또는 노트 내용에 가까운 구체적 쿼리가 정확도를 높인다

## Verification — grep vs sc_search 직접 비교 (2026-05-22)

같은 주제로 두 방식을 각각 실행하여 비교했다.

| | grep | sc_search |
|---|---|---|
| 탐색 쿼리 횟수 | 3회 (점진적 정제) | 2회 |
| 탐색 출력 | ~35줄 (파일명 나열) | ~20줄 (score+경로) |
| 읽은 파일 | 86줄 | 70줄 |
| 탐색 단계 합계 | ~121줄 | ~90줄 |
| 유효 정보 비율 | 낮음 — draft 노트 2개 포함 | 높음 — 현재 유효 노트만 |
| 연결된 노트 수 | 1개 | 2개 |
| Consequences 상세도 | 2줄 | 4줄 (한국어 노이즈 실측 포함) |

grep은 `PKM Infrastructure Design`(54줄, draft)을 끌어왔으나 최종 노트에 기여 없었다. sc_search는 `Old PKM protocol blocked...`(38줄)를 첫 쿼리에서 0.791로 발견했고 Consequences에 직접 반영됐다.

→ 비교 대상 노트: [[grep-based PKM linking structurally misses notes with different expressions]]

---

[[pkm-역할-재정의]] · [[AI replaces Zettelkasten retrieval but not personal context or decision log]]
