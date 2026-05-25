---
created: 2026-01-09
tags:
  - AWS
  - DynamoDB
  - Cost_Optimization
---
# DynamoDB TTL (Time To Live)

## 본질 (Essence)
> 데이터마다 '유통기한 스티커'를 붙여두면, 기한이 지났을 때 관리자가 추가 비용 없이 자동으로 쓰레기통에 비워주는 자동 청소 시스템

## 구조 (Mechanism)
- **정의**: 테이블의 아이템별로 특정 시간(Epoch 시간 형식)을 지정하면, 해당 시간이 경과한 아이템을 DynamoDB가 자동으로 삭제하는 기능
- **핵심**: 삭제 작업에 별도의 Write Capacity Unit(WCU)을 소모하지 않아 비용이 무료이며, 애플리케이션 레벨에서 복잡한 삭제 로직을 구현할 필요가 없어 개발 공수가 최소화됨

## 확장 (Connection)
- **연결**: 세션 정보 관리나 임시 로그 저장 등 '최신 데이터'만 가치가 있는 휘발성 데이터 관리에 최적임
- **응용**: "최근 30일 데이터만 유지"와 같은 요구사항 발생 시, Lambda나 배치 스크립트보다 우선적으로 고려해야 할 비용 최적화 솔루션

---
See Also: [[Amazon DynamoDB]], [[AWS Lambda]], [[Cost Explorer]]