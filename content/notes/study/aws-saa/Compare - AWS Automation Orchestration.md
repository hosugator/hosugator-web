---
created: 2026-01-16
tags:
  - AWS
  - Automation
  - Decision_Making
---
# AWS Automation Orchestration Guide

## 본질 (Essence)
물량은 Batch에게, 복잡한 절차는 Step Functions에게, 단순한 신호 전달은 EventBridge에게 맡기는 적재적소의 원칙

## 구조 (Mechanism)
- **AWS Batch**: 독립적인 대량 작업을 리소스 가용성에 맞춰 스케줄링하는 '효율' 중심 서비스
- **Step Functions**: 작업 간의 의존성과 순서를 관리하고 실패 지점을 명확히 추적하는 '신뢰' 중심 서비스
- **EventBridge**: 이벤트 발생 시 즉각적으로 타겟을 호출하여 시스템 간 결합도를 낮추는 '유연' 중심 서비스

## 확장 (Connection)
- **연결**: 대량의 화물을 처리하는 물류 시스템과 개별 서류의 결재 라인을 관리하는 행정 시스템의 차이와 유사함
- **응용**: S3 업로드 시 즉시 알림은 **EventBridge**, 결제-배송-환불 등 긴 호흡의 로직은 **Step Functions**, 대규모 위성 이미지 분석은 **Batch**를 선택합니다.

---
See Also: 
- [[AWS Event-Driven Automation]]
- [[AWS Automation Orchestration Guide]]