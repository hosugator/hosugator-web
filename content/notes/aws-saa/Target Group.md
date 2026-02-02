---
created: 2026-01-21
tags:
  - aws
  - target_group
  - alb
  - port
  - asg
---
# Target Group (대상 그룹)

## 본질 (Essence)
로드밸런서(ALB)가 트래픽을 전달할 최종 목적지들을 논리적으로 묶은 '바구니'이자, 리소스의 '종(Type)'과 '통신 규격(Port/Protocol)'을 정의하는 정책 그룹

## 포트 설계 및 핵심 구조 (Mechanism)
- **Target Type**: 개별 인스턴스 ID뿐만 아니라 IP, Lambda 함수 등 리소스의 성격을 지정함.
- **Port & Protocol**: 해당 그룹에 담길 리소스들이 수신 대기할 통로(예: HTTP 80, HTTPS 443)를 사전에 정의함.
- **Health Check**: 지정된 포트와 경로(Path)를 통해 리소스의 생존 여부를 주기적으로 확인하여, 정상(Healthy)인 대상에게만 트래픽을 배분함.
- **연결 고리**: ALB(입구) → Target Group(규격/바구니) ← ASG(리소스 공급자).

## 설계 원칙 (Best Practice)
- **통로 기반 분리**: 동일한 EC2군이라도 서비스 포트(80 vs 8080)나 역할(API vs Web)이 다르면 별도의 Target Group으로 설계하여 트래픽을 격리함.
- **경로 기반 라우팅**: ALB의 리스너 규칙과 결합하여 `/api/*`는 API 그룹으로, `/static/*`은 파일 서버 그룹으로 정교하게 교통 정리를 수행함.

## 확장 (Connection)
- **비유**: 식당의 '테이블 번호'나 '예약석' 개념. 손님(트래픽)은 어떤 요리사(EC2)가 만드는지 몰라도, 지정된 테이블(Target Group)로 음식을 배달받음.
- **응용**: ASG는 새로운 EC2를 생성하자마자 이 바구니에 자동으로 등록(Register)하여 관리자의 수동 개입 없는 동적 확장을 가능케 함.

---
See Also: 
- [[Port]]