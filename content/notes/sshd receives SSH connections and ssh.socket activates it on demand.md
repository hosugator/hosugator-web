---
created: 2026-06-12
updated: 2026-06-12
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - ssh
  - linux
  - systemd
publish: true
---
## Context
맥북에서 리눅스 머신으로 SSH 접속을 준비하던 중 `/etc/ssh/sshd_config`가 없다는 오류가 발생했다. SSH 서버 데몬이 설치되지 않은 상태였다.

## Insight
### sshd가 없으면 포트 22에서 대기하는 프로세스가 없어 접속이 거절된다

SSH는 클라이언트(`ssh`)와 서버(`sshd`)로 분리된다.

- `ssh` — "저 서버에 접속할게요" (클라이언트)
- `sshd` — "들어오는 SSH 접속을 받을게요" (서버)

`sshd`가 없으면 포트 22를 열어두는 프로세스가 없어서 클라이언트가 연결을 시도해도 거절된다. `openssh-server` 패키지 설치로 해결한다.

### ssh.socket은 sshd를 항상 켜두지 않고 첫 요청 시에만 깨운다

Ubuntu는 기본으로 `ssh.socket` 방식을 사용한다. systemd가 포트 22를 대기하다 접속 요청이 오면 그때 `sshd`를 시작한다. 접속 결과는 항상-켜두는 방식과 동일하나 평소 메모리를 소비하지 않는다.

```
systemctl status ssh
# Active: inactive (dead)
# TriggeredBy: ● ssh.socket   ← 이 줄이 있으면 socket 방식, 접속 가능
```

`Active: inactive`가 나와도 `TriggeredBy: ssh.socket`이 있으면 정상이다.

## Related
- [[SSH authentication uses private key on client and public key on server]] — sshd가 뜬 후 공개키 인증 흐름
- [[Tailscale over port forwarding when corporate firewall blocks inbound SSH]] — Tailscale IP로 sshd에 접속하는 전체 흐름
