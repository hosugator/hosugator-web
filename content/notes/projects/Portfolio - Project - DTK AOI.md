---
created: 2026-05-12
updated: 2026-05-12
version: 1.1.0
project: "[[dtk_aoi]]"
type: portfolio
status: refined
tags: [aoi, quality-control, manufacturing, dtk]
---

# Portfolio - Project - DTK AOI (지능형 품질 예측 시스템)

## 💡 Overview
DTK 내부 생산 라인의 품질 검사를 지능화하기 위한 통합 AOI(Automated Optical Inspection) 시스템입니다. [[Portfolio - EdgeAI LMR]] 프로젝트에서 검증된 기술력을 바탕으로, 전사적 품질 관리 표준을 수립하는 것을 목표로 합니다.

---

## 🚀 문제 정의 (Problem Definition)
*   **파편화된 검사 로직:** 공정별로 분산된 품질 검사 로직을 하나로 통합하고, 데이터 기반의 정량적 품질 지표 수립 필요.
*   **실시간 피드백 부재:** 단순 판정을 넘어, 불량의 원인을 실시간으로 분석하고 차후 공정에 반영하는 Closed-loop 시스템 구축.

---

## 🛠️ 기술적 구현 (Technical Implementation)
*   **통합 파이프라인:** Anomalib(PatchCore) 기반의 이상 탐지 엔진을 핵심으로 하며, 설비 로그와 비전 판정 결과를 1:1 매핑하는 데이터 거버넌스 구축.
*   **시스템 리팩토링:** UI 서버를 Node.js Express에서 **FastAPI**로 전환하여 ML 추론 성능 및 비동기 처리 효율 극대화.
*   **데이터 아키텍처:** [[EdgeAI LMR - 데이터 아키텍처]]의 Cycle_ID(Golden Key) 개념을 이식하여 전사 공정 추적성 확보.

---

## 📊 주요 성과 (Expected Impact)
*   **품질 표준화:** 전 공정 AUROC 99.9% 이상의 고성능 비전 검사 표준 모델 확립.
*   **운영 효율:** 수동 검사 대비 리소스 50% 이상 절감 및 검사 이력의 완벽한 자산화.

---

## 🧠 회고 및 인사이트
이 프로젝트의 핵심은 '모델' 자체가 아니라 **'데이터의 연결'**에 있습니다. 비전 판정 결과가 단순한 Pass/Fail을 넘어 설비의 제어 파라미터와 결합될 때 비로소 '지능형' 시스템이 완성됨을 확인했습니다. 현재는 2차 연도 AOI 연계 고도화를 위한 데이터 파이프라인 검토 단계에 있습니다.
