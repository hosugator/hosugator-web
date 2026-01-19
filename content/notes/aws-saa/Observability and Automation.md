---
created: 2025-11-21
tags: [aws_saa, observability, automation, cloudwatch, x_ray, eventbridge, continuous_improvement, resilience]
reference:
---
# Observability and Automation (모니터링 및 이벤트 기반 대응)
## 정의
시스템의 주요 지표(Metrics)를 추적하고, 장애 및 환경 변화에 대해 거의 실시간으로 대응하여 지속적인 개선과 자동화된 복구 작업을 지원하는 AWS 서비스

## 요소
### Amazon CloudWatch
AWS 리소스 및 애플리케이션에 대한 지표(Metrics), 로그(Logs) 및 이벤트(Events)를 수집하고 추적하는 모니터링 서비스이다.

### AWS X-Ray
애플리케이션을 통과하는 요청의 종단 간(End-to-End) 추적을 수행하여, 분산된 시스템에서의 병목 현상 및 서비스 간 오류를 분석하는 서비스이다.

### Amazon EventBridge
AWS 서비스, SaaS 애플리케이션 또는 사용자 지정 애플리케이션에서 발생하는 이벤트를 기반으로 대상 서비스에 거의 실시간으로 대응하는 서버리스 이벤트 버스이다.

## 원리
### Continuous Improvement (지속적인 개선)
CloudWatch를 통해 수집된 지표와 X-Ray로 분석된 성능 데이터를 기반으로, 아키텍처의 잠재적인 Single Point of Failure (SPOF)나 병목 현상을 식별하고 선제적으로 개선한다.

### Automated Response (자동화된 대응)
CloudWatch Alarms를 사용하여 설정된 임계값(Threshold)을 초과하는 지표가 감지되면, Amazon EventBridge를 통해 사전 정의된 자동화된 작업(예: Auto Scaling 그룹 조정, Lambda 함수 실행)을 즉시 트리거한다.

### Decoupling Services (서비스 분리)
EventBridge는 이벤트를 발행하는 서비스와 이를 소비하는 서비스 간의 결합도를 낮춰(Decoupling), 복원력이 높은 이벤트 기반 아키텍처를 구현한다.

## 특징
### CloudWatch Alarms (경보)
주요 지표(CPU 사용률, 네트워크 I/O 등)를 기반으로 자동화된 작업을 트리거할 수 있어, 고가용성(HA)을 유지하기 위한 자동 복구 또는 확장(Scaling)에 필수적이다.

### AWS X-Ray Trace Analysis (추적 분석)
마이크로서비스 환경에서 복잡하게 얽힌 요청 경로를 시각화하여, 장애 발생 시 원인을 빠르게 진단하고 RTO를 단축하는 데 기여한다.

### Amazon Polly Integration (Polly 통합)
Amazon Comprehend와 함께 IT 서비스 요청을 자동 분류하고, Polly를 추가하여 시스템에 음성 출력을 제공함으로써 고객 센터(Amazon Connect) 내에서 셀프 서비스를 생성하는 데 활용될 수 있다.

## 비교
| 구분 | CloudWatch | AWS X-Ray | Amazon EventBridge |
| :--- | :--- | :--- | :--- |
| 주요 역할 | Metrics, Logs 수집 및 Alarms 트리거 | 애플리케이션 요청의 End-to-End Tracing | Event 기반 라우팅 및 자동화된 대응 |
| 데이터 형태 | 시간 경과에 따른 숫자 데이터 (지표) | 요청의 서비스 맵 및 세그먼트 데이터 | 실시간 JSON 기반 이벤트 |
| 활용 계층 | 인프라 및 애플리케이션 계층 | 분산 애플리케이션 흐름 | 서비스 통합 및 워크플로우 자동화 |

## 예시
### 자동화된 고가용성 복구 (HA Automated Recovery)
1. 장애 감지: Amazon CloudWatch가 EC2 인스턴스의 CPU 사용률이 5분 이상 90%를 초과하는 것을 감지하고 Alarm을 발생시킨다.
2. 이벤트 라우팅: 이 Alarm 이벤트는 Amazon EventBridge로 전송된다.
3. 자동 대응: EventBridge 규칙이 이 이벤트를 포착하여, Auto Scaling Group의 용량을 자동으로 늘리거나(Scale-out) 장애 인스턴스를 교체하도록 AWS Lambda 함수를 트리거한다.
4. 결과: 시스템이 자동으로 부하를 분산하고 정상 상태로 복구되어 가동 중단 시간을 최소화한다 (Low RTO).