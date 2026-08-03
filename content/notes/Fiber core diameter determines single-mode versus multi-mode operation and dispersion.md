---
created: 2026-07-15
updated: 2026-07-15
type: study
status: 2-stable
subject: "[[Optics]]"
project: "[[Corning Varioptic]]"
tags:
  - photonics
  - optical-fiber
publish: true
---
## Context
Corning Varioptic 프로젝트에서 DTK의 광통신 관련 리드(EO Technics의 HBM 후공정 레이저 장비, Inno instruments의 융착접속기 등)를 이해하려고, 광섬유가 실제로 어떻게 빛을 전달하는지 기초부터 정리해봄.

## Insight
### 코어-클래딩 굴절률 차이가 전반사를 만들어 빛을 가둔다
광섬유는 코어(중심, 굴절률 높음)와 클래딩(바깥, 굴절률 낮음) 2중 구조다. 
이 굴절률 차이 때문에 코어 안에서 진행하던 빛이 경계에서 전부 반사되어(전반사) 코어 밖으로 새지 못한 채 갇힌 채로 전달된다.
코팅은 빛과 무관한 물리적 보호층일 뿐이다.

### 코어가 넓으면 여러 경로(모드)가 동시에 존재해 도착시각이 갈라진다
멀티모드(코어 지름 ~50~62.5μm)는 여러 각도의 반사 경로(모드)가 동시에 허용되는데, 각 모드는 자기 경로를 끝까지 지키지만 물리적 이동 거리 자체가 서로 다르다(트랙 경기에서 바깥 레인이 안쪽 레인보다 긴 것과 같은 구조). 
그래서 같은 시각에 출발해도 도착 시각이 모드마다 갈라지고, 이게 누적되면 원래 뾰족했던 펄스가 시간축에서 뭉개진다(모달 분산) — 다음 비트와 겹쳐버려 고속 전송의 한계가 된다.

### 코어를 싱글모드 수준으로 좁히면 분산 문제 자체가 사라진다
싱글모드(코어 지름 ~8~10μm)는 애초에 하나의 모드(경로)만 허용해서 도착시각이 갈라질 여지가 없다. 
그래서 장거리·고속 전송(데이터센터 백본, 800G급 트랜시버)에는 싱글모드를 쓴다.

> 빛의 속도(c/n) 자체는 지그재그로 가든 직진하든 동일하다. "느려지는" 게 아니라 "여러 경로의 도착시각 차이(분산)"가 고속 전송을 막는 진짜 원인이다.

## Related
- [[Coupling light into a fiber core requires focusing to a spot not collimating a beam]] — 이 좁은 코어에 빛을 넣는 방법
- [[Varioptic liquid lens targets variable-focus machine vision not fixed telecom coupling optics]]
