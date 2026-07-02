---
created: 2026-06-16
updated: 2026-06-16
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml-engineering
  - architecture
  - multi-product
  - monorepo
publish: true
---
## Context
Q-display, Q-edge 이후 hesung 제품이 추가되면서 제품마다 클래스 수, 라벨 구조, 마스크 두께, 평가 방향이 달라졌다. 처음에는 `if product == "hesung":` 분기가 train.py, evaluate.py, convert_labels.py에 산발적으로 퍼지기 시작했다.

## Insight
### 제품별 분기를 코드에 두지 말고 데이터 객체에 두어라

```python
@dataclass
class ProductConfig:
    name: str
    num_classes: int        # 2=binary, 3=multi-class
    label_map: dict         # labelme 라벨명 → 클래스 인덱스
    direction: str          # "H" | "V" | "auto" | "both"
    mm_per_px: float
    min_lines: int = 2
    detect_priority: bool = False
    mask_thickness: int = 3

PRODUCTS = {
    "Q-display": ProductConfig(...),
    "hesung":    ProductConfig(num_classes=3, label_map={"line_H": 1, "line_V": 2}, direction="both", mask_thickness=9, ...),
}
```

스크립트는 `cfg = PRODUCTS[args.product]`로 설정을 받아서 동작한다. 새 제품 추가 = `product_config.py`에 한 줄. 기존 스크립트 수정 없음.

### 모노레포가 언제까지 유효한가

제품 수가 늘어도 **전처리 파이프라인이 동일한 구조** (labelme → mask → train → onnx) 라면 모노레포가 맞다. 제품별로 파이프라인 자체가 달라지는 시점(예: 다른 모델 아키텍처, 다른 학습 프레임워크)에 분리를 검토한다.

## Decision
ProductConfig 패턴을 채택. 제품별 하위 레포 분리는 파이프라인 구조가 달라질 때 재검토.
**전환 조건**: 제품 중 하나가 U-Net 이외의 아키텍처가 필요하거나, 전처리 흐름이 근본적으로 달라질 때.

## Related
- [[Checkpoint naming separates resume from deployment in ML training]]
- [[Operator label quality is the hidden ceiling for supervised segmentation over anomaly detection]]
