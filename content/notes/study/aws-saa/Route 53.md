---
created: 2025-11-12
tags: [aws_saa, route53, dns, hostedzone, record, healthcheck]
reference:
  - https://docs.aws.amazon.com/route53/latest/developerguide/what-is-route-53.html
---

# Amazon Route 53
## 정의
도메인 이름 등록과 인터넷 트래픽 라우팅을 제공하는 확장 가능한 클라우드 DNS 및 가용성 확인 서비스

## 구성
- [[Hosted Zone]] : 도메인의 [[DNS]] 레코드 컨테이너(퍼블릭/프라이빗)
- [[Record]] : 이름, 타입, 값, [[TTL]], 라우팅 정책을 담은 DNS 항목
- [[Health Check]] : 엔드포인트나 별칭 레코드 상태 모니터링

## 라우팅 정책
- 단순 : 1대1 매핑
- 가중 : 가중치 기반 로드 밸런싱
- 지연 : 사용자에게 최소 지연 리전 응답
- 장애 조치 : 기본/보조, 상태 비정상 시 자동 전환
- 지리적·지리 근접·다중 응답·IP 기반

## 특징
- [[SLA]] 100% 가용성
- 도메인 등록, 민간 [[CA]] 인증서 발급 통합
- [[API]]로 레코드 자동 생성·삭제 가능
- 프라이빗 호스티드 존은 [[VPC]] 내부 전용 DNS 제공