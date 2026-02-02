---
created: 2025-10-20
tags: [정보처리기사, sw_testing, validation, verification, quality_assurance]
reference:
  - "[[정보처리기사 - hub]]"
---

> Last revised: `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`
# Comparison - Validation and Verification
## 정의
### Validation
요구사항 만족 여부 확인
- 주요 테스트 레벨: 시스템 테스트, 인수 테스트 등 프로젝트 후반부에 주로 수행된다.
### Verification
기능 명세·내부 표준 정상 여부 확인
- 주요 테스트 레벨: 단위 테스트, 통합 테스트 등 프로젝트 전반부에 주로 수행된다.
## 특징
확인과 검증은 독립적이며, 한쪽의 성공이 다른 쪽의 성공을 보장하지 않는다.
### Validation Fail
코드가 설계 명세대로 완벽하게 작동하더라도, 애초에 설계가 고객 요구사항을 잘못 해석하여 고객이 원하는 것과 다른 제품을 만들었다면 검증은 성공하고 확인은 실패한다.
### Verification Fail
최종 기능이 고객 요구사항을 충족(확인 성공)하더라도, 그 기능이 비효율적이거나 불안정한 코드(검증 실패)로 구현되었다면 품질이 낮다고 평가된다.