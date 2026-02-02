---
created: 2026-01-06
tags:
  - AWS
  - alternate_contacts
  - account
  - root
---
# AWS Alternate Contacts

## 요약 (Summary)
루트 사용자 외에 결제, 운영, 보안 전담 담당자에게 중요 알림이 직접 전달되도록 경로를 최적화하는 계정 관리 설정

## 배경 (Background)
- 탄생 배경: 모든 계정 알림이 루트 이메일로만 집중될 경우, 실제 담당자가 메일을 확인하지 못해 결제 실패나 보안 사고 대응이 지연되는 문제가 발생함
- 핵심 과제: 마스터 권한을 가진 루트 계정의 보안을 유지하면서도, 특정 분야의 알림을 해당 전문가에게 정확하고 신속하게 전달하는 체계가 필요했음

## 솔루션 (Solution)
- 핵심 설계: AWS 계정 설정 내에 Billing(결제), Operations(운영), Security(보안) 세 가지 전용 연락처 필드를 구현
- 작동 메커니즘: AWS에서 특정 범주의 이벤트(예: 예산 초과, 서비스 점검 공지, 보안 위협)가 발생하면, 시스템이 이를 분류하여 등록된 대체 연락처로 이메일을 우선 발송함

## 변별점 (Distinction)
- 비유: 회사의 대표 번호로 전화를 걸어 안내원을 거치는 대신, 필요한 부서의 직통 내선 번호를 눌러 바로 연결하는 시스템
- 대안과의 차이: 
	 - [Root User Email]: 모든 정보를 한곳으로 모아 관리 부하와 수신 누락 위험이 큰 반면, Alternate Contacts는 역할별로 정보를 분산하여 대응 속도와 전문성을 높임

---
See Also:
- [[Organizations]]
- [[Distribution List (Email Group)]]