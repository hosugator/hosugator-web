---
created: 2026-07-27
updated: 2026-07-27
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - pkm
  - embedding
  - search
  - smart-connections
  - data-integrity
publish: true
---
## Context
GV-001 프로젝트 논의를 PKM 노트로 정리하면서 `sc_search`가 0.692로 반환한 `Edge AI 배포 전략 - Docker vs 모델 파일`에 위키링크를 걸었다. 링크 검증 단계에서 그 노트가 볼트에 존재하지 않는다는 것을 발견했다. 처음에는 인덱스가 stale하다고 판단했지만, 측정해보니 원인이 달랐다.

## Insight
### 인덱스는 stale하지 않았다 — 추가는 되고 삭제만 안 된다

인덱스 최신 항목이 당일 갱신돼 있었다. 플러그인은 정상 작동 중이다. 어긋난 것은 수량이었다.

```
실제 노트    1,901
인덱스 항목  2,148  →  유효 1,887 / 고아 261
```

노트 저장마다 반응해야 하는 Obsidian 플러그인에게 append-only는 합리적 선택이다. 벡터가 노트당 수십 KB이고 볼트가 103MB인데 매번 전체 재작성은 감당하기 어렵다. 쓰기 중 크래시에도 앞부분이 무손상이다.

### UI가 정합성을 우연히 덮어주고 있었고, 외부 리더는 그 보정을 상속받지 못한다 ← 핵심

```
Obsidian UI  : 인덱스 → 볼트 파일 존재 확인 → 렌더링   유령이 보이지 않는다
sc_search.py : 인덱스 → 그대로 출력                     유령이 노출된다
```

플러그인 안에서는 이 결함이 드러나지 않는다. 없는 노트는 링크로 렌더링할 수 없으니 자연히 걸러지기 때문이다. 플러그인은 자기 UI 경계 안에서만 정합성을 보장했고, 인덱스를 외부에서 직접 읽는 소비자가 있다고 가정하지 않았다.
일반화하면 — 다른 도구의 내부 인덱스를 재사용하면, 그 도구의 UI가 암묵적으로 수행하던 검증까지 함께 인수해야 한다. 인덱스는 그 도구의 공개 계약이 아니라 구현 세부사항이므로, 보장 범위가 UI까지만인 것이 오히려 정상이다. 계약을 넘어 읽기로 결정한 쪽이 그 차이를 메울 책임을 진다.

### 규율이 아니라 도구에서 막아야 했다

"링크 전에 존재를 확인한다"를 프로토콜에 추가하는 방식은 이미 실패했다. 이번 세션에서 내가(=LLM이) 0.692 결과를 보고 존재한다고 믿고 링크를 걸었기 때문이다. 매 호출마다 규율에 의존하는 지점은 결국 새어나간다. 유령이 출력 자체에 나오지 않게 하는 것이 옳다.

## Decision
`sc_search.py`의 `load_vectors()`에 실재 확인을 넣어 로드 시점에 유령을 배제한다. 고아 `.ajson` 261개는 삭제하지 않는다.

```python
note = key.removeprefix("smart_sources:")
if not (VAULT / note).exists():
    continue
vectors[note] = vec
```

`search()`가 아니라 `load_vectors()`에 넣은 이유: `search()`의 출력 필터는 `top_n` 슬라이싱 뒤에 걸려 결과 개수가 줄어든다. 원하는 것은 "실재하는 노트 상위 N개"이므로 배제가 슬라이싱보다 앞에 와야 한다. 의미상으로도 정합성 확보는 데이터 로딩의 책임이다.
`.ajson`을 지우지 않는 이유: 대증요법이다. 노트를 지우거나 이름을 바꿀 때마다 다시 쌓이므로 반복 작업이 된다. 필터가 무력화하므로 디스크 낭비만 감수한다.
전환 조건: 고아 비율이 30%를 넘어 로드 시간이 체감되면 compaction 스크립트를 추가한다(현재 261/2148 = 12%).

## Related
- [[sc_search over grep for PKM linking because semantic similarity finds expression-variant notes]] — sc_search 도입 결정. 제약으로 "추가 지연"만 기록돼 있었고 삭제 측면이 누락돼 있었다
- [[Smart Connections expands recall but wikilinks encode relational judgment]] — SC는 회상 범위, 위키링크는 관계 판단. 유령 링크는 후자를 오염시킨다
- [[sc_search two-tier threshold separates link candidates from read candidates]] — 점수 구간 기준
- [[Lightweight local embedding models trade accuracy for offline capability]] — bge-micro-v2 선택의 트레이드오프
- [[Defensive error handling converts porting bugs into silent feature loss]] — 무증상 실패의 동일 구조. 이쪽은 예외를 삼켜서, 이쪽은 UI 밖으로 나가서 신호가 사라졌다
- [[A broken config symlink silently disables all terminal keybinds without error]] — 무증상 실패 계보
