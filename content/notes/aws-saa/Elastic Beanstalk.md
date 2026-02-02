---
created: 2025-11-16
tags:
  - aws_saa
  - aws
  - elastic_beanstalk
  - deployment
  - paas
  - management
reference:
---
# AWS Elastic Beanstalk
## 정의
개발자가 코드를 업로드하는 것만으로 용량 프로비저닝, 로드 밸런싱, 자동 조정 및 상태 모니터링을 자동으로 처리하는 완전 관리형 플랫폼 서비스 (PaaS)
## 원리
### 자동화된 인프라 구축
- 사용자가 지원되는 플랫폼(Java, Node.js, Python, Docker 등)을 선택하고 코드를 업로드하면, Elastic Beanstalk는 해당 애플리케이션 실행에 필요한 모든 AWS 리소스(예: [[EC2]], [[ELB]], [[Auto Scaling Group]], [[VPC]] 구성)를 자동으로 프로비저닝하고 구성한다.
### 환경 기반 관리
- 애플리케이션의 코드를 애플리케이션 버전으로 관리하고, 이 버전을 환경 (예: 개발, 스테이징, 프로덕션)에 배포하여 운영한다.
## 요소
- 애플리케이션(Application): Elastic Beanstalk에서 관리하는 애플리케이션의 논리적 정의이다.
- 환경(Environment): 애플리케이션의 특정 버전을 실행하는 리소스 모음(로드 밸런싱, Auto Scaling 등)이다. 환경은 단일 인스턴스 환경 또는 로드 밸런싱 환경으로 구성될 수 있다.
- 애플리케이션 버전(Application Version): 배포할 소스 코드의 특정 반복분(예: zip 파일 또는 WAR 파일)이다.
- 환경 구성(Configuration): 환경에 사용되는 인스턴스 유형, 키 페어, 데이터베이스 연결 등 인프라 설정이다.
## 특징
- PaaS (Platform as a Service): 인프라 관리의 복잡성을 제거하여 개발 속도를 높인다.
- 다양한 배포 전략: 애플리케이션 다운타임을 최소화하기 위해 롤링(Rolling), 불변(Immutable), 블루/그린(Blue/Green, [[CodeDeploy]] 사용) 등 다양한 배포 방식을 지원한다.
- 커스터마이징: `.ebextensions` 구성 파일을 통해 생성된 기본 AWS 리소스를 직접 수정하거나 추가적인 리소스를 정의하여 유연성을 제공한다.
- 상태 모니터링: [[CloudWatch]] 및 [[AWS Health]]를 사용하여 환경 상태를 지속적으로 모니터링하고 알림을 제공한다.
## 비교
| 구분 | Elastic Beanstalk (PaaS) | [[CloudFormation]] (IaC) | [[ECS]] (Container Orchestration) |
| :--- | :--- | :--- | :--- |
| 주요 목적 | 애플리케이션 배포 및 환경 관리 | 인프라 프로비저닝 및 코드화 | 컨테이너화된 워크로드 오케스트레이션 |
| 관리 단위 | 애플리케이션 환경 | 인프라 템플릿 (JSON/YAML) | 컨테이너 태스크 |
| 적합한 경우 | 빠른 웹 애플리케이션 배포 및 단순한 환경 관리 | 복잡하고 사용자 지정된 인프라 구축 | 도커 컨테이너 및 마이크로서비스 운영 |
## 예시
- 단일 서버 웹 애플리케이션 배포:
    1. 개발자가 Node.js 기반의 웹 애플리케이션 코드를 압축(Zip)한다.
    2. Elastic Beanstalk 콘솔에서 Node.js 플랫폼을 선택하고 코드를 업로드하며, 환경 유형을 단일 인스턴스 환경으로 선택한다.
    3. Elastic Beanstalk는 자동으로 [[EC2]] 인스턴스를 프로비저닝하고, Node.js 런타임을 설정하며, 코드를 배포하고 실행한다.
    4. 이후 코드 업데이트가 필요할 때마다 새로운 버전을 업로드하고 롤링 배포를 선택하면, 환경 다운타임 없이 새로운 버전으로 업데이트가 완료된다.