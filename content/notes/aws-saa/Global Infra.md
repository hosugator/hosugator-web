---
created: 2025-11-12
tags: [aws_saa, global_infrastructure, region, az, edge]
reference:
  - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html
  - https://aws.amazon.com/about-aws/global-infrastructure/
---
# AWS 글로벌 인프라
## 정의
AWS가 운영하는 전 세계 물리 자원 네트워크로 리전, 가용 영역, 엣지 로케이션 세 계층으로 구성됨
## 구성
- [[Region]] : 지리적 단위의 데이터센터 클러스터
- [[AZ]] : 리전 내 독립 데이터센터 그룹
- [[Edge Location]] : 콘텐츠 전달 및 DNS 응답용 엣지 네트워크
## 특징
리전 간 완전 격리, 엣지는 전 세계 400+ 위치에 분포  
지연 시간 최소화와 재해 복구 기반 제공