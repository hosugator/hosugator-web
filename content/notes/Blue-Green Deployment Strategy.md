---
created: 2026-02-10
updated: 2026-02-10
type: insight
status: 1-draft
subject: "[[Infra]]"
project: "[[AWS SAA]]"
tags:
  - aws
  - deployment
  - blue-green
  - devops
  - availability
publish: true
---
# Blue-Green Deployment Strategy
## 본질 (Essence)
"구형 엔진을 끄고 새 엔진으로 교체하는 위험한 방식(In-place) 대신, 새 엔진이 달린 새 차를 옆에 준비해두고 운전자만 옮겨 타는(Blue-Green) 안전한 방식"
## 원리 (Mechanism)
- 정의: 동일한 사양의 두 환경(Blue: 현재 운영 중, Green: 신규 버전)을 동시에 유지하며, 트래픽의 목적지를 변경하여 배포하는 전략.
- 핵심:
    - Zero Downtime: 트래픽 전환이 즉각적이므로 서비스 중단이 없음.
    - Instant Rollback: Green 환경에 문제가 발생하면 Route 53이나 ALB 가중치를 조절해 즉시 Blue로 복구 가능.
    - Isolation: 운영 환경과 분리된 Green에서 최종 검토(Sanity Check) 후 배포 가능.
## 확장 (Connection)
- Application: AWS에서는 Route 53의 Weighted Routing이나 ALB의 Target Group Switching을 통해 구현.
- Comparison: 
    - In-place: 기존 서버를 덮어쓰기함 (비용 저렴, 가동 중단 위험).
    - Canary: 일부 사용자에게만 먼저 배포해보고 점진적으로 확대 (리스크 최소화).
---
See Also: 
- 