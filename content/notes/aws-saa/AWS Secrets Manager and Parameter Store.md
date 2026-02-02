---
created: 2025-12-23
tags:
  - AWS_Security
  - Secrets_Manager
  - Parameter_Store
reference:
  - "[[AWS IAM]]"
  - "[[Data Encryption at Rest]]"
---
# AWS Secrets Manager vs Parameter Store

## 정의 (Definition)
애플리케이션에서 사용하는 자격 증명, API 키, 설정 데이터 등을 안전하게 저장하고 중앙 집중적으로 관리하는 클라우드 보안 관리 서비스

## 핵심 맥락 (Context & Why)
### Problem
자격 증명을 코드나 로컬 파일에 평문으로 저장할 경우 보안에 취약하며 암호 주기적 변경 작업 시 애플리케이션 코드를 수정하고 재배포해야 하는 운영 오버헤드가 발생함
### Solution
민감한 정보를 암호화하여 저장소에 분리 관리하고 API 호출을 통해 동적으로 정보를 가져오며 특히 데이터베이스 암호 등을 자동으로 교체해주는 기능을 활용하여 보안성과 운영 효율성을 극대화함

## 작동 원리 (Mechanism) 
### 자동 암호 교체(Rotation) 프로세스 (Secrets Manager 기준)
교체 주기 도달 -> Secrets Manager가 Lambda 함수 트리거 -> Lambda가 DB의 새 암호 생성 및 변경 -> 변경된 암호를 Secrets Manager에 저장 -> 앱은 다음 호출 시 새로운 암호를 획득

## 유비 및 비교 (Analogy & Comparison)
### It's like
Parameter Store는 중요한 물건을 넣어두는 번호 키 달린 사물함 같고 Secrets Manager는 정기적으로 비밀번호를 바꿔주고 열쇠를 관리해주는 전문 보안 금고 서비스와 같음
### vs (유사 개념): 
 - AWS Secrets Manager: DB 자격 증명 특화 및 자동 교체 기능 내장하며 보관 및 호출당 비용 발생
 - SSM Parameter Store: 일반 설정값 및 환경 변수 중심이며 자동 교체 기능 미내장으로 필요 시 Lambda 직접 구현해야 하나 대부분 무료(Standard 기준)

## 예시 및 구조 (Example/Structure)
RDS(Aurora) 연결 정보를 관리하는 시나리오: `Secrets Manager에 DB 호스트/PW 저장` -> `EC2 앱이 SDK로 Secret 값 요청` -> `Secrets Manager가 해독하여 반환` -> `앱이 DB 접속` -> `정기적으로 Lambda가 DB와 Secret의 암호를 동시 갱신`