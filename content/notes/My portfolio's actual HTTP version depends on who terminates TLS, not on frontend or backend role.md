---
created: 2026-07-16
updated: 2026-07-16
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - kubernetes
  - networking
  - http
  - s3
publish: true
---
## Context
포트폴리오 사이트(React를 S3에 정적 호스팅 + 데모 기능은 Oracle 인스턴스의 FastAPI)를 두고 "프론트엔드는 HTTP/3, 백엔드는 HTTP/1.1을 쓰는 것 아니냐"고 추측했다.
실제로는 "프론트엔드/백엔드"라는 역할이 아니라 각 연결을 누가 종단하느냐가 버전을 정한다는 걸 확인했다.

## Insight
### HTTP 버전은 "역할"이 아니라 "TLS를 종단하는 지점"으로 정해진다
- S3 정적 웹사이트 호스팅 엔드포인트(`*.s3-website-*.amazonaws.com`)는 HTTPS 자체를 지원하지 않는다 → HTTP/2·3은 TLS가 필수라 애초에 불가능, HTTP/1.1만 가능.
- CloudFront를 앞에 두면 HTTP/2·3까지 가능해지지만, 이것도 배포 설정에서 명시적으로 켜야 하는 옵션이지 자동이 아니다.
- Oracle 인스턴스의 FastAPI(Uvicorn을 직접 노출)도 HTTP/1.1 확정 — HTTP/2·3을 쓰려면 Nginx/Caddy 같은 리버스 프록시를 앞에 두고 명시적으로 설정해야 한다.

### 두 연결(브라우저↔S3, 브라우저↔Oracle)은 완전히 독립적인 협상이다
이론적으로는 하나가 HTTP/2, 하나가 HTTP/1.1인 비대칭 상황도 가능하다 — "프론트/백엔드"라는 구도로 미리 결론 내릴 수 없고, 실제 설정(CDN 유무, 리버스 프록시 유무)을 봐야 확정된다.

### 이론 추측보다 브라우저 DevTools로 확인하는 게 확실하다
Network 탭의 Protocol 열을 켜면 각 요청이 실제로 `http/1.1`, `h2`, `h3` 중 뭘 썼는지 바로 보인다.
별도 CDN/리버스 프록시 설정을 명시적으로 하지 않은 현재 구성 기준으로는 둘 다 HTTP/1.1일 가능성이 높다.

## Related
- [[Kubernetes Service L4 boundary prevents HTTP path and header routing without Ingress]] — 같은 맥락의 "역할로 짐작 말고 실제 종단 지점을 확인하라"는 원칙