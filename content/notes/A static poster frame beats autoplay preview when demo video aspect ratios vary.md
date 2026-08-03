---
created: 2026-07-10
updated: 2026-07-10
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Hosugator Web]]"
tags:
  - ux
  - ui
  - web
  - video
publish: true
---
## Context
hosugator-web 프로젝트 상세 페이지의 인라인 데모 영상(cureat·dotodo·dorosee 등)이 원본 비율이 제각각(세로 폰 화면 녹화, 정사각, 4:3)인데, 고정 16:9 박스에 재생 전 `object-cover`로 우겨넣고 있었다.
실제로 열어보니 cureat 영상은 텍스트가 위아래로 대부분 잘리고, 재생 버튼도 크롭된 화면 위 엉뚱한 위치에 떠 있었다.

## Insight
### 자동재생 loop 프리뷰는 같은 크롭이라도 정지 이미지보다 훨씬 더 눈에 띄게 만든다

크롭 자체는 피할 수 없더라도(비율이 다른 원본을 고정 박스에 넣으려면 뭔가는 잘려야 한다), 계속 움직이는 영상에서의 크롭은 시선을 붙잡아 계속 거슬리고, 정지 이미지의 크롭은 훨씬 덜 신경 쓰인다.
"무엇을 자를 것인가"보다 "잘린 상태를 얼마나 오래, 얼마나 눈에 띄게 보여주는가"가 체감 UX를 더 크게 좌우했다.

### `object-fit`을 재생 전/후로 다르게 쓰면 비율 불일치가 반드시 어느 한쪽에서 터진다

프리뷰는 `object-cover`, 재생 중엔 `object-contain`으로 나눠 쓰면, 16:9가 아닌 원본은 프리뷰 단계에서 무조건 크롭된다. 
두 상태를 하나의 `object-fit`(contain)으로 통일하고, 자동재생 대신 각 영상의 실제 프레임을 추출한 poster 정지 이미지로 프리뷰를 대체하면, 어떤 원본 비율이 와도 레터박스만 생길 뿐 크롭이 아예 발생하지 않는다.

### poster는 원본 해상도 그대로 추출해야 재생 시작 순간 이미지가 안 튄다

```bash
ffmpeg -ss 00:00:01 -i demo.mp4 -frames:v 1 -q:v 3 demo_poster.jpg
```

`-frames:v 1`로 실제 프레임 하나를 원본 해상도 그대로 뽑는다. 다른 크기로 리사이즈해서 쓰면 poster→실제 재생 전환 순간 이미지가 미세하게 리스케일되는 게 눈에 띈다.

## Decision
### 20260710
자동재생을 제거하고, 각 데모 영상의 1초 지점 프레임을 poster로 추출해 클릭 전 정적 이미지로 사용하도록 바꿨다. `object-fit`은 재생 전/후 항상 `contain`으로 통일.
[[A single-demo detail page plays media inline while modals belong to grids]]에서 정한 "인라인 재생" 원칙(모달 대신 흐름 안에서 재생)은 그대로 유지하고, 그 노트가 정했던 "muted 루프 프리뷰" 구현 디테일만 이번에 교체했다.

## Related
- [[A single-demo detail page plays media inline while modals belong to grids]] — 이 노트의 "muted 루프 프리뷰" 구현을 오늘 정지 poster로 교체
- [[Monochrome editorial signals engineering credibility better than warm serif for an AI portfolio]] — 차분한 정적 미리보기가 이 사이트의 모노 에디토리얼 톤에 더 맞는다는 판단의 배경
