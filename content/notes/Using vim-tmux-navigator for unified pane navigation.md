---
created: 2026-05-20
updated: 2026-05-27
type: insight
status: 2-stable
subject: "[[Dotfiles]]"
project: "[[Self-development in 2026]]"
tags:
  - tmux
  - nvim
  - lazyvim
  - fcitx5
  - keybinding
  - ghostty
publish: true
---
## Context
tmux prefix + h/j/k/l 방식으로 페인 이동 시 두 가지 불편이 있었다.
1. 페인 이동마다 prefix를 눌러야 하는 번거로움
2. fcitx5 한글 모드에서 키가 IME에 가로채져 단축키가 먹히지 않음 (Ctrl 기반 키는 IME를 bypass함 → [[Ctrl key combinations bypass IME on Linux]])

## Decision
전체 이동 체계를 Ctrl+Shift 기반으로 계층화:

| 레이어 | 키 | 동작 |
|---|---|---|
| 페인/nvim 창 | Ctrl+h/j/k/l | vim-tmux-navigator (nvim ↔ tmux 경계 투명) |
| 윈도우 | Ctrl+Shift+h/l | tmux previous/next-window |
| 세션 | Ctrl+Shift+k/j | tmux switch-client (k=이전, j=다음) |

페인은 vim-tmux-navigator 플러그인, 윈도우·세션은 tmux `bind -n` (prefix 없음).

추가로 fcitx5 자동 영어 전환 설정:
- `after-select-pane` 훅: 페인 전환 시 `fcitx5-remote -c`
- `InsertLeave` autocmd: nvim insert 모드 종료 시 `fcitx5-remote -c`

**Ghostty Ctrl+Shift+j 충돌**: Ghostty가 이 키를 터미널 레벨에서 `write_screen_file` (화면을 `/tmp/...` 텍스트로 저장 후 경로 붙여넣기)로 선점한다. Claude Code나 nvim 등 앱 설정으로는 막을 수 없고, Ghostty config에서 unbind해야 한다.
```
keybind = ctrl+shift+j=unbind
```
결과적으로 세션 이동은 Ctrl+Shift+k(이전) 단방향만 사용 — 실용상 충분.

**macOS 한글 IME 문제**: 위 체계는 Ubuntu(fcitx5) 기준. macOS에서는 Korean IME가 Ctrl+Shift+letter를 가로채므로 별도 처리 필요.
→ [[macOS Korean IME tmux shortcut bypass via Karabiner and Ghostty text action]]

## Consequences
- prefix 없이 페인·윈도우·세션을 단일 Ctrl 체계로 이동 가능
- 한글 모드에서도 모든 키 정상 동작 (Ctrl 기반이므로 IME bypass)
- 페인 이동·insert 종료 시 자동 영어 전환으로 오타 방지
- neo-tree 열린 상태에서는 tmux 페인 경계를 넘지 못하는 한계 있음 (허용)
- Ghostty 기본 키바인딩이 tmux 설정보다 상위에서 작동함에 주의 — 충돌 시 Ghostty config에서 먼저 확인
