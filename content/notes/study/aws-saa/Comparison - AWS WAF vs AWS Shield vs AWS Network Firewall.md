---
created: 2025-12-30
tags: [comparison, security, defense]
---
# Comparison: AWS WAF vs AWS Shield vs AWS Network Firewall

## 비교 목적 (Objective)
인프라의 보호 계층(Layer)과 공격 유형에 따른 최적의 AWS 관리형 보안 서비스 선정

## 요소별 상세 비교 (Feature Matrix)
| 비교 기준 | [[AWS WAF]] | [[AWS Shield]] | [[AWS Network Firewall]] |
| :--- | :--- | :--- | :--- |
| 핵심 본질 | 웹 애플리케이션 계층(L7) 데이터 검사 | 인프라 계층(L3/L4) 대규모 물량 방어 | VPC 전반의 네트워크 경로 통제 총책 |
| 장점 (Pros) | HTTP/S 내 SQLi, XSS 및 속도 기반 자동 차단 | 전용 성벽을 통한 무상 기본 DDoS 방어 (Standard) | 양방향 감시 및 비 HTTP(FTP 등) 정밀 제어 |
| 단점 (Cons) | 비 HTTP 프로토콜 및 하부 레이어 방어 불가 | 대역폭 방어 중심이며 세부 데이터 검사는 제한됨 | 설정 복잡도가 높으며 Suricata 규칙 관리 필요 |
| 비용/관리 | 규칙/요청 기반 실무형 관리 (매우 낮음) | Standard 무상 / Advanced 고정비 (낮음) | 엔드포인트 유지비 및 트래픽 처리비 (중간) |

## 선택 기준 및 로직 (Selection Logic)

### AWS WAF가 적합한 경우
- 조건 (IF): 웹 서비스 입구에서 손님의 가방(L7 데이터)을 열어 위험물을 걸러내야 할 때
- 이유 (THEN): Rate-based Rule로 비정상 속도의 IP를 자동 식별 및 차단하여 운영 오버헤드를 최소화함

### AWS Shield가 적합한 경우
- 조건 (IF): 성벽 밖에서 밀려드는 거대한 군중(L3/L4 DDoS)의 압박을 견뎌야 할 때
- 이유 (THEN): AWS 글로벌 네트워크 인프라 수준에서 트래픽을 세척(Scrubbing)하여 가용성을 보장함

### AWS Network Firewall이 적합한 경우
- 조건 (IF): 성 내부(VPC)의 모든 도로와 출입문을 감시하여 정해진 경로만 허용해야 할 때
- 이유 (THEN): 인바운드 공격 방어뿐만 아니라 내부 자원의 외부 유출(Outbound)까지 전수 조사하는 총책임자 역할을 수행함

---
Conclusion: WAF와 Shield가 특정 공격에 특화된 '전용 식칼'이라면, Network Firewall은 모든 경로를 통제하는 '다목적 칼(상위 집합)'이나 운영 전문성을 위해 3자 협업(심층 방어) 구조로 설계함