---
created: 2026-05-22
updated: 2026-05-22
type: study
status: 2-stable
subject: "PKM"
project: "PKM"
tags: [embedding, pkm, search, bge-micro]
publish: true
---

## Context

[[sc_search over grep for PKM linking because semantic similarity finds expression-variant notes]]을 작성하면서 Smart Connections 플러그인이 `TaylorAI/bge-micro-v2`를 사용해 볼트 전체를 로컬 임베딩한다는 것을 알게 됐다. 이 구조를 sc_search 스크립트로 CLI에서 활용하면서 경량 모델의 특성을 실제로 체감했다.

bge-micro-v2는 384차원, ~22MB 크기로 완전 오프라인 구동이 가능하다. 반면 OpenAI `text-embedding-3-small`(1536차원) 같은 API 기반 모델은 인터넷 없이 사용 불가하다.

## Insight

### 오프라인 임베딩 모델은 "충분히 좋은" 정확도와 완전한 자율성을 맞바꾼다

| 항목 | bge-micro-v2 (로컬) | text-embedding-3-small (API) |
|---|---|---|
| 크기 | ~22MB, 384차원 | — (클라우드) |
| 오프라인 가능 | 가능 | 불가 |
| 영어 정확도 | 충분함 | 높음 |
| 한국어 기술 용어 | 노이즈 발생 | 양호 |
| 데이터 프라이버시 | 완전 로컬 | 외부 전송 |
| 비용 | 0 (초기 다운로드 후) | API 호출당 과금 |

### 한국어 쿼리는 모델 한계를 직접 드러낸다

sc_search 실사용에서 순수 한국어 기술 용어 쿼리(`"의미 기반 검색 구현"` 등)는 관련 노트를 놓치는 경우가 있었다. bge-micro-v2는 영어 데이터셋 중심으로 훈련되어 한국어 의미 공간이 영어 대비 밀도가 낮다. 영어 혼용 쿼리(`"semantic search PKM 임베딩"`)로 보완해야 한다.

### 경량 모델은 탐색 보조 도구로 적합하나 유일한 근거로 삼으면 안 된다

실제 ADR 비교([[sc_search over grep for PKM linking because semantic similarity finds expression-variant notes]] Verification 참조)에서 sc_search는 grep 대비 더 적은 쿼리로 더 관련성 높은 노트를 찾았다. 다만 score 0.80 미만 결과가 대다수인 경우, 모델이 해당 개념을 잘 표현하지 못하는 것일 수 있다. 이때는 결과 없음을 "관련 노트 없음"이 아닌 "모델 표현 한계"로 해석해야 한다.

### 오프라인 임베딩 모델의 실용 임계점은 "로컬 용도에 맞는 정확도"다

로컬 PKM 검색은 API 수준의 정밀도를 요구하지 않는다. 수백~수천 개 노트 중 의미적으로 가까운 상위 10개를 추려내는 것이 목표이므로, bge-micro-v2의 정확도는 이 용도에 충분하다. 이 판단은 [[local-llm-offline-coding-assistant-evaluation]]의 "챗봇 Q&A 용도로는 실용적이나 고난도 자율 작업에는 부적합"과 동일한 패턴이다 — 오프라인 경량 모델은 용도를 좁힐수록 실용성이 올라간다.

---

[[sc_search over grep for PKM linking because semantic similarity finds expression-variant notes]] · [[local-llm-offline-coding-assistant-evaluation]]
