---
created: 2026-04-28 09:16
updated: 2026-04-28 09:16
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - machine-learning
  - transfer-learning
  - feature-extraction
  - deep-learning
publish: true
---
## 핵심 원칙
사전학습 백본을 **완전히 고정(freeze)** 한 채로, 마지막 Head만 새로 학습한다.  
모델이 이미 알고 있는 표현을 그대로 쓰되, "어떤 클래스로 분류할지"만 새로 배우는 것이다.

## 구조

```
[사전학습 백본]  ← 가중치 고정 (freeze), 학습 안 함
      │
      │  특징 벡터 출력 (예: 1,280차원)
      ▼
[새 Head]        ← 이 부분만 학습
      │
      ▼
출력 (타겟 클래스)
```

## 언제 쓰나

| 조건                    | 이유                                                |
| ------------------ | ------------------------------------------------- |
| 타겟 데이터가 **매우 적을 때**   | 데이터가 적으면 전체 학습 시 과적합. Head만 학습하면 파라미터 수가 훨씬 적어 안전 |
| 소스와 타겟 도메인이 **유사할 때** | 백본이 뽑은 특징이 타겟에서도 유효하다는 전제가 성립해야 함                 |
| **빠른 프로토타입**이 필요할 때   | 학습 시간이 매우 짧음                                      |

## Fine-Tuning과의 차이

```
Feature Extraction:   [백본 고정] + [Head 학습]
Partial Fine-Tuning:  [백본 하위 고정] + [백본 상위 학습] + [Head 학습]
Full Fine-Tuning:     [백본 전체 학습] + [Head 학습]
```

Feature Extraction은 Fine-Tuning의 가장 보수적인 형태다.  
백본을 전혀 수정하지 않으므로 **Catastrophic Forgetting이 발생하지 않는다.**

## 관련 노트
- [[전이 학습 - 사전학습 모델 재사용 전략]] — 전략 선택 기준 전체
- [[이미지 기반 이상탐지 - PatchCore와 메모리 뱅크 패턴]] — Feature Extraction 실무 적용
- [[PEFT method selection depends on model access level and structural constraints]] — 파라미터를 최소화한 Fine-Tuning 기법들