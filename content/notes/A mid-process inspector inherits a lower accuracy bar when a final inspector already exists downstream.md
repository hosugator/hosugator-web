---
created: 2026-06-02
updated: 2026-07-22
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[AOI]]"
tags:
  - aoi
  - performance-target
  - preprocessing
  - skku
publish: true
---
## Context
2026-06-02 AI솔루션 내부 논의(오전/오후 2회)에서 SKKU 발표자료의 성능 목표(초기 90%, 최종 95%)를 두고 DTK 내부 기준을 처음 논의하며 나온 결론. 이재철 수석은 "99.99%도 부족할 수 있다"는 입장이었으나 다른 결론에 도달했다.

## Insight
### 검사기 앞뒤로 다른 검사기가 있다면, "이 검사기의 목적"이 곧 "이 검사기가 필요한 정확도"를 정한다

이주형 팀장의 판단 근거:
DTK가 만드는 AOI는 성형 직후 붙는 중간 검사기이고, 다이싱 이후에는 이미 별도의 고가 최종 광학 검사기가 존재한다.

최종 관문이 이미 있으므로, 중간 검사기가 놓친 결함은 최종 단계에서 다시 걸러진다 — 그래서 SKKU가 제시한 95%를 수용 가능하다고 판단했다.
반대로 이 검사기가 유일한 관문이었다면 95%는 논쟁의 여지가 있었을 것.

> 즉 정확도 목표는 모델 능력만으로 정해지는 게 아니라, 그 검사기가 파이프라인에서 차지하는 위치(유일한 방어선인가, 여러 겹 중 하나인가)로 정해진다.

### "한 프레임에 여러 객체"라는 촬영 구조는 크롭 전처리를 AI보다 먼저 오는 선행조건으로 만든다

한 프레임에 MLA 렌즈가 여러 개 배열되어 촬영되는 구조라서, 개별 렌즈를 크롭해 AI 입력 단위로 만들지 않으면 OK/NG 분류 자체가 불가능하다.
이주형 팀장:
"이 전처리가 먼저 개발이 안 되면 시작이 안 돼. AI고 자시고 다 필요 없다."
알고리즘 고도화보다 전처리 파이프라인이 먼저 서야 한다는 순서의 문제이며, 이 순서는 촬영 방식(멀티 오브젝트 프레임)이 정한 것이라 협상의 여지가 없다.

### "AI 단독 검사기는 현업에 전례가 없다"는 판단이 AI+룰베이스 혼합을 기본 전략으로 만들었다

DTK 실무진의 관찰:
AI만으로 검사를 완결하는 설비는 업계에서 본 적이 없고, AI+룰 베이스 혼합이 현실적이라는 결론에 도달했다. 
이는 한 달여 뒤 07-10 SKKU 미팅에서 "AI도 측정에 관해서는 약하더라고요, 정밀 측정은 룰 베이스로"([[VDG augmentation collapses per-image labeling into ten representative samples per category]])라는 실무 경험으로 재확인된 원칙의 원형이다.
도입 초기부터 이미 "AI가 전부를 대체하지 않는다"는 전제를 깔고 있었다.

## Related
- [[VDG augmentation collapses per-image labeling into ten representative samples per category]] — AI+룰베이스 혼합 원칙이 실무 경험으로 재확인된 이후 사례
- [[Obvious defects make bounding boxes sufficient until recurring operator relabeling demands folder-only classification]] — 같은 시기 라벨링 최소화 논의의 연장선
- [[AOI]]
