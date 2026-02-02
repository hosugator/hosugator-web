---
created: 2025-11-14
tags: [aws_saa, aws, dms, database, migration, cdc]
reference:
---
# AWS DMS (Database Migration Service)

## 정의 (Definition)
관계형 데이터베이스, 데이터 웨어하우스, NoSQL 데이터베이스 및 기타 데이터 저장소를 최소한의 가동 중단으로 AWS에 마이그레이션할 수 있게 해주는 서비스.

## 핵심 맥락 (Context & Why)
-  Problem: 대규모 데이터베이스를 마이그레이션할 때, 데이터를 백업하고 복구하는 전통적인 방식은 작업 시간 동안 서비스를 중단(Downtime)해야 하며 그 사이 발생하는 데이터 변경분을 반영하기 어렵다.
 - Solution: AWS DMS는 초기 복제 이후 발생하는 변경 사항을 실시간으로 추적하는 CDC(Change Data Capture) 기술을 통해 소스와 타겟 DB 간의 동기화를 유지하며 서비스 중단 없이 마이그레이션을 가능하게 한다.

## 작동 원리 (Mechanism)
- Replication Instance 생성: 소스와 타겟 사이에서 데이터를 중계할 복제 서버를 준비한다.
- Endpoint 설정: 소스 DB(온프레미스)와 타겟 DB(Aurora)의 접속 정보를 정의한다.
- Replication Task 실행: Ongoing Replication 옵션을 선택하여 기존 데이터를 옮김과 동시에 실시간 변경분을 지속적으로 동기화한다.

## 유비 및 비교 (Analogy & Comparison)
-  It's like: 이사 중에도 계속 운영되는 상점
	 - 이삿짐 센터(DMS)가 물건을 하나씩 옮기는데, 그 와중에 상점에서 새로 팔린 물건 정보(CDC)를 실시간으로 새 매장에 똑같이 채워 넣어 두 상점이 항상 같은 상태를 유지하게 하는 것.
 - vs [[SCT]] (Schema Conversion Tool): 
	 - DMS: 실제 데이터(Row)를 옮기는 엔진.
	 - SCT: 소스와 타겟의 DB 종류가 다를 때(예: Oracle -> Aurora) 스키마(설계도)를 변환하는 도구.

## 예시 및 구조 (Example/Structure)
### 가동 중단 없는 DB 이관 (Question 26 적용)
- 인프라: AWS DMS 복제 서버(Replication Server)를 생성함.
- 태스크: Ongoing Replication Task를 생성하여 실시간 복제 활성화.
- 전환: 두 DB가 완전히 동기화되었을 때, 애플리케이션의 DB 엔드포인트만 Aurora로 변경하여 최소한의 지연으로 이관 완료.