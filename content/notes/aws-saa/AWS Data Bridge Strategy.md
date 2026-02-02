---
created: 2026-01-28
tags:
  - aws
  - storage
  - connectivity
  - hybrid-cloud
  - data
  - bridge
  - strategy
---
# Data Bridge Strategy (On-prem to Cloud)

## 본질 (Essence)
온프레미스의 모든 유산(Legacy) 데이터가 클라우드라는 거대한 데이터 바다(S3/FSx/RDS)로 흘러가게 만드는 통합 배관 지도

## 구조 (Mechanism)
### A. 스토리지 가교 (Storage Gateway - 실시간 연동)
1. S3 File Gateway: NFS/SMB $\rightarrow$ S3 객체. (파일 공유용)
2. S3 Tape Gateway: iSCSI-VTL $\rightarrow$ S3/Glacier. (백업 테이프 대체용)
3. S3 Volume Gateway: iSCSI Block $\rightarrow$ S3(EBS Snapshot). (로컬 디스크 백업용)
4. Amazon FSx File Gateway: 온프레미스에서 클라우드의 FSx(Windows 등) 파일 서버에 저지연 접근.

### B. 전송 및 동기화 도구 (Data Movement - 통로)
1. [[AWS Transfer Family]]: 외부 파트너 주체의 SFTP/FTP/AS2 $\rightarrow$ S3/EFS. (외부 파트너 협업용)
2. [[DataSync]]: AWS 주체(DataSync Agent)의 온프레미스 스토리지 $\leftrightarrow$ S3/EFS/FSx 간의 온라인 고속 동기화 셔틀.
3. [[Snow Family]]: 오프라인 물리적 이송 (Snowcone < Snowball Edge < Snowmobile).

### C. 데이터베이스 및 스트리밍 (Specific Data - 특수 목적)
1. AWS DMS (Database Migration Service): 온프레미스 DB $\rightarrow$ RDS/S3. (데이터베이스 복제 및 이전)
2. AWS Kinesis Data Firehose: 실시간 스트리밍 데이터 $\rightarrow$ S3/Redshift. (로그 및 IoT 데이터 수집)

## 확장 (Connection)
- 연결: 일반 가전(File)은 콘센트(Gateway)에 꽂고, 대량의 이삿짐(Migration)은 트럭(Snow)에 싣고, 흐르는 수돗물(Streaming)은 수도관(Kinesis)으로 받는 원리.
- 응용: DB를 실시간 복제하려면 DMS를, 윈도우 파일 서버의 성능을 온프레미스에서 그대로 쓰려면 FSx File Gateway를 선택.

---
See Also: 
- [[AWS Network Connectivity Strategy]]
- [[AWS Data Retention Strategy]]