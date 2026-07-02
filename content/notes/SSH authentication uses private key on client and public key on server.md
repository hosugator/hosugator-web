---
created: 2026-06-09
updated: 2026-06-10
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - ssh
  - security
  - authentication
publish: true
---
## Context
현장 서버에 원격 접속하는 방법을 논의하면서 SSH 키 구조를 처음으로 명확히 이해했다. GitHub SSH는 GUI로 등록했지만 실제 동작 원리는 파악하지 못했다.

## Insight
### SSH 키는 개발자가 생성하고 공개키만 서버로 이동한다

```
개발자 컴퓨터에서 키 생성
  → 개인키: ~/.ssh/id_ed25519       (절대 이동 금지)
  → 공개키: ~/.ssh/id_ed25519.pub   (서버에 등록)

서버: ~/.ssh/authorized_keys에 공개키 텍스트 추가
```

### 인증 흐름은 자물쇠(공개키)와 열쇠(개인키) 구조다

```
ssh user@서버IP
  → 서버: authorized_keys의 공개키와 매칭되는 개인키를 가지고 있는가?
  → 개발자 컴퓨터: 개인키로 증명
  → 인증 성공
```

### 단일 키 재사용은 폐기 단위를 망가뜨린다

GitHub 키가 탈취되면 서버 접근도 차단해야 하고, 특정 서버 권한만 회수하려 해도 다른 곳까지 끊긴다. 키를 용도별로 분리해야 폐기 범위를 최소화할 수 있다.

```
~/.ssh/
  id_ed25519_github       ← GitHub 전용
  id_ed25519_prod         ← 운영 서버 전용
  id_ed25519_dev          ← 개발 서버 전용
```

### SSH config는 커스텀 키 이름을 호스트에 자동 매핑하는 편의 레이어다

SSH는 기본 키 파일명(`id_ed25519`, `id_rsa`)만 자동 시도한다. 용도별로 키 이름을 커스텀하면 매 접속마다 `-i` 플래그로 키를 명시해야 한다. `~/.ssh/config`는 이 매핑을 사전에 등록해서 생략 가능하게 만든다.

```
# config 없음
명령어: ssh -i ~/.ssh/id_ed25519_prod ubuntu@192.168.1.10

# config 있음
Host prod-server
    HostName 192.168.1.10
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519_prod
명령어: ssh prod-server
```

## Related
- [[Edge deployment separates control plane connectivity from worker node internet access]] — SSH로 Control Plane에 원격 접속하는 맥락
- [[GitHub repository security has two independent axes account protection and device cleanup]] — GitHub 접근 보안에서 기기별 키 관리와 연결