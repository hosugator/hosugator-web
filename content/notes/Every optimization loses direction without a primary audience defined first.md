---
created: 2026-05-29
updated: 2026-05-29
type: post
status: 3-superseded
subject: "[[Communication]]"
project:
tags:
  - linkedin
  - communication
  - audience
  - content-strategy
publish: true
---

← [[Defining primary audience before filling content prevents density loss for the target reader]] (superseded — LinkedIn 앵커 버전)

## Source

[[Optimizing for non-primary audience introduces noise that bottlenecks the primary goal]] — 핵심 인사이트
[[AOI model boundaries align with imaging domain not defect category]] — 단일 모델로 두 스케일 도메인을 담으려다 정보 소실이 발생한 경험
[[3-tier document architecture satisfy SSOT, audit-trail, and cooperation]] — 단일 ADR로 여러 청자를 담으려다 문서가 비대해진 경험, 청자 기준 계층 분리로 해결
[[Negative framing hooks outperform positive framing by making readers recognize their own failure]] — 훅 전략 (부정 프레임 기본)

## Draft

**넓힐수록, 정작 아무에게도 닿지 못했다.**

더 많이 담으면 더 많은 사람에게 닿을 것 같지만 — 두 번의 경험이 그 반대를 가르쳐줬다.

---

**경험 1 — 모델 학습**

렌즈 검사 AI — 소스 이미지 전체를 학습에 넣었다. 탐지 성공률 40%.

원인을 추적했더니 175장 중 43%가 선이 1개만 보이는 이미지였다. 모델은 라인 탐지가 아니라 "1개를 예측해도 정답"이라는 패턴을 학습했다.

케이스를 분리했다. 선이 2개인 이미지와 1개인 이미지를 각각의 타겟으로 정의하고 파이프라인을 구축했다. 175장 → 100장. 탐지 성공률 100%, PASS율 91% — 좁혔더니 오히려 닿았다.

---

**경험 2 — 기술 문서**

단일 ADR로 개발팀·비기술 이해관계자·외부 파트너를 모두 담으려 했다. 문서는 비대해졌고, 회의 전에 읽어오는 사람이 없었다.

청자별로 나눴다 — 결정 근거(ADR), 현재 상태(SPEC), 청자별 협의(Comms). 나눈 뒤 각 문서가 실제로 읽히기 시작했다. 같은 사실을 두 언어로 쓰는 건 중복이 아니라 관심사 분리였다.

---

모델도 문서도, 채우기 전에 먼저 물어야 할 질문이 있다.

누구를 위한 것인가.

청자가 다르면 언어가 달라야 한다. 하나로 모두를 담으려는 순간, 아무도 완전히 이해하지 못하는 무언가가 된다.

---

*지금 당신이 만들고 있는 것 — 누구를 위한 것인가?*

## Variant

**긍정 프레임 (A/B 테스트용):**
청자를 하나로 좁혔을 때, 오히려 더 많은 사람에게 닿는다는 걸 경험했다.
N개 분리 모델로 나눴을 때 — 각 모델이 자기 도메인에서 더 정확해졌다.
좁히는 것이 도달을 줄이는 게 아니다. 도메인 특화가 정밀도를 만들고, 정밀도가 신뢰를 만든다.
