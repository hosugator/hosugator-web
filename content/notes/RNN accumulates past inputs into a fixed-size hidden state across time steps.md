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
  - rnn
  - lstm
publish: true
---
## Context
CNN이 공간을 슬라이딩하듯 RNN은 시간을 슬라이딩한다는 관점에서 구조를 학습했다.

## Insight
### h는 시간 축을 가로질러 전달되는 고정 크기 기억이다

CNN이 공간 위치 간 가중치를 공유하듯, RNN은 시간 축 간 가중치를 공유한다.

```
"나는"   + h0(빈값) → [W, U] → h1 → y1
"밥을"   + h1       → [W, U] → h2 → y2   ← 같은 W, U 재사용
"먹었다" + h2       → [W, U] → h3 → y3
```

h는 고정 크기(예: 256차원)다. 토큰이 늘어도 h 크기는 변하지 않는다. 대신 새 토큰이 들어올 때마다 h를 덮어쓰며 업데이트한다.

### 기억 소실의 원인은 h의 고정 크기다

h가 커지는 게 아니라 고정 크기에 계속 덮어쓰다 보니 초기 입력 정보가 희석된다.

```
256차원 공간에 1000개 토큰 정보를 우겨넣으려다 앞쪽 정보가 밀려남
→ 기울기 소실(Vanishing Gradient) 문제
```

### LSTM은 게이트로 기억/망각을 제어한다

```
forget gate  : 이전 h에서 무엇을 지울지
input gate   : 현재 입력에서 무엇을 기억할지
output gate  : h에서 무엇을 출력할지
```

완전히 해결하지는 못했고, 이것이 Transformer 등장의 배경이 됐다.

## Related
- [[CNN shares one kernel across spatial positions to detect location-invariant patterns]] — 공간 슬라이딩 vs 시간 슬라이딩
- [[Transformer computes all token relationships simultaneously through QKV attention]] — RNN의 순차 처리 한계를 병렬화로 해결한 구조