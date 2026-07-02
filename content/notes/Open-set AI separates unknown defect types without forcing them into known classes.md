---
created: 2026-05-22
updated: 2026-05-22
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - ml
  - open-set
  - segmentation
  - anomaly-detection
  - unet
publish: true
---
## Context

성균관대 RISE 과제(2026) 발표자료에서 처음 접한 아키텍처 패턴이다. DTK AOI 프로젝트에서 PatchCore(이진 이상탐지)와 Closed-set 분류기 사이의 중간 경로를 찾고 있는 맥락에서 검토했다.

## Insight

### Open-set AI는 "알고 있는 것 분류 + 모르는 것 분리" 이중 구조다

```
PatchCore (이상탐지)
  → "정상" vs "비정상" (이진, 결함 종류 모름)

Closed-set 분류기
  → "스크래치" or "이물" or "금형마모" (강제 선택, 미지 결함 오분류)

Open-set AI (이중 구조)
  → Lightweight U-Net: 기지 결함 픽셀 단위 분류
  → Open-set 탐지기: U-Net의 출력/feature에서 unknown 판정
  출력: "스크래치" or "이물" or "금형마모" or "unknown"
```

핵심은 Open-set 탐지기가 독립된 이상탐지 모델이 아니라는 점이다. U-Net이 생성하는 출력값 또는 내부 feature에 알고리즘(엔트로피, 에너지 점수, Mahalanobis distance, OpenMax 등)을 얹는 방식으로 구현한다 — 재처리 없이 기존 계산 결과를 재활용한다.

### PatchCore를 Open-set 탐지기로 그대로 쓸 수 없는 이유

참조 분포의 기준점이 다르다:

```
PatchCore 참조: 정상 이미지 → 기지 결함·unknown 전부 "비정상"으로 묶임
Open-set 탐지기 참조: 기지 결함 클래스 feature → unknown만 분리
```

PatchCore는 U-Net이 이미 끝낸 "정상 vs. 결함" 판단을 중복 수행하면서 기지 결함 분류 결과와 충돌한다. 단, PatchCore의 거리 측정 원리 자체는 응용 가능하다 — Mahalanobis distance를 기지 결함 클래스 U-Net encoder feature 클러스터에 적용하면 PatchCore와 동일한 원리의 Open-set 탐지기가 된다.

### Open-set 탐지기의 unknown이 Active Learning 후보가 된다

unknown → 라벨링 → 재학습 → 새 클래스 편입의 자동화된 순환이 형성된다. 별도 불확실도 측정 모듈 없이 Open-set 판정 결과를 재사용하는 설계다.

### 발표자료 미명시: 탐지기 알고리즘 선택은 과제 착수 시 확인 필요

SKKU PPT는 Open-set 탐지기의 동작("학습 분포 밖 unknown 자동 분리")만 기술하고 구체적 알고리즘을 명시하지 않았다. Stage 2 운영 설계에 영향을 주므로 과제 착수 시 확인이 필요하다.

### 멀티라벨 분류 + PatchCore 하이브리드가 Open-set을 근사하는 범위

멀티라벨 sigmoid 모델(이미지 단위 라벨) + PatchCore(픽셀 단위 이상 맵)의 조합은 Open-set AI 기능 대부분을 대체할 수 있다. unknown 판정 논리도 수학적으로 유사하다 — "모든 클래스 score 임계값 미달 + PatchCore NG"는 Open-set 탐지기의 분포 이탈 판정과 동일한 목적을 다른 신호 조합으로 구현한다.

**두 접근이 달라지는 유일한 조건**: 동일 이미지 내 복수 결함이 공간적으로 공존할 때 **클래스별 독립 크기/위치 측정**. PatchCore는 클래스 구분 없는 단일 이상 맵을 출력하므로 "스크래치 면적 vs 이물 면적"을 분리 계산할 수 없다.

## Related
- [[U-Net classifies pixels while PatchCore measures distance from normal features]] 
- [[Operator label quality is the hidden ceiling for supervised segmentation over anomaly detection]] 
- [[이상 탐지 방법론 분류 및 고유 실패 모드]] 
- [[Multi-label classification uses independent sigmoid outputs per class]]
