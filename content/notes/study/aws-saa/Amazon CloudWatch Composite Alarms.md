---
created: 2025-12-19
tags:
  - aws
  - cloudwatch
  - alarm
  - noise_reduction
reference:
  - "[[Amazon CloudWatch]]"
---

# Amazon CloudWatch Composite Alarms

## 정의 (Definition)
여러 개의 개별 지표 알람 상태를 논리 연산자(AND, OR)로 결합하여 하나의 상위 알람 상태를 결정하는 고급 알람 관리 기능

## 핵심 맥락 (Context & Why)
### Problem
단일 지표 알람만 사용할 경우, 짧은 시간의 일시적인 급증이나 중요하지 않은 개별 지표의 변화에도 불필요한 알람(False Alarm)이 쏟아져 관리자가 실제 장애를 놓칠 위험이 있습니다.
### Solution
"CPU 부하가 높고 동시에 디스크 IOPS도 높을 때"와 같이 실제 장애 상황을 대변하는 복합 조건을 설정함으로써 알람의 정확도를 높이고 운영 소음을 줄입니다.

## 작동 원리 (Mechanism) 
### 하위 알람 생성
모니터링이 필요한 각 지표(CPU, Memory, IOPS 등)에 대해 개별적인 메트릭 알람을 먼저 생성합니다.
### 논리 규칙 설정
생성된 하위 알람들을 대상으로 `ALARM(CPU_High) AND ALARM(IOPS_High)`와 같은 논리식을 구성하여 복합 알람을 정의합니다.
### 상태 전이 및 통지
모든 조건이 충족되어 복합 알람의 상태가 변할 때만 단일한 SNS 알림이나 자동화 조치를 실행합니다.

## 유비 및 비교 (Analogy & Comparison)
### It's like
보안 시스템에서 적외선 센서 하나가 울릴 때마다 경보를 울리는 대신, 적외선 센서와 열 감지기가 동시에 반응할 때만 실제 침입으로 간주하고 비상벨을 울리는 것과 같습니다.
### vs (유사 개념)
- Metric Alarm: 하나의 지표만 감시하며, 여러 지표 간의 상관관계를 판단할 수 없습니다.
- Composite Alarm: 여러 알람의 상태를 종합하여 시스템의 총체적인 건강 상태를 판단합니다.

## 예시 및 구조 (Example/Structure)
Question 56 해결 사례:
1. 알람 1: CPU Utilization > 50%
2. 알람 2: High Read IOPS
3. 복합 알람: `ALARM(1) AND ALARM(2)` -> 이 조건이 충족될 때만 관리자에게 긴급 알림 전송

---
See Also:
- [[Reducing Alarm Noise with CloudWatch]]
- [[CloudWatch Metric Math]]