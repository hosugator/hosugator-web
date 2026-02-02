---
created: 2025-11-11
tags: [aws_saa, edge, cloudfront, global_infrastructure, az, region]
reference:
  - https://aws.amazon.com/cloudfront/features/
  - https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/HowCloudFrontWorks.html
---
# AWS Edge Location (엣지 로케이션)
## 정의
전 세계 도시에 분산된 콘텐츠 캐시 및 [[DNS]] 응답 노드로 [[CloudFront]], [[Route 53]] 등이 이용하는 AWS 엣지 네트워크 시설
## 특징
- 400개 이상의 POP(Point-of-Presence) 운영
- 리전 외부에 존재, AZ와는 별개 계층
- 정적·동적 콘텐츠, TLS 핸드셰이크, API 가속 처리
- 사용자-가장 가까운 엣지로 자동 라우팅하여 지연 시간 최소화
## 예시
한국 사용자 요청은 서울 리전이 아닌 부산/인천 엣지 로케이션에서 캐시된 CloudFront 콘텐츠로 응답