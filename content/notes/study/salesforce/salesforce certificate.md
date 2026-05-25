---
created: 2025-10-09
revised: 2025-10-09 14:35
tags: []
reference:
  - "[[salesforce - hub]]"
---

# salesforce certificate 
### user id
hosugator@resourceful-goat-2mi0m0.com
## system architecture
Salesforce는 단일 플랫폼을 중심으로 교육, 개발, 배포, 확장까지 모든 것이 유기적으로 연결된 구조입니다.
## **Salesforce 에코시스템 핵심 아키텍처**
| 구성 요소                   | 역할 (What it is)                                                                                                                      | 아키텍처 내 위치 및 상호작용                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| **Salesforce Platform** | **중앙 플랫폼 (Core System)**: Salesforce의 모든 애플리케이션(Sales Cloud, Service Cloud 등)과 데이터가 구동되는 기반. CRM 데이터, 비즈니스 로직, 보안 등이 통합 관리되는 핵심 엔진.  | 모든 구성 요소의 **중심 축**. **Trailhead**에서 학습한 내용이 **Playground**를 통해 실제 환경으로 연결됩니다. |
| **Trailhead**           | **공식 학습/교육 플랫폼**: Salesforce 기술과 비즈니스 지식을 학습하는 온라인 공간. 뱃지(Badge)와 트레일(Trail) 단위로 학습 경로가 구성됩니다.                                       | **플랫폼 상단 (교육 계층)**: 이론 및 실습 지식을 제공하며, **Playground**를 학습 환경으로 사용합니다.          |
| **Playground**          | **실습 환경 (Sandbox)**: Trailhead 학습 중 코드를 실행하거나 설정을 변경하는 등 실제 Salesforce 환경을 모방한 **개인용 개발 공간**. 실제 프로덕션 환경에 영향을 주지 않고 안전하게 실습할 수 있습니다. | **플랫폼 연동 (개발/테스트 계층)**: Salesforce Platform의 기능을 사용하지만, 데이터는 격리되어 있습니다.       |
|**AppExchange**|**앱 스토어/마켓플레이스**: Salesforce Platform 위에서 구동되는 **외부 솔루션/앱을 사고팔 수 있는 장터**. 서드파티 개발사들이 만든 특화된 애플리케이션(예: 물류 관리, 복잡한 재무 보고서 등)을 다운로드하여 플랫폼에 추가합니다.|**플랫폼 확장 (솔루션 계층)**: Salesforce Platform에 **추가 기능과 가치**를 제공하며, 고객의 요구사항을 충족합니다.|
## **핵심 개념 간의 관계 요약**
Salesforce의 시스템은 다음의 흐름으로 이해할 수 있습니다.
1. **학습 (Trailhead)**: 사용자는 **Trailhead**에서 Salesforce의 개념과 기능을 배웁니다.
2. **실습 (Playground)**: 배운 내용을 **Playground**라는 안전한 임시 환경에서 직접 코딩하거나 설정해 봅니다.
3. **핵심 기능 (Salesforce Platform)**: 이 모든 것은 **Salesforce Platform**이라는 강력한 기반 위에서 이루어지며, 이곳에 기업의 실제 데이터가 저장됩니다.
4. **확장 및 배포 (AppExchange)**: 필요한 추가 기능은 **AppExchange**를 통해 구매하거나 자체 개발하여 **Salesforce Platform**에 설치함으로써 시스템을 확장합니다.
**즉, Trailhead와 Playground는 '사용자 및 개발자 역량 강화'를 위한 교육/실습 도구이며, AppExchange는 '플랫폼 기능 확장'을 위한 솔루션 마켓입니다.** 이 모든 것이 Salesforce Platform이라는 단일 아키텍처 위에서 유기적으로 작동합니다.