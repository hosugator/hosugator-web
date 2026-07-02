---
created: 2026-05-22
updated: 2026-05-22
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - ml
  - data-augmentation
  - generative-ai
  - defect-generation
  - stable-diffusion
publish: true
---
## Context

성균관대 RISE 과제(2026) 발표자료에서 처음 접한 파이프라인이다. DTK AOI 프로젝트에서 초기 결함 이미지 부족 문제(콜드 스타트)를 해결하기 위한 접근으로 검토했다. 일반적인 데이터 증강(회전·밝기 조정)이 "기존 이미지를 변형"하는 데 반해, VDG(Visual Defect Generation)는 "존재하지 않던 결함을 새로 생성"한다.

## Insight

### Physics-aware VDG는 세 개의 독립 관심사로 구성된다

| 관심사 | 구성요소 | 역할 |
|--------|---------|------|
| ① 어떤 결함인가 | FMEA prompt T(m,d,p) + Frozen LDM | 재질(m)·결함유형(d)·공정조건(p)으로 결함 형태와 유형을 명세해 생성 |
| ② 이 표면에서 어떻게 보이는가 | self-referential 합성 | 렌즈 이미지 자체의 표면 통계에서 결함 외관을 도출 — 외부 텍스처 없이 도메인 갭 최소화 |
| ③ 배경과 경계가 자연스러운가 | Gradient Domain Fusion (Poisson blending) | 결함을 배경에 붙일 때 경계(seam)의 밝기 구배 연속성 보정 |

> self-referential이 ②로 독립된 이유: Perlin noise(결함 궤적 모사)와 Hadamard 변환(형태·밝기 독립 제어)으로 "이 재질 표면에서 그 결함이 어떻게 보이는가"를 결정한다. ①이 결함 유형을 정하고 ②가 표면 외관을 입히고 ③이 경계를 처리하는 순서다. 셋 모두 없으면 합성 이미지가 부자연스럽다.

> **FMEA (Failure Mode and Effects Analysis)**: 제품·공정의 잠재적 실패 유형을 사전에 체계적으로 식별하는 품질 관리 방법론. 이 파이프라인에서는 원래 용도(위험 분석)가 아니라 결함 생성 프롬프트를 재질(m)·결함유형(d)·공정조건(p) 3축으로 구조화하는 틀로 전용했다. 예: T("유리", "기포", "고압 성형") → "고압 성형 조건의 유리에 생기는 기포 결함 이미지"를 프롬프트로 명세.
>
> **Gradient Domain Fusion (Poisson blending)**: 합성 시 색상값(절댓값) 대신 색상의 변화율(gradient)이 자연스럽게 이어지도록 경계를 처리하는 기법. Poisson 방정식을 풀어 두 이미지의 gradient 연속성을 보장한다. 단순 paste는 경계에서 색상 불연속이 눈에 드러나지만, Poisson blending은 이를 수학적으로 제거해 "붙여넣은 티"가 사라진다.

엔진은 Frozen LDM(Stable Diffusion 계열). 유리렌즈 도메인에 맞게 재학습하지 않고 FMEA 프롬프트로만 방향을 제어한다.

> **LDM (Latent Diffusion Model)**: 픽셀 공간이 아닌 인코더가 압축한 잠재 공간(latent space)에서 노이즈 제거(denoising)를 반복해 이미지를 생성하는 모델. Stable Diffusion의 기반 아키텍처. 픽셀 공간에서 직접 diffusion하면 연산 비용이 이미지 해상도에 제곱으로 늘어나는데, 잠재 공간으로 압축하면 이 비용을 대폭 낮출 수 있다. "Frozen"은 가중치를 고정한 채 파인튜닝 없이 프롬프트만으로 생성 방향을 제어한다는 의미다.

①만 있으면 결함 형태는 그럴듯하게 생성되어도 양품 이미지와 합성 시 경계가 부자연스럽다. "붙여넣기 티"를 없애는 ②가 필요하다. "Physics-aware"는 ①+②를 결합한 개념이다.

### self-referential 합성은 VDG와 역할 분담 관계다

```
Physics-aware VDG (LDM + FMEA): "어떤 형태의 결함을 만들지" 결정
self-referential (Perlin noise + Hadamard): "그 결함이 이 표면에서 어떻게 보이는지" 결정
  → 도메인 내부 주파수 패턴 분석으로 외부 텍스처 의존 없이 결함 패턴 생성
  → 도메인 갭 수학적 최소화
```

### Zero-shot → Fully Supervised는 순차 파이프라인이 아니라 능력 성장 궤적이다

"Zero-shot → Fully Supervised Segmentation 전환"은 데이터가 순서대로 흘러가는 파이프라인이 아니다. Zero-shot은 학습 데이터가 전혀 없는 시작 상태, Fully Supervised는 VDG + 실제 데이터 학습이 완료된 최종 상태를 가리킨다.

**합성 데이터 단계에서 Zero-shot은 무관하다.** VDG는 결함을 자신이 붙이므로 위치를 정확히 알고 픽셀 단위 GT mask를 자동 생성한다. Zero-shot 탐지가 개입할 필요가 없다.

**실제 데이터 단계(Stage 2)에서 SAM이 라벨링 보조 도구로 등장한다.** 현장에서 진짜 결함 이미지가 들어오면 작업자가 클릭 한 번으로 SAM이 픽셀 마스크 후보를 잡아주고, 작업자는 검수·수정만 한다. Zero-shot 기반 SAM이 이 단계의 라벨링 공수를 줄이는 역할이다.

```
[합성 단계]  VDG → GT mask 자동 생성 → U-Net 학습  (Zero-shot 무관)
[실제 단계]  현장 결함 이미지 → SAM(클릭) → 작업자 검수 → 재학습
```

### 검증 기준: 생성 품질보다 하위 성능이 최종 기준이다

합성 이미지가 "그럴듯해 보이는가"(FID 점수)보다 "이 데이터로 학습한 모델이 현장 실제 결함에서 작동하는가"가 실질적 검증 기준이다. Physics-aware(공정 물리 기반)를 강조하는 이유가 여기 있다.

→ 관련: [[Open-set AI separates unknown defect types without forcing them into known classes]] [[ML 비지도 학습에서 합성 이상 데이터가 필요한 이유]] [[Operator label quality is the hidden ceiling for supervised segmentation over anomaly detection]]
