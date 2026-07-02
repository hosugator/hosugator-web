---
created: 2026-06-17
updated: 2026-06-17
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - architecture
  - cv
publish: true
---
## Context
ML 아키텍처 용어 정리 중 Backbone을 Architecture의 동의어로 오해했던 것을 교정했다. Backbone은 Architecture의 일부이며, Architecture 안에서 역할별로 Backbone/Neck/Head로 구분된다.

## Insight
### Architecture와 Backbone은 다른 범주다

```
Architecture (큰 범주):
  ├── Backbone   특징 추출 네트워크 (ResNet, ViT 등)
  ├── Neck       특징 통합 (선택적)
  ├── Head       태스크별 출력층
  └── 활성화 함수, 편향, 정규화 등 내부 구성요소

학습 설정 (별도 범주):
  ├── 손실 함수
  ├── Learning Rate
  └── 옵티마이저
```

### Backbone: 특징 추출 네트워크

입력 이미지를 받아 의미있는 특징 맵을 뽑는 역할이다. 보통 ImageNet 등으로 사전학습된 네트워크를 재사용한다.

```
입력 이미지
  → Backbone (ResNet50, ViT 등)
  → 특징 맵 (Feature Map)
```

### Neck: 다중 스케일 특징 통합

Backbone은 레이어마다 해상도가 다른 특징 맵을 출력한다. 작은 객체는 얕은 레이어에서, 큰 객체는 깊은 레이어에서 잘 보이기 때문에 여러 스케일을 합치는 것이 유리하다.

```
Backbone 출력:
  레이어1: 256×256  (세밀하지만 추상도 낮음)
  레이어3:  64×64   (추상도 높지만 해상도 낮음)
      ↓
Neck (FPN 등): 여러 스케일을 합쳐 다중 해상도 특징 맵 생성
      ↓
Head: 각 스케일에서 박스/클래스 예측
```

Neck이 없는 모델도 많다. 단순 분류(ResNet + FC)는 Backbone → Head로 바로 연결된다.

### Head: 태스크별 출력층

```
분류 Head:         FC → Softmax → 클래스 확률
검출 Head:         FC → 박스 좌표 + 클래스 확률
세그멘테이션 Head:  Decoder → 픽셀별 클래스
```

같은 Backbone에 다른 Head를 붙여서 여러 태스크에 재사용할 수 있다.

### 전체 구조 예시

```
Faster R-CNN: ResNet50(Backbone) → FPN(Neck) → RPN+RoI Head(Head)
YOLO:         Darknet(Backbone)  → PAN(Neck) → 검출 Head
PatchCore:    ResNet50(Backbone) → (Neck 없음) → KNN(Head)
분류 ResNet:  ResNet50(Backbone) → (Neck 없음) → FC(Head)
```

## Related
- [[ML backbone lineage evolves by solving the predecessor bottleneck]] — 각 backbone architecture의 역사
- [[CNN shares one kernel across spatial positions to detect location-invariant patterns]] — CV backbone의 대표 architecture
- [[U-Net classifies pixels while PatchCore measures distance from normal features]] — Neck 없이 Backbone → Head 직접 연결 사례
- [[객체 탐지의 정의]] — Head가 다중 태스크를 수행하는 검출 태스크 개요
- [[ML architecture overview for field practitioners]] — 현업 모델 전체 개요