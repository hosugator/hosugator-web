---
created: 2025-12-22 Mon
tags: [aws, networking, data_transfer]
reference:
  - "[[AWS Lambda]]"
  - "[[Amazon SNS]]"
  - "[[Amazon SQS]]"
---

# Payload

## 정의 (Definition)
전송되는 데이터 패킷에서 헤더나 메타데이터와 같은 제어 정보를 제외한 사용자가 실제로 전달하고자 하는 **실질적인 데이터 본문**

## 핵심 맥락 (Context & Why)
### Problem
데이터 전송 시 보내는 사람, 받는 사람, 보안 설정 등 부가적인 정보가 함께 섞여 들어오기 때문에, 애플리케이션이 처리해야 할 실제 비즈니스 데이터가 무엇인지 명확히 구분해야 합니다.
### Solution
제어 정보는 시스템 인프라가 처리하고, 애플리케이션은 Payload 영역에 담긴 내용만 추출하여 로직을 수행함으로써 통신 효율성과 데이터 처리의 명확성을 확보합니다.

## 작동 원리 (Mechanism) 
### 캡슐화 (Encapsulation)
데이터는 각 통신 계층을 지나며 헤더가 붙는데, 상위 계층의 전체 데이터(헤더+데이터)는 하위 계층에서 통째로 Payload로 취급됩니다.
### 크기 제한 (Quotas)
AWS 서비스마다 Payload의 최대 크기가 제한되어 있습니다 (예: SNS/SQS는 256KB, Lambda 동기 호출은 6MB 등).
### 구조화
주로 JSON이나 XML 형식을 사용하여 데이터의 구조를 정의하며, 수신 측에서는 이 구조를 파싱(Parsing)하여 사용합니다.

## 유비 및 비교 (Analogy & Comparison)
### It's like
택배 상자에서 운송장(헤더)을 제외하고 상자 안에 들어있는 **실제 물건(Payload)**과 같습니다. 택배 기사는 운송장을 보고 배달하지만, 받는 사람은 상자 안의 물건만 사용합니다.
### vs (유사 개념)
- Header: 데이터를 어디로 보낼지, 어떤 방식인지 알려주는 '안내문'입니다.
- Payload: 그 안내문을 따라 배달된 '진짜 내용물'입니다.

## 예시 및 구조 (Example/Structure)
AWS Lambda의 이벤트 객체 예시:
```json
{
  "header": { "requestId": "12345", "source": "aws.events" },
  "payload": { "user_id": "gemini", "action": "login" }  // 실제 처리될 데이터
}