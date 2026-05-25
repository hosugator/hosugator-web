---
created: 2026-01-14
tags:
  - aws
  - ssm
  - ssh
  - iam
  - audit
---
# AWS Systems Manager Session Manager

## 본질 (Essence)
열쇠(SSH Key)와 대문(22번 포트) 없이, 신분증(IAM)만으로 성안의 인스턴스에 안전하게 들어가는 '마법의 통로'

## 구조 (Mechanism)
- **정의**: 브라우저나 CLI를 통해 EC2 인스턴스를 안전하게 관리할 수 있게 해주는 완전 관리형 서비스입니다.
- **핵심**: 
    - **IAM 기반 제어**: 개별 SSH 키 관리 대신 IAM 정책으로 접근 권한을 통합 관리합니다.
    - **네트워크 보안**: 인바운드 SSH 포트를 열지 않고도 접속이 가능하며, 모든 활동 로그가 CloudTrail/S3에 기록되어 감사(Audit)가 용이합니다.

## 확장 (Connection)
- **연결**: 전통적인 'Bastion Host'가 성문을 지키는 수문장이라면, 'SSM Session Manager'는 성벽 어디서든 바로 호출할 수 있는 전용 무전기와 같습니다.
- **응용**: 대규모 EC2 환경에서 보안 규정을 준수하면서도 관리자의 편의성과 운영 효율을 극대화해야 할 때 최우선적으로 고려합니다.

---
See Also: 
- [[IAM]]
- [[SSH]]