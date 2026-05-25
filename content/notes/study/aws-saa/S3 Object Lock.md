---
created: 2026-01-23
tags:
  - aws
  - s3
  - security
  - compliance
---
# S3 Object Lock & Compliance

## 본질 (Essence)
WORM(Write Once, Read Many) 모델을 사용하여 데이터를 일정 기간 동안 수정하거나 삭제할 수 없도록 물리적으로 보호하는 기능.

## 구조 (Mechanism)
- **Compliance Mode**: 가장 강력한 보호. AWS 계정 루트 사용자를 포함한 그 누구도 보존 기간 내에 파일을 삭제/수정할 수 없음.
- **Governance Mode**: 특정 IAM 권한(`s3:BypassGovernanceRetention`)이 있는 사용자는 파일을 삭제하거나 설정을 변경할 수 있음.
- **Retention Period**: 객체가 잠기는 구체적인 기간(예: 365일)을 설정.
- **Legal Hold**: 기간 제한 없이 명시적으로 해제할 때까지 객체를 보호. 보존 기간과 함께 사용 가능.

## 확장 (Connection)
- **연결**: 의료 기록, 금융 거래 데이터 등 법적 규제가 엄격한 데이터는 "Compliance Mode"가 정석.
- **응용**: "그 누구도 삭제 불가" 키워드가 나오면 고민 없이 Compliance Mode를 선택.

---
See Also: 
- [[AWS Security Service]]