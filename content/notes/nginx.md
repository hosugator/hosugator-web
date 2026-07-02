---
created: 2026-02-10
updated: 2026-02-10
type: insight
status: 1-draft
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - category
  - keyword
publish: true
---
## Nginx (엔진엑스)
오늘의 역할: '스마트한 문지기' (Reverse Proxy)
Nginx는 원래 고성능 웹 서버이지만, 오늘 승완 님은 이를 리버스 프록시로 사용하셨습니다.
- 포트 단일화: 백엔드(cureat-api)는 8080 포트에서 돌고 있지만, 사용자가 주소창에 귀찮게 :8080을 붙이지 않게 해줍니다. 사용자가 80(HTTP)이나 443(HTTPS)으로 들어오면 Nginx가 이를 낚아채서 내부의 8080으로 토스해 줍니다.
- SSL 종단점(Termination): 암호화되지 않은 요청이 들어오면 HTTPS로 강제로 돌려보내고, 암호화된 요청을 복호화해서 내부 서버에 전달하는 '보안 관문' 역할을 수행했습니다.
- 도메인 분기: api.hosugator.com으로 오면 API 컨테이너로, www로 오면 메인 사이트로 리다이렉트하는 '교통 정리'를 담당했습니다.