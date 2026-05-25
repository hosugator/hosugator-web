---
created: 2025-11-11
tags: [aws_saa, ebs, storage, block, ec2, snapshot]
reference:
  - https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html
---
# Amazon Elastic Block Store (EBS)
## 정의
EC2 인스턴스에 전용으로 연결하는 고성능 블록 스토리지 서비스
## 특징
- [[블록 스토리지]] : OS가 바로 접근 가능한 디스크 볼륨
- 한 번에 하나의 인스턴스만 마운트(공유 불가)
- SSD(gp3, io2) 또는 HDD(sc1, st1) 타입 선택
- 인스턴스 중단 시에도 데이터 유지
- [[스냅샷]]으로 S3에 백업 및 볼륨 복제 가능
## 예시
OS 디스크, 데이터베이스 파일, 로그 드라이브로 활용  
Multi-AZ RDS의 저장소 내부도 EBS 기반