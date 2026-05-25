---
created: 2026-01-02
tags: [comparison, security, aws]
---
# Comparison: KMS vs ACM vs Secrets Manager

## 비교 목적 (Objective)
데이터 보호 상태(저장 vs 전송) 및 관리 대상(키 vs 인증서 vs 비번)에 따른 최적 보안 서비스 선정

## 요소별 상세 비교 (Feature Matrix)
| 비교 기준 | [[AWS KMS]] | [[AWS ACM]] | [[Secrets Manager]] |
| :--- | :--- | :--- | :--- |
| 관리 대상 | 암호화용 **열쇠(Key)** | SSL/TLS **인증서** | **자격 증명**(비밀번호/API 키) |
| 주요 용도 | **저장 시 암호화 (At-rest)** | **전송 중 암호화 (In-transit)** | 자격 증명 탈취 방지 및 자동 교체 |
| 비유 | 금고를 여는 실물 열쇠 | 신뢰할 수 있는 기관의 신분증 | 비밀번호가 적힌 보안 메모장 |
| 문제 키워드 | Encrypt at rest, S3/EBS 암호화 | HTTPS, SSL/TLS, Certificate | Rotation, Password, API Key |

## 선택 로직 (Selection Logic)

### AWS KMS가 적합한 경우
- 조건 (IF): RDS 인스턴스나 S3 버킷에 담긴 데이터를 물리적으로 암호화해야 할 때
- 이유 (THEN): KMS 키를 통해 하드웨어 수준에서 데이터 노출을 원천 차단할 수 있음

### AWS ACM이 적합한 경우
- 조건 (IF): 웹사이트에 HTTPS를 적용하여 통신 구간을 보호해야 할 때
- 이유 (THEN): 관리형 인증서를 통해 간편하게 SSL/TLS 보안 통신을 구현할 수 있음

### AWS Secrets Manager가 적합한 경우
- 조건 (IF): DB 접속 비번을 소스 코드에 노출하지 않고 주기적으로 바꾸고 싶을 때
- 이유 (THEN): 암호 자동 교체 기능을 통해 비번 유출 리스크를 최소화할 수 있음

---
Conclusion: 데이터 암호화는 KMS, 통신 암호화는 ACM, 비밀번호 관리는 Secrets Manager가 정답임