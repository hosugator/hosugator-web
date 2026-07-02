---
created: 2026-05-21
updated: 2026-05-21
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - ml
  - collaboration
  - deployment
  - onnx
  - packaging
  - internalization
publish: true
---
## Context

성균관대 AOI 협업에서 ML 모델 산출물을 어떤 형태로 요청할지 결정하는 과정.
핵심 요구사항: 현장 재학습(제품·설비 변경 시 반복), 파트너 과제 종료 후 자체 유지보수.
"Python으로 제한하지 말자"는 피드백을 받아 언어 중립성도 검토했다.

## Insight

### 재학습과 내재화가 둘 다 필요하면 소스 코드 외에 선택지가 없다

| 형태 | 재학습 | 내재화/수정 | 언어 독립 | 적합 상황 |
|------|--------|------------|----------|----------|
| 소스 코드 (패키지) | ✓ | ✓ | ✗ | 과제 종료 후 자체 유지, 현장 재학습 |
| REST API | ✗ | ✗ | ✓ | 파트너가 모델을 계속 관리 |
| ONNX 모델 파일 | ✗ | ✗ | ✓ | 추론 전용, 경량 배포 |
| wheel (빌드 패키지) | ✗ | ✗ | ✗ | 파트너 IP 보호 우선 |
| Docker 이미지 | ✗ | ✗ | ✓ | 환경 격리·배포 편의 우선 |

핵심 분기점:
1. **재학습이 필요한가?** → 소스 코드 필수. 나머지는 모두 불가.
2. **파트너 관계 종료 후에도 유지해야 하는가?** → 소스 코드 필수. REST API는 파트너 서버에 의존이 남는다.

### 소스 코드 + ONNX export를 함께 요청하면 두 마리 토끼를 잡는다

소스 코드로 재학습·수정을 확보하고, ONNX export로 배포 유연성(언어 독립, 경량 추론)을 확보한다.
어차피 주요 프레임워크(PyTorch, TensorFlow, MATLAB)는 모두 ONNX export를 지원하므로 언어를 특정할 필요가 없다.

### REST API는 협업이 아니라 의존이다

파트너가 서버를 유지하는 한 편리하지만, 과제 종료·담당자 이탈·서버 장애 시 추론 자체가 불가능해진다.
엣지 환경(오프라인 현장)에서는 구조적으로 선택 불가.

## 관련 노트

- [[How to inference with sole object independent with language]] — ONNX Runtime이 언어 독립성을 확보하는 원리
- [[Edge AI 배포 전략 - Docker vs 모델 파일]] — 배포 계층 전략 전반
