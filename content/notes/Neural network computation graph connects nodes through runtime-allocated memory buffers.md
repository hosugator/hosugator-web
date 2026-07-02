---
created: 2026-06-04
updated: 2026-06-04
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml
  - onnx
  - systems
  - neural-network
publish: true
---
## Context
predict_onnx.py 쉐도잉 준비 중 ONNX 연산 그래프의 내부 구조를 추적했다. "신경망 그래프"가 메모리에서 어떻게 동작하는지 피상적으로만 알고 있었고, 노드 간 연결 메커니즘을 구체적으로 파악했다.

## Insight
### 연산 그래프는 노드(레이어) + 엣지(중간 텐서)로 구성된다

뉴런 단위가 아니라 레이어(연산) 단위로 그래프가 구성된다. 뉴런은 레이어 내부에 암묵적으로 존재한다.

```
[Conv 노드] → [중간 텐서] → [BN 노드] → [중간 텐서] → [ReLU 노드]
```

### ONNX 파일은 논리적 연결만 정의하고 주소는 없다

```
# ONNX 파일 내부
node { op: "Conv",  input: ["x"],         output: ["conv1_out"] }
node { op: "BN",    input: ["conv1_out"], output: ["bn1_out"]   }
node { op: "ReLU",  input: ["bn1_out"],   output: ["relu1_out"] }
```

이름(conv1_out 등)이 연결고리이고, 실제 메모리 주소는 없다.

### ONNX Runtime이 로드 시점에 주소를 할당하고 딕셔너리로 관리한다

```python
address_map = {
  "conv1_out": 0x7f3a2000,
  "bn1_out":   0x7f3a4000,
}
# 노드들은 이 딕셔너리를 통해 서로의 버퍼를 읽고 쓴다
```

주소는 전역 고정이 아니라 **로드 시점에 동적 할당 후 추론 동안 고정**된다. 재로드 시 주소가 바뀔 수 있다.

### 노드 내부에서 입력 텐서는 뉴런들에 분배되고 출력은 하나의 텐서로 합쳐진다

Conv 레이어를 예로 들면: 입력 텐서가 필터(뉴런들)에 각각 적용되고, 각 필터의 출력이 합쳐져 다음 노드로 전달될 하나의 텐서가 된다.

## Related
- [[model eval mode disables Dropout and fixes BatchNorm running stats for inference]] — 같은 ONNX 학습 맥락에서 나온 인사이트
- [[ONNX format embeds computation graph making it self-contained unlike pth which depends on Python code]] — ONNX 자기완결성 원칙
