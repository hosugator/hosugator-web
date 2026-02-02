---
created: 2025-11-20
tags: [aws_saa, scaling_comparison, vertical_scaling, horizontal_scaling, cost_optimization, resilience]
reference:
---
# Scaling Comparison (수직 vs. 수평 크기 조정 비교)
## 정의
애플리케이션의 수요 및 로드 증가에 대응하여 시스템 용량을 확장하는 두 가지 근본적인 접근 방식의 차이점을 분석하는 비교 연구.

## 요소
### Vertical Scaling (수직적 크기 조정)
- 단일 서버 (Single Server): 인스턴스의 개수 변경 없이 단일 인스턴스에 집중한다.
- Resource Upgrade: CPU, RAM 등 자원의 사양 자체를 높인다.

### Horizontal Scaling (수평적 크기 조정)
- Distributed Servers: 여러 인스턴스를 추가하여 로드를 분산한다.
- Load Balancing: Elastic Load Balancer (ELB)를 통해 트래픽을 분산하는 과정이 필수이다.
- Automation: Auto Scaling Group (ASG)을 통해 자동화된 확장 및 축소가 가능하다.

## 원리
### 용량 확장 방식
Vertical Scaling은 리소스를 추가 증설하여 용량을 확장하는 방식인 반면, Horizontal Scaling은 다수의 독립적인 단위를 추가하여 용량을 확장한다.

### 장애 대응 방식
Vertical Scaling은 단일 서버의 장애에 대비하지 못하고 [[SPOF]](단일 장애 지점)를 가지는 반면, Horizontal Scaling은 장애 발생 시 나머지 인스턴스가 트래픽을 인수하여 자동 복구 및 내결함성(Fault Tolerance)을 제공한다.

### 탄력성 구현
Horizontal Scaling은 ASG 자동화를 통해 수요에 맞게 자동으로 용량을 조정하는 진정한 탄력성(Elasticity)을 구현할 수 있다.

## 특징
### 비용 효율 곡선
- Vertical Scaling은 중소 규모 및 초기 단계에서 비용 효율적이다.
- Horizontal Scaling은 대규모 트래픽 환경에서 종량제 모델을 통해 사용량 기반으로 최적화되어 비용 효율이 높다.

### 아키텍처 복잡도
Vertical Scaling은 아키텍처 변경 없이 인스턴스 사양만 변경하므로 설계 복잡도가 낮다.
Horizontal Scaling은 ELB, ASG, Loose Coupling 등을 고려해야 하므로 설계 및 운영 복잡도가 높다.

## 비교
| 구분 | Vertical Scaling (수직적) | Horizontal Scaling (수평적) |
| :--- | :--- | :--- |
| 방법론 | Scale-up (단일 서버 성능 향상) | Scale-out (인스턴스 개수 증가) |
| 복원력/가용성 | 낮음 (SPOF 존재) | 높음 (내결함성 내장) |
| 탄력성 | 낮음 (수동, 가동 중단 필요) | 높음 (자동, 실시간 대응 가능) |
| 확장 한계 | 명확한 한계 (최대 사양 존재) | 사실상 무한대 (인스턴스 개수 제한 거의 없음) |
| 주요 비용 | 고가 사양 인스턴스 비용 | ELB 고정 비용 + 추가 인스턴스 요금 |
| 적합 워크로드 | 레거시 애플리케이션, 라이선스 제약 DB (중소규모) | 웹/앱 티어, 마이크로서비스, 높은 트래픽 서비스 |

## 예시
### 비용 효율적 선택 기준 시나리오
1. 시나리오 A (스타트업 초기 웹사이트): 트래픽 변동이 적고 고가용성 요구 사항이 낮으며 예산이 제한적이다.
   - 선택: Vertical Scaling. 저렴한 `t3.large` 단일 인스턴스로 시작하고 ELB/ASG 비용을 절감한다.
1. 시나리오 B (이벤트성 대규모 트래픽): 연말 세일 등 일시적으로 트래픽이 100배 이상 급증한 후 정상으로 돌아오는 서비스이다.
   - 선택: Horizontal Scaling. ASG를 통해 수요에 맞춰 수천 대의 인스턴스로 자동 확장했다가 이벤트 종료 후 자동 축소하여 비용을 최적화한다.
1. 시나리오 C (RDBMS 관리): AWS RDS를 사용하며, 쓰기(Write) 작업 부하를 처리해야 한다.
   - 선택: RDS 인스턴스 사양을 높이는 Vertical Scaling (DB는 일반적으로 쓰기 작업을 분산하기 어렵기 때문)을 선택하고, 읽기(Read) 부하 처리를 위해 Read Replicas를 추가하여 수평적 확장을 보조한다.