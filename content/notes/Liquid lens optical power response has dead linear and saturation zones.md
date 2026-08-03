---
created: 2026-06-30
updated: 2026-06-30
type: study
status: 2-stable
subject: "[[Optics]]"
project: "[[Corning Varioptic]]"
tags:
  - liquid-lens
  - optics
  - electrowetting
publish: true
---
## Context
Corning Varioptic 트레이닝 세션 1(2026-06-30)에서 A25H TEDS(Technical Data Sheet)를 처음 읽으며 액체 렌즈의 전기-광학 특성 곡선을 처음 접했다. 광학 부품의 데이터시트를 해석하는 것 자체가 처음이었다.

## Insight
### 굴절력 단위: 디옵터는 초점 거리의 역수다

디옵터(D) = 1 / 초점 거리(m). 10D → 초점 거리 10cm, 20D → 5cm, 음수 → 발산 렌즈. 일반 소비자 렌즈 도수와 동일한 단위다.

### 전압-굴절력 곡선은 세 구간으로 나뉜다

1. **무반응 구간** (0 ~ 약 27V): 전압을 올려도 굴절력 변화 없음. 임계 전압 이하.
2. **선형 구간**: 전압 증가에 따라 굴절력이 거의 선형으로 증가. 실제 제어에 사용하는 구간.
3. **포화 구간**: 전압을 올려도 굴절력이 더 이상 증가하지 않음. 최대 전압 60~70V(드라이버 사양 의존).

### 히스테리시스: 상승 경로와 하강 경로의 값이 다르다

같은 전압이라도 전압을 올릴 때와 내릴 때 굴절력 값이 미세하게 다르다. A25H 기준 0.3D(전형값). 정밀 캘리브레이션이 필요한 이유다.

### 고전압에서 파면 오차 증가는 렌즈 결함이 아니다

파면 오차(wavefront error): 실제 구면이 이상적 구면에서 벗어나는 정도. A25H 전형값 ~40nm RMS(우수). 고전압에서 파면 오차가 증가하는 것은 구면 수차(spherical aberration) — 완벽한 구면 렌즈라도 발생하는 물리적 현상이며 렌즈 불량이 아니다.

## Related
- [[Liquid lens must be driven with AC voltage to prevent insulating layer degradation]] — 전기 구동 방식 및 신뢰성 조건
- [[Liquid lens requires 50 micron front clearance for thermal volume expansion]] — 기계적 통합 필수 조건
