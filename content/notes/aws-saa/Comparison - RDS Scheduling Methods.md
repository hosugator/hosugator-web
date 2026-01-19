---
created: 2025-12-22 Mon
tags: [comparison, decision_making]
reference:
  - "[[Amazon RDS Stop/Start]]"
  - "[[AWS Lambda]]"
---
# Comparison - RDS Scheduling Methods

## 비교 목적 (Objective)
특정 시간에만 사용하는 RDS 인스턴스의 비용을 최소화하기 위한 자동화 방안을 비교합니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[EC2 Cron Job]] | [[EventBridge + Lambda]] | [[ElastiCache (B)]] |
| :--- | :--- | :--- | :--- |
| **작동 방식** | 서버 내 스케줄러가 API 호출 | **서버리스 이벤트 기반 호출** | 데이터를 캐시에 복사 후 유지 |
| **추가 비용** | EC2 인스턴스 유지 비용 발생 | **거의 없음 (Free Tier 범위 내)** | **Cache 클러스터 비용 추가 발생** |
| **운영 오버헤드** | 서버 관리(OS 패치 등) 필요 | **관리 필요 없음 (Serverless)** | 매우 높음 (데이터 동기화 로직) |
| **적합성** | 낮음 | **매우 높음 (Standard Practice)** | 낮음 (용도에 맞지 않음) |

## 선택 기준 및 로직 (Selection Criteria)

### [[EventBridge + Lambda]]를 선택해야 하는 경우
* **조건:** 정해진 시간에 반복적으로 인스턴스를 끄고 켜야 하며, 추가적인 관리 포인트나 비용을 만들고 싶지 않은 경우
    * *Ex:* 매일 업무 시간(09~18시)에만 개발용 DB 가동

### [[Reserved Instances (RI)]]를 선택해야 하는 경우
* **조건:** 24시간 상시 가동되는 운영 DB의 비용을 줄여야 할 때 (이 문제의 상황과는 반대)

---
**Conclusion:**
정해진 시간에 끄고 켜는 스케줄링의 왕도는 **EventBridge + Lambda** 조합입니다.