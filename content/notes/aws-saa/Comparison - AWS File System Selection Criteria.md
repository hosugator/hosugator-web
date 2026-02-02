---
created: 2025-12-19
tags:
  - comparison
  - storage
  - file_system
reference:
  - "[[Amazon EFS]]"
  - "[[Amazon FSx for Lustre]]"
  - "[[Amazon FSx for Windows File Server]]"
  - "[[Amazon FSx for NetApp ONTAP]]"
  - "[[High-Performing and Scalable Storage Solutions]]"
---
# Comparison - AWS File System Selection Criteria

## 비교 목적 (Objective)
애플리케이션의 운영체제(OS), 요구되는 성능 수준, S3 통합 필요성에 따라 최적의 AWS 공유 파일 시스템을 선택하기 위함

## 서비스별 상세 비교 (Feature Matrix)

| 구분 | [[Amazon EFS]] | [[FSx for Lustre]] | [[FSx for Windows]] |
| :--- | :--- | :--- | :--- |
| **주요 OS** | Linux 전용 | Linux 전용 | Windows 전용 |
| **핵심 키워드** | 범용, 서버리스, 자동 확장 | **HPC, 고성능, 병렬 처리** | AD 통합, SMB 프로토콜 |
| **S3 통합** | 별도 복사 프로세스 필요 | **직접 링크 (자동 Import/Export)** | 해당 없음 |
| **성능 특징** | 수천 대 연결 가능하나 범용적 | **밀리초 미만 지연, 폭발적 처리량** | 일관된 저지연 성능 |

## 상황별 선택 로직 (Decision Logic)

### 1. 고성능 컴퓨팅(HPC) 및 머신러닝이 필요한 경우
- 선택: **[[FSx for Lustre]]**
- 이유: 수백 대의 인스턴스가 병렬로 파일을 읽고 쓰는 고성능 환경에 최적화됨
- S3 통합: S3 버킷과 직접 연결되어 데이터를 자동으로 가져오고 작업 후 다시 내보내는 기능 내장
- 비용: 작업 시에만 임시(Scratch)로 생성하고 결과를 S3에 저장 후 삭제하여 비용 최적화

### 2. 일반적인 Linux 서버 간의 공유 스토리지가 필요한 경우
- 선택: **[[Amazon EFS]]**
- 이유: 관리 부담이 없는 서버리스 형태이며 표준 NFS 프로토콜 사용
- 차이점: S3와 직접적인 연동이 없으며, HPC급의 초고성능 처리량 요구 시 Lustre보다 비용 및 성능 효율이 낮을 수 있음

---
**Conclusion:**
- **Linux + 병렬 + 고성능 + S3 통합** = FSx for Lustre
- **Linux + 일반 공유 + 서버리스** = EFS
- **Windows + 기업용** = FSx for Windows