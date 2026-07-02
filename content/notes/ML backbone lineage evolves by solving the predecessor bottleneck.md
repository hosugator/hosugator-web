---
created: 2026-06-16
updated: 2026-06-16
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - machine-learning
  - deep-learning
  - architecture
  - cnn
  - transformer
  - ssm
publish: true
---
## Context
Edge AI LMR 프로젝트에서 U-Net, YOLO, PatchCore를 실제로 적용하면서 "이 구조들은 왜 생겨났는가"를 체계화할 필요가 생겼다. ML 아키텍처를 태스크·모달리티·학습 패러다임 등 여러 축으로 나눌 때, **구조(Backbone) 축의 계보**가 가장 근본적인 질문과 연결된다.

## Insight
각 세대의 주류 구조는 이전 구조의 핵심 병목을 해소하며 등장했다. 병목을 이해하면 "왜 이 구조가 쓰이는지"가 자연스럽게 따라온다.

| 구조              | 핵심 아이디어                     | 해소한 병목                   | 남긴 병목                            |
| --------------- | --------------------------- | ------------------------ | -------------------------------- |
| **CNN**         | 지역 필터 + 파라미터 공유             | FC 레이어의 파라미터 폭발          | 멀리 떨어진 픽셀 관계를 보려면 깊이가 필요         |
| **RNN / LSTM**  | 은닉 상태로 순서 정보 유지             | CNN의 시퀀스 처리 불가           | 순차 처리 → 병렬화 불가, 장거리 의존성 소실       |
| **Transformer** | Self-Attention으로 전체 위치 쌍 비교 | RNN의 병렬화 불가 + 장거리 의존성 소실 | O(n²) 메모리·연산 — 긴 시퀀스에서 비쌈        |
| **SSM (Mamba)** | 선형 순환으로 시퀀스 모델링             | Transformer의 O(n²) 복잡도   | Vision에서 Transformer 대비 아직 검증 부족 |

### 병목 계보가 실무 선택의 기준이 된다

YOLO가 Transformer 계열(DETR)보다 실무에서 여전히 많이 쓰이는 건 O(n²)을 피하는 실용적 이유가 있다. 반대로 PatchCore가 CNN backbone(ResNet 등)을 고정 사용하는 건 CNN이 남긴 "지역 특징 추출"이라는 유산을 전이학습으로 재활용하기 때문이다.

구조 선택의 실질적 기준: **"어느 병목을 내가 감당할 수 있는가"**

- 실시간 추론 + 소규모 데이터 → CNN 계열 (YOLO, EfficientNet)
- 전역 문맥 필요 + 대규모 데이터 → Transformer 계열 (ViT, DETR)
- 긴 시퀀스 + 메모리 제약 → SSM 계열 (Mamba, 검토 단계)

## Related
- [[비전 모델 설계 비교 - MobileNet EfficientNet ViT DETR]] — 각 구조의 구체적 모델별 성능·적합 상황 비교
- [[AnomalyDetection_MVTecAD_PatchCore_ROI]] — CNN backbone 위에서 동작하는 PatchCore 실전 적용
- [[Feature Embedding - 사전학습 CNN을 특징 추출기로 활용하는 원리]] — CNN이 남긴 유산: pretrained backbone 재사용 원리
- [[전이 학습 - 사전학습 모델 재사용 전략]] — 구조 전환기에도 지속되는 전이학습 전략
