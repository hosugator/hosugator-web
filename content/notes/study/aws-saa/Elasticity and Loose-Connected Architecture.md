---
created: 2025-11-20
tags:
  - aws_saa
  - architecture
  - loose_connect
  - elasticity
reference:
---
# AWS - 아키텍처 설계 - 확장 가능하고 느슨하게 결합된 아키텍처
## 1. 크기 조정 및 탄력성 기본 사항

### 수직적 크기 조정(Vertical Scaling) vs. 수평적 크기 조정(Horizontal Scaling)
- 두 방법의 차이점 및 각각의 비용 최적화 방안을 이해한다.

### 탄력성 (Elasticity)
- 정의: 자동화를 사용하여 수요에 맞춰 용량을 조정하는 능력이다.
- 핵심: 끊임없이 변화하는 수요에 맞춰 용량을 자동으로 늘리거나 줄이는 원리를 이해한다.

### AWS Auto Scaling 및 EC2 Auto Scaling
- 기능: 시스템을 확장 및 축소하여 수요에 맞추는 방법이다.
- 크기 조정 정책: EC2 Auto Scaling에서 사용할 수 있는 다양한 유형의 크기 조정 정책 (예: 대상 추적, 단계 조정)을 알아야 한다.

## 2. 컴퓨팅 워크로드 옵션 및 선택 기준

### 컴퓨팅 옵션의 이해
- 컨테이너 (Fargate, ECS, EKS): 기본 원리 및 사용 상황.
- 서버리스 (Lambda, API Gateway): 기본 원리 및 사용 상황.
- 가상 인스턴스 (EC2): 기본 원리 및 사용 상황.
- 선택 기준: 어떤 요구 사항에서 특정 옵션(컨테이너, 서버리스, 가상화)이 다른 옵션보다 더 적절한지 판단할 수 있어야 한다.

### AWS 서버리스 (Serverless) 정의
- 정의: 프로비저닝하거나 관리할 인프라가 없는 운영 모델이다.
- 속성: 소비 단위에 따라 자동 크기 조정, 종량제 결제 모델, 내장된 가용성 및 내결함성이다.

### 고성능 컴퓨팅 (HPC)
- EC2 인스턴스 유형: HPC에 최적인 다양한 인스턴스 유형을 알아야 한다.
- 배포 구성: 배치 그룹(Placement Groups)의 다양한 유형과 고급 네트워킹 옵션이 성능에 미치는 영향을 이해해야 한다.

## 3. 데이터베이스 확장성, 복원력 및 캐싱

### 목적별 데이터베이스 (Database Services)
- RDS (관리형 관계형 DB): 일반적인 관계형 데이터베이스 요구 사항을 충족한다.
- Amazon Aurora (클라우드 네이티브 관계형 DB): RDS 대비 확장성 및 성능 이점을 이해한다.
- DynamoDB (NoSQL): 극단적인 규모에서 짧은 지연 시간 성능이 필요한 경우에 적합하다.
- Amazon Redshift (데이터 웨어하우스): 대규모 데이터 분석 및 웨어하우징 요구 사항에 사용된다.

### RDS 복원력 및 확장성
- 읽기 전용 복제본 (Read Replicas): 성능 이점 (읽기 크기 조정) 및 가용성 이점을 제공한다.
- RDS Multi-AZ (다중 가용 영역): 고가용성에만 적합하며, 읽기 크기를 조정하지 않는다 (Standby 인스턴스는 직접 액세스 불가).
- RDS 프록시 (RDS Proxy): 애플리케이션 확장성 증가, 데이터베이스 실패에 대한 복원력 향상, 보안 강화 방법을 이해해야 한다.

### 캐싱 (Caching) 전략
- 캐싱 vs. 읽기 전용 복제본: 읽기 전용 복제본은 여전히 DB 오버헤드가 있으므로, 캐싱이 읽기 전용 복제본을 대신할 수 없다는 점을 이해해야 한다.
- 주요 캐싱 서비스: Amazon CloudFront, Amazon ElastiCache, DynamoDB Accelerator (DAX)의 기능을 알아야 한다.

## 4. 분리 (Decoupling) 및 비동기 아키텍처

### 분리의 정의 및 목표
- 정의: 구성 요소가 더 큰 시스템의 일부로 작업을 완료할 때 자율적으로 유지되고 서로를 인식하지 못하는 상태이다.

### 동기 통합 (Synchronous)
- 특징: 2개 이상의 구성 요소가 항상 사용 가능해야 제대로 작동한다.
- 예시: Elastic Load Balancing을 사용하여 여러 AZ의 인스턴스 간에 트래픽 분산 (인스턴스 간의 의존성은 없으나, 로드 밸런서와 인스턴스가 모두 실행되어야 기능 유지).

### 비동기 통합 (Asynchronous)
- 특징: 구성 요소 중 하나가 다운되어도 통신이 계속 이루어질 수 있는 메커니즘이 마련되어 있다.
- 서비스: Amazon Simple Queue Service (SQS), DynamoDB와 같은 내구성 있는 메시지 스토어를 사용하여 요청 처리와 응답을 분리한다.

### SQS 심층 이해
- 사용 사례: 마이크로서비스, 분산 시스템, 서버리스 애플리케이션의 분리 및 크기 조정이다.
- 확장성: 매우 높은 처리량을 제공하며, 메시지 생성자 및 소비자의 크기를 수평으로 조정해야 한다.
- 장점: 장기 실행 프로세스에서 사용자 경험 개선 및 크기 조정 관리 지원이다.

## 5. 엣지 및 관리형 서비스

### AWS 엣지 네트워킹 서비스
- 서비스: CloudFront, Route 53, Global Accelerator를 알아야 한다.
- 구성: 향상된 지연 시간으로 안전하게 데이터를 전송하도록 구성하는 방법, 암호화, 네트워크 홉 제거를 통한 복원력 및 성능 개선 방법을 이해해야 한다.

### 파일 전송 서비스 (AWS Transfer Family)
- 기능: 자체 코드나 인프라 유지 관리 없이 SFTP, FTPS, FTP 파일 전송 워크플로를 생성, 자동화 및 모니터링한다.
- 복원력: 최대 3개의 가용 영역 지원, 자동 크기 조정 및 중복 플릿 지원이다.

### 서버리스 통신 서비스
- API Gateway: 자동으로 크기가 조정되며, Lambda 함수를 API 메서드를 통해 노출하는 방법을 알아야 한다.
- Lambda 동시성 및 트랜잭션: Lambda의 크기 조정을 위해 동시성 및 트랜잭션에 대한 이해가 필수이다.

## 6. 최종 서비스 목록 (심층 이해 필수)

- Amazon API Gateway
- AWS Transfer Family
- Amazon SQS
- AWS Secrets Manager (강의에서 언급되었으므로 보안 관련 용도로 파악 필요)
- Application Load Balancer (ALB)
- AWS Fargate
- AWS Lambda
- Amazon Elastic Container Service (ECS)
- Elastic Kubernetes Service (EKS)