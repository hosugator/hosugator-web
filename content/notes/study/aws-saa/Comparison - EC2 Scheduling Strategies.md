---
created: 2025-12-23 Tue
tags:
  - comparison
  - ec2
  - automation
  - eventbridge
  - lambda
reference:
  - "[[AWS Instance Scheduler Overview]]"
  - "[[EC2 Stop/Start Automation]]"
  - "[[Comparison - RDS Scheduling Methods]]"
---
# Comparison - EC2 Scheduling Strategies

## 비교 목적 (Objective)
지원이 중단된 Scheduled RI를 대체하여, 프로그래밍 방식으로 인스턴스 가동 시간을 제어하는 방안을 검토합니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[Scheduled RI]] (Legacy) | [[EventBridge + Lambda]] (Modern) |
| :--- | :--- | :--- |
| **제어 방식** | AWS가 정해진 시간에 용량 할당 | **사용자가 API 호출로 직접 껐다 켬** |
| **비용 절감** | 예약된 시간만큼 할인된 고정비 | **꺼져 있는 동안 컴퓨팅 비용 0원** |
| **유연성** | 예약 변경이 까다로움 | **코드 수정으로 즉시 스케줄 변경 가능** |
| **운영 오버헤드** | 낮음 (구매 후 방치) | 중간 (Lambda 코드 및 권한 관리 필요) |

## 선택 기준 및 로직 (Selection Criteria)

### [[EventBridge + Lambda]] 조합을 선택해야 하는 경우
* **조건:** 69번 문제처럼 특정 요일에만 인스턴스가 필요하고, 사용하지 않는 시간의 비용을 완전히 제거하고 싶을 때
* **조건:** RDS와 EC2의 스케줄을 동일한 로직으로 통합 관리하고 싶을 때

---
**Conclusion:**
인스턴스를 물리적으로 중지시키는 자동화는 현재 AWS에서 가장 확실한 '시간 기반 비용 절감' 전략입니다.