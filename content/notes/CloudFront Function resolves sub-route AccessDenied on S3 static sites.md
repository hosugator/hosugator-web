---
created: 2026-05-25
updated: 2026-05-25
type: log
status: 2-stable
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - cloudfront
  - s3
  - nextjs
  - static-site
  - routing
publish: true
---

## Context

Next.js `output: 'export'` + `trailingSlash: true`로 빌드하면 `/blog` → `/blog/index.html` 파일이 생성된다. S3+CloudFront 구성에서 CloudFront의 Default Root Object는 루트(`/`)에만 적용되므로, `/blog` 접속 시 S3는 객체를 찾지 못하고 `AccessDenied`(XML) 응답을 반환한다.

## Decision

CloudFront Function(viewer-request 이벤트)으로 URI를 rewrite한다.

```javascript
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    } else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }
    return request;
}
```

**배포 절차:**
1. AWS Console → CloudFront Functions → 함수 생성 (`hosugator-uri-rewrite`)
2. Test → Publish(LIVE) 배포
3. Distribution → Behaviors → Default(*) → Function associations → Viewer request에 연결

이후 새 Next.js 라우트를 추가해도 추가 서버 설정 불필요.

**대안과 비교:**

| 방법 | 특징 |
|---|---|
| CloudFront Error Pages | 403→200 `/index.html` 리다이렉트. CSR SPA에 적합. SSG 사이트에선 모든 경로가 홈으로 리다이렉트되는 부작용. |
| S3 Website Hosting + 오류 문서 | S3 버킷 정책 복잡도 증가. HTTPS 직접 지원 불가. |
| **CloudFront Function** | 요청 전 URI 변환. 조건 분기 가능. 비용 저렴. |

## Consequences

- `/blog`, `/projects` 등 정적 라우트 모두 정상 접근.
- `.js`, `.css`, `.png` 등 파일 확장자가 있는 요청은 rewrite 제외 (`!uri.includes('.')` 조건).
- CloudFront Distribution ID: `E36M7TT0F7EFQ6` (hosugator.com)

---

See Also:
- [[Hosugator blog and insights restructure 2026-05]]
- [[Hosugator Web]]
