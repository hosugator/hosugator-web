---
created: 2025-11-13
tags: [aws_saa, systemsmanager, ssm, parameter, runcommand, patch, automation]
reference:
  - https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html
---
# AWS Systems Manager (SSM)
## 정의
온프레미스 및 AWS 하이브리드 환경의 인스턴스·인프라·응용 프로그램을 중앙에서 관리·자동화하는 통합 운영 서비스
## 핵심 기능
- [[Parameter Store]] : 설정값·비밀번호·라이선스 키 등 계층적 저장(hierarchical) 및 버전 관리
- [[Run Command]] : 에이전트 기반 원격 명령 실행, S3·CloudWatch 로그 출력
- [[Patch Manager]] : OS 패치 베이스라인 생성·스캔·자동 설치, Patch Group 기반
- [[Session Manager]] : SSH 키·베스천 호스트 없이 브라우저 또는 CLI로 인터랙티브 셸 접속
- [[Automation]] : YAML/JSON 기반 워크플로로 인스턴스 시작·백업·AMI 생성 등 자동화
- [[Inventory]] : 인스턴스 소프트웨어·파일·레지스트리 수집
## 특징
- SSM Agent 기본 탑재(Amazon Linux 2, Ubuntu, Windows)
- [[VPC]] 엔드포인트로 퍼블릭 인터넷 없이 통신 가능
- 요금 : API 호출 및 Parameter Store 고급 파라미터(암호화) 월 0.05USD/10,000건
- 다중 계정·다중 리전 운용 시 [[OpsCenter]], [[Explorer]] 로 통합 가시성 제공