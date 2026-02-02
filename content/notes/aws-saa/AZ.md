---
created: 2025-11-11
tags: [aws_saa, az, region, global_infrastructure, edge]
reference:
  - https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones
---

# AWS Availability Zone (AZ, 가용 영역)
## 정의
단일 리전 내에서 물리적으로 분리되고 독립적인 전력·네트워크 인프라를 갖춘 데이터센터 그룹

## 특징
- 리전 당 3개 이상 존재
- 각 AZ는 개별 냉각·방화벽·전원 공급 장치 보유
- 낮은 지연 시간(&lt;2 ms) 망 연결로 묶임
- 재해 격리 단위로 활용

## 예시
서울 리전(ap-northeast-2)은 ap-northeast-2a, 2b, 2c 세 AZ 제공  
다중 AZ 배포 시 EC2 인스턴스를 서로 다른 AZ에 분산하여 고가용성 확보