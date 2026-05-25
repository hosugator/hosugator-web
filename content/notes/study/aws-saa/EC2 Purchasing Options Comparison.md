---
created: 2025-11-26
tags: [aws_saa, ec2, purchasing_options, cost_optimization, on_demand, ri, sp, spot_instance, dedicated]
reference:
  - "[[Cost-Optimized Compute Solutions]]"
  - "[[EC2]]"
---
# EC2 Purchasing Options Comparison (EC2 구매 옵션 비교)
## 정의
[[EC2]] 인스턴스의 워크로드 패턴 및 지속 기간에 따라 가장 저렴하고 유연한 구매 옵션을 선택하여 컴퓨팅 비용을 극대화하는 비용 최적화 전략

## 요소
- 온디맨드 (On-Demand): 장기 약정 없이 시간당 또는 초당 요금을 지불.
- 예약 인스턴스 (RI) / 절감형 플랜 (SP): 1년 또는 3년 약정을 통해 최대 72% 할인된 가격으로 컴퓨팅 비용을 절감하는 약정 모델.
- [[Spot Instance]] (Spot Instances): AWS의 미사용 여유 용량을 온디맨드 가격보다 최대 90% 저렴하게 이용.
- 전용 호스트 (Dedicated Hosts) / 전용 인스턴스 (Dedicated Instances): 물리적 서버 전체 또는 인스턴스를 단독 사용하며 라이선스 사용이 필요한 경우에 적합.
- 정기 예약 인스턴스 (Scheduled RI): 특정 시간대나 요일에만 용량을 예약하는 옵션.
- 용량 예약 (Capacity Reservations): 특정 AZ에서 온디맨드 요금으로 필요한 용량을 보장하는 옵션.

## 원리
### Commitment-Discount Trade-off (약정-할인 트레이드오프 원리)
고객이 AWS에 제공하는 약정 기간과 유연성에 반비례하여 할인율이 증가한다.
- 무약정 (최고 유연성) $\to$ 온디맨드 (할인 최소)
- 장기 약정 (최소 유연성) $\to$ RI/SP (할인 최대)

### Interruption Tolerance (중단 허용치 매칭)
워크로드가 중단되거나 종료되어도 무방한지 여부에 따라 구매 옵션을 매칭한다.
- 중단 허용 불가 (미션 크리티컬): 온디맨드 또는 RI/SP를 사용.
- 중단 허용 가능 (배치 처리, HPC, 빅데이터, 스테이트리스 웹 서버): 스팟 인스턴스를 사용하여 비용을 획기적으로 절감.

## 특징
### Savings Plans (절감형 플랜)의 유연성
RI가 특정 인스턴스 패밀리, 리전, 가용 영역에 종속될 수 있는 반면, SP는 시간당 컴퓨팅 사용량(USD)에 약정하여 인스턴스 패밀리나 리전을 유연하게 변경해도 할인 혜택이 유지되므로 최신 모범 사례로 권장된다.

### Spot Fleet and Diversification (스팟 플릿과 다양화)
다양한 인스턴스 유형과 가용 영역을 조합하여 [[Spot Instance]]를 요청하는 스팟 플릿(Spot Fleet) 기능을 사용하여, 특정 유형의 중단 위험을 줄이고 목표 용량을 달성할 확률을 높인다.

## 예시
### 개발/테스트 환경과 프로덕션 환경의 비용 최적화
1. 프로덕션 (예측 가능, 중단 불가): 1년 또는 3년 절감형 플랜(SP)을 구매하여 안정적으로 높은 할인율을 적용.
2. 개발/테스트 (간헐적, 중단 허용): [[Spot Instance]]를 사용하여 온디맨드 대비 70~90% 비용 절감.