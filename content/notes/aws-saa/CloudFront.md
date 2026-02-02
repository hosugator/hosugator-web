---
created: 2025-11-12
tags: [aws_saa, cloudfront, cdn, edge, origin, cache]
reference:
  - https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html
---
# Amazon CloudFront
## 정의
전 세계 엣지 로케이션을 통해 정적·동적 콘텐츠를 최종 사용자에게 낮은 지연 시간으로 전달하는 관리형 CDN 서비스
## 구성
- [[Distribution]] : 엣지 전체 설정 단위(도메인 dxxxxx.cloudfront.net)
- [[Origin]] : 콘텐츠 원본(S3, ELB, EC2, 온프레미스 등)
- [[Cache Behavior]] : 경로 패턴별 캐시 규칙, TTL, 허용 메서드
- [[Cache Key]] : URI, 쿼리 스트링, 헤더, 쿠키 포함 여부
## 특징
- 엣지 로케이션 400+ , 전 세계 90+ 국가
- HTTPS/TLS 1.3, TLS 종료 인증서 자동 발급
- 기본 캐시 TTL 24시간, 최소 0초
- Origin Shield, Lambda@Edge, CloudFront Functions으로 리퀘스트 가공
- 실시간 로그·WAF·GeoRestriction 연동