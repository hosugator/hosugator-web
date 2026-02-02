---
created: 2025-11-11
tags:
  - aws_saa
  - region
  - global_infrastructure
  - az
  - edge
reference:
  - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-regions
---
# AWS 리전
## 정의
AWS가 전 세계에 분산하여 운영하는 지리적 단위의 독립 데이터센터 클러스터 묶음
## 특징
- 리전 간 완전 네트워크 격리
- 대부분 리전은 3개 이상의 [[AZ]] 포함
- 고객 데이터는 리전 내에만 상주 (이동 불가)
- 리전 코드는 보통 지역-도시 형식 (예: ap-northeast-2)
## 예시
서울 리전(ap-northeast-2)은 한국 사용자에게 낮은 지연 시간 제공  
버지니아 북부 리전(us-east-1)은 글로벌 서비스의 기본 리전으로 자주 사용