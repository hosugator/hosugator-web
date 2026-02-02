---
created: 2025-12-18 Thu
tags:
  - aws_saa
  - cloudfront
  - s3
  - alb
  - edge_location
  - performance
reference:
  - "[[AWS Snow Family (물리적 데이터 마이그레이션)]]"
  - "[[Static vs Dynamic Content Handling]]"
---
# CloudFront Multi-Origin (정적/동적 콘텐츠 최적화)

## 정의 (Definition)
단일 [[CloudFront]] 배포 환경에서 여러 소스(S3, ALB 등)를 오리진으로 등록하고, 경로 규칙에 따라 트래픽을 분기하여 전 세계 사용자에게 저지연으로 콘텐츠를 제공하는 기술.

## 핵심 맥락 (Context & Why)
- **Problem:** 글로벌 서비스에서 정적 데이터(이미지)는 캐싱이 필요하고, 동적 데이터(로그인, 검색)는 서버와 빠른 통신이 필요하다. 이를 각각 다른 도메인으로 관리하면 설정이 복잡해진다.
- **Solution:** CloudFront를 단일 접점으로 두고, **S3(정적)**와 **ALB(동적)**를 연결하여 캐싱과 경로 최적화를 한꺼번에 해결한다.

## 작동 원리 (Mechanism)
1. **Origin 정의:** S3 버킷과 Application Load Balancer를 각각 오리진으로 등록함.
2. **Behavior 설정:** - `Default (*)` -> ALB (동적 요청 처리)
   - `/static/*` -> S3 (캐싱 적용)
3. **Route 53 연결:** 사용자 도메인(example.com)을 CloudFront 배포 주소에 별칭(Alias)으로 연결함.

## 유비 및 비교 (Analogy & Comparison)
- **It's like: 대형 마트의 통합 배송 서비스**
    - 신선식품(동적 데이터)은 산지에서 직접 빨리 오게 통로를 뚫어주고, 공산품(정적 데이터)은 동네 창고(Edge)에 미리 쌓아두었다가 바로 배송해주는 통합 시스템과 같음.
- **vs [Global Accelerator]:** 
	- **CloudFront:** 내용을 미리 복사해두는 **'편의점'** (HTTP 특화).
    - **GA:** 전용 차선을 그려주는 **'하이패스'** (IP/네트워크 특화).

## 예시 및 구조 (Example/Structure)
### 글로벌 웹 앱 아키텍처 (Question 32 적용)
- **정적 데이터:** S3 -> CloudFront Cache -> 사용자 (지연 시간 최소화)
- **동적 데이터:** ALB -> CloudFront 네트워크 최적화 -> 사용자 (전송 속도 향상)