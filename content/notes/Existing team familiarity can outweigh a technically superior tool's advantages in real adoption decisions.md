---
created: 2026-07-24
updated: 2026-07-24
type: insight
status: 2-stable
subject: "[[Thinking]]"
project: "[[AOI]]"
tags:
  - decision-making
  - tooling
  - organization
publish: true
---
## Context
AOI 저장소로 NAS vs MinIO를 비교하다가, 기능적으로 MinIO가 우위인 지점(이벤트 알림, presigned URL, 원자적 쓰기)이 명확한데도, 기존 작업자들이 NAS에 이미 익숙하면 실제로는 NAS를 선택하는 경우가 실무에서 많을 거라는 생각이 들었다.

## Insight
### 기술적 우위와 실제 채택 사이엔 항상 간극이 있고, 그 간극을 메우는 건 기존 인력의 익숙함(전환 비용)이다
어떤 도구가 기능적으로 명백히 낫다는 것과, 그 도구가 실제로 선택된다는 것은 별개의 문제다. 기존 작업자들이 이미 NAS 운영·트러블슈팅에 익숙하다면, MinIO의 기능 우위를 얻기 위해 지불해야 하는 학습 비용·운영 리스크가 그 우위를 상쇄하고도 남을 수 있다.

### 이 판단은 "기능이 더 나은가"가 아니라 "누가 이걸 계속 운영할 것인가"로 물어야 한다
도구 선택 논의가 기능 비교표로 흐르기 쉬운데, 실제 결정에 영향을 미치는 변수는 그 팀의 기존 숙련도다. AOI처럼 소규모 조직에서는 특히 "이론상 더 나은 도구"보다 "지금 있는 사람이 사고 없이 운영할 수 있는 도구"가 실질적으로 더 안전한 선택일 수 있다.

## Related
- [[File-sharing protocols were built for humans while object storage protocols were built for automated pipelines]] — 이 판단이 적용되는 구체적 비교 대상(NAS vs MinIO)
- [[Storage System Strategy]] — "저장 방식의 익숙함(NAS와 유사해 마이그레이션 용이)"이라는 관련 관찰이 이미 있었던 노트
