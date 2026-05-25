---
created: 2025-11-21
tags: [aws_saa, storage_services, s3, efs, fsx, backup_restore, disaster_recovery]
reference:
---
# AWS Storage Services for DR (DR을 위한 스토리지 서비스)
## 정의
AWS가 제공하는 객체 및 파일 스토리지 솔루션으로, 데이터의 장기 보존, 백업 계획 및 재해 복구(Disaster Recovery)를 위한 핵심 저장소 역할을 수행하는 서비스
## 요소
### Amazon S3 (Simple Storage Service)
비용 효율적이고 내구성이 매우 뛰어난 객체 스토리지 서비스이다. (DR 전략에서 Backup Target으로 가장 많이 사용된다.)
### Amazon EFS (Elastic File System)
Linux 인스턴스를 위한 확장 가능한 파일 스토리지 서비스이다. Multi-AZ에 걸쳐 데이터가 자동 복제된다.
### Amazon FSx
Windows, Lustre, NetApp ONTAP 등 특정 파일 시스템을 지원하는 서비스이다. (예: FSx for Windows File Server는 Windows 기반 파일 백업에 사용)
## 원리
### Offsite Data Protection (현장 외 데이터 보호)
DR 계획에서 백업 데이터를 시스템과 같은 물리적 위치가 아닌 AWS 클라우드(S3 등)에 저장하여, 지역적 재해 발생 시 데이터 손상으로부터 백업 데이터를 안전하게 보호한다.
### Cross-Region Replication (교차 리전 복제)
S3의 CRR(Cross-Region Replication) 기능 등을 사용하여 백업 데이터를 다른 AWS Region에 자동으로 복제함으로써, 리전 규모의 광범위한 장애로부터 데이터의 복원력을 확보한다.
### Backup and Restore Strategy (백업 및 복원 전략 구현)
가장 저렴한 DR 전략인 Backup and Restore 전략을 구현할 때, S3를 백업 대상(Target)으로 사용하여 데이터를 안전하게 보관하고, 필요 시 여기서 데이터를 복원한다.
## 특징
### Durability and Availability (내구성 및 가용성)
- S3: 99.999999999%의 높은 내구성을 제공하며, 데이터는 Multi-AZ에 걸쳐 자동으로 중복 저장된다.
- EFS/FSx: Multi-AZ 배포 옵션을 통해 파일 기반 데이터의 가용성과 복원력을 높인다.
### Encryption Options (암호화 옵션)
모든 AWS 스토리지 서비스는 전송 중(TLS/SSL) 및 저장 데이터(SSE/KMS, SSE-S3 등)에 대한 암호화 옵션을 제공하여 데이터 무결성을 보장한다.
## 비교
| 구분 | S3 | EFS | FSx for Windows File Server |
| :--- | :--- | :--- | :--- |
| 스토리지 유형 | Object (객체) | File (파일, Linux) | File (파일, Windows SMB 프로토콜) |
| DR 주요 활용 | 아카이브, 로그, DB 백업 파일의 Offsite 저장 | Linux 인스턴스의 공유 파일 시스템 백업 | Windows 기반 애플리케이션의 파일 시스템 백업 |
| 적합 전략 | Backup and Restore | Pilot Light, Warm Standby (Multi-AZ) | Pilot Light, Warm Standby (Multi-AZ) |
## 예시
### S3를 이용한 DB 백업 및 Cross-Region DR
1. 백업 생성: Amazon RDS에서 주기적으로 생성되는 DB 스냅샷(백업 파일)을 Amazon S3 버킷에 저장한다.
2. 교차 리전 복제: 이 S3 버킷에 CRR (Cross-Region Replication)을 설정하여, 백업 파일을 재해 복구 대상인 Secondary Region의 S3 버킷으로 자동 복제되도록 한다.
3. 재해 복구 시: Primary Region에 장애가 발생하면, Secondary Region의 S3에 보존된 백업 파일을 사용하여 새로운 DB 인스턴스를 복구 Region에 생성하여 복원한다. (RTO/RPO는 Backup and Restore 전략을 따름)