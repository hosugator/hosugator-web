---
created: 2026-05-12
updated: 2026-05-12
version: 1.1.0
project: "[[align-ai]]"
type: portfolio
status: refined
tags: [segmentation, automation, computer-vision, dtk]
---

# Portfolio - Project - AlignAI (CV 정렬 자동화 시스템)

## 💡 Overview
기존 OpenCV 기반의 수동/규칙 기반 정렬 프로그램을 AI 기반의 자동화 시스템으로 전환하는 프로젝트입니다. 픽셀 단위의 정밀한 선(Line) 탐지를 위해 딥러닝 Segmentation 모델을 도입하여 운영 효율성을 극대화했습니다.

---

## 🚀 문제 정의 (Problem Definition)
*   **기존 방식의 한계:** 수동으로 조작하는 OpenCV 필터 기반 방식은 환경 변화(조명, 노이즈)에 취약하며, 정밀한 정렬을 위해 많은 수작업 리소스가 소요됨.
*   **핵심 목표:** 선(Line) 구조물에 대한 딥러닝 기반 Segmentation을 통해 정렬 프로세스를 100% 자동화하고 탐지 안정성을 확보.

---

## 🛠️ 기술적 구현 (Technical Implementation)
*   **모델 아키텍처:** `Segmentation Models PyTorch(SMP)`의 **U-Net** 구조 채택.
    *   **Encoder:** **EfficientNet-B0** (ImageNet 사전학습 가중치 활용으로 소량의 데이터로 고성능 확보).
    *   **Input:** 1-Channel Grayscale (명암 정보 중심의 고속 처리).
*   **최적화 전략:**
    *   **Skip Connection:** 인코더의 위치 정보를 디코더에 직접 전달하여 얇은 선 탐지 시 손실되는 공간 정보 보완.
    *   **Dice Loss 활용:** 데이터 불균형(배경 대비 매우 얇은 선) 문제를 해결하기 위해 Cross-Entropy 대신 Dice Loss 중심의 학습 수행.

---

## 📊 성과 및 수치 (Metrics)
*   **탐지 성공률:** 실제 Q-display 데이터셋 기반 테스트 결과 **탐지 성공률 100%** 달성.
*   **추론 속도:** CPU 환경에서 장당 **~330ms** 수준의 실시간성 확보.
*   **정합성:** 수동 OpenCV 방식 대비 PASS율 91%를 기록하며 인간의 개입 없는 자동 정렬 가능성 입증.

---

## 🧠 회고 및 인사이트
단순히 최신 모델을 사용하는 것보다, **"얇은 선"이라는 도메인 특성**에 맞춰 IoU 수치에 매몰되지 않고 실제 탐지 성공률과 공간 정보 보존(Skip Connection)에 집중한 것이 주효했습니다. 향후 이 시스템을 [[VLM]]과 연동하여 정렬 실패 시 원인을 자연어로 피드백하는 구조로 고도화할 계획입니다.
