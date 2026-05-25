---
created: 2025-11-13
tags: [aws_saa, directconnect, dx, leasedline, vlan, hybrid]
reference:
  - https://docs.aws.amazon.com/directconnect/latest/UserGuide/what-is-aws-direct-connect.html
---
# AWS Direct Connect
## 정의
고객 데이터센터와 AWS 리전을 전용 사설 회선(또는 캐리어 중계)으로 연결해 퍼블릭 인터넷을 거치지 않는 관리형 하이브리드 네트워크 서비스
## 비유
일반 인터넷은 마을 도로에 섞여서 차가 막힐 수 있지만,  
Direct Connect는 자신만의 전용 차선을 내서 24시간 막힘 없이 집(온프레미스)과 창고(AWS)를 잇는 고속도로
## 핵싀 구성
- [[Connection]] : 물리 포트(1G·10G·100G) 또는 호스팅 파트너를 통한 가상 회선
- [[Virtual Interface (VIF)]] : VLAN 단위로 퍼블릭·프라이빗·트랜짓 구분
- [[Virtual Private Gateway (VGW)]] : VPC 쪽 종단점, [[BGP]] 라우팅 교환
- [[Direct Connect Gateway]] : 여러 리전 VPC·트랜짓 게이트웨이를 하나의 연결로 통합
## 주요 기능
- 대역폭 고정 : 50M~100G, 요금 할인 구간 선택
- BGP 기본 지원 : 온프레미스 라우트 테이블과 동적 교환
- MACsec(1/10G) : 회선 암호화, 기밀 데이터 전송
- SiteLink : 리전 간 직접 트래픽 bypass, 지연 시간 최소화
## 특징
- 요금 : 포트 시간당(1G 0.30USD, 10G 2.25USD) + 데이터 이그레스 0.02~0.05USD/GB(리전별)
- SLA 99.9%, 평균 지연 1~2ms(동일 메트로)
- 인터넷 대비 대역폭 비용 최대 70% 절감, 일정 대역 이상 시 경제적
- 재해 복구용 이중화는 다중 위치(또는 파트너) 연결로 구현