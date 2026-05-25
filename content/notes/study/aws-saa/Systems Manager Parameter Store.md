---
created: 2025-11-13
tags: [aws_saa, parameter_store, ssm, secret, hierarchy, version]
reference:
  - https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
---

# AWS Systems Manager Parameter Store
## 정의
설정값이나 민감 정보를 중앙에 저장하고 애플리케이션과 인프라가 안전하게 꺼내 쓸 수 있는 관리형 키-값 저장소
## 핵심 용어
- [[Parameter]] : 키-값 한 쌍, 문자열·문자열리스트·SecureString 암호화 저장
- [[Hierarchy]] : 경로 표기(/myApp/dev/dbHost)로 버전·환경 구분
- [[Version]] : 같은 키에 대한 수정 이력, 최대 100개 보관
- [[SecureString]] : [[KMS]] 고객 키로 암호화된 값, 비밀번호·API 키 저장용
## 주요 기능
- 경로 기반 일괄 조회 : /myApp/prod/* 한 번에 가져오기
- IAM 정책으로 키별 읽기·쓰기 제한
- CloudWatch 이벤트 : 값 변경 시 Lambda·SNS 호출
- VPC 엔드포인트로 퍼블릭 인터넷 없이 접근
## 특징
- 요금 : Standard 파라미터 1만 건·월 무료, 초과 0.05USD/10,000건
- 고급 파라미터(암호화·정책) 월 0.05USD/10,000건
- Secrets Manager 대비 생명주기·회전 기능은 없지만, 간단 설정값 관리에는 저렴하고 빠름