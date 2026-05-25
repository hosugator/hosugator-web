---
created: 2025-11-11
tags: [aws_saa, elb, load_balancer, alb, nlb, clb, high_availability]
reference:
  - https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html
---
# AWS Elastic Load Balancer (ELB)
## 정의
들어오는 트래픽을 여러 대상(EC2, 컨테이너, Lambda 등)에 걸쳐 자동으로 분산시켜주는 관리형 로드 밸런싱 서비스
## 유형
- [[Application Load Balancer (ALB)]] : Layer 7(HTTP/HTTPS), 경로·호스트·헤더 기반 라우팅
- [[Network Load Balancer (NLB)]] : Layer 4([[TCP]]/UDP), 초고성능·고정 IP·지연 시간 낮음
- [[Gateway Load Balancer (GWLB)]] : Layer 3(T Geneve), 가상 어플라이언스(방화벽 등) 투명 삽입
- [[Classic Load Balancer (CLB)]] : Layer 4/7 혼합, 레거시 권장 안 함
## 공통 기능
- 다중 [[AZ]] 배포로 고가용성
- 대상 그룹, 헬스 체크, SSL/TLS 종료
- [[AWS Auto Scaling]]과 연동
- 기본 1개 [[ELB]]당 1000개 대상 제한(증청 가능)