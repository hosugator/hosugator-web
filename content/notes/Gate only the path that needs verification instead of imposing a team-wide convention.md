---
created: 2026-07-28
updated: 2026-07-28
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - ci-cd
  - gitlab
  - cross-platform
  - team-workflow
  - verification
publish: true
---
## Context
MLA 검사기를 Ubuntu에서 개발하고 Windows로 배포한다. 팀 동료들은 Windows에서 작업하며 `main`에 직접 커밋한다. 내 리눅스 이식 작업은 코드가 끝났는데도 "Windows 미검증"이라는 이유로 커밋·병합을 못 하는 상태가 됐다. 듀얼 부팅은 기능 단위마다 재부팅이 반복되고, Docker로 우회할 수 있는지 검토했다.

## Insight
### 다중 환경 개발의 병목은 구현이 아니라 검증이다

측정된 대비가 명확했다 ㅡ 코드는 끝났는데 확신이 없어서 진행이 멈췄다.
그리고 이 병목은 기능 단위마다 반복된다. 일회성 비용이 아니라 반복 비용이라, 해결책도 일회성 검증이 아니라 자동화여야 한다.

### Docker는 이 문제를 풀 수 없다 — 커널을 공유하기 때문이다

컨테이너는 프로세스 격리만 하고 커널은 호스트 것을 쓴다. 이게 VM보다 가벼운 이유이자 OS를 넘나들 수 없는 이유다. 
Docker Desktop for Windows가 Linux 컨테이너를 돌리는 것은 내부에 Linux VM을 띄우기 때문이다. 
Wine은 되지만 검증 대상이 "Windows"가 아니라 "Wine의 Windows 구현"이 된다. 
우리는 배포 환경에서의 검증이 필요하다. 

### 파이프라인은 push를 막지 않고 병합만 막는다 — 이것이 비대칭 도입을 가능하게 한다 ← 핵심

CI를 붙여도 동료의 `git push`는 지금과 똑같이 즉시 끝난다. 실패하면 커밋 옆에 빨간 표시가 붙을 뿐이다.
만약 파이프라인이 push를 게이트했다면 CI 도입은 팀 전체 워크플로 변경을 강요하게 된다.
나만 MR을 쓰고 MR에만 CI를 게이트로 두면, 기존 팀의 변화는 0이고 합의 비용도 0이다.

### 게이트와 감지는 다르다 

```
내 변경 → Windows 깨짐     MR 게이트가 잡는다
동료 변경 → Linux 깨짐     아무도 안 잡는다 ← 내가 유일한 Linux 사용자
```

`main` push에 Linux 잡을 감지용으로 붙인다. 누구도 막지 않되, 표시는 남는다.

## Decision
### 20260728
GitLab MR 게이트 + `main` 감지 파이프라인으로 구성한다. 팀 워크플로는 건드리지 않는다.

| 트리거                 | 잡               | 역할              |
| ------------------- | --------------- | --------------- |
| MR (`feat/ → main`) | windows + linux | 게이트 — 통과해야 병합   |
| `main` push         | linux           | 감지 — 차단 없음, 표시만 |
| 수동 (web)            | 선택              | 필요 시            |
## Related
- [[Defensive error handling converts porting bugs into silent feature loss]] — 검증이 병목인 이유. 이식 실패가 무증상이라 자동 검증 없이는 발견되지 않는다
- [[Cross-platform reproducibility comes from locking resolution not from the manifest format]] — CI가 검증할 대상(lockfile이 양 플랫폼 휠을 담는지)
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]] — Windows/Linux 이원화의 배경
- [[CI manifest commit triggers infinite loop without paths-ignore on manifest directory]] — 트리거 범위 설정을 잘못하면 생기는 문제
- [[Effective AI management requires both orchestration speed and verification depth]] — 검증을 역량 축으로 본 관점. 이쪽은 그 검증을 도구로 옮기는 문제
- [[Git Rebase와 안전한 원격 반영 (--force-with-lease)]] — 직선 이력 유지 관련 원격 반영 기법
