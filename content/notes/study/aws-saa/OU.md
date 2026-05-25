---
created: 2026-01-16
tags:
  - AWS
  - Governance
  - Organization
---
# Organizational Units (OU)

## 본질 (Essence)
수많은 계정들을 팀이나 목적에 맞게 분류하여 담아두는 '관리용 폴더'

## 구조 (Mechanism)
- **정의**: AWS Organizations 내에서 계정들을 논리적으로 그룹화하는 계층적 컨테이너입니다.
- **핵심**: 
    - **계층 구조**: OU 내부에 다른 OU를 포함할 수 있어 기업의 조직도나 환경(Dev/Prod)에 맞춘 설계가 가능합니다.
    - **정책 적용 단위**: SCP(Service Control Policy)를 OU 단위로 할당하여, 해당 폴더에 속한 모든 계정에 동일한 보안 가이드레일을 일괄 적용합니다.

## 확장 (Connection)
- **연결**: 컴퓨터의 폴더 구조와 유사하며, 상위 폴더의 권한 설정이 하위 파일(계정)에 상속되는 원리와 같음
- **응용**: 개발팀 전용 OU를 만들고 그 아래에 개발, 검증용 계정들을 배치하여 공통 보안 정책을 한 번에 관리함

---
See Also: 
- [[AWS Organizations]]