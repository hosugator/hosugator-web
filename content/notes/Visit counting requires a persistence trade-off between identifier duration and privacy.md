---
created: 2026-07-09
updated: 2026-07-09
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Hosugator Web]]"
tags:
  - analytics
  - privacy
  - tracking
  - goatcounter
publish: true
---
## Context
hosugator-web(정적 export, S3+CloudFront)에 방문자 분석을 처음 붙이면서, "pageview·visit·unique visitor가 대체 어떻게 세지는가"부터 다시 짚어야 했다.
애널리틱스 도구를 그냥 골라서 스니펫만 넣으면 끝일 줄 알았는데, 실제로는 도구마다 "같은 사람"을 판단하는 방식 자체가 다르고 그게 법적(GDPR 동의배너) 요구까지 갈라놓는다는 걸 이번에 처음 제대로 이해했다.

## Insight
### 웹은 상태가 없어서, 집계 단위 3개가 서로 다른 것을 센다

- Pageview — HTTP 요청 1건. 그냥 요청마다 +1.
- Visit/Session — pageview 여러 개를 "한 번의 방문"으로 묶은 것. 묶는 기준은 시간 윈도우(GA4는 30분, GoatCounter는 8시간).
- Unique visitor — "몇 명이 왔나". 이건 식별자가 있어야만 셀 수 있다(쿠키 ID, 지문, 혹은 IP+UA 해시).

### 식별자를 얼마나 오래 유지하느냐가 트레이드오프의 축이다

식별자를 오래·정확하게 유지 = 재방문·리텐션까지 보이지만 개인정보에 가까워짐. 
짧게·뭉뚱그려 유지 = 프라이버시는 안전하지만 "이 사람이 지난주에도 왔다"는 원천적으로 못 봄.

이 축을 기준으로 도구를 4갈래로 분류:

| 분류                                | 식별 메커니즘                      | 재방문 인식 | 동의배너    | 비용/운영          |
| --------------------------------- | ---------------------------- | ------ | ------- | -------------- |
| A. 서버 로그 (CloudFront/nginx 원본 로그) | 없음(요청 그대로)                   | ✗      | 대체로 불필요 | 로그 파이프라인 구축 필요 |
| B. GA4·Mixpanel류                  | 쿠키/localStorage에 영속 ID (수개월) | ✓✓ 깊게  | 필요      | 무료(데이터가 대가)    |
| C. GoatCounter·Plausible·Fathom류  | `siteID+IP+UA` 해시, 메모리에 8시간만 | ✗      | 대부분 불필요 | 무료~소액, 스크립트만   |
| D. Umami·Matomo 셀프호스팅             | 옵션에 따라 B/C 중 선택              | 설정에 따라 | 설정에 따라  | 서버+DB 직접 운영    |

### GoatCounter의 구체적 메커니즘 (공식 문서 기준)

- 세션ID = `concat(siteID, User-Agent, IP)` 해시, 메모리에만 8시간 보관 후 폐기. DB/디스크에 IP·UA 원문 저장 안 함.
- 8시간 이내 재방문 → 같은 visit(pageview만 증가). 8시간 초과 → 완전히 새 방문자로 카운트.
- 수집: 브라우저/OS(User-Agent 파싱 결과), IP 기반 대략 위치, 언어, 화면 너비, 리퍼러. 체류 시간·스크롤·클릭 등 행동 데이터는 수집하지 않음 — 애초에 그런 지표를 보여주는 도구가 아니다.
- "동의배너 불필요" 주장의 근거는 ①개인식별정보 미저장(집계 데이터만) ②방문자 수 파악은 "정당한 이익(legitimate interest)"이라는 논리. 공식 문서도 법적 확정을 보장하진 않는다고 명시.

## Decision
### 20260709

이 사이트엔 C(GoatCounter)를 선택했다. 이유:

- 정적 export(S3+CloudFront)라 A를 하려면 CloudFront 로그→S3→Athena 파이프라인을 새로 깔아야 함 — 개인 포트폴리오 규모엔 과함.
- B(GA4)는 퍼널·리텐션까지 보는 도구인데 이 사이트에 필요한 건 "요청 수/유입경로/기기" 정도 — 무거운 도구 + 동의배너 UX까지 넣을 이유가 없음.
- D(Umami 셀프호스팅)는 이미 리소스가 빡빡한 Oracle Free Tier k3s에 DB 포함 워크로드를 또 얹는 셈 — 클러스터 운영 부담 증가 방향과 안 맞음.
- C는 요구사항(가볍게, 법적 걱정 없이, 트래픽 규모만 확인)과 정확히 맞고, 오픈소스라 나중에 셀프호스팅 전환도 가능해 락인이 없음.

적용 스니펫 (`app/layout.tsx`, `next/script`로 삽입):

```html
<script data-goatcounter="https://hosugator.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

> 전환 조건: 나중에 리텐션·퍼널 분석이 실제로 필요해지면(예: 유입→데모 클릭 전환율 추적) B 또는 D로 옮기는 걸 재검토. 그 전까진 C 유지.

## Related
- [[useSearchParams without Suspense breaks Next.js static export]] — 같은 세션, 같은 프로젝트(hosugator-web)에서 발생한 작업 로그
