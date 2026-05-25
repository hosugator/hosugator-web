---
created: 2026-02-02
tags:
  - aws
  - computing
  - auto-scaling
  - cost-optimization
---
# Auto Scaling Strategy

## 본질 (Essence)
리소스의 낭비를 막기 위해 수요(Traffic)에 맞춰 공급(Resource)을 자동으로 조절하는 메커니즘

## 구조 (Mechanism)
- **EC2 Auto Scaling**: 오직 EC2 인스턴스의 개수를 조절할 때 사용.
- **Application Auto Scaling**: 
    - 대상: ECS Fargate, DynamoDB, Aurora Replicas 등 비-EC2 리소스.
    - 정책: Target Tracking(목표치 유지), Step Scaling(단계별 확장).
- **Scheduled Scaling**: 특정 시간(예: 매일 오전 9시)에 미리 확장.

## 확장 (Connection)
- **연결**: 
    - 서버(EC2)가 필요하면 **EC2 ASG**.
    - 컨테이너(Fargate)나 DB 용량이 필요하면 **Application Auto Scaling**.
- **응용**: "비용 절감"과 "자동 확장"이 동시에 나오면, 별도의 개발이 필요한 Lambda보다 AWS 기본 제공 서비스인 Application Auto Scaling을 우선 선택.

---
See Also: 
- [[AWS Application Auto Scaling 1]]