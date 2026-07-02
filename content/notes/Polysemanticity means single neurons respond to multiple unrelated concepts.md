---
created: 2026-06-05
updated: 2026-06-05
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[MarqVision screening interview prep 2026-06-04]]"
tags:
  - deep-learning
  - xai
  - interpretability
  - polysemanticity
publish: true
---
## Context
MarqVision 면접 대비 중 "뉴런 단위로 복원이 가능한가"라는 질문에서 Feature Visualization을 논의하다가, 그 한계로 자연스럽게 등장한 개념이다.

## Insight
### Feature Visualization으로 특정 레이어/뉴런이 무엇에 반응하는지 결과론적으로 추정할 수 있다

```
특정 뉴런 하나만 활성화 → 나머지 뉴런 출력 0으로 고정 → 역변환
→ "이 뉴런이 무엇에 반응하는가"를 시각적으로 추정
```

레이어 전체를 복원하면 해당 레이어가 어떤 수준의 특징을 처리하는지 확인 가능하다. 앞쪽 레이어는 엣지·색상, 뒤쪽은 눈·바퀴 같은 의미 단위가 나타나는 경향이 있다. 단, 이는 설계된 것이 아니라 수많은 시각화 연구에서 **관찰된 경향**이다.

### 그러나 뉴런 하나가 여러 무관한 개념에 동시 반응하는 Polysemanticity가 해석을 어렵게 만든다

```
기대: 뉴런 A → 고양이 귀에만 반응
현실: 뉴런 A → 고양이 얼굴 + 자동차 바퀴 + 피자에 동시 반응
```

뉴런과 개념이 1:1로 대응하지 않는다. 이 때문에 "이 뉴런은 X를 담당한다"고 단정하기 어렵고, 해석은 항상 **경향성** 수준에 머문다.

### XAI는 이 블랙박스 문제의 부분적 해결 시도다

- **Grad-CAM**: 이미지의 어느 영역을 보고 판단했는지 히트맵으로 시각화
- **SHAP**: 어떤 입력 특징이 결과에 얼마나 기여했는지 분해

Anthropic의 **Mechanistic Interpretability** 팀이 Polysemanticity 문제를 전담 연구 중이며, 미해결 상태다.

## Related
- [[Activation function prevents stacked linear layers from collapsing into one]] — 같은 대화에서 이어진 레이어 구조 이해
- [[Feature Embedding - 사전학습 CNN을 특징 추출기로 활용하는 원리]] — 레이어 출력 활용 맥락