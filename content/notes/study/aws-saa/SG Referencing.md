---
created: 2025-12-26
tags:
  - Security
  - Networking
  - Best_Practice
reference:
  - "[[Amazon EC2 Security Groups]]"
---
# 보안 그룹 참조 (Security Group Referencing)

## 정의 (Definition)
보안 그룹 규칙을 설정할 때 특정 IP 대역(CIDR) 대신 다른 보안 그룹의 ID를 소스(Source) 또는 대상(Destination)으로 지정하는 방식

## 핵심 맥락 (Context & Why)
### Problem
클라우드 환경에서는 인스턴스가 수시로 생성/삭제되고 IP가 유동적으로 변함. 이때 IP 기반으로 규칙을 관리하면 인스턴스가 바뀔 때마다 규칙을 수동으로 업데이트해야 하며, 관리 실수로 인해 보안 구멍이 생길 위험이 높음
### Solution
객체 지향적인 접근 방식을 사용하여 "어떤 명찰(SG)을 달고 있는가"를 기준으로 통신을 허용함. 이를 통해 인스턴스의 개별 IP와 상관없이 논리적인 계층 구조에 따라 보안 정책을 유지할 수 있음

## 작동 원리 (Mechanism) 
### 1. 논리적 연결
A 보안 그룹(예: Web-SG)이 B 보안 그룹(예: App-SG)을 참조하도록 설정하면, Web-SG를 부여받은 모든 리소스는 자동으로 App-SG와 통신할 수 있는 자격을 얻음
### 2. 동적 업데이트
오토 스케일링으로 인해 Web-SG를 가진 인스턴스가 1대에서 100대로 늘어나더라도, App-SG의 규칙을 수정할 필요 없이 즉시 모든 신규 인스턴스에 보안 정책이 적용됨

## 유비 및 비교 (Analogy & Comparison)
### It's like
출입 명부에 방문객의 '이름(IP)'을 일일이 적는 대신, 특정 '색깔의 출입증(SG ID)'을 목에 걸고 있는 사람만 통과시키는 것과 같음. 사람이 바뀌어도 출입증만 정해진 것을 차고 있으면 통제 시스템은 그대로 작동함
### vs (IP 기반 참조): 
 - IP 기반: 정적이고 관리가 복잡하며 실수 가능성이 높음 (최소 권한 원칙 준수 어려움)
 - SG 참조: 동적이고 자동화에 최적화되어 있으며 관리 오버헤드가 매우 낮음 (최소 권한 원칙의 정석)

## 예시 및 구조 (Example/Structure)
- DB-SG 인바운드 규칙: [Port: 5432 / Source: App-SG-ID]
- 해석: "App-SG를 할당받은 서버들이라면 IP가 무엇이든 5432 포트로 접속을 허용한다."

---
See Also:
- [[Principle of Least Privilege]]
- [[Three-tier Architecture Security]]