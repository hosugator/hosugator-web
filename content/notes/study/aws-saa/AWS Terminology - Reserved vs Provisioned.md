---
created: 2026-01-15
tags:
  - aws
  - terminology
  - reserved
  - provisioned
---
# AWS Terminology: Reserved vs Provisioned

## 본질 (Essence)
자리를 찜해두는 것(Reserved)과, 즉시 쓸 수 있게 세팅해두는 것(Provisioned)의 차이

## 구조 (Mechanism)
- **Reserved (예약)**: 특정 리소스의 소유권을 확정하는 행위입니다. 타 리소스와의 간섭을 막기 위한 '할당량 확보' 및 '상한선 제어'가 핵심입니다.
- **Provisioned (공급/준비)**: 리소스를 활성화하여 실제 구동 가능한 상태로 만드는 행위입니다. 요청 즉시 처리(Low Latency)가 가능하도록 '최소 자원 유지' 및 '하한선 보장'이 핵심입니다.

## 확장 (Connection)
- **연결**: EC2 Reserved Instance(RI)가 '비용 절감을 위한 자리 찜'이라면, Provisioned IOPS(EBS)는 '성능 보장을 위한 미리 닦아놓은 길'입니다.
- **응용**: 고가용성과 저지연이 중요한 서비스에는 **Provisioned** 개념을, 리소스 간섭 방지와 비용 통제가 중요한 곳에는 **Reserved** 개념을 적용합니다.

---
See Also: 
- [[Lambda Concurrency Strategies]]