---
created: 2026-07-01
updated: 2026-07-01
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
tags:
  - machine-learning
  - peft
  - fine-tuning
  - llm
  - deep-learning
publish: true
---
## Bottleneck 모듈이란
입력을 **압축했다가 다시 복원**하는 구조. 좁은 구간(병목, bottleneck)을 통과시켜 핵심 정보만 흐르게 한다.

```
[입력: 768차원]
      ↓
[Down-proj: 64차원]  ← 병목 (bottleneck)
      ↓
[Up-proj: 768차원]
      ↓
[출력: 768차원]
```

## Adapter의 삽입 위치
사전학습 레이어와 레이어 **사이**에 끼워 넣는다. 사전학습 레이어는 freeze 유지.

```
[Transformer Layer 1]
        ↓
   [Adapter]  ← 이 작은 모듈만 학습
        ↓
[Transformer Layer 2]
        ↓
   [Adapter]
        ↓
     ...
```

## Related
- [[PEFT method selection depends on model access level and structural constraints]] — Adapter가 속한 PEFT 분류 허브
- [[transformer-block]] — Adapter가 삽입되는 Transformer 레이어 구조
