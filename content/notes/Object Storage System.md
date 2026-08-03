---
created: 2025-12-05
updated: 2026-07-24
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[AWS SAA]]"
tags:
  - aws_saa
  - storage
  - object_storage
  - s3
  - flat_structure
  - durability
  - scaling
  - archiving
  - 
publish: true
---
## 정의
데이터를 파일이 아닌 객체 형태로 저장하며, 객체마다 고유한 식별자를 부여하고 버킷이라는 단일 계층 구조에 저장하는 방식

## 특징
### 평면 구조 (Flat Structure)

기존 파일 시스템의 폴더나 디렉터리 같은 복잡한 계층 구조가 없다. 
모든 객체는 버킷 내에서 동등하게 존재하며, 고유한 키(Key, 객체의 고유 식별자)를 통해 액세스된다.

### 메타데이터 분리 (Metadata Bundled)

객체는 데이터(파일)와 객체 자체의 메타데이터(크기, 생성일, 사용자 정의 메타데이터 등)가 함께 번들로 저장된다. 이는 객체를 찾고 분류하는 데 사용된다.

### 높은 확장성 (Virtually Unlimited Scalability)

단일 버킷에 저장할 수 있는 객체의 수에 제한이 거의 없으며, 용량 또한 무한대에 가깝게 확장 가능하다.

### 전체 객체 변경 (Atomic Replacement)

객체에서 데이터의 일부만 변경하는 것은 불가능하다. 
객체를 수정하려면 전체 객체를 다운로드, 수정 후, 새로운 객체로 다시 업로드해야 한다.

### API 기반 액세스

일반적인 파일 시스템 프로토콜(NFS/SMB)이 아닌 RESTful API (HTTP/HTTPS)를 통해 액세스된다.

## AWS 서비스 예시
- [[S3 1]] (Simple Storage Service): 클라우드 네이티브 환경에서 가장 널리 사용되는 객체 스토리지 서비스.