---
created: 2025-11-25
tags: [aws_saa, data_migration, data_transfer, datasync, snow_family, transfer_family, dms, offline_transfer, performance]
reference:
  - "[[High-Performing and Scalable Network Solutions]]"
---
# Data Transfer and Migration Services (데이터 전송 및 마이그레이션 서비스)
## 정의
온프레미스 환경 또는 클라우드 내에서 대용량 데이터를 [[S3]], [[EFS]] 등의 AWS 스토리지 서비스로 효율적, 안전하며 성능이 최적화된 방식으로 이동시키기 위해 설계된 다양한 솔루션의 집합
## 요소
### AWS DataSync
- [[S3]], [[EFS]], [[FSx]] 등과 온프레미스 NFS/SMB 파일 시스템 간의 온라인 데이터 전송 및 동기화를 자동화하고 가속화하는 서비스이다.
### AWS Transfer Family
- 완전 관리형 서비스로, [[S3]] 또는 [[EFS]]에 데이터를 저장할 수 있도록 표준 SFTP, FTPS, FTP 프로토콜 엔드포인트를 제공한다.
### AWS Database Migration Service (DMS)
- 데이터베이스 및 데이터 웨어하우스의 동종(Homogeneous) 및 이종(Heterogeneous) 마이그레이션을 지원한다.
### AWS Snow Family
- 네트워크 연결이 제한적이거나 불가능할 때 물리적 장치를 사용하여 페타바이트 규모의 데이터를 AWS로 오프라인 전송하는 서비스 (Snowcone, Snowball Edge, Snowmobile).
## 원리
### Selection Criteria (선택 기준)
솔루션은 데이터 양(Volume), 네트워크 대역폭, 데이터 유형(파일, DB), 소요 시간을 기준으로 선택해야 한다.
- 네트워크 대역폭이 낮고 데이터 양이 많은 경우: [[AWS Snow Family]] (오프라인 전송)가 가장 비용 및 시간 효율적이다.
- 온라인 동기화 및 자동화가 필요한 경우: [[DataSync]]가 가장 빠르고 안전한 전송을 제공한다.
### Cost and Time Trade-off (비용 및 시간 트레이드오프)
대용량 데이터 이동 시, 네트워크 전송 비용과 전용 회선 구성 비용 vs. 물리적 장치 운송 및 서비스 이용 비용을 비교하여 가장 저렴하고 빠른 경로를 결정해야 한다.
## 특징
### DataSync Optimization (DataSync 최적화)
[[DataSync]]는 병렬 전송 및 압축 기술을 사용하여 네트워크 처리량(Throughput)을 최대 10배까지 가속화하며, 전송 후 데이터 무결성 검증을 자동으로 수행한다.
### DMS Continuous Replication (DMS 지속 복제)
[[AWS Database Migration Service]]는 초기 데이터 로드 후에도 지속적인 복제(Continuous Replication)를 지원하여 운영 중단 시간(Downtime)을 최소화하면서 라이브 데이터베이스를 마이그레이션할 수 있다.
### Hybrid File Transfer (하이브리드 파일 전송)
[[AWS Transfer Family]]는 레거시 시스템에서 흔히 사용되는 SFTP 등의 프로토콜을 AWS 스토리지와 직접 통합하여, 레거시 애플리케이션의 코드 수정 없이 클라우드로의 데이터 전송을 가능하게 한다.
## 예시
### 200TB 미디어 아카이브 마이그레이션
1. 요구 사항: 네트워크 대역폭이 50Mbps로 제한적인 상황에서 200TB 규모의 미디어 아카이브를 [[S3]]로 옮겨야 한다.
2. 솔루션: [[AWS Snowball]]을 사용하여 물리적 장치에 데이터를 복사한 후, 이를 AWS로 운송하여 업로드한다.
3. 결과: 네트워크 정체를 피하고, 수개월이 걸릴 수 있는 온라인 전송을 며칠로 단축하여 성능과 비용 효율성을 확보한다.