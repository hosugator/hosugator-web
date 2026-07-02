---
created: 2026-05-27
updated: 2026-05-27
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - terminal
  - tmux
  - ghostty
  - ssh
  - cli
publish: true
---
## Context
Ghostty + tmux 조합을 사용하는 상황에서 각 도구의 역할과 서버 환경에서의 동작 방식을 정확히 이해하지 못한 채 쓰고 있었다. Windows 환경에서의 대응 도구를 찾다가 근본 개념을 정리하게 됐다.

## Insight
### 터미널 에뮬레이터는 물리적 터미널 하드웨어의 소프트웨어 대체다

1960-70년대 메인프레임 시대의 "터미널"은 입출력 전용 하드웨어 장치(키보드+모니터)였다. 연산은 메인프레임이 하고 터미널은 입력/출력만 담당. Ghostty 같은 현대 터미널 에뮬레이터는 이 역할을 소프트웨어로 흉내 낸 것이다.

### Ghostty는 GUI 앱이고 tmux는 CLI 프로그램이다

- **Ghostty**: OS에 네이티브 창을 요청한다 → 디스플레이 서버 없이 실행 불가 → GUI 앱
- **tmux**: 텍스트 스트림만 처리, OS 창 불필요 → 디스플레이 없는 서버에서도 실행 가능

안에 보이는 내용이 텍스트여도 **창을 OS에 요청하는 순간 GUI 앱**이다.

### SSH 환경에서의 역할 분리

```
서버 (화면 없음)
  └── tmux + Neovim → 텍스트 데이터 생성
        ↓ SSH (네트워크로 전송)
로컬 Ghostty
  └── 받은 텍스트 데이터를 GPU로 렌더링 → 화면에 표시
```

서버는 화면이 없어도 된다. 텍스트 데이터를 생성해서 SSH로 보내면, 로컬 터미널 에뮬레이터가 화면에 띄워준다.

### tmux는 교체 불가, Ghostty는 교체 가능

- tmux 없으면: 터미널 종료 시 세션 소멸, 서버 세션 유지 불가 → 작업 흐름 변경
- Ghostty 없으면: macOS Terminal.app이나 iTerm2로 동일 작업 가능 → 렌더링 품질 차이만

Ghostty의 가치는 GPU 가속, 폰트 렌더링, 반응속도 등 **경험 품질**이지 기능 자체가 아니다.

### 서버에는 tmux + Neovim만 설치하면 충분하다

Ghostty는 로컬 전용(GUI). 서버에는 CLI 도구만 설치 가능하고 필요하다.

```
로컬: Ghostty (창) + tmux (세션)
서버: tmux (세션) + Neovim (편집)
```

## Related

- [[CLI literacy for AI supervision means reading flow not memorizing syntax]] — CLI 흐름을 이해하는 것이 도구 구조 파악의 전제
- [[Using vim-tmux-navigator for unified pane navigation]] — tmux 실전 활용
