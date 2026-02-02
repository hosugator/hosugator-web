---
created: 2025-11-16
tags: [aws_saa, aws, codedeploy, ci_cd, deployment, automation]
reference:
---
# AWS CodeDeploy
## 정의
애플리케이션 배포를 자동화하여 새로운 기능의 출시 속도를 높이고 배포 중단 시간을 최소화하는 관리형 배포 서비스
## 원리
### 중앙 집중식 배포 관리
- 배포 그룹(Deployment Group)에 속하는 인스턴스에 애플리케이션 리비전을 자동으로 배포한다.
- `appspec.yml` 파일을 사용하여 배포 과정(파일 복사, 스크립트 실행, 서비스 시작/중지)을 정의한다.
### 다양한 배포 방식 지원
- 다양한 배포 전략(인플레이스/블루-그린)과 롤백 기능을 내장하고 있어, 오류 발생 시 자동으로 이전 상태로 복구할 수 있다.
## 요소
- 애플리케이션(Application): 배포할 코드와 구성 정보를 포함하는 논리적 컨테이너이다.
- 배포 그룹(Deployment Group): 배포 대상이 되는 [[EC2]] 인스턴스, 온프레미스 서버, 또는 [[Lambda]] 함수 그룹이다. [[AWS Auto Scaling]] Group과 연동될 수 있다.
- 리비전(Revision): 배포할 코드 및 관련 파일(소스 코드, 웹 페이지, 실행 파일 등)의 특정 버전으로, 일반적으로 [[S3]] 또는 [[CodeCommit]]에 저장된다.
- `appspec.yml`: 배포 대상 인스턴스 유형(EC2/온프레미스 또는 Lambda)에 따라 배포 프로세스의 단계(Hook)와 파일을 정의하는 YAML 형식의 구성 파일이다.
## 특징
- 자동화된 배포: 수천 개의 인스턴스에 걸쳐 애플리케이션 배포 프로세스를 자동으로 처리한다.
- 제로 다운타임(Zero Downtime) 배포:
    - Blue/Green 배포: 기존 환경(Blue)은 유지한 채 새 환경(Green)에 배포하고 트래픽을 일시에 전환하여 다운타임을 최소화한다.
    - In-Place 배포: 기존 인스턴스에 직접 새 버전을 설치한다 (다운타임 발생 가능).
- 롤백 기능: 배포 후 모니터링([[CloudWatch]] 등과 통합)을 통해 오류가 감지되면 자동으로 이전 버전으로 롤백한다.
- 다양한 컴퓨팅 플랫폼: Amazon EC2/온프레미스 컴퓨팅, [[Lambda]] 환경에 모두 배포할 수 있다.
## 비교
| 구분 | CodeDeploy | [[2. project/AWS_SAA/Elastic Beanstalk]] |
| :--- | :--- | :--- |
| 관리 단위 | 배포 프로세스 자체를 관리 | 전체 환경(인프라)을 관리 |
| 목적 | 배포 방식(Blue/Green, In-Place)에 대한 세부 제어 | 빠른 PaaS 환경 구축 및 인프라 자동 관리 |
| 관계 | [[2. project/AWS_SAA/Elastic Beanstalk]]가 내부적으로 CodeDeploy를 사용하여 Blue/Green 배포를 수행할 수 있다. | CodeDeploy는 배포의 핵심 엔진 역할을 한다. |
## 예시
- Blue/Green 웹 서비스 업데이트:
    1. [[CodePipeline]]이 AWS CodeDeploy를 호출하여 새 리비전의 배포를 시작한다.
    2. CodeDeploy는 Blue/Green 전략을 사용하여 트래픽을 받지 않는 새로운 환경(Green)에 EC2 인스턴스를 프로비저닝하고 애플리케이션을 배포한다.
    3. 배포가 성공하면, [[ELB]]를 통해 트래픽을 기존 환경(Blue)에서 새 환경(Green)으로 전환한다.
    4. 트래픽 전환 후, 문제가 없을 경우 기존 환경(Blue)의 리소스는 해제되어 다운타임 없이 업데이트가 완료된다.