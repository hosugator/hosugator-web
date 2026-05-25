---
created: 2025-12-19
tags:
  - aws
  - systems_manager
  - patching
  - automation
reference:
  - "[[Amazon EC2]]"
  - "[[Application Load Balancer]]"
---

# Automated EC2 Patching with ALB Integration

## 정의 (Definition)
패치 작업 중 서비스 가용성을 유지하기 위해 로드 밸런서에서 인스턴스를 일시적으로 제거하고 업데이트를 수행한 뒤 다시 등록하는 자동화된 운영 절차

## 핵심 맥락 (Context & Why)
### Problem
실행 중인 서버에 직접 패치를 적용하면 프로세스 재시작 등으로 인해 서비스 오류가 발생할 수 있으며, 특히 보안 프로토콜상 패치 중인 인스턴스를 서비스에서 완전히 격리해야 하는 요구사항이 있을 때 수동 관리는 에러 발생 가능성이 높습니다.
### Solution
SSM(Systems Manager)의 자동화 문서와 유지 관리 기간 기능을 결합하여 인스턴스의 서비스 등록 해제, 패치 설치, 재등록 과정을 사람의 개입 없이 안전하고 일관되게 수행합니다.

## 작동 원리 (Mechanism) 
### 작업 스케줄링 (Maintenance Windows)
미리 정의된 점검 시간대에 실행 대상 인스턴스와 수행할 자동화 작업을 연결하여 패치 프로세스가 시작되도록 제어합니다.
### 트래픽 격리 및 패치 (SSM Automation)
AWSEC2-PatchLoadBalancerInstance 문서를 실행하여 대상 그룹에서 인스턴스를 제거(Deregister)하고, 패치 설치 및 재부팅을 완료한 뒤 다시 상태를 검사하여 등록합니다.
### 상태 확인 및 복구
로드 밸런서의 상태 검사(Health Check)를 통과한 인스턴스만 다시 서비스에 투입하여 안정성을 보장합니다.

## 유비 및 비교 (Analogy & Comparison)
### It's like
건물 전체의 전기를 차단하지 않고 한 층씩 전력을 끊어 점검한 뒤 다시 연결하는 순차적 점검 방식과 같습니다.
### vs (유사 개념)
- SSM Patch Manager: 실제 패치를 무엇을 설치할지 정의하는 도구이며, 로드 밸런서 연동과 같은 흐름 제어 기능은 포함하지 않습니다.
- SSM State Manager: 인스턴스의 설정 상태를 지속적으로 유지하는 데 사용되며, 일시적인 패치 워크플로우 실행에는 적합하지 않습니다.

## 예시 및 구조 (Example/Structure)
보안 규정에 따라 매월 세 번째 일요일 새벽 2시에 ALB 뒤의 인스턴스를 패치하는 구조:
Maintenance Window(시간 설정) -> SSM Automation(LB 제거 로직) -> Patch Manager(보안 패치 적용) 순으로 작동합니다.

---
See Also:
- [[AWS Systems Manager Patch Manager]]
- [[AWS Systems Manager Automation]]