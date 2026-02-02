---
created: 2026-01-16
tags:
  - AWS
  - IAM
  - Security
---
# The Double-Check Mechanism (양방향 권한 확인)

## 본질 (Essence)
두 개의 서로 다른 계정 간에 권한을 주고받을 때, 주는 쪽과 받는 쪽 모두가 서로를 명시적으로 허용해야만 작동하는 보안 원리

## 구조 (Mechanism)
- **Identity-based Policy (주체 쪽)**: 사용자나 그룹에 붙이는 정책으로, `sts:AssumeRole` 액션과 대상 Role의 ARN을 명시하여 '나갈 수 있는 권한'을 부여합니다.
- **Resource-based Policy (Role 쪽)**: Role의 신뢰 정책(Trust Policy)으로, 외부 계정의 ID를 명시하여 '들어올 수 있는 권한'을 부여합니다.
- **결과**: 두 정책이 마주 보고 있을 때만 STS는 임시 자격 증명을 발급합니다.

## 확장 (Connection)
- **연결**: 국가 간 이동 시 '비자(상대국 허가)'와 '여권(자국 증명)'이 모두 필요한 것과 유사함
- **응용**: 다계정 환경에서 중앙 관리 계정의 유저가 자식 계정으로 넘어가 작업할 때, 양쪽 계정 모두에 관련 IAM 설정을 적절히 배치해야 함

---
See Also: 
- [[AWS STS]]