---
created: 2025-11-17
tags: [aws_saa, aws, ecr, containers, registry, security]
reference:
---
# AWS ECR (Elastic Container Registry)
## 정의
Docker 컨테이너 이미지와 OCI(Open Container Initiative) 호환 아티팩트를 안전하게 저장, 관리 및 배포할 수 있는 완전 관리형 컨테이너 이미지 레지스트리 서비스
## 원리
### 이미지 저장 및 배포
- 리포지토리(Repository)라는 논리적 공간에 Docker 이미지를 저장한다.
- [[ECS]], [[EKS]], AWS Lambda 또는 온프레미스 Docker 클라이언트에서 이 리포지토리에 저장된 이미지를 Pull(가져오기)하여 컨테이너를 실행한다.
- 백엔드에서 [[S3]]를 사용하여 이미지를 저장하므로, 높은 내구성(Durability)과 가용성(Availability)을 보장한다.
### 인증 및 권한 관리
- Docker 클라이언트가 ECR에 이미지를 Push/Pull 하기 위해서는 AWS IAM 인증을 통해 임시 인증 토큰을 획득해야 한다.
- 리포지토리 정책(Repository Policy)을 사용하여 특정 [[IAM]] 사용자 또는 계정에 대한 접근 권한을 세밀하게 제어할 수 있다.
## 요소
- 레지스트리 (Registry): 각 AWS 계정에 부여되는 프라이빗 레지스트리 공간이다. 그 안에 리포지토리를 생성한다.
- 리포지토리 (Repository): 컨테이너 이미지 컬렉션을 저장하는 기본 단위이다.
- 이미지 (Image): 실제 컨테이너 파일(Docker Layer)이다. 태그(Tag)를 사용하여 버전을 구분한다. (예: `latest`, `v1.0.0`)
- 인증 토큰: AWS CLI 명령(`aws ecr get-login-password`)을 통해 Docker CLI에서 ECR에 접근하기 위해 사용된다.
## 특징
- 완전 관리형 및 고내구성: 자체 컨테이너 레지스트리 인프라를 운영하거나 확장할 필요가 없으며, 저장된 데이터는 [[S3]]에 의해 보호된다.
- 보안 통합:
    - 이미지 스캔 (Image Scanning): 푸시 시 또는 지속적으로 이미지 내의 OS 및 언어 패키지 취약성(CVE)을 식별한다.
    - 암호화: 유휴 데이터는 기본적으로 SSE-S3 암호화를 사용하며, [[KMS]]를 사용하여 서버 측 암호화를 설정할 수 있다.
- 수명 주기 정책 (Lifecycle Policy): 이미지의 수명 주기를 관리하여, 오래되거나 사용되지 않는 이미지를 자동으로 정리(삭제)함으로써 스토리지 비용을 절감한다.
- 복제 (Replication): 교차 리전(Cross-Region) 및 교차 계정(Cross-Account) 복제 기능을 제공하여, 여러 지리적 위치 또는 조직 간 이미지 배포를 간소화한다.
## 통합
- [[ECS]] / [[EKS]]: 컨테이너 오케스트레이션 서비스가 컨테이너 이미지를 가져오는 주된 소스이다.
- [[CodePipeline]]: CI/CD 파이프라인의 Build 단계(CodeBuild)에서 생성된 이미지를 ECR로 푸시하고, Deploy 단계(CodeDeploy/ECS)에서 이미지를 풀(Pull)한다.
## 예시
- CI/CD 파이프라인의 핵심:
    1. CodeBuild가 소스 코드를 Docker 이미지로 빌드한다.
    2. 빌드가 성공하면, 이미지는 AWS ECR 리포지토리에 푸시된다.
    3. [[ECS]] 서비스는 ECR에서 최신 태그 이미지를 Pull하여 Fargate 또는 [[EC2]] 인스턴스에 컨테이너로 배포한다.
    4. 주기적으로 ECR 수명 주기 정책이 90일 이상된 이미지를 자동으로 삭제하여 스토리지 비용을 관리한다.