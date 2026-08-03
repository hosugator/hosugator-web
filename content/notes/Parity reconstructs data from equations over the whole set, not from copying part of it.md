---
created: 2026-07-24
updated: 2026-07-27
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - erasure-coding
  - raid
  - parity
  - storage
publish: true
---
## Context
"패리티가 원본 데이터를 50%만 복사해두는 것"으로 오해했다.
이 모델이면 패리티가 커버하지 않는 원본 조각이 훼손될 때 복구가 불가능해야 하는데, 실제로는 그렇지 않다 — RAID5의 XOR 계산 예시로 오해를 바로잡았다.

## Insight
### 패리티는 원본의 부분 복사가 아니라, 원본 전체를 재료로 한 계산값이다
RAID5(데이터 A, B, C + 패리티 P)에서 P = A XOR B XOR C다.
P는 A나 B, C 중 일부만 담당하는 게 아니라 셋 전체를 하나로 섞은 결과다. 
"일부를 복사해서 남겨둔다"가 아니라 "전체를 방정식 재료로 써서 값 하나를 뽑아낸다"는 원리.

### 그래서 "패리티가 커버하지 않는 조각"이라는 개념 자체가 없다
A가 훼손되면 A = P XOR B XOR C로 역산 복구된다. B나 C가 죽어도 같은 원리로 복구된다. 
패리티는 특정 조각을 편애하지 않고 모든 조각을 동등하게 커버한다.

### 패리티가 여러 개면, 각각 다른 방정식으로 같은 데이터 전체를 조합한다
4데이터+2패리티 같은 구성에서 두 패리티 조각은 같은 4개 데이터를 서로 다른 계수로 조합한 별개의 방정식(Reed-Solomon)이다.
살아있는 조각 수가 원본 데이터 개수(k) 이상이면, 그게 데이터든 패리티든 조합에 상관없이 연립방정식을 풀어 없어진 조각을 전부 복원할 수 있다.

## Related
- [[Erasure coding overhead trades usable capacity for failure tolerance, and shrinks as the parity set grows]] — 오버헤드 계산이 전제하는 패리티 복구 메커니즘을 이 노트가 구체화
- [[RAID]] — RAID5/6 패리티를 "복구용 정보 추가 저장"으로만 서술했던 배경 노트, 이 노트가 그 메커니즘(XOR)을 명시
- [[XOR's invertibility comes from flipping any single input always flipping the output]] — 이 노트의 XOR이 왜 하필 복구 가능한 연산인지, 그 조건을 일반화
