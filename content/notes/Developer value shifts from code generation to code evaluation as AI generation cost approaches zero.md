---
created: 2026-05-26
updated: 2026-05-26
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - career
  - coding
  - ai-assisted-development
  - learning
  - shadowing
publish: true
---
## Context
코드 전문가가 아닌 상황에서 AI 코드 생성 비용이 0에 수렴하고 있으나, 직접 코드를 쓰거나 터미널 명령어를 쳐봐야 "눈에 보인다", "내 것이 된다"는 감각이 분명하다.
한편 코드 리뷰가 고부하인 이유를 탐색하다 핵심 병목이 검증 능력 부재임을 확인했다 ㅡ 언어 학습의 쉐도잉과 동일한 구조.

## Insight
### AI 시대에 개발자의 핵심 병목은 생성이 아니라 평가 능력이다

AI가 코드를 대신 쓰는 비용이 0에 가까워질수록, 개발자의 가치는 "얼마나 빨리 쓰는가"에서 "AI가 쓴 코드가 맞는지 판단할 수 있는가"로 이동한다.
검증 능력 없이 AI를 쓰면 위임이 아니라 도박이 된다.

### 코드 쉐도잉이 검증 능력을 만드는 유일한 경로다

언어 학습에서 단어를 처음 봤을 때 소리 내어 읽어봐야 내 것이 되듯, 코드 패턴도 직접 타이핑해야 내재화된다(생산 효과).
읽기만 해서는 "이해했다"는 착각이 생긴다. 쉐도잉 이후에는 AI 위임 시 즉시 검증 가능해진다.

- 생산 효과(Production Effect, MacLeod et al., 2010): 소리 내거나 타이핑하는 등 직접 생산하면 읽기만 할 때보다 기억 파지가 유의미하게 높다는 실험 결과. "이해했다"는 착각이 수동적 읽기에서 반복적으로 확인됨.
- 의식적 연습(Deliberate Practice, Anders Ericsson): 전문성은 반복 경험이 아니라 즉각 피드백이 있는 의식적 반복에서 형성된다. 코드를 직접 쓰고 실행 결과로 즉시 검증받는 구조가 이 조건을 충족함.
- Tutorial Hell: 개발자 커뮤니티에서 광범위하게 관찰되는 실패 패턴 — 강의·영상만 소비하고 직접 구현하지 않으면 실력이 늘지 않는다. "보는 것"과 "쓰는 것"의 인지적 차이가 원인. 언어 학습의 수동적 소비 실패와 동일한 구조.

>  현업 조언의 수렴: "복붙하지 말고 타이핑하라", "튜토리얼 프로젝트 말고 실제 프로젝트를 만들어라"는 입문 수준부터 시니어까지 반복되는 공통 조언. 이론이 아니라 실패 경험의 통계적 귀납.


```python
# 쉐도잉 전: AI가 zero_grad() 빠뜨려도 모름
# 쉐도잉 후: 순서만 봐도 즉시 이상함을 감지
optimizer.zero_grad()
loss.backward()
optimizer.step()
```

```bash
# 쉐도잉 전: -rl 플래그가 뭔지 몰라 흐름이 안 보임
# 쉐도잉 후: xargs sed 조합 전체가 한 눈에 들어옴
grep -rl "pattern" . | xargs sed -i 's/old/new/g'
```

### 반대 진영 논리와 그 한계

두 진영이 실제로는 다른 것을 말하고 있다:
- "쓸 필요 없다" 진영 → 생성 능력은 불필요 ㅡ 추상화 수준이 올라가는 역사적 흐름 (어셈블리 → C → Python → 자연어)
- "직접 써봐야 한다" 진영 → 평가 능력은 여전히 필요

ML/AI 영역은 위임 시 특히 위험하다:
- `zero_grad()` 순서 오류 → 학습이 되는 것처럼 보이지만 실제로는 안 됨
- 데이터 누수(data leakage) → 평가 지표는 좋지만 모델이 쓸모없음
- Loss 함수 오선택 → 수렴해도 엉뚱한 것을 학습

버그는 코드를 읽을 줄 알아야 잡힌다. 쉐도잉 루틴은 이 반대 진영 논리를 고려해도 ML/AI 맥락에서는 유효하다.

## Decision
### 20260526
오전 첫 시간은 코드 쉐도잉으로 고정한다 — 개발이든 리뷰든 형식 무관.
목적은 구현 완료가 아니라 해당 패턴에 대한 검증 능력 확보다.
재료는 진행 중인 프로젝트의 실제 코드로 한정한다.

> CLAUDE.md 반영 (2026-05-26): 쉐도잉 단계임을 전역 컨텍스트로 기재. 기본 동작 = 스캐폴딩 + WHY. "그냥 만들어줘" 트리거로 프로덕션 모드 전환. PKM이 SSOT — 이 결정에서 CLAUDE.md가 파생됨.

## Related
- [[Every work activity except reading draws from a finite daily cognitive budget]] — 오전 첫 시간 코드 고정의 인지 부하 근거.
- [[Personal artifacts outlast project attribution when work becomes subsidiary to a larger effort]] — 쉐도잉을 프로젝트 구현과 연결하면 포트폴리오 문제도 동시 해결.
- [[CLI literacy for AI supervision means reading flow not memorizing syntax]] — 검증 능력의 같은 패턴. 암기가 아니라 흐름 파악.