---
created: 2026-07-30
updated: 2026-08-03
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - git
  - release
  - versioning
  - deployment
publish: true
---
## Context
MR이 main에 병합된 뒤 프로덕션에서 버그가 발견되면 이력을 어떻게 관리하는지 물었다 — 문제가 된 커밋들을 이력에서 지우는지, main이 두 갈래가 되는지.

## Insight
### 배포와 이력은 다른 축이다

되돌려야 하는 것은 현장에서 도는 것이고, 그것을 위해 이력을 고칠 필요가 없다.
특히 산출물 배포(폴더 복사·이미지 태그)에서는 git 없이도 롤백이 끝난다 — 이전 산출물을 보관해두고 되돌리면 된다. git은 "무엇을 다시 빌드할지" 특정하는 데만 필요하다.
main은 한 갈래로 앞으로만 간다. 버그가 있었던 커밋도 남는다 — "그때 무엇이 있었는지"가 기록으로 남아야 원인 분석이 가능하다.

### 되돌릴 지점을 특정하려면 이름이 필요하다 — 그게 태그다

태그는 두 일을 한다.

```
식별   이 상태를 "v1.2.0"이라 부른다 — 사람이 말로 옮길 수 있는 이름
검증   이것은 통과했고 배포했다는 표시
```

태그의 필요는 저장소 밖에서 온다. 커밋 해시도 완전한 식별자지만 사람이 쓸 수 없고, 현장 작업자·고객은 저장소가 없다. 이것이 [[Abstraction is triggered by the need to share so abstracting the unshared only adds cost]]의 사례다.
그래서 기준은 배포가 아니라 "누군가 이 상태에 의존하기 시작한 시점"이다. 배포가 대표적이지만 내부 시험 사용자·데모·성능 기준선도 해당한다.

### 개발 중에는 CI가 검증을 맡고 식별은 해시로 된다

```
릴리스 후    태그        식별 + 검증
개발 중      커밋 해시    식별
            초록 CI      검증        ← 태그의 절반을 대신한다
```

CI가 태그를 대체하는 게 아니라, 태그의 두 기능 중 개발 중에 필요한 하나만 맡는다. 식별은 이미 해시로 되어 있고, 저장소 밖에서 지목하는 사람이 없으므로 이름이 필요 없다.
그리고 변경이 잦은 것은 태그가 덜 필요한 이유가 아니라 검증이 더 촘촘해야 하는 이유다. 태그를 커밋마다 붙일 수는 없고, CI는 붙일 수 있다.

## Decision
### 20260730

1. 의존이 생기는 시점에 태그 시작 — 첫 설비 배포 또는 데모. 그전까지는 main + 초록 CI로 충분하다
2. 빌드에 커밋 해시를 굽는다 — 기동 로그 배너에 `버전 + 커밋`을 남기면 "어느 빌드의 로그인가"가 해결된다. 로그에 실행 경계 표시가 없다는 별개 문제와 함께 해결된다

## Related
- [[Abstraction is triggered by the need to share so abstracting the unshared only adds cost]] — 태그가 왜 저장소 밖의 요구인지
- [[A running deployment proves a past build worked not that current source still builds]] — 배포와 소스가 다른 것에 대한 진술이라는 같은 축
- [[A non-deterministic component in the verification environment destroys the implication CI sells]] — CI가 검증을 맡을 수 있는 조건
- [[Gate only the path that needs verification instead of imposing a team-wide convention]] — main을 초록으로 유지하는 설계
- [[Cross-platform reproducibility comes from locking resolution not from the manifest format]] — 파생 가능한 값을 고정하는 같은 원리
- [[latest tag forces imagePullPolicy Always bypassing local image cache]] — 태그가 가변일 때 생기는 문제
- [[latest-only tag creates untagged dangling versions in container registry]] — 태그 위생
