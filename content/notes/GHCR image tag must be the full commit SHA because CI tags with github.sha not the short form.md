---
created: 2026-07-09
updated: 2026-07-09
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - ghcr
  - github-actions
  - k3s
  - debugging
publish: true
---
## Context
align-ai 이미지를 배포하며 `deployment.yaml`의 이미지 태그를 손으로 `cb1b30f`(git이 터미널에 보통 보여주는 짧은 7자리 sha)로 적었더니 `ImagePullBackOff`가 났다.

## Insight
### GitHub Actions는 `github.sha`(전체 40자)로 태깅하므로, 짧은 sha를 쓰면 "그런 태그 없음"으로 실패한다

`ci.yml`에서 이미지를 `ghcr.io/hosugator/align-ai:${{ github.sha }}`로 푸시하는데, 이 컨텍스트 변수는 항상 전체 40자 SHA다.
터미널에서 익숙하게 보는 짧은 7자리 sha(`cb1b30f`)는 GHCR에 존재하지 않는 태그라서 pull이 실패한다.

### 에러 메시지가 실패 원인을 구분해준다

`not found`는 태그 자체가 없다는 뜻(이 케이스), `unauthorized`는 인증(imagePullSecret) 문제라는 뜻이다. 
둘 다 컨테이너가 안 뜨는 증상은 같지만 원인이 다르므로, 디버깅 시 `kubectl describe pod`의 에러 메시지 문자열로 먼저 갈래를 나눠야 한다.

## Decision
`deployment.yaml`의 이미지 태그는 항상 CI 로그/커밋 링크에서 전체 SHA(`cb1b30ffa420e33fe60196af0007364709fa2690`)를 그대로 복사해 쓰기로 했다 — 터미널에 익숙한 짧은 형태를 손으로 옮겨적지 않는다.

## Related
- [[GHCR private image pull reuses an existing gh CLI token instead of minting a new PAT]] — 같은 배포 작업에서 겪은 또 다른 함정
- [[latest tag forces imagePullPolicy Always bypassing local image cache]] — 태그 관련 인접 함정(이건 짧은 sha가 아니라 `latest` 자체의 문제)
