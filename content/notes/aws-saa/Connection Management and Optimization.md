---
created: 2025-11-25
tags:
  - aws_saa
  - rds_proxy
  - connection_management
  - performance
  - lambda
  - optimization
reference:
  - "[[High-Performing Database Solutions]]"
  - "[[RDS]]"
  - "[[Aurora]]"
---
# Connection Management and Optimization (RDS Proxy)
## 정의
[[RDS]] 및 [[Aurora]] 인스턴스에 대해 연결 풀(Connection Pool)을 유지하고 관리하여, 컴퓨팅 리소스의 연결 과부하를 줄이고 성능 저하 없이 애플리케이션의 크기 조정(Scaling)을 지원하는 완전 관리형 데이터베이스 프록시 서비스
## 요소
### Connection Pool (연결 풀)
[[RDS Proxy]]가 데이터베이스 인스턴스에 대해 설정하고 유지하는 활성 연결들의 집합이다. 애플리케이션의 요청이 있을 때마다 이 풀에서 연결을 재사용한다.
### Compute Source (컴퓨팅 소스)
데이터베이스 연결을 요청하는 주체 (예: [[Lambda]] 함수, [[EC2]] 인스턴스, 컨테이너).
### RDS/Aurora Instance
실제 데이터베이스 인스턴스.
## 원리
### Connection Multiplexing (연결 다중화)
애플리케이션 계층에서 발생하는 많은 수의 클라이언트 연결을 DB 인스턴스에 대한 더 적은 수의 공유 연결로 효과적으로 재사용(Multiplexing)한다. 이는 DB 인스턴스의 CPU 및 메모리 사용량에 대한 스트레스를 줄여준다.
### Efficient Scaling (효율적인 크기 조정)
특히 [[Lambda]]와 같이 짧고 빈번한 연결을 대량으로 생성하는 서버리스 환경에서, 연결 풀을 활용하여 DB 연결 한계를 해결하고 성능 저하 없이 컴퓨팅 계층의 크기를 확장할 수 있도록 한다.
### Failover Handling (장애 조치 처리)
DB 인스턴스에 장애 조치(Failover)가 발생할 경우, [[RDS Proxy]]가 애플리케이션의 연결을 끊지 않고 자동으로 새로운 라이터 인스턴스로 트래픽을 라우팅하여 애플리케이션 레벨의 다운타임을 줄인다.
## 특징
### Serverless Optimization (서버리스 환경 최적화)
[[Lambda]] 함수가 활성화될 때마다 새 연결을 생성하는 비효율성을 해소하여, 서버리스 아키텍처에서 [[RDS]] 및 [[Aurora]]를 사용할 때 발생하는 성능 및 확장성 문제를 근본적으로 해결한다.
### Security Enhancement (보안 강화)
IAM을 사용하여 데이터베이스 액세스 자격 증명(Credential)을 관리하고 인증할 수 있어, 데이터베이스 비밀번호를 애플리케이션 코드에 보관할 필요가 없어진다.
## 예시
### Lambda 기반 API의 DB 연결 안정화
1. 문제: API Gateway와 [[Lambda]]를 사용하여 백엔드 DB([[Aurora]])에 연결할 때, 트래픽 급증 시 수백 개의 Lambda 동시 실행으로 인해 DB 연결 제한에 도달하고 성능이 저하된다.
2. 솔루션: [[Lambda]]와 [[Aurora]] 사이에 RDS Proxy를 배치한다.
3. 결과: [[Lambda]] 함수가 종료되어도 Proxy는 DB 연결을 유지하고 재사용하며, DB 인스턴스에는 안정적이고 통제된 수의 연결만 유지되어 최대 66%의 성능 향상 및 안정적인 확장이 가능하다.