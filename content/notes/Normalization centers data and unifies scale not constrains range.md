---
created: 2026-06-04
updated: 2026-06-04
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml
  - preprocessing
  - normalization
publish: true
---

## Context

evaluate.py 쉐도잉 중 역정규화 식 `img * 0.5 + 0.5`의 의미를 추적하면서, 정규화의 목적을 잘못 이해하고 있었음을 발견했다. "값을 -1~1로 맞추는 것"이 목적이라고 생각했으나 그게 아니었다.

## Insight

### 정규화의 두 목적은 0 중심화와 스케일 통일이다

```
원본 픽셀: 0 ~ 255
÷ 255        → 0.0 ~ 1.0
- mean       → 0 중심  (편향 제거)
÷ std        → 스케일 통일
```

- **mean 빼기**: 데이터 분포의 중심을 0으로 이동. 편향을 제거하는 것이 목적이지 범위를 맞추는 게 아니다.
- **std 나누기**: 값의 폭(스케일)을 통일. 범위를 1로 표준화하는 것이지 -1~1을 보장하는 게 아니다.

### 결과 범위가 -1~1이 아니어도 무관하다

mean=0.3, std=0.2인 데이터를 정규화하면 결과가 -1.5~3.5가 될 수 있다. 신경망이 요구하는 건 **대략적인 0 중심 + 비슷한 스케일**이지 정확한 범위 제한이 아니다.

### mean=0.5가 올바른 값인지는 데이터 분포에 달려 있다

0~1로 압축한 이미지가 균등 분포라면 이론적 mean=0.5가 맞다. 하지만 실제 이미지는 조명 환경에 따라 mean이 0.3이 될 수도 있다. mean=0.5를 쓰면 중심이 0이 아니라 편향이 생긴다. 정확한 정규화는 데이터셋 전체 픽셀값의 실제 mean/std를 계산해 사용한다.

align-ai에서 0.5/0.5를 쓴 건 소규모 scratch 학습에서 근사값으로 충분하다는 판단이었다.

## Related

- [[Normalization]] — 정규화 개념 기본 노트
- [[Shadowing requires spec-first and adversarial review to build judgment not just familiarity]] — 이 인사이트가 나온 evaluate.py 쉐도잉 맥락
