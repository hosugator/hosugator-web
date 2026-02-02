---
created: 2025-12-17
tags:
  - aws_saa
  - cloud_migration
  - lift_and_shift
  - rehosting
  - migration_strategy
reference:
  - "[[Cloud Migration Strategy (6 R's)]]"
  - "[[Re-platforming vs Re-architecting]]"
---
# Lift and Shift Strategy (리프트 앤 시프트 전략)
## 정의 (Definition)
기존 온프레미스(On-Premise) 환경에서 운영되던 애플리케이션과 데이터를 최소한의 변경만으로 클라우드 환경(주로 [[EC2]])으로 그대로 옮겨(Rehost) 운영하는 클라우드 마이그레이션 전략
## 핵심 맥락 (Context & Why)
- Problem: 클라우드 도입을 빠르게 시작하고 싶지만, 복잡한 애플리케이션 아키텍처를 당장 변경(Re-architecting)할 시간, 예산, 전문성이 부족하다.
- Solution: Lift and Shift는 AWS의 6R 마이그레이션 전략 중 Rehosting (재호스팅)에 해당하며, 클라우드 환경에 대한 즉각적인 이점(비용 절감, 탄력성)을 얻으면서 가장 빠르고 저렴하게 마이그레이션을 완료할 수 있는 방법론이다.
## 작동 원리 (Mechanism)
- 마이그레이션 도구: AWS의 Cloud Migration Service (MGN)나 VM Import/Export와 같은 도구를 사용하여 기존 서버의 VM 이미지(AMI)를 캡처하여 [[EC2]] 인스턴스로 변환한다.
- 인프라 유사성: 애플리케이션은 온프레미스 환경에서 사용하던 OS, 미들웨어, 데이터베이스 구성 등을 거의 그대로 유지하며 클라우드 인프라(VPC, Subnet, Security Group 등)에 매핑된다.
- 클라우드 이점: 마이그레이션 후 [[EC2]]의 사이징(Right Sizing) 최적화, Auto Scaling Group 적용, 예약 인스턴스(RI) 활용 등을 통해 즉각적인 비용 절감 및 탄력성 이점을 얻는다.
## 유비 및 비교 (Analogy & Comparison)
- It's like: 오래된 가구를 새 집으로 가져갈 때, 페인트칠이나 수리 없이 그대로 옮겨서 배치하는 것.
- vs [[Re-platforming]] (Re-platforming):
  - Lift and Shift (Rehost): 코드 및 아키텍처 변경 없음. 마이그레이션 속도가 가장 빠르다.
  - Re-platforming (재플랫폼): 코드 변경은 최소화하지만, OS나 미들웨어를 클라우드 네이티브 서비스로 교체한다 (예: 온프레미스 DB를 [[RDS]]로 전환). 더 나은 비용 효율성과 관리 용이성을 얻는다.
- vs [[Re-architecting]] (Re-architecting):
  - Lift and Shift: 클라우드 이점은 제한적이며, 레거시 아키텍처의 비효율성을 그대로 가져온다.
  - Re-architecting: 마이크로서비스([[ECS]], [[Lambda]])로 아키텍처를 전면 수정하여 클라우드 네이티브 이점을 극대화하지만, 시간과 비용이 가장 많이 든다.
## 예시 및 구조 (Example/Structure)
### 레거시 ERP 시스템 마이그레이션
1.  Old State: 온프레미스 [[VMware]] 서버에서 Windows Server와 Oracle DB가 설치된 ERP 애플리케이션 운영.
2.  Lift and Shift: AWS MGN을 사용하여 해당 VM을 [[EC2]] 인스턴스로 복제하고, Oracle DB도 [[EC2]]에 그대로 설치하여 VPC 내에 배포한다.
3.  Optimization (Quick Wins): 마이그레이션 후, [[EC2]] 인스턴스의 크기만 조정하거나(Right Sizing), [[ELB]]와 Auto Scaling을 인스턴스 앞에 추가하여 탄력성만 확보한다.
4.  Result: 클라우드 환경으로의 빠른 진입에 성공하며, 이후 장기적인 관점에서 [[RDS]]로의 Re-platforming을 계획한다.