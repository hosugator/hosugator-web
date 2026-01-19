---
created: 2025-12-05
tags:
  - aws_saa
  - storage
  - comparison
  - file_storage
  - block_storage
  - object_storage
  - s3
  - ebs
  - efs
reference:
  - "[[Storage Classification]]"
  - "[[File Storage System]]"
  - "[[Block Storage System]]"
  - "[[Object Storage System]]"
  - "[[File Storage System]]"
  - "[[Block Storage System]]"
  - "[[Object Storage System]]"
---
# File vs Block vs Object Storage Comparison (파일, 블록, 객체 스토리지 비교)
## 정의
AWS에서 제공하는 세 가지 핵심 스토리지 모델인 파일, 블록, 객체 스토리지를 구조, 성능, 액세스 방식, 적합한 워크로드 측면에서 비교하여 최적의 솔루션을 선택하는 설계 기준
## 비교표
| 특징         | File Storage (파일)         | Block Storage (블록)                 | Object Storage (객체)                |
| :--------- | :------------------------ | :--------------------------------- | :--------------------------------- |
| AWS 서비스 예시 | [[EFS]], [[FSx]]          | [[EBS]], [[EC2]] 인스턴스 스토어          | [[S3]], [[Glacier]]                |
| 데이터 구조     | 계층적 (폴더/파일 시스템)           | 구조 없음 (OS가 포맷 후 파일 시스템 생성)         | 평면적 (버킷 내 객체)                      |
| 접근 단위      | 파일 단위                     | 블록 단위 (고정 크기 청크)                   | 객체 전체 단위                           |
| 액세스 프로토콜   | NFS, SMB (기존 파일 시스템 프로토콜) | iSCSI, Fibre Channel (OS 드라이버를 통해) | RESTful API (HTTP/HTTPS)           |
| 접근 방식      | 다중 연결 및 파일 잠금 지원          | 단일 호스트에 독점 연결 (OS 독점 제어)           | 다중 접근 가능 (API 기반)                  |
| 성능 특징      | 중간 지연 시간, 우수한 공유 기능       | 최저 지연 시간, 높은 IOPS (OS, DB에 최적)     | 높은 확장성, 높은 내구성, 느린 부분 업데이트         |
| 업데이트 방식    | 파일의 일부 수정 가능 (In-place)   | 블록 단위로 부분 수정 가능 (In-place)         | 전체 객체를 덮어써야 함 (Atomic Replacement) |
## 핵심 구분 원칙
### 1. I/O 성능 vs 확장성
- 블록 스토리지: IOPS와 지연 시간이 가장 중요하며, OS나 트랜잭션 데이터베이스처럼 랜덤 I/O가 빈번한 미션 크리티컬 워크로드에 사용된다.
- 객체 스토리지: 무한한 확장성과 최고의 내구성이 중요하며, 비정형/대규모 데이터셋 저장 및 아카이빙에 사용된다.
### 2. 공유 액세스 요구 사항
- 파일 스토리지: 여러 서버가 동시에 동일한 데이터를 공유하고 일관성(Consistency)을 위해 파일 잠금이 필요할 때 선택된다.
- 블록/객체 스토리지: 블록은 단일 호스트에, 객체는 API 기반의 다중 접근은 가능하지만 파일 잠금 메커니즘이 필요하지 않은 워크로드에 적합하다.
### 3. 저장 방식의 익숙함
- 파일 스토리지: 기존 온프레미스 NAS(Network Attached Storage) 시스템과 가장 유사하여 리프트 앤 시프트(Lift-and-Shift) 마이그레이션이 용이하다.