---
created: 2026-06-11
updated: 2026-06-12
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - ssh
  - network
  - tailscale
publish: true
---
## Context
회사 컴퓨터(Linux, 192.168.100.x 사설 IP)에 맥북에서 외부 SSH 접속이 필요했다. 게이트웨이가 SonicWall 방화벽이라 IT 관리자 권한 없이는 포트포워딩 설정이 불가능한 구조였다.

## Insight
### 기업 방화벽은 inbound를 막지만 outbound는 허용한다

포트포워딩은 외부 → 내부 방향(inbound)이라 방화벽 관리자 권한이 필요하다. Tailscale은 양쪽 기기가 모두 Tailscale 서버로 outbound 연결을 열어서 중계하는 방식이라 방화벽 설정 없이 NAT를 우회한다.

```
MacBook ──outbound──▶ Tailscale 서버 ◀──outbound── 회사 PC
```

P2P가 가능하면 직접 연결, 불가능하면 DERP 서버 경유.

## Decision
Tailscale을 선택했다. 포트포워딩(IT 관리자 필요), VPN(회사 인프라 필요) 대비 개인이 독립적으로 설정 가능하고 무료다.

**설치 후 설정:**

```bash
# 회사 컴퓨터 (Linux)
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
sudo systemctl enable --now tailscaled  # 부팅 시 자동 시작

# 맥북에서 공개키 복사 (최초 1회, 비밀번호 인증 필요)
ssh-copy-id user@100.x.x.x

# 이후 접속
ssh user@100.x.x.x  # Tailscale IP
```

**전환 조건**: 회사 IT 정책으로 Tailscale outbound가 차단되면 Cloudflare Tunnel 검토.

## Related
- [[SSH authentication uses private key on client and public key on server]] — MacBook 키를 회사 컴퓨터 authorized_keys에 등록해야 비밀번호 없이 접속 가능
- [[sshd receives SSH connections and ssh.socket activates it on demand]] — 서버에 sshd가 없으면 Tailscale IP로 접속해도 거절됨
- [[Docker and Ansible over k3s until edge scale justifies HA overhead]] — 회사 컴퓨터에 k3s, Docker 운영 중 — Tailscale IP로 원격 관리 가능