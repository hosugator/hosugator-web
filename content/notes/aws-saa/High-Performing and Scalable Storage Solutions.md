---
created: 2025-11-24
tags:
  - aws_saa
  - high_performance
  - storage_solution
  - s3
  - ebs
  - efs
  - fsx
  - scaling
reference:
  - "[[High-Performing Architecture Design]]"
---
# High-Performing and Scalable Storage Solutions (고성능 스토리지 설계)
## 정의
애플리케이션의 액세스 패턴, 처리량, 지연 시간, 확장성 요구 사항을 충족하기 위해 AWS의 객체, 블록, 파일 세 가지 스토리지 유형 중 최적의 솔루션을 선택하고 구성하는 설계 활동
## 요소
### AWS Storage Forms (AWS 스토리지 3가지 형태)
- Object Storage (객체 스토리지): Amazon [[S3]]
- Block Storage (블록 스토리지): Amazon [[EBS]], Instance Store
- File Storage (파일 스토리지): Amazon [[EFS]], Amazon [[FSx]], AWS [[Storage Gateway]]
## 원리
### Scaling Mechanisms Comparison (스케일링 메커니즘 비교)
솔루션의 성능 및 운영 지원 수준을 결정하는 핵심 원리는 각 서비스의 크기 조정 메커니즘을 이해하는 것이다.
- Manual Scaling (수동 확장): Amazon EBS (볼륨 유형, 크기, IOPS 용량을 수동으로 수정)
- Automatic Scaling (자동 확장): Amazon S3, Amazon EFS (파일을 추가/제거하면 용량이 자동으로 조정됨)
### Low Latency Optimization (낮은 지연 시간 최적화)
데이터를 읽는 데 매우 짧은 지연 시간이 필요할 경우, EBS 볼륨의 IOPS 및 볼륨 유형을 최적으로 구성하거나, 캐싱(S3 Accelerator, CloudFront) 서비스를 활용하여 데이터 검색 성능을 개선한다.
### Resiliency and Durability (복원력 및 내구성)
- S3: 글로벌 복원력을 갖춘 서비스로, 데이터는 특정 리전에 저장되지만 AZ 실패의 영향을 받지 않으며, 교차 리전 복제를 지원한다.
- EBS: EBS 스냅샷은 S3에 저장되어 리전 복원력을 갖춘 백업 및 DR 기능을 제공한다.
### Hybrid Solutions (하이브리드 솔루션)
AWS Storage Gateway 및 Amazon FSx는 온프레미스 환경과의 연결 및 파일 공유를 지원하여 하이브리드 스토리지 솔루션에 적합하다.