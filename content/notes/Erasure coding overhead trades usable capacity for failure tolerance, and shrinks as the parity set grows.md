---
created: 2026-07-23
updated: 2026-07-27
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[AOI]]"
tags:
  - erasure-coding
  - raid
  - storage
  - minio
publish: true
---
## Context
MinIO/S3 비용 비교를 하다가 "54TB 실사용을 위해 70~80TB 원본 디스크가 필요하다"는 계산의 근거를 설명하며 소거부호(Erasure Coding) 오버헤드 개념을 처음 정리했다.

## Insight
### 오버헤드는 "산 용량 중 패리티(복구용 정보)가 차지하는 비율"이다

소거부호는 데이터를 여러 조각으로 나누고, 그중 일부를 복구용 여분 정보(패리티)로 추가해 디스크 몇 개가 죽어도 나머지로 원본을 재구성한다.
예를 들어 데이터 4조각 + 패리티 2조각(총 6개 디스크)이면, 디스크 2개까지 죽어도 복구 가능하지만 실사용 가능 용량은 6개 중 4개(66%)뿐이고 나머지 33%는 데이터가 아니라 패리티다. 
[[RAID]]의 RAID5/6(패리티 1~2개)도 이 원리의 특수 사례이고, MinIO의 소거부호는 이를 여러 노드에 걸쳐서까지 확장한 소프트웨어 구현이다.

### 패리티 개수를 고정하면, 세트가 클수록 오버헤드 비율은 낮아지지만 장애 영향 범위는 커진다

| 구성 | 오버헤드 | 실사용 비율 |
|---|---|---|
| 4데이터 + 2패리티 (총 6) | 33% | 66% |
| 8데이터 + 2패리티 (총 10) | 20% | 80% |
| 8데이터 + 4패리티 (총 12) | 33% | 66% |

패리티를 늘리면(더 많은 디스크 장애를 버팀) 오버헤드가 늘고, 세트 크기 자체를 키우면(같은 패리티 개수를 더 많은 디스크에 나눠 가짐) 오버헤드 비율은 줄어든다.
다만 세트가 클수록 "그 세트가 한꺼번에 망가졌을 때 영향받는 데이터 범위(blast radius)"도 커진다 — 오버헤드를 낮추는 선택이 동시에 장애 시 손실 규모를 키우는 선택이기도 하다는 트레이드오프.

## Related
- [[RAID]] — RAID5/6이 소거부호의 특수 사례라는 배경 개념
- [[MinIO standalone means one server's local disks, not a control plane reaching across separate machines]] — MinIO가 이 소거부호를 노드 단위로 확장 적용하는 방식
- [[PNG's subtraction filter only skews the value distribution; actual size reduction comes from entropy coding]] — 이 오버헤드(패리티)와 진짜 압축(PNG)을 대비한 노트
