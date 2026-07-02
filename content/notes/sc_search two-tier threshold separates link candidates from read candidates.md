---
created: 2026-05-22
updated: 2026-05-22
type: insight
status: 2-stable
subject: "[[PKM]]"
project: PKM
tags:
  - pkm
  - sc_search
  - threshold
  - embedding
publish: true
---

## Context

[[sc_search over grep for PKM linking because semantic similarity finds expression-variant notes]] 작성 후 4가지 탐색 방식을 직접 벤치마킹했다([[sc_search with query cap outperforms grep on token efficiency and recall]] 참조). 이 과정에서 두 가지 문제가 드러났다.

**임계값 문제:** `bge-micro-v2`는 코사인 유사도 점수를 0.65–0.82 대역에 압축한다. min_score 0.75는 "관련됨" 구간(0.65–0.79)을 반으로 자르는 위치여서, `AI replaces Zettelkasten retrieval...`(0.692), `Old PKM protocol blocked...`(0.677) 같이 실제로 연결할 가치 있는 노트들이 필터링됐다.

**용도 혼동:** sc_search가 "노트 내용을 개선하는 도구"라는 암묵적 전제 아래 0.80+ 노트를 Read하는 것이 기본 행동이었다. 그러나 새 노트의 내용은 현재 세션 컨텍스트에서 나오므로 sc_search가 내용 품질을 바꾸는 경우는 드물다. sc_search의 실질적 가치는 **이전 세션 노트들과의 위키링크 후보 발굴**이다.

## Decision

**1. min_score 기본값: 0.75 → 0.65**
- `~/.dotfiles/scripts/sc_search.py` 수정

**2. 점수별 처리 2계층 분리**

| score | 처리 |
|---|---|
| 0.80+ | Read 후보 — 제목을 보고 내용이 현재 노트를 실질적으로 고도화할 때만 Read |
| 0.65–0.79 | Link 후보 — Read 없이 제목만 보고 `[[위키링크]]` 연결 여부 판단 |
| 0.65 미만 | 무시 |

**3. 0 결과 시 bash 폴백 금지**
- sc_search 0 결과 = "볼트에 해당 주제 기존 노트 없음" 신호. bash grep으로 보완 탐색하지 않는다.

## Consequences

**개선**
- 0.65–0.75 구간의 의미적 연결 노트가 링크 후보로 포착된다
- Read 없이 링크만 추가하는 경로가 생겨 평균 도구 호출 횟수 감소
- 0 결과가 "모델 실패"가 아닌 "미개척 주제"로 해석 가능해진다

**트레이드오프**
- 0.65–0.75 결과 중 노이즈(`NFS and SMB`, `Hash Function` 등)가 포함될 수 있다. 에이전트가 제목 기반으로 판단해야 하므로 판단 부담이 생긴다.

---

[[sc_search over grep for PKM linking because semantic similarity finds expression-variant notes]] · [[pkm-역할-재정의]] · [[Lightweight local embedding models trade accuracy for offline capability]]
