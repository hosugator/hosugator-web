---
created: 2025-11-11
tags: [aws_saa, rds, database, managed, engine, backup]
reference:
  - https://docs.aws.amazon.com/rds/latest/userguide/Welcome.html
---
# Amazon Relational Database Service (RDS)
## 정의
관계형 데이터베이스의 프로비저닝·패치·백업·모니터링을 AWS가 대신 수행하는 관리형 데이터베이스 서비스
## 지원 엔진
- MySQL, MariaDB, PostgreSQL, Oracle, SQL Server, [[Aurora]]
## 핵심 기능
- [[Multi-AZ]] : 물리적 독립 AZ에 존재하는 동기화 상태의 스탠바이 인스턴스를 AZ에 자동 복제(고가용성)하여 물리적 장애 극복
- [[Read Replica]] : 읽기 전용 복제본 최대 15개(확장성)
- 자동 백업·스냅샷·포인트인타임 복구(PITR)
- 스토지지 자동 확장(gp2→gp3, io1→io2) 및 암호화 지원
## 제약
- OS 수준 접근 불가, 슈퍼 권한 일부 제한  
- 기본 최대 40개 인스턴스/리전(증청 가능)
## 비교
[[RDS 스탠바이 vs 읽기 전용 복제본]]