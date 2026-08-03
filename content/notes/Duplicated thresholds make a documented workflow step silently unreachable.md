---
created: 2026-07-27
updated: 2026-08-03
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - pkm
  - ssot
  - sc_search
  - threshold
  - data-integrity
publish: true
---
## Context
`sc_search.py`의 유령 결과 문제를 고치면서 코드를 직접 읽다가, docstring의 점수 기준(0.80/0.65)이 pkm-management 스킬 문서(0.67/0.60)와 다르다는 것을 발견했다. 추적해보니 같은 값이 다섯 곳에 복제돼 있었고 서로 세 가지 값이었다.

## Insight
### 같은 값이 다섯 곳에 있었고 서로 갈라져 있었다

| 위치 | 값 | 성격 |
|---|---|---|
| PKM 결정 노트 | 0.80 / 0.65–0.79 / 0.65↓ | 최초 결정. 미갱신 |
| pkm-management 스킬 | 0.67 / 0.60–0.66 / 0.60↓ | 최신. 실제로 따르던 기준 |
| `sc_search.py` docstring | 0.80 / 0.65–0.79 | 구버전 |
| `sc_search.py` 사용법 문자열 | 0.75 | 아무것과도 불일치 |
| `sc_search.py` 실제 기본값 | 0.65 | 구버전 |

임계값 이력이 `0.75 → 0.65 → 0.60`인데, 각 복사본이 서로 다른 시점에 멈춰 있었다.


### SSOT 원칙이 있었는데도 막지 못했다

[[PKM outlasts any project and is the single source of truth that skills derive from]]에 "반대 방향(스킬에만 반영)은 PKM이 stale해지는 원인"이라고 이미 적어뒀다. 그런데 정확히 그 방향으로 갈라졌다.
원칙이 정하는 것은 권위의 방향뿐이다. 복제본이 몇 개 존재하는지, 그것들이 갱신됐는지는 다루지 않는다. 방향만 선언하고 파생을 사람 손에 맡기면, 원칙을 알면서도 갈라진다. 파생은 문서가 아니라 코드로 강제해야 한다 — 한쪽이 다른 쪽을 런타임에 읽거나, 최소한 서로를 명시적으로 참조해야 한다.

### 서로를 참조하지 않는 복사본은 갈라진 것을 탐지할 방법이 없다

다섯 곳 중 어느 것도 "이 값의 출처는 X"라고 적지 않았다. 그래서 불일치가 우연히 발견됐다 — 다른 버그를 고치려고 코드를 읽었기 때문이다. 읽지 않았으면 계속 방치됐을 것이다.

## Decision
다섯 곳을 스킬 기준(`0.67 / 0.60–0.66 / 0.60↓`)으로 통일하고, `sc_search.py` docstring에 출처를 명시했다.

```
점수 기준 (SSOT: pkm-management 스킬 문서. 변경 시 양쪽을 함께 갱신한다):
```

PKM 결정 노트에는 값을 갱신하면서 개정 이력을 남겼다 — 값만 바꾸면 왜 갈라졌는지가 사라진다. `0.75 → 0.65 → 0.60` 이력과 "Link 후보 구간이 한 번도 출력되지 않았다"는 사실을 본문에 보존했다.
전환 조건: 이 값이 또 갈라지면 문자열 명시로는 부족하다는 증거이므로, `sc_search.py`가 스킬 문서에서 임계값을 파싱해 읽는 방식(또는 반대로 스킬이 코드를 참조)으로 파생을 자동화한다.

## Related
- [[sc_search two-tier threshold separates link candidates from read candidates]] — 임계값을 최초 결정한 노트. 이번에 개정 이력과 함께 갱신
- [[PKM outlasts any project and is the single source of truth that skills derive from]] — 위반된 원칙. 방향만 정하고 복제본 관리는 다루지 않는다
- [[Reusing another tool's index inherits the integrity checks its own UI provided]] — 같은 세션·같은 도구에서 나온 다른 결함. 이건 삭제 미처리, 저건 값 드리프트
- [[Defensive error handling converts porting bugs into silent feature loss]] — 무증상 실패의 동일 구조. 기능이 사라지는 방식만 다르다
- [[IaC GitOps and DaC share the same Git SSOT pattern applied to different operational domains]] — SSOT를 도메인별로 적용하는 패턴
- [[3-tier document architecture satisfy SSOT, audit-trail, and cooperation]] — 계층별 SSOT 분담
