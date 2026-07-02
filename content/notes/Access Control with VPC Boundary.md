---
created: 2026-01-26 10:19
tags:
  - aws
  - vpc
  - security
  - boundary
  - 
updated: 2026-02-14 20:27
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[MOC - AWS SAA]]"
publish: true
---
# VPC Boundary

## 본질 (Essence)
우리 집 마당에 들어온 사람은 '울타리(보안그룹)'로 막고, 우리 집 밖에 있는 공용 주차장은 '이용 약관(리소스 정책)'으로 제한한다.

## 구조 (Mechanism)
- 정의: AWS 리소스가 논리적으로 격리된 가상 네트워크(VPC) 내부에 존재하는지, 혹은 AWS 공용 네트워크망에 존재하는지에 따라 결정되는 보안 통제 경계.
- 핵심: VPC 내부 리소스는 네트워크 인터페이스(ENI)를 통해 '물리적/네트워크적'으로 차단(SG/NACL)하지만, VPC 외부 서비스는 엔드포인트를 통해 접근하므로 '자격 증명 및 조건' 중심의 정책(Resource Policy)으로 제어함.

## 확장 (Connection)
- 연결: 운영 체제의 '커널 모드(Kernel Mode)'와 '유저 모드(User Mode)' 구분 - 커널 내부 자원은 직접 제어하지만, 외부 시스템 호출은 인터페이스 정책을 따르는 것과 유사함.
- 응용: 사내 전산망(VPC) 내부의 서버는 방화벽으로 막고, 외부의 Google Drive(S3 유사 서비스)는 공유 권한 설정으로 접근을 제어하는 보안 설계.

---
See Also: 
- [[3-Tier Security Architecture]]