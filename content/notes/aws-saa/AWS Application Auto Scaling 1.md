---
created: 2026-02-02
tags:
  - aws
  - application
  - auto
  - scaling
  - target
---
# Application Auto Scaling

## 본질 (Essence)
EC2 외 AWS의 다양한 서비스들을 위해 표준화된 API 인터페이스를 제공하는 통합 자동 확장 엔진

## 구조 (Mechanism)
### 1. 작동 원리 (Workflow)
1. **등록**: 확장하고자 하는 리소스(예: ECS 서비스)를 'Scalable Target'으로 등록.
2. **감시**: CloudWatch 지표(CPU 사용률, 요청 수 등)를 실시간 모니터링.
3. **판단**: 설정된 정책(Target Tracking 등)에 따라 확장/축소 필요성 판단.
4. **실행**: 해당 서비스의 API를 호출하여 용량(Desired Count, Capacity Unit 등) 변경.

### 2. 주요 확장 정책 (Scaling Policies)
- **Target Tracking**: 특정 지표를 목표 값으로 유지 (예: "평균 CPU 사용률을 50%로 유지해줘"). 가장 권장되는 방식.
- **Step Scaling**: 지표 변화 크기에 따라 단계별로 조절 (예: CPU 50~60%면 1개 추가, 60% 이상이면 3개 추가).
- **Scheduled Scaling**: 트래픽 예측이 가능한 경우 특정 시간대별로 미리 확장.

## 적용 범위 (Applicability)
| 서비스 분류 | 적용 대상 리소스 |
| :--- | :--- |
| **컨테이너** | **ECS** (Fargate/EC2 서비스 모두), App Runner |
| **데이터베이스** | **DynamoDB** (읽기/쓰기 용량), **Aurora** (Read Replica 개수) |
| **기타** | Lambda (Provisioned Concurrency), Amazon SageMaker (엔드포인트 변수) |

## 확장 (Connection)
- **차이점**: 
    - **EC2 ASG**: 가상 서버(인스턴스)의 개수를 직접 관리.
    - **App Auto Scaling**: 서비스의 '용량 수치'나 '태스크 개수'를 논리적으로 조절.
- **비용**: 서비스 이용 자체는 **무료**. 확장되어 사용된 실제 리소스 비용만 발생.
- **응용**: "운영 오버헤드 최소화" 요건에서 수동 Lambda 스케일링보다 항상 우선순위를 가짐.

---
See Also: 
- [[Auto Scaling Strategy]]