---
created: 2026-01-23
tags:
  - aws
  - networking
  - traffic-flow
  - architecture
---
# AWS End-to-End Traffic Flow & Layer Transformation

## 본질 (Essence)
사용자의 L7 요청이 보안/라우팅을 위해 복호화(L7)와 캡슐화(L4/L3) 과정을 반복하며 종단까지 전달되는 데이터 생명 주기

## 구조 (Mechanism)
### 1. 서비스별 계층 및 데이터 취급
- CloudFront (L7): 최전방 Edge에서 SSL 복호화 및 캐싱 데이터 제공.
- API Gateway (L7): HTTP 본문을 분석하여 WAF 검사, 인증, 할당량 제어 수행.
- ALB (L7): HTTP 헤더/경로를 읽고 콘텐츠 기반으로 타겟 그룹 분산.
- NLB (L4): 데이터 본문은 무시하고 IP/Port 정보만 확인하여 초고속 전송.
- VPC/Subnet (L3): IP 라우팅을 통해 가상 네트워크 내 패킷 이동 경로 제공.
- EC2 (L7): OS 레벨에서 패킷을 최종 수신하여 비즈니스 로직 처리.

### 2. 계층 변환의 이유 (The 'Why')
- L7 변환 (Decapsulation): 보안 검사(WAF) 및 지능적 라우팅(Content-based)을 위해 데이터 실체를 확인해야 함.
- L4/L3 변환 (Encapsulation): 중간 전달 과정의 성능 극대화. 내용물을 확인하지 않고 겉면 주소만 보고 배달하여 지연 시간(Latency) 최소화.

### 3. 트래픽 흐름 (U-Shape Journey)
1. 시작: User가 HTTPS(L7) 요청 전송.
2. 검문: API Gateway/WAF가 L7 데이터를 열어 보안 위협 검사 및 필터링.
3. 포장: 내부 망 전달을 위해 TCP(L4) 및 IP(L3) 패킷으로 다시 캡슐화.
4. 가속: NLB가 L4 정보만 확인하여 백엔드 EC2로 데이터 토스.
5. 처리: EC2의 웹 서버가 모든 포장을 뜯고 L7 데이터를 최종 복호화하여 로직 수행.

## 확장 (Connection)
- 연결: "시력(L7/WAF)"이 필요한 구간과 "근력(L4/NLB)"이 필요한 구간을 전략적으로 배치.
- 응용: 고성능이 필요한 MSA 환경에서는 외부 노출은 API Gateway(보안)로, 내부 통신은 NLB(속도)로 구성하는 하이브리드 패턴 사용.

---
See Also: 
- [[3-Tier Security Architecture]]