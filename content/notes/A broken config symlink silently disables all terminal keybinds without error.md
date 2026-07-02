---
created: 2026-05-31
updated: 2026-05-31
type: insight
status: 2-stable
subject: "[[Dotfiles]]"
project: "[[Self-development in 2026]]"
tags:
  - ghostty
  - dotfiles
  - symlink
  - debugging
publish: true
---
## Context
맥북에서 Ghostty 재부팅 후 Ctrl+Shift+hjkl 단축키가 동작하지 않았다. Karabiner 권한, 크래시 등 여러 원인을 디버깅했으나 해결되지 않았다. `ghostty +list-keybinds`로 확인하니 커스텀 keybind가 하나도 적용되지 않은 상태였다.

## Insight
### 근본 원인: 심링크가 가리키는 경로가 플랫폼 종속 절대경로로 하드코딩되어 있었다

```
~/.config/ghostty/config
  → /home/hosugator/.dotfiles/config/ghostty/config.linux
     ↑ Linux 절대경로
```

### Ghostty는 config 로드 실패 시 아무 에러 없이 기본값으로 동작한다
dead symlink여도 에러 메시지 없이 조용히 기본 설정으로 시작한다. 단축키가 안 먹히는 증상이 나오기 전까지 원인을 알 수 없다.
```bash
ghostty +list-keybinds | grep -E "f13|shift\+j"
# 아무것도 안 나오면 config 미로드 상태
```

### 디렉토리 심링크 방식은 순환 참조 위험이 있다
```
~/.config/ghostty        → ~/.dotfiles/config/ghostty/   (디렉토리 심링크)
~/.dotfiles/.../config   → ~/.config/ghostty/config      (다시 위를 가리킴)
```
이렇게 되면 `~/.config/ghostty/config` → `~/.dotfiles/.../config` → `~/.config/ghostty/config` → 무한 반복. OS가 "Too many levels of symbolic links" 에러로 접근을 차단한다.
macOS install.sh를 Linux 머신에서 실행했을 때 이 패턴이 발생했다. Ghostty가 자동생성 파일(`auto/`, `config.ghostty`)을 dotfiles 디렉토리에 직접 기록하는 오염도 함께 발생한다.

### 해결 원칙: 파일 단위 심링크 + 플랫폼 분기는 install.sh가 담당
```
# install.sh
if linux:  ln -sf ~/.dotfiles/.../config.linux ~/.config/ghostty/config
if macos:  ln -sf ~/.dotfiles/.../config.mac   ~/.config/ghostty/config
```
디렉토리 전체를 심링크하지 않고, 파일 하나씩 연결한다. 플랫폼별 경로 차이는 dotfiles 안에서 해결하지 않고 install.sh가 실행 시점에 결정한다.

## Related
- [[macOS Korean IME tmux shortcut bypass via Karabiner and Ghostty text action]] — 이 문제가 발견된 맥락
- [[Ghostty crashes on yazi PDF preview inside tmux]] — 같은 날 발생한 Ghostty 관련 이슈