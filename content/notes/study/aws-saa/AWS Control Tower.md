---
created: 2025-12-18
tags:
  - aws_saa
  - governance
  - landing_zone
  - multi_account
reference:
  - "[[AWS Organizations]]"
  - "[[AWS Config]]"
  - "[[Comparison - Compliance Enforcement and Monitoring]]"
---
# AWS Control Tower

## 정의 (Definition)
여러 AWS 계정으로 구성된 환경을 AWS 모범 사례에 따라 자동으로 설정하고 중앙에서 거버넌스를 규정하는 랜딩 존 관리 서비스

## 핵심 맥락 (Context & Why)
- Problem: 기업 규모가 커지면서 수십 개의 계정을 운영할 때 각 계정마다 보안 규정이나 리전 제한을 일일이 설정하고 관리하는 것이 불가능함
- Solution: 가드레일이라는 사전 정의된 정책 세트를 통해 계정 생성부터 보안 설정까지 표준화된 환경을 자동으로 구축하고 중앙에서 통제함

## 작동 원리 (Mechanism) 
### 오케스트레이션 및 프로비저닝
사용자가 설정한 가드레일을 기반으로 AWS Organizations를 통해 계정을 생성하고 필요한 보안 베이스라인을 자동으로 배포함
### 가드레일 적용 및 모니터링
서비스 제어 정책(SCP)을 통해 금지된 행동을 차단하고 AWS Config 규칙을 배포하여 실시간으로 규정 준수 여부를 감시함

## 유비 및 비교 (Analogy & Comparison)
- It's like: 신도시를 건설할 때 모든 집들이 일정한 안전 기준과 건축 양식을 지키도록 총괄 지휘하는 도시 계획국
- vs [[AWS Organizations]]: 
	 - AWS Control Tower: Organizations와 Config를 내부적으로 활용하여 사용자에게 더 추상화되고 편리한 관리 UI를 제공하는 상위 서비스임
	 - AWS Organizations: 계정 그룹화와 권한 차단(SCP) 기능만을 제공하는 가장 기초적인 관리 도구임

## 예시 및 구조 (Example/Structure)
새로운 프로젝트 팀을 위해 AWS 계정을 발급할 때 Control Tower의 Account Factory를 사용하면 해당 계정은 생성 즉시 '인터넷 게이트웨이 생성 금지'와 '서울 리전 외 자원 생성 차단' 정책이 자동으로 적용된 상태로 시작됨

---
See Also:
- [[Principle of AWS Control Tower]]
- [[Compositions of Landing Zone]]