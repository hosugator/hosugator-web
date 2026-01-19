---
created: 2025-11-24
tags: [aws_saa, storage_scaling, file_storage, object_storage, block_storage, shared_access, parallelism]
reference:
  - "[[EFS and FSx Performance and Scaling]]"
  - "[[S3 Performance and Optimization]]"
  - "[[EBS Performance and Scaling]]"
---
# Comparison - Storage Scaling Principle (스토리지 확장 원리 비교)
## 정의
AWS의 세 가지 스토리지 유형(파일, 객체, 블록)이 워크로드의 수평적 확장성(Horizontal Scalability) 요구 사항에 따라 데이터를 공유하고 병렬 처리를 지원하는 방식에 대한 비교 원리
## 요소
### File Storage Scaling (파일 스토리지 확장)
- 대상: [[2. project/AWS_SAA/EFS]], [[FSx]]
- 원리: 공유 파일 시스템의 동시 마운트 및 [[POSIX]]/[[SMB]] 의미론을 통해 여러 [[EC2]] 인스턴스가 동시에 동일한 데이터를 읽고 쓰면서 컴퓨팅 계층을 수평 확장할 수 있도록 지원한다.
### Object Storage Scaling (객체 스토리지 확장)
- 대상: [[S3]]
- 원리: API 기반 접근을 통해 수천 개의 요청을 개별 객체 단위로 병렬 처리한다. 용량과 요청 수가 무한대로 자동 확장되지만, 파일 시스템 공유 상태를 제공하지 않는다.
### Block Storage Scaling (블록 스토리지 확장)
- 대상: [[EBS]]
- 원리: 단일 인스턴스에 연결되어 높은 IOPS를 제공한다. 기본적으로 공유 액세스를 지원하지 않으므로 데이터 공유를 통한 수평 확장에는 적합하지 않다.
## 원리
### Architecture Decoupling (아키텍처 분리)
스토리지 시스템의 확장 전략은 애플리케이션의 결합도(Coupling)에 따라 결정된다.
- 강한 결합: 여러 인스턴스가 동일한 파일/디렉토리 구조 및 잠금 메커니즘을 공유해야 할 때 파일 스토리지가 필수적이다.
- 느슨한 결합: 각 인스턴스가 독립적으로 객체를 가져오고 저장하는 경우 객체 스토리지가 최적의 성능과 확장성을 제공한다.
### Scaling of Compute vs. Storage (컴퓨팅 대 스토리지의 확장)
- 파일 스토리지: 공유 데이터에 의존하는 컴퓨팅 인스턴스의 수평 확장을 가능하게 하는 핵심 인프라 역할을 수행한다.
- 객체 스토리지: 스토리지 자체가 무한한 용량과 요청 처리 능력을 제공하며, 데이터 액세스 병렬 처리를 지원한다.
## 특징
### Shared State Requirement (공유 상태 요구 사항)
시나리오 질문에서 여러 인스턴스가 동일한 파일 시스템을 공유해야 한다는 키워드가 나오면 [[2. project/AWS_SAA/EFS]] 또는 [[FSx]]를 선택해야 한다.
### Performance Limit (성능 한계)
파일 스토리지의 경우, 공유 파일 시스템 특성상 쓰기 작업의 일관성 보장을 위한 오버헤드가 발생하여 S3만큼의 극단적인 요청 처리량은 제공하기 어렵다.
## 예시
### 공유 웹 콘텐츠와 로그 저장소
- 웹 콘텐츠 (EFS): 여러 웹 서버가 동일한 HTML 및 이미지 파일을 동시에 서빙해야 하므로 EFS/FSx (파일 스토리지)를 사용하여 공유 상태를 유지한다.
- 접근 로그 (S3): 각 웹 서버가 생성하는 로그 파일을 중앙 집중식으로 저장할 때, 각 로그 파일은 독립적인 객체이므로 S3 (객체 스토리지)에 저장하여 무한한 확장성을 확보하고 분석 도구에 연결한다.