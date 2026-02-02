---
created: 2025-12-18 Thu
tags:
  - aws_saa
  - aws_batch
  - step_functions
  - automation
  - serverless
reference:
  - "[[AWS Migration Strategies]]"
---
# AWS Batch & Step Functions (Operational Efficiency)

## 정의 (Definition)
대규모 컴퓨팅 작업(Batch)을 자동화하고, 그 실행 단계를 로직에 따라 유연하게 연결(Step Functions)하는 서버리스 기반의 워크플로 관리 솔루션.

## 핵심 맥락 (Context & Why)
- **Problem:** 수천 개의 이미지 처리 작업을 사람이 일일이 감시하거나 서버 사양을 조절하기 힘듦. 관리 포인트가 적어야 함.
- **Solution:** **AWS Batch**로 컴퓨팅 자원 관리를 맡기고, **Step Functions**로 작업 순서를 자동화함.

## 주요 특징 (Features)
1. **Zero Infrastructure Management:** 서버를 직접 켜고 끄거나 모니터링할 필요가 없음 (Batch가 대행).
2. **Complex Workflow:** 조건문, 병렬 처리, 재시도 로직 등을 시각적으로 구성 가능 (Step Functions).
3. **Cost Optimization:** 작업이 있을 때만 자원을 할당하여 비용 낭비 최소화.

## 유비 및 비교 (Analogy & Comparison)
- **It's like: 대량의 빨래를 처리하는 세탁 서비스**
    - **EC2 (D):** 내가 직접 세탁기를 사고, 세제를 넣고, 시간을 맞춰서 빨래를 돌리는 것.
    - **AWS Batch (B):** 빨래감을 세탁 바구니에 넣어두면, 업체가 알아서 빈 세탁기를 찾아 돌리고 건조까지 해서 가져다주는 것. 나는 세탁기 상태를 신경 쓸 필요가 없음.