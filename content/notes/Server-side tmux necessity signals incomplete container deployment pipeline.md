---
created: 2026-05-27
updated: 2026-05-27
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - tmux
  - docker
  - k3s
  - deployment
  - devops
publish: true
---

## Context

tmux + Neovim dotfiles를 서버에 pull해서 쓸 수 있는지 논의하다, k3s/Docker/CI-CD 워크플로우에서는 서버에 개발 도구가 필요한지 의문이 생겼다. k3s 이전 시대에 서버가 작업 환경과 실행 환경을 동시 수행할 때는 tmux가 매우 유용했다는 역사적 맥락도 함께.

## Insight

### 서버에서 tmux 필요 여부는 배포 파이프라인 성숙도의 지표다

tmux의 핵심 가치는 "SSH가 끊겨도 세션이 살아있다"는 것이다. 이 가치가 빛나는 전제는 서버에서 장시간 작업하는 상황이다.

- **전통적 서버**: 편집·빌드·실행 모두 서버에서 → 서버 = 작업 환경 + 실행 환경 → tmux 필수
- **컨테이너 워크플로우**: 편집은 로컬, 서버는 실행만 → SSH 접속은 짧고 산발적 → 서버에서 tmux 불필요

### 파이프라인이 실제로 작동해야만 성립한다

Docker/k3s/CI-CD가 제대로 갖춰지지 않은 상태에서 서버의 개발 도구를 걷어내면 전체가 꼬인다. 배포 파이프라인이 실행 환경을 온전히 소유할 때만 서버에서 개발 도구가 불필요해진다.

서버에 tmux·Neovim이 여전히 필요하다는 신호 = 컨테이너 배포 파이프라인이 아직 미완성이라는 진단이기도 하다.

### tmux가 여전히 살아있는 곳: 로컬 개발 환경

서버 여부와 무관하게 로컬에서는 유용하다. 세션 레이아웃 분할, 재부팅 후 복원 등 경험 품질 향상은 배포 방식에 영향받지 않는다.

## Related

- [[Terminal emulators render text streams locally while multiplexers persist sessions on the host]] — tmux/터미널 구조 개념
- [[Docker and Ansible over k3s until edge scale justifies HA overhead]] — 배포 구조 선택 맥락
