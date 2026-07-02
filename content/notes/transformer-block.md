---
created: 2026-04-17 11:03
updated: 2026-05-13
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
type: study
status: 2-stable
tags:
  - ai/transformer
  - multi-head-attention
  - transformer
publish: true
---
## 1. Multi-Head Attention

Self-Attention을 **h번 병렬로** 수행한다. 각 Head는 서로 다른 Wq, Wk, Wv를 사용한다.

```mermaid
flowchart LR
    X["입력 X"]
    
    H1["Head 1 (문법 관계에 집중?)"]
    H2["Head 2 (의미 관계에 집중?)"]
    H3["Head 3 (위치 관계에 집중?)"]
    
    CONCAT["Concat 모든 Head 결과를 이어붙임"]
    WO["× Wo 출력 선형 변환"]
    OUT["최종 출력"]
    
    X --> H1 & H2 & H3 --> CONCAT --> WO --> OUT
```

- 각 Head가 서로 다른 "관점"에서 주목 패턴을 학습한다.
- GPT-3: 96 Heads / BERT-Base: 12 Heads
- 결과를 이어붙인(Concat) 뒤 Wo 행렬로 다시 d_model 차원으로 줄인다.

## 2. Transformer Block 전체 구조

```mermaid
flowchart TD
    subgraph "Transformer Block (반복)"
        LN1["Layer Norm"]
        MHA["Multi-Head Attention (Self-Attention × h)"]
        ADD1["잔차 연결 (Residual: x + output)"]
        LN2["Layer Norm"]
        FFN["Feed-Forward Network (일반 FC 레이어 2개)"]
        ADD2["잔차 연결"]
    end
    
    IN["입력 임베딩"] --> LN1 --> MHA --> ADD1 --> LN2 --> FFN --> ADD2 --> OUT["다음 블록"]
```

- **FFN (Feed-Forward Network)**: 일반 레이어 2개. 토큰별 독립 처리.
- **Attention**: 토큰 간 관계 처리.
- **잔차 연결**: 입력을 출력에 더해 기울기 소실 방지.
- **Layer Norm**: 학습 안정화를 위한 정규화.
- 이 블록이 GPT-3에는 96번, BERT-Base에는 12번 쌓인다.

## 3. Attention이 Edge AI에 적용되는가?

| 모델 유형           | Attention 사용 여부 | 비고                 |
| --------------- | --------------- | ------------------ |
| CNN 기반 이상 탐지    | 불필요             | 공간 패턴만 필요          |
| LSTM 기반 예지 보전   | 선택적             | Attention 추가 가능    |
| 시계열 Transformer | 핵심              | Temporal Attention |
| LLM (텍스트 생성)    | 필수              | Self-Attention 기반  |
| 경량 Edge 모델      | 부분적             | 연산 비용으로 축소 적용      |

Edge AI에서는 Attention의 O(n²) 연산 비용이 부담되어, **Linear Attention** (근사 계산)이나 **Local Attention** (주변 토큰만 비교) 등 경량화 변형이 사용된다.


## 연결

- [[Attention 개념 정리]] — 개요 및 탐색 허브
- [[self-attention]] — Q/K/V 메커니즘, 계산 과정
- [[kv-cache]] — 추론 시 K,V 재사용 최적화
