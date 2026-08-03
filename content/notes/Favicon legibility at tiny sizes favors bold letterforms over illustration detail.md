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
  - branding
publish: true
---
## Context
hosugator.com 파비콘이 Next.js 기본 아이콘 그대로였던 걸 계기로 교체 작업을 시작했다.
처음엔 "hosugator(hosu+gator)" 브랜딩에 맞춰 개인적으로 좋아하는 손그림 악어(크레용톤 스케치)를 쓰려고 몸통 전체→기하학적 재해석→입/이빨 크롭→눈+위턱 크롭→확대 채우기까지 여러 시안을 반복했지만, 매번 16~32px에서 "뭔지 모르겠는" 결과로 끝났다.

## Insight
### 손그림 일러스트는 어떻게 잘라도 파비콘 크기에서 안 살아난다

문제는 특정 크롭의 선택이 아니라 **매체 자체의 한계**였다. 손으로 그린 얇고 불규칙한 선(눈 윤곽, 이빨 지그재그, 다리)은 16~32px로 축소되는 순간 디테일이 뭉개져 색 덩어리로 수렴한다. 크롭·확대를 아무리 반복해도 "무엇을 보여줄까"만 바뀔 뿐 "선이 가늘고 불규칙하다"는 근본 원인은 그대로였다.

### 글자(letterform)는 작은 아이콘에서 일러스트보다 훨씬 잘 읽힌다

GitHub·Notion·Linear 등 업계 파비콘 대부분이 단순 로고/이니셜인 이유가 이거다 — 사람 뇌가 문자 형태를 극도로 잘 인식하도록 훈련되어 있어서, 두껍고 균일한 폰트는 극한으로 축소해도 "글자가 있다"는 정보가 살아남는다. 실제로 이번에도 대문자 "H" 하나는 16px에서 또렷했고, 4글자 "hosu"도 32px까지는 읽혔다(16px에서만 약화).

### 타이포 스타일은 반드시 기존 브랜드 언어와 맞춰야 한다

필기체(cursive) "h"를 대안으로 검토했지만 기각했다. 이 사이트는 Space Grotesk 기반 기하학적 산세리프 + 단일 accent 컬러로 일관해왔고, [[Monochrome editorial signals engineering credibility better than warm serif for an AI portfolio]]에서 이미 "따뜻한 세리프보다 단색조 에디토리얼이 신뢰감을 더 준다"고 정리했었다. 필기체는 그 반대 방향(우아함·개인성)의 타입 언어라, "캐릭터를 담고 싶다"는 욕구는 굵기·형태가 아니라 **폰트 스타일 자체를 바꾸는 방식으로 풀면 안 된다**는 걸 확인했다.

### 로컬 파일 교체 → 시크릿 창 확인이 빠른 반복 루프였다

Next.js는 `app/icon.png` 파일 하나만 있으면 코드 수정 없이 자동으로 파비콘 태그를 생성한다. 후보 이미지를 그 경로에 덮어쓰고 dev 서버 hot-reload + 시크릿 창(파비콘 캐시 회피)으로 확인하는 루프가, 매번 커밋·배포하지 않고도 여러 시안을 몇 분 안에 비교하게 해줬다.

## Decision
여러 시안(H 모노그램 → 손그림 악어 크롭 다수 → 필기체 검토)을 거쳐 **흰 원형 배지 + accent 컬러(#35618E) "hosu" 워드마크**로 확정했다. 악어 컨셉은 파비콘에서는 포기하고(다른 곳에 개인적 이스터에그로 쓸 여지는 남김), 사이트 타이포 언어와 일치하는 텍스트 마크를 택함.
전환 조건: 나중에 실제 브랜드 로고(벡터)를 정식으로 제작하게 되면 그걸로 교체. 그 전까지는 이 워드마크를 유지.

## Related
- [[Monochrome editorial signals engineering credibility better than warm serif for an AI portfolio]] — 필기체를 기각한 근거가 된 기존 브랜드 원칙
- [[A static poster frame beats autoplay preview when demo video aspect ratios vary]] — 같은 세션대의 다른 미디어 자산(데모 영상) 관련 UX 결정
