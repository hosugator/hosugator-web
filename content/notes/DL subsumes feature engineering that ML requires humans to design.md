---
created: 2026-06-24
updated: 2026-06-24
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - deep-learning
  - machine-learning
  - feature-engineering
  - representation-learning
  - xai
publish: true
---
## Context
align-ai RAG 구현 중 임베딩 모델의 작동 원리를 탐구하다가 ML과 DL의 근본적 차이를 정리했다. U-Net이 픽셀에서 직접 특징을 추출하는 것과 전통 ML이 사람이 설계한 특징 벡터를 입력받는 것의 차이를 구체적으로 이해했다.

## Insight
### ML과 DL의 분기점은 특징을 누가 설계하느냐다

```
전통 ML 파이프라인:
  원본 데이터 → [사람이 설계한 특징 추출기] → 특징 벡터 → 모델 → 출력
  예) 스팸 분류: ["무료" 포함 여부, 링크 수, 대문자 비율] → SVM

DL 파이프라인:
  원본 데이터 → [모델이 특징 추출 + 분류를 동시에] → 출력
  예) 스팸 분류: 이메일 원문 → CNN/Transformer → 결과
```

DL 모델은 특징 추출기와 분류기를 한 번에 학습한다. U-Net의 인코더가 라인 특징을 스스로 추출하고 디코더가 이를 분류하는 구조가 이에 해당한다.

### 사람이 특징을 설계하면 입력이 설명 가능하다

전통 ML에서는 입력 차원이 사람이 명시한 의미를 가지므로 모델의 판단 근거를 추적할 수 있다.

```
입력: [무료 포함(0.8), 링크 수(0.6), 대문자 비율(0.3), 발신자 신뢰도(0.1)]
      ↑ 가중치가 클수록 판단에 영향 → "무료" 단어가 스팸 판단에 가장 영향
```

DL은 원본 픽셀이나 텍스트를 그대로 받아 수백만 가중치를 거치므로 "왜 이 판단을 했는가"를 설명하기 어렵다. 이를 보완하려는 연구가 XAI(Explainable AI)다.

### 사람이 모르는 패턴은 ML로 잡을 수 없다

특징을 사람이 설계하면, 사람이 미처 생각하지 못한 패턴은 입력에 포함되지 않아 모델이 학습할 수 없다. DL이 이미지, 음성, 텍스트처럼 고차원 데이터에서 강한 이유다.

## Related
- [[ML 모델 분류의 3개 독립 축]] — 학습 패러다임(지도/비지도/자기지도) 분류 체계
- [[Embedding vectors require the same model for comparison because each model defines its own semantic space]] — DL이 만드는 임베딩 공간의 블랙박스 특성
- [[U-Net classifies pixels while PatchCore measures distance from normal features]] — DL(U-Net)과 전통 ML 계열(PatchCore 거리 측정)의 차이
