---
created: 2026-06-17
updated: 2026-06-17
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - architecture
  - unit
publish: true
---
## Context
FC/CNN/RNN/Transformer/SSM을 학습하면서 각 구조마다 계산 단위(unit)가 무엇을 입력으로 보고 무엇을 출력하는지가 다름을 파악했다.

## Insight
### 계산 단위(unit)는 입력 범위와 출력 형태로 구분된다

unit이란 레이어 안에서 독립적으로 계산을 수행하고 다음 레이어로 값을 넘기는 최소 단위다.

```
구조          unit 명칭       입력 범위            출력
FC            뉴런            전체 입력            스칼라 1개
CNN           공간 위치       커널 크기만큼 (일부)  스칼라 1개 (채널당)
RNN           타임스텝        현재 토큰 + h        벡터 1개 (h)
Transformer   토큰 위치       전체 토큰 참조        벡터 1개
SSM           토큰 위치       현재 토큰 + h        벡터 1개 (h)
```

### "전체를 본다"와 "전체를 가진다"는 다르다

Transformer는 Attention으로 전체 토큰을 참조하지만, 각 unit이 출력으로 가져가는 건 자기 토큰의 벡터 1개다.

```
토큰1: 전체(토큰1,2,3,4) 참조 → 출력 벡터 1개 (맥락이 녹아있음)
토큰2: 전체(토큰1,2,3,4) 참조 → 출력 벡터 1개
```

FC 뉴런도 전체를 참조하지만 출력이 스칼라다. 참조 범위가 같아도 출력 형태가 다르다.

### CNN만 진짜로 입력의 일부를 본다

```
FC:          전체 참조 → 스칼라
CNN:         일부 참조 (커널 크기) → 스칼라  ← 유일하게 국소적
Transformer: 전체 참조 → 벡터
RNN/SSM:     현재 + 압축 과거 참조 → 벡터
```

CNN의 국소성이 이미지에 적합한 이유가 여기 있다. 엣지나 질감 같은 패턴은 주변 픽셀만 보면 감지할 수 있다.

### 레이어가 깊어질수록 unit이 반응하는 특징이 추상화된다

```
얕은 레이어 unit: 엣지, 색상 경계 등 저수준 특징에 반응
깊은 레이어 unit: 형태, 객체, 의미 등 고수준 특징에 반응
```

이 추상화 과정이 "분석하고 다음 레이어로 넘긴다"의 실체다.

## Related
- [[FC assigns independent weights to each neuron making it parameter-inefficient]] — FC unit의 특징
- [[CNN shares one kernel across spatial positions to detect location-invariant patterns]] — CNN unit의 국소성
- [[RNN accumulates past inputs into a fixed-size hidden state across time steps]] — RNN unit의 시간 압축
- [[Transformer computes all token relationships simultaneously through QKV attention]] — Transformer unit의 전체 참조
- [[SSM replaces nonlinear recurrence with linear state equations enabling parallel training]] — SSM unit의 구조
- [[Each backbone architecture is optimized for a different data structure]] — 구조 축 전체 비교
- [[Activation function prevents stacked linear layers from collapsing into one]] — unit 내 활성화 함수의 역할
- [[Neural network computation graph connects nodes through runtime-allocated memory buffers]] — 계산 그래프 관점에서의 노드/연결 구조
