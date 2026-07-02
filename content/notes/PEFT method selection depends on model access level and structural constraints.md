---
created: 2026-04-28 09:16
updated: 2026-07-01
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - machine-learning
  - peft
  - lora
  - fine-tuning
  - llm
  - deep-learning
publish: true
---
## 핵심 원칙
전체 가중치를 다 학습하지 않고, **소수의 파라미터만 건드려서** Fine-Tuning 비용을 줄인다.  
모델 가중치는 보존하면서 태스크 적응을 달성하는 것이 목표다.

## 왜 PEFT가 필요한가

```
GPT-3 파라미터 수:  1750억 개
Full Fine-Tuning:   1750억 개 전부 업데이트  → GPU 수십 대, 수일
PEFT (LoRA):        약 0.1% = 1.75억 개만    → GPU 1대, 수시간
```

<!-- 💡 스케일이 커질수록 Full Fine-Tuning의 비용은 감당 불가 수준이 된다. PEFT는 "원본은 건드리지 않는다"는 철학에서 시작한다. -->

## PEFT 기법 비교

| 기법                | 무엇을 학습하나          | 원본 건드림 | 개념           |
| ----------------- | ----------------- | ------ | ------------ |
| **LoRA**          | 저랭크 행렬 ΔW = A×B   | 없음     | 변화량만 학습      |
| **Adapter**       | 삽입된 Bottleneck 모듈 | 없음     | 레이어 사이 끼워 넣기 |
| **Prompt Tuning** | 입력 앞의 Soft Token  | 없음     | 마법 주문 학습     |

## 기법 선택 가이드

```
모델 가중치에 접근 가능한가?
 ├── NO  → Prompt Tuning (API 기반 환경)
 └── YES → 구조 변경을 원하는가?
            ├── YES → Adapter (레이어 사이 삽입)
            └── NO  → LoRA (가장 범용적, 현재 업계 표준)
```

> 2024년 이후 LLM Fine-Tuning 실무에서는 LoRA가 사실상 기본값으로 자리잡았다.

## 관련 노트
- [[전이 학습 - 사전학습 모델 재사용 전략]] — 전략 선택 기준 및 레이어 구조
- [[LoRA - Low-Rank Adaptation]] — 저랭크 분해, 병렬 구조, VRAM 절감 상세
- [[PEFT Adapter - bottleneck module]] — Bottleneck 모듈 구조 및 삽입 위치 상세
- [[Prompt Tuning - soft token prefix]] — 소프트 토큰, 임베딩 우회, 태스크 고정값 상세