---
created: 2025-12-23 Tue
tags: [concept, vpc, asg, alb, boundary]
reference:
  - "[[AWS Region vs Availability Zone Boundaries]]"
---
# Comparison - AWS Service Operating Boundaries

## 비교 목적 (Objective)
VPC, ASG, ALB 등 주요 서비스가 물리적으로 어디까지 영향력을 미치는지 명확히 구분합니다.

## 요소별 상세 비교 (Feature Matrix)

| 서비스명 | 작동 범위 (Boundary) | 여러 AZ 지원 여부 | 여러 리전 지원 여부 |
| :--- | :--- | :--- | :--- |
| **[[VPC]]** | 단일 리전 | Yes (VPC 내 여러 AZ 존재) | **No (리전 종속적)** |
| **[[ALB]]** | 단일 리전 | Yes (여러 AZ 서브넷 선택) | **No (VPC 내 존재)** |
| **[[ASG]]** | 단일 리전 | **Yes (핵심 기능)** | **No (단일 VPC 내 작동)** |
| **[[Route 53]]** | **글로벌** | Yes | **Yes (리전 간 라우팅)** |

## 핵심 논리 (Logic Flow)
ASG가 인스턴스를 가용 영역(AZ)마다 흩어 놓아도, 그들은 모두 하나의 VPC라는 지붕 아래 있습니다. 따라서 ALB는 지붕 안의 모든 방(AZ)을 자유롭게 드나들며 통신할 수 있습니다.

---
**Conclusion:**
통신이 안 될 걱정은 없습니다. ASG는 VPC를 벗어나지 않으며, ALB는 VPC 내의 모든 곳을 갈 수 있기 때문입니다.