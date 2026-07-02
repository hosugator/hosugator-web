---
created: 2026-03-24 08:34
updated: 2026-03-24 08:48
type: insight
status: 1-draft
subject: "[[Web]]"
project: "[[Edge AI LMR]]"
tags:
  -
publish: true
---
# 대시보드 디자인
## 설비 대시보드
- 설비 대시보드에 어떤 데이터 시각화가 포함되어야 사용자 관점에서 가장 효과적일까?
- 일단 각 모델들의 추론 결과를 메인 화면에 띄워주는 것으로 초안 화면을 구성해보자.
- 아래의 4개 모델들을 메인 화면에 4등분하여 띄운다.
	- 공정 최적화
		- 전체 공정 흐름
		- 현재 공정 단계 
		- 현재 경과 시간 (평균 시간과 함께)
		- 예상 완료 시간 (평균 시간과 함께)
	- 에너지 최적화
		- 전체 공정 에너지 사용량
		- 현재 공정 에너지 사용량 (평균 사용량과 함께)
		- 예상 에너지 사용량
	- 품질 예측
		- 전체 품질 예측
		- 현재 공정 품질 예측 (평균 품질과 함께)
		- 품질 예측 상태 메시지
	- 이상 탐지
		- 전체 PLC 데이터 요약
		- 현재 PLC 데이터
		- 이상 탐지 상태 메시지
- 좌상단에는 설비의 메타 데이터
- 우상단에는 현장 환경 데이터
- 좌하단에는 통합 판단 상태(각 모델들의 판단을 종합하여 한 줄의 상태로 변환)
- 우하단에는 보류
## KPI 및 성능 지표 고도화
### Diagnostic 열원·온도 & 이상탐지
공정 지표: Thermal Std. Dev (8개 존 온도 편차의 표준편차)
모델 지표: Anomaly F1-Score (85% Benchmark)
배치: 존 매트릭스 하단에 편차 수치 표시, 카드 헤더에 F1-Score 배지 배치.
### Optimization 에너지 관리
공정 지표: SEC (Specific Energy Consumption, kWh/Unit)
모델 지표: AI Reduction Rate (15% Benchmark)
배치: Shadow Baseline Overlay 차트 중앙에 실시간 SEC 및 목표 대비 절감률 시각화.
### Predictive 생산성 & 품질예측
공정 지표: Net Cycle Time (목표 50s 대비 실적) / Yield Rate (%)
모델 지표: Predictive Precision/Recall (85% Benchmark)
배치: 수율 차트 상단에 모델 정밀도(Precision) 지표 노출.
### Prescriptive 통합 어드바이저
논리 근거: 각 처방 메시지 뒤에 "Based on 92% Precision Model"과 같은 신뢰도 태그 병기.
비즈니스 가치: 금일 누적 에너지 절감액(ROI)을 가장 강조하여 표시.