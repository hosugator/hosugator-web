---
created: 2025-12-18 Thu
tags:
  - programming_language
  - php
  - server_side
  - backend
  - web_development
reference:
  - "[[Static vs. Dynamic Content Handling]]"
---
# PHP (Server-Side Scripting Language)

## 정의 (Definition)
웹 개발에 특화된 서버 측 스크립트 언어로, HTML 코드 안에 포함되어 동적인 웹 페이지를 생성하는 데 널리 사용됨.

## 핵심 역할 (Core Role)
- **Business Logic 처리:** 사용자가 입력한 데이터를 검증하고 계산함.
- **DB 연동:** MySQL, PostgreSQL 등과 통신하여 데이터를 주고받음.
- **동적 HTML 생성:** 데이터베이스에서 가져온 정보를 바탕으로 사용자마다 다른 화면을 그려줌.

## 유비 및 비교 (Analogy & Comparison)
- **It's like: 식당의 '레시피와 요리사'**
    - **HTML/CSS (정적):** 이미 인쇄된 고정 메뉴판.
    - **PHP (동적):** 주문이 들어오면 주방에서 요리사가 재료(DB 데이터)를 가지고 요리를 완성해 나가는 과정.

## AWS 아키텍처에서의 관점 (Question 35 적용)
- **Compute Power:** PHP 코드를 실행하기 위해서는 CPU 연산 능력이 필요하므로 [[EC2]] 인스턴스가 담당함.
- **Scalability:** 트래픽이 몰려 PHP 연산이 지연되면 [[ASG]]가 [[AMI]]를 통해 동일한 PHP 환경을 가진 서버를 증설함.