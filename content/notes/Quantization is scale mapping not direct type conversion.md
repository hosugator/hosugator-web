---
created: 2026-06-04
updated: 2026-06-04
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - quantization
  - ml
  - llm
  - inference-optimization
publish: true
---
## Context
LLM 추론 최적화를 알아보다 양자화 개념을 처음 제대로 이해함. "가중치가 실수인데 어떻게 정수로 저장하나?" 라는 의문에서 출발. float→int가 직접 변환이 아니라 스케일 매핑이라는 걸 처음 인식한 시점.

## Insight
### 양자화의 핵심은 자료형 변환이 아니라 범위 스케일 매핑이다
float32 가중치를 int8/int4로 직접 변환하는 게 아니라, 실수 값의 분포 범위를 정수 격자에 **근사 매핑**한다.

```
int_val = round(float_val / scale + zero_point)
float_val ≈ (int_val - zero_point) * scale   # 복원 시 약간의 오차 발생
```

수백만 개의 가중치는 int로 저장하고, `scale`과 `zero_point` 두 값만 float로 보존한다. 압축률은 이 비율에서 나온다.

### int4는 16단계로 실수 분포를 근사한다
LLM 가중치 분포는 대부분 0 근처에 몰려있어 16~256단계 근사로도 실제 추론 품질 하락이 작다. 이 분포 특성이 양자화가 작동하는 이유다.

### GGUF/GPTQ/AWQ의 차이는 scale 결정 방식의 정교함이다
- **static quantization**: 가중치 분포 전체를 보고 scale 결정
- **dynamic quantization**: 실제 입력 데이터를 흘려보면서 동적으로 결정
- **per-channel**: 레이어마다 다른 scale 사용 (더 정교)

양자화 포맷 간 품질 차이는 결국 "scale을 얼마나 정교하게 잡느냐"의 차이로 귀결된다.

## Related
- [[Edge-AI]]