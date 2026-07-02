---
created: 2026-06-17
updated: 2026-06-17
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - mlops
  - edge
  - cloud
  - aws
  - cost
publish: true
---
## Context
hesung 모델 학습 파이프라인을 설계하면서, 현장에 GPU PC를 두는 온프레미스 방식 외에 클라우드 배치 학습이 현실적인 대안인지 검토했다. 고객사 현장에 GPU 장비가 없고, 데이터 반출이 허용된다는 전제.

## Insight
### 데이터 반출 허용 여부가 아키텍처 분기점이다

- **반출 불가** → 게이트웨이 PC + 온프레미스 학습 불가피. 현장에 GPU 장비 필요.
- **반출 가능** → EC2 Spot Instance 배치 학습. 현장에 인터넷 연결 PC 한 대만 있으면 됨.

### 클라우드 배치 학습 아키텍처

```
현장 PC (인터넷 연결)
  └── 이미지 촬영 → S3 증분 업로드
  └── S3에서 모델 다운로드 → 추론 (C SDK + ONNX)

클라우드
  └── S3: 학습 데이터 임시 보관 (학습 완료 후 삭제)
  └── EC2 Spot (g4dn.xlarge): 배치 학습 실행
  └── 학습 완료 → 모델 S3 저장 → 현장 PC pull

CI/CD: GitHub Actions → 학습 트리거 → 완료 후 S3 데이터 삭제
```

### 보안 옵션 비교

| 방식 | 데이터 경로 | 체류 시간 | 보안성 |
|---|---|---|---|
| S3 영구 보관 | 현장 → S3 → EC2 | 무기한 | 낮음 |
| S3 임시 + 삭제 | 현장 → S3 → EC2 → 삭제 | 학습 완료까지 | 중간 |
| EC2 직접 전송 | 현장 → EC2 | 학습 완료까지 | 높음 |

보안성만 따지면 EC2 직접 전송이 최선. S3는 버저닝·액세스 로그가 남아 "완전 삭제" 증명이 어렵다. 실용적으로는 S3 임시 + 삭제 + VPC + TLS 조합이 고객 설득 가능한 수준.

### 비용

- g4dn.xlarge Spot: ~$0.16/h
- 이미지 수백 장, 학습 30분 기준: **~$0.08/회**
- 학습할 때만 인스턴스 기동 → idle 비용 없음
- 현재 로컬 RTX 5070 Laptop이 T4보다 연산 성능 높음 → 지금 규모에선 로컬이 빠르고 무료

## Related
- [[Air-gapped factory ML deployment uses gateway PC as pull bridge not Argo CD push]]
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]]
- [[OrtSession hot-swap enables zero-downtime model updates without restarting C SDK process]]
