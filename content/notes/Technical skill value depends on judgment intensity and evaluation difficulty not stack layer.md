---
created: 2026-06-23
updated: 2026-06-23
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
tags:
  - career
  - ai-assisted-development
  - product
publish: true
---
## Context
AI가 FE 가치를 낮춘다는 통념에서 출발해, 실제로 어느 레이어가 얼마나 대체되는지를 분석했다. FE vs BE vs Infra라는 레이어 구분으로는 가치 변화를 제대로 설명할 수 없다는 걸 확인했다.

## Insight
### 기술 가치는 레이어가 아니라 판단 강도와 평가 난이도로 결정된다

```
판단 강도 높음 + 평가 어려움 → AI가 대체하기 어려움 → 프리미엄 유지
판단 강도 낮음 + 평가 쉬움   → AI가 빠르게 대체     → commoditized
```

레이어별 예시:

| 영역 | 판단 낮음 + 평가 쉬움 | 판단 높음 + 평가 어려움 |
|---|---|---|
| FE | 표준 UI 컴포넌트 | information hierarchy 설계 |
| BE | CRUD API | 보안 아키텍처, 신뢰 경계 설정 |
| Infra | k8s 설정·배포 | "지금 k8s가 필요한가" 판단 |

같은 레이어 안에서도 작업 성격에 따라 가치가 극단적으로 갈린다.

### 평가 난이도가 높은 작업일수록 그동안 저평가됐다

보안·분산 시스템은 "문제가 없으면 보이지 않는다"는 특성 때문에 가치가 인정받기 어려웠다. AI가 표면적 작업을 평준화할수록 이런 비가시적 깊이의 가치가 역설적으로 드러난다.

### 구현 판단이 설계 판단보다 빠르게 commoditized된다

k8s 설정을 잘 하는 것보다 "지금 k8s가 필요한가, 필요하다면 어느 수준까지"를 판단하는 것이 더 대체하기 어렵다. 정답이 컨텍스트에 종속될수록 AI는 범용 답변만 줄 수 있다.

## Related
- [[Developer value shifts from code generation to code evaluation as AI generation cost approaches zero]] — 같은 방향의 선행 인사이트. 코딩 맥락에서의 평가 능력 이동.
- [[Progressive disclosure is the moat when AI commoditizes feature implementation]] — 레이어가 아닌 판단 설계가 차별점이 되는 FE 영역 사례
- [[AI helpfulness and judgment delegation risk scale together]] — 판단을 AI에 위임하는 위험의 구조
