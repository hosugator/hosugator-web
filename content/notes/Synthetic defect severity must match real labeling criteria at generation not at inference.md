---
created: 2026-06-29
updated: 2026-06-29
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - ml
  - defect-generation
  - stable-diffusion
  - vdg
  - labeling
  - segmentation
publish: true
---
## Context
Align AI 라인 검출 모델에서 SD 기반 VDG 합성 데이터 전략을 검토하면서, VDG 라벨이 실제 라벨링 기준과 어떻게 다른지를 탐구했다. 추론 시 threshold로 제어하면 되지 않냐는 질문에서 구조적 문제를 발견했다.

## Insight

### VDG는 생성된 모든 결함을 1로 라벨링하지만 실제 라벨링은 기준 미달 결함을 0으로 처리한다

```
실제 라벨링:  subtle 결함 → 검수자 판단 → 기준 미달 시 0 (정상 처리)
VDG:         inpainting mask = GT mask → 생성된 모든 결함 → 무조건 1
```

라벨의 binary 구조 자체는 동일하지만, 어떤 결함을 1로 처리하느냐의 기준이 다르다.

### 이 미스매치가 있으면 추론 시 threshold 제어가 동작하지 않는다

모델이 subtle 패턴도 1로 학습했다면, 추론 시 subtle 결함에도 높은 확률을 배정한다. 결과적으로 obvious/subtle 간 score gap이 사라진다.

```
threshold 제어가 동작하는 전제:
  obvious 결함 → 0.9+
  subtle 결함  → 0.4~0.6   ← gap 존재
  정상         → 0.1~

VDG로 subtle을 모두 1 학습 시:
  obvious 결함 → 0.9+
  subtle 결함  → 0.8+       ← gap 소멸 → threshold로 분리 불가
  정상         → 0.1~
```

### 결함 판정 기준의 성격이 전략을 결정한다

| 기준 | 후처리 제어 가능 여부 | 전략 |
|---|---|---|
| 크기 (픽셀 수) | 가능 | 느슨하게 생성 → connected component 크기 필터 |
| 패임 깊이 / 선명도 | 불가 (2D 이미지에 깊이 정보 없음) | 생성 단계에서 inpainting strength 기준 설정 |

크기 기준이면 모델 출력 후 연결 요소 분석으로 소형 결함을 제거할 수 있다. 패임·선명도 기준이면 모델이 학습 시 이미 이를 구분할 수 없으므로 생성 단계에서 기준에 맞는 결함만 만들어야 한다.

### inpainting strength 기준 설정은 실제 라벨 데이터를 앵커로 삼는다

strength 자체가 목적이 아니라 "실제 판정 기준을 통과하는 최소 strength"를 찾는 것이다.

- 실제 데이터 역산: 라벨링된 결함의 배경 대비 intensity 차이를 측정 → 일치하는 strength 범위 도출
- 검수자 평가: 여러 strength 샘플을 검수자에게 제시 → 불량 판정 받는 최솟값 확인
- 기존 모델 필터링: 실제 데이터 학습 모델로 SD 생성물을 필터링 → 탐지되는 것만 사용

세 방법 모두 공통으로 실제 라벨링 기준을 앵커로 삼는다. 실제 데이터가 없으면 기준 자체를 세우기 어렵다.

## Related
- [[Physics-aware VDG generates defect data with FMEA prompts and Poisson blending]] — VDG 파이프라인 구조. 생성 품질보다 하위 성능이 검증 기준이라는 동일 원칙
- [[Operator label quality is the hidden ceiling for supervised segmentation over anomaly detection]] — 라벨 품질이 모델 성능의 실질적 천장이 된다는 연장선
- [[Segmentation position extraction separates mask post-processing from coordinate representation]] — 마스크 후처리와 좌표 추출이 독립 단계라는 구조 (크기 기준 필터링에 해당)
