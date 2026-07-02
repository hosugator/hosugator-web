---
created: 2026-05-28
updated: 2026-05-28
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[EdgeAI LMR - 모델 아키텍처]]"
tags:
  - aoi
  - model-architecture
  - manufacturing-ai
publish: true
---

## Context

MLA(마이크로 렌즈 어레이) 외관 검사기 설계에서 단일 통합 모델 vs. N개 분리 모델을 선택해야 했다. 검사 항목은 7개(변색·이물·스크래치·크랙·치핑·배열이상·미성형)로, 이론상 하나의 다중 클래스 모델로 커버 가능해 보인다. 초기 직관은 "항목 수가 많아도 하나의 모델이 더 단순하다"는 방향이었다.

## Insight

### 관찰 스케일과 대상이 다르면 모델 경계가 다르다 — 조명 차이만으로는 충분하지 않다

변색 검사는 글라스 전체 FOV(수천 px)를, 이물·크랙·스크래치 등은 렌즈 단위 크롭(수백 px)을 사용한다. 이 두 입력을 동일 모델에 넣으면 리사이즈 과정에서 한쪽 스케일의 구조 정보가 소실된다. 분리의 실제 기준은 **관찰 대상(object)과 해상도/스케일 차이**다. 조명 차이 단독은 분리 이유가 되지 않는다.

조명만 다른 경우(같은 물리 객체를 bright/dark로 촬영) 단일 모델이 이미지 밝기 통계를 암묵적 라우팅 신호로 사용하여 조건부 탐지를 학습할 수 있다. 캡처 단계에서 이미 다른 정보가 픽셀에 포착되어 있기 때문이다 — [[Image capture quality sets an information ceiling that no downstream model can exceed]].

### 분리 모델이 운영 독립성을 보장한다

특정 모델(예: 변색 모델) 재학습이 다른 모델(이물·크랙 모델)에 영향을 주지 않는다. 폴더 단위로 분류된 데이터를 투입하면 모델 N개로 무한 확장 가능한 구조가 된다. 조명 컨셉이 추가되는 시점에 새 슬롯을 열면 된다.

## Decision

통합 모델 대신 **N개 분리 모델 병렬 관리** 구조 채택.
- 모델 A: 글라스 전체 이미지 → 변색, 배열이상
- 모델 B: 렌즈 단위 크롭 → 이물, 스크래치, 크랙, 치핑, 미성형
- 모델 C~: 향후 조명 컨셉 추가 시 확장

조명 변화 흡수 방법: 그레이스케일 변환 + 밝기 증강으로 소폭 조명 변화 수용. 광학계 컨셉 자체 변경 시에는 재학습 필요.

전환 조건: 렌즈 크롭 모델이 글라스 변색까지 수용하는 멀티스케일 구조가 실험적으로 검증되면 통합 모델 재검토.

## Consequences

- 성균관대 기능 명세에 "모델 매니지먼트 (N개 독립 탭/슬롯)" 요구사항 명시
- 인덱스(이미지 종류) → 모델 라우팅 레이어 필요 (검사 모델 매핑 기능)
- 모델 수 증가에 비례한 운영 복잡도 상승 — UI에서 탭/슬롯 방식으로 관리

## Verification

**Align AI 반례 (경계 조건 확인):** 동일 물리 객체(얼라인 마크)를 bright 조명에서는 선 A만 보이고, dark 조명에서는 선 B만 보이는 조건으로 촬영. 두 조건의 이미지와 라벨을 단일 U-Net에 학습시켰고 잘 동작했다. 이 케이스에서 분리가 불필요했던 이유: 해상도/스케일이 동일하고 관찰 대상이 같았기 때문. 모델이 조명 밝기 통계를 암묵적 태스크 라우터로 학습했다. MLA와 달리 스케일 정보 손실이 없었다.

이 반례에서 도출되는 판단 기준:
- 같은 객체 + 조명만 다름 → 단일 모델로 합칠 수 있다 (조명 = implicit augmentation 또는 routing signal)
- 다른 객체 + 스케일 다름 → 리사이즈 시 정보 손실 → 분리 필요

## Related

- [[MLA defect taxonomy DTK internal 2026]] — 이 결정의 대상이 된 검사 항목 정의
- [[EdgeAI LMR - 모델 아키텍처]] — 프로젝트 아키텍처 컨텍스트
- [[산업용 AOI 소프트웨어 아키텍처 비교 - VisionPro vs 오픈소스]] — 운영 복잡도 비교 참조
- [[제조업 비전 AI 단계적 도입 전략]] — 분리 모델의 단계적 확장 전략과 연결
- [[Domain Adaptation - 레이블 없이 도메인 분포 정렬]] — 조명 변화 흡수 한계 관련
- [[Open-set AI separates unknown defect types without forcing them into known classes]] — 미래 unknown 결함 대응 확장 방향
- [[Image capture quality sets an information ceiling that no downstream model can exceed]] — 캡처 단계의 정보 상한; 조명 차이가 픽셀에 무엇을 포착하는지를 결정함
