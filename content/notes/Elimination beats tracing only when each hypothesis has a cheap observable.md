---
created: 2026-07-29
updated: 2026-07-29
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - debugging
  - ci-cd
  - strace
  - methodology
publish: true
---
## Context
GitLab 러너를 systemd 사용자 서비스로 등록했더니 모든 잡이 `prepare environment: exit status 1`로 실패했다. 그런데 **같은 러너를 셸에서 직접 실행하면 성공**했다. 가설을 8개 세워 하나씩 배제했고, 전부 아니었다. 그 뒤 strace를 걸자 **한 번에** 원인이 나왔다.

## Insight
### 배제법은 각 가설에 값싼 관측 지표가 있을 때만 빠르다

[[Linux CPU 폭주 디버깅 패턴 - 배제법과 GPU 교차검증]]에서는 배제법이 잘 통했다. 그때는 가설마다 **즉시 읽을 수 있는 지표**가 있었다.

```
FUSE hang?      → cat /proc/PID/wchan        (즉시, 정보 풍부)
busy-wait?      → ps -L -o stat              (즉시, Rl 개수가 보임)
GPU 대기?       → nvidia-smi                 (즉시, 교차검증)
```

이번은 정반대였다.

| | CPU 폭주 사례 | CI 러너 사례 |
|---|---|---|
| 가설 1개 검증 비용 | 명령 1회, 즉시 | 설정 변경 + 서비스 재시작 + 파이프라인 재시도 ≈ 40초 |
| 검증이 주는 정보 | 수치·상태값 (풍부) | **통과/실패 이진값** |
| 실패해도 얻는 것 | 다음 가설의 단서 | 없음 |

**정보를 주지 않는 이진 테스트로 배제법을 하면 가설 목록을 다 소진할 때까지 아무것도 배우지 못한다.** 8개를 배제하는 데 쓴 시간이 strace 한 번보다 훨씬 길었고, 배제된 8개는 원인에 대한 힌트를 하나도 주지 않았다.

판단 기준은 이렇게 정리된다.

```
가설당 관측 비용이 낮고 정보가 풍부  →  배제법
비용이 높고 결과가 이진값           →  추적 도구 먼저
```

그리고 이번 실패는 **100% 재현되고 0.02초에 끝났다.** 추적 도구를 쓰기에 이상적인 조건이었는데 마지막에 썼다.

### ptrace 제약은 서비스가 추적기를 실행하게 하면 우회된다

Ubuntu 기본 `ptrace_scope=1`에서는 **이미 돌고 있는 남의 프로세스에 붙을 수 없다.** systemd 서비스는 내 자손이 아니므로 `strace -p`가 막힌다. 그래서 처음에 추적을 포기하고 가설로 돌아갔는데, 방향을 뒤집으면 된다.

```ini
ExecStart=/usr/bin/strace -f -qq -s 300 -e trace=execve,chdir,exit_group,write \
  -o /tmp/strace.log %h/.local/bin/gitlab-runner run --working-directory %h/.gitlab-runner
```

**서비스가 strace를 실행하고 strace가 대상을 실행하면** 대상이 추적기의 자식이 되어 제약이 사라진다. 결과는 즉시였다.

```
execve("/usr/bin/bash", ["bash", "-l"]) = 0
execve("/usr/bin/clear_console", ["/usr/bin/clear_console", "-q"]) = 0
exit_group(1)
```

### 정확하지만 불완전한 안내가 범위를 좁힌다

러너의 오류 메시지는 `shells/#shell-profile-loading` 문서를 안내했다. 그래서 `/etc/profile`, `~/.profile`, `/etc/profile.d/*`를 전부 검사했고 — 전부 정상이었다.

원인은 **`~/.bash_logout`**, 즉 종료 훅이었다. "프로파일"이라는 단어가 시작 파일만 떠올리게 해서 종료 경로를 아예 후보에 넣지 않았다.

안내가 틀린 것은 아니다. `.bash_logout`도 로그인 셸이 읽는 파일이니 넓게는 맞다. **그러나 정확하지만 불완전한 안내는 아무 안내가 없는 것보다 위험하다** — 탐색 범위를 좁혀놓고 그 범위가 옳다고 믿게 만든다. 로그인 셸은 **시작과 종료 양쪽에 훅이 있다.**

## Decision
워크어라운드(포그라운드 실행)를 거부하고 근본 원인을 계속 찾았다. 내가 먼저 워크어라운드를 제안했고, 사용자가 거부한 판단이 옳았다.

> "개발 환경과 러너 환경이 다르다고 러너 환경에서 검증이 안 되면 내 로컬에서만 동작하는 무언가가 되는 거잖아."

**도구의 존재 이유가 어떤 의존성을 제거하는 것이라면, 그 의존성을 다시 들여오는 워크어라운드는 도구를 무효화한다.** CI의 목적이 "환경 차이를 잡는 것"인데 그 CI가 특정 환경(내 대화형 셸)에 의존하면 남는 것이 없다.

그리고 이 버그는 **Ubuntu 기본 `~/.bash_logout`** 때문이라 누가 Linux 러너를 붙여도 재현된다. 워크어라운드는 그 사람에게도 같은 조사를 반복시켰을 것이다. 재현되는 범위가 넓을수록 근본 해결의 값이 커진다.

**전환 조건**: 원인이 상용 도구 내부에 있어 수정할 수 없고, 벤더 수정까지 기다려야 한다면 워크어라운드가 정당하다. 그때는 워크어라운드임을 문서에 명시하고 전환 조건을 적는다.

## Related
- [[Linux CPU 폭주 디버깅 패턴 - 배제법과 GPU 교차검증]] — 배제법이 통한 사례. 관측 비용이 낮았다는 점이 이번과의 차이
- [[Some process state is computed by the child so copying the environment cannot reproduce it]] — 이번에 찾아낸 실제 원인의 메커니즘
- [[하드웨어-증상을-시스템-신호로-디버깅하는-방법론]] — 증상을 관측 가능한 신호로 바꾸는 접근
- [[Gate only the path that needs verification instead of imposing a team-wide convention]] — 이 러너를 도입한 CI 설계
- [[Defensive error handling converts porting bugs into silent feature loss]] — 오류가 진단 정보를 잃는 다른 형태
