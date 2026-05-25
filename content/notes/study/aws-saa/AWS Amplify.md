---
created: 2025-12-19
tags:
  - aws
  - amplify
  - frontend
  - mobile
  - fullstack
reference:
  - "[[Amazon ECS]]"
  - "[[AWS Lambda]]"
  - "[[Amazon API Gateway]]"
---

# AWS Amplify

## 정의 (Definition)
모바일 및 프론트엔드 웹 개발자가 AWS의 클라우드 서비스를 활용하여 풀스택 애플리케이션을 신속하게 구축하고 배포할 수 있도록 지원하는 완전 관리형 개발 플랫폼입니다.

## 핵심 맥락 (Context & Why)
### Problem
프론트엔드 개발자가 사용자 인증, 데이터베이스 연결, API 구축과 같은 백엔드 인프라를 직접 구성하고 관리하려면 클라우드 인프라에 대한 깊은 지식이 필요하며 많은 개발 시간이 소모됩니다.
### Solution
반복되는 백엔드 구성 작업을 CLI와 시각적 인터페이스로 자동화하고 다양한 프론트엔드 프레임워크와 결합된 라이브러리를 제공하여 개발자가 비즈니스 로직에만 집중하게 합니다.

## 작동 원리 (Mechanism) 
### 백엔드 리소스 프로비저닝
개발자가 Amplify CLI를 통해 필요한 기능(인증, API 등)을 선택하면 CloudFormation을 기반으로 AWS 리소스가 자동으로 생성되고 관리됩니다.
### 프론트엔드 라이브러리 연동
생성된 백엔드 리소스와 통신하기 위한 설정 파일이 로컬 프로젝트에 생성되며 전용 SDK를 통해 선언적인 방식으로 백엔드 기능을 호출합니다.
### 지속적 배포 (CI/CD)
Git 리포지토리와 연결되어 코드가 푸시될 때마다 프론트엔드 자산 빌드 및 백엔드 업데이트가 포함된 배포 워크플로우가 실행됩니다.

## 유비 및 비교 (Analogy & Comparison)
### It's like
식재료 준비부터 조리 기구 세팅까지 다 해주는 밀키트 서비스와 같아서 요리사는 재료를 조합하여 완성하는 것에만 집중하면 됩니다.
### vs (유사 개념)
- AWS Amplify: 신규 모바일 및 웹 앱의 빠른 풀스택 개발과 호스팅에 최적화되어 있습니다.
- Amazon ECS: 기존 애플리케이션 코드를 컨테이너화하여 마이크로서비스로 쪼개고 복잡한 인프라 제어가 필요한 경우에 적합합니다.

## 예시 및 구조 (Example/Structure)
React 프로젝트에서 사용자 인증 기능을 추가할 때 사용:
`amplify add auth` 명령 실행 후 `withAuthenticator` 컴포넌트로 프론트엔드 코드를 감싸면 즉시 로그인 화면이 구현됩니다.

---
See Also:
- [[AWS Amplify Hosting]]
- [[AWS Amplify Admin UI]]