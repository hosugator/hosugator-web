---
created: 2026-07-29
updated: 2026-07-29
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - linux
  - shell
  - systemd
  - reproducibility
  - debugging
publish: true
---
## Context
GitLab 러너가 systemd 서비스로는 실패하고 셸에서 직접 실행하면 성공했다. "환경 차이"라고 판단해 동작하던 셸의 환경변수 **61개 전부**를 `EnvironmentFile`로 서비스에 넘겼다. 그래도 실패했다.

원인은 `~/.bash_logout`의 `clear_console -q`였고, 그것이 실행되는 조건이 `SHLVL = 1`이었다.

## Insight
### 환경변수는 프로세스 상태의 일부일 뿐이다

`SHLVL`(셸 중첩 깊이)은 **부모가 전달하는 값이 아니라 셸이 시작할 때 스스로 계산**한다. 부모의 값에 1을 더하거나, 없으면 1로 설정한다.

```
내 대화형 셸의 자식으로 실행   →  SHLVL = 2 이상  →  분기 안 탐  →  성공
systemd 서비스로 실행         →  SHLVL = 1       →  분기 탐    →  실패
```

그래서 **환경변수를 100% 복사해도 재현되지 않는다.** 복사 대상이 아니기 때문이다. "환경이 같은데 왜 다르지"에서 막힌 이유가 이것이었고, 이 사실을 알아채는 데 가장 오래 걸렸다.

같은 성질을 갖는 상태들이 더 있다.

| 상태 | 결정 주체 | 환경변수로 복사되나 |
|---|---|---|
| `SHLVL` | 셸이 계산 | ❌ |
| TTY 연결 여부 (`[ -t 0 ]`) | 커널의 fd 종류 | ❌ |
| 프로세스 그룹·세션 | 커널 | ❌ |
| cgroup 소속 | systemd/커널 | ❌ |
| 부모 프로세스 | exec 구조 | ❌ |
| umask, 리소스 한계 | 상속되지만 별도 채널 | ❌ (env 아님) |

**"동일한 환경"을 환경변수 집합으로 정의하면 이런 것들이 전부 빠진다.** 재현이 안 될 때 확인해야 할 목록이 환경변수보다 넓다.

### 시스템 도구는 TTY 부재를 실패로 취급한다

`clear_console -q`는 TTY가 없으면 `exit 1`이다. 콘솔을 지우는 도구이므로 콘솔이 없으면 실패하는 것이 자연스럽다.

문제는 그것이 `~/.bash_logout`의 **마지막 명령**이라 로그인 셸의 종료 코드가 되는 것이다. Ubuntu 기본 내용은 이렇다.

```bash
if [ "$SHLVL" = 1 ]; then
    [ -x /usr/bin/clear_console ] && /usr/bin/clear_console -q
fi
```

대화형 로그아웃만 상정한 코드다. **비대화형 로그인 셸(CI 러너, systemd 서비스, `ssh host command`)이 이 파일을 통과하는 경로를 고려하지 않았다.**

### 조건을 정확히 하는 편이 실패를 덮는 것보다 낫다

두 가지 수정이 가능했다.

```bash
... && /usr/bin/clear_console -q || true      # 실패를 덮는다
if [ "$SHLVL" = 1 ] && [ -t 0 ]; then         # 조건을 정확히 한다
```

후자를 골랐다. 콘솔 지우기는 **터미널이 붙어 있을 때만 의미가 있으므로** 의미상 맞고, 조건이 거짓인 `if`는 종료 코드가 0이라 문제도 해결된다. `|| true`는 "이 명령이 실패해도 상관없다"고 선언하는 것이라, 나중에 다른 이유로 실패해도 묻힌다.

## Decision
`~/.bash_logout`에 `[ -t 0 ]`을 추가했다. 백업은 `~/.bash_logout.bak`.

이것은 **호스트 설정 수정**이지 레포 변경이 아니다. 그래서 레포에는 "Linux 러너를 등록하려면 이 수정이 필요하다"는 **필수 절차로 문서화**했다 — Ubuntu 기본 설정이라 누가 러너를 붙여도 같은 곳에서 막힌다.

**재현 실패를 조사할 때 확인 순서**를 이렇게 정리한다.

1. 환경변수 (가장 먼저 의심하지만, 여기서 끝나면 안 된다)
2. **셸이 계산하는 상태** — `SHLVL`, 대화형 여부
3. **fd 종류** — TTY / 파이프 / `/dev/null`
4. 프로세스 계보 — 누가 exec했는지
5. 커널 컨텍스트 — cgroup, 세션, 리소스 한계, 보안 프로필

**전환 조건**: 2~5를 확인하는 것보다 추적 도구(strace)를 먼저 쓰는 편이 빠른 경우가 많다 — [[Elimination beats tracing only when each hypothesis has a cheap observable]] 참조.

## Related
- [[Elimination beats tracing only when each hypothesis has a cheap observable]] — 이 원인을 찾은 방법과, 순서를 잘못 잡은 기록
- [[Encoding must be fixed at each boundary not by a process-wide setting]] — 전역 설정으로 환경 차이를 해결하려다 실패한 다른 사례
- [[Cross-platform reproducibility comes from locking resolution not from the manifest format]] — 재현성을 선언으로 고정하는 접근
- [[Defensive error handling converts porting bugs into silent feature loss]] — 종료 코드가 진단을 왜곡하는 구조
