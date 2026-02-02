---
created: 2025-12-26
tags:
  - Security
  - Networking
  - Performance
reference:
  - "[[Application Load Balancer]]"
  - "[[AWS Certificate Manager]]"
  - "[[SSL · TLS]]"
---
# SSL Termination (SSL 오프로딩)

## 정의 (Definition)
네트워크 통신의 암호화 해제 작업을 백엔드 서버(EC2) 대신 앞단의 전용 장비(Load Balancer)에서 처리하는 보안 구성 방식

## 핵심 맥락 (Context & Why)
### Problem
SSL/TLS 암호화 및 복호화 과정은 수학적으로 매우 복잡하여 서버의 CPU 자원을 많이 소모함. 트래픽이 늘어나면 서버가 실제 비즈니스 로직을 처리할 자원이 부족해져 서비스가 느려짐 
### Solution
중앙 집중화된 로드 밸런서(ALB)에서 인증서를 관리하고 모든 복호화 작업을 수행하여, 서버에게는 가벼운 평문(HTTP) 데이터만 전달함으로써 서버 부하를 제거함

## 작동 원리 (Mechanism) 
### 1단계: 인증서 준비
보유 중인 SSL 인증서를 ACM(AWS Certificate Manager)으로 가져오거나 새로 발급받음
### 2단계: 로드 밸런서 설정
ALB에 HTTPS(443) 리스너를 생성하고 ACM 인증서를 연결함
### 3단계: 트래픽 처리
외부 요청(HTTPS) 수신 -> ALB가 복호화 수행 -> 백엔드 서버로 평문(HTTP) 전달 -> 서버는 데이터 처리만 전담

## 유비 및 비교 (Analogy & Comparison)
### It's like
식당 주방장(EC2)이 요리도 하고 입구에서 손님들 외투도 받아 보관(SSL 연산)하던 상황에서, 전문 발렛 파킹 직원(ALB)을 고용하여 입구 업무를 전담시키는 것과 같음. 주방장은 이제 요리에만 집중할 수 있음
### vs (End-to-End Encryption): 
 - SSL Termination: 보안과 성능의 타협점. 내부 네트워크(ALB~EC2)는 평문으로 통신하여 속도가 빠름 
 - End-to-End Encryption: 보안이 극도로 중요하여 서버까지 계속 암호화 상태를 유지함 (성능 부담이 큼)

## 예시 및 구조 (Example/Structure)
사용자 --(HTTPS)--> ALB (SSL 종료) --(HTTP)--> EC2 인스턴스

---
See Also:
- [[AWS Certificate Manager (ACM)]]
- [[Application Load Balancer Listeners]]