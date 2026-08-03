---
created: 2026-02-11 18:00
updated: 2026-02-11 18:00
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - security
  - cloudfront
  - nginx
  - infra
publish: true
---
# ADR 002: CloudFront-to-Nginx Custom Header 기반 원본 보호 (Origin Shield)
## Context (배경)
- **보안 취약점**: 현재 서비스는 CloudFront를 통해 도메인 접근을 제공하고 있으나, EC2의 퍼블릭 IP가 노출될 경우 공격자가 CloudFront의 보안 계층(SSL, 캐싱 등)을 우회하여 직접 서버에 부하를 주거나 공격할 위험이 있음.
- **비용 제약**: AWS WAF(Web Application Firewall)를 도입하여 IP 화이트리스팅을 할 수 있으나, 개인 포트폴리오 수준에서는 추가 비용 부담이 존재함.
- **요구사항**: 추가 비용 없이 오직 CloudFront를 통해서만 들어오는 요청만 Nginx에서 수락하도록 강제해야 함.
## Decision (결정)
1. **Custom Header 도입**: CloudFront의 'Origin Request Settings'에서 사전에 약속된 커스텀 헤더(`X-CloudFront-Hosugator-Secret`)를 모든 원본 요청에 부착하도록 설정함.
2. **Nginx 검증 로직 구현**: EC2 내 Nginx 설정에서 해당 헤더가 존재하지 않거나 값이 일치하지 않을 경우 `403 Forbidden`을 즉시 반환하도록 `if` 조건문을 추가함.
3. **HTTPS 강제**: Certbot을 통한 SSL 적용을 유지하여 헤더 값이 전송 중 노출되지 않도록 보장함.
## Consequences (결과)
- **장점 (Pros)**:
    - **비용 효율성**: AWS WAF 비용을 지불하지 않고도 원본 IP 직접 공격을 효과적으로 방어함.
    - **가시성**: 비정상적인 우회 시도를 Nginx 로그를 통해 명확히 모니터링할 수 있음.
- **단점 (Cons)**:
    - **운영 공수**: 보안 강화를 위해 주기적으로 헤더 키 값을 수동으로 변경(Rotation)해야 하는 번거로움이 있음.
    - **디버깅 복잡도**: 로컬에서 직접 API를 테스트할 때 해당 헤더를 수동으로 넣어야 하므로 테스트 과정이 다소 복잡해짐.
---
## 작업 로그 (트러블슈팅 예상)
- [x] CloudFront Behavior 설정에서 헤더 추가 확인
- [x] Nginx `$http_x_cloudfront_hosugator_secret` 변수 매핑 확인
- [x] 꼬였던 설정 파일 정합성 체크 (`nginx -t`)