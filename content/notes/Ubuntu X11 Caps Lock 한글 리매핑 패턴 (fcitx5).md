---
created: 2026-05-06 14:53
updated: 2026-05-08
status: 3-superseded
type: insight
subject: "[[Software]]"
project: "[[AOI]]"
tags:
  - linux
  - fcitx5
  - xmodmap
  - korean-input
  - x11
  - gnome
  - xkb
publish: true
---

# Ubuntu X11 Caps Lock 한글 리매핑 패턴 (fcitx5)

> **이 결정은 [[Linux 키보드 리매핑 계층 - hwdb xkb xmodmap 비교]]로 대체됨 (2026-05-08)**
> xmodmap+caps:none 방식은 hwdb 기반 구조로 완전히 교체. caps:none은 hwdb가 scancode를 커널에서 교체하므로 불필요함이 확인됨.

## 개념 지도

| 개념 | 역할 |
|---|---|
| **xkb** | X11의 키보드 레이아웃 시스템. 키코드 → 키심 매핑 규칙 정의 |
| **keycode** | 물리 키의 고유 번호. Caps Lock = keycode 66 |
| **keysym** | 키가 보내는 논리 신호. `Caps_Lock`, `Hangul`, `a`, `Return` 등 |
| **xmodmap** | xkb 위에서 개별 키를 런타임으로 재매핑하는 도구 |
| **Hangul keysym** | 한국어 키보드 전용 한/영 전환 신호. fcitx5가 이것을 감지 |
| **fcitx5 trigger** | fcitx5가 한/영 전환을 실행하는 keysym 조건 |
| **gsettings** | GNOME 설정 저장소. xkb 옵션도 여기서 관리됨 |

## 핵심 문제: GNOME 설정 데몬의 xmodmap 덮어쓰기

로그인 시 `gnome-settings-daemon`이 gsettings 기반으로 xkb를 초기화하면서 xmodmap 리매핑을 무효화한다.

```
로그인
  → GNOME 설정 데몬 실행
  → gsettings 기반 xkb 초기화 → keycode 66 = Caps_Lock (복원)
  → autostart xmodmap 실행 → keycode 66 = Hangul
  → GNOME이 다시 덮어씀 ← 여기서 실패
```

## 해결: gsettings로 GNOME에 caps:none 등록

GNOME에게 먼저 "Caps Lock은 아무것도 아님"을 등록하면, 초기화 시 keycode 66 = `VoidSymbol`로 세팅된다. 그 위에 xmodmap으로 Hangul을 올리면 유지된다.

```bash
gsettings set org.gnome.desktop.input-sources xkb-options "['caps:none']"
```

```
로그인
  → GNOME 설정 데몬: caps:none 적용 → keycode 66 = VoidSymbol
  → autostart: xmodmap → keycode 66 = Hangul ✓ (유지됨)
```

## 최종 구성

### 1. gsettings 등록 (1회)

```bash
gsettings set org.gnome.desktop.input-sources xkb-options "['caps:none']"
```

### 2. GNOME autostart

`~/.config/autostart/hangul-remap.desktop`:

```ini
[Desktop Entry]
Type=Application
Name=Hangul Key Remap
Exec=bash -c 'sleep 3 && xmodmap -e "keycode 66 = Hangul"'
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
```

### 3. fcitx5 트리거 설정

`~/.config/fcitx5/config`:

```ini
[Hotkey/TriggerKeys]
0=Hangul
```

## 최종 작동 흐름

```
물리 Caps Lock 키 누름
  → keycode 66 발생
  → xmodmap: "66 = Hangul"
  → X11이 Hangul keysym 전달
  → fcitx5: "Hangul 감지 → 한/영 전환"
```

## 주의사항

- 대문자 입력은 `Shift` 키로 처리 (Caps Lock 대문자 고정 기능 제거됨)
- `setxkbmap` 실행 시 xmodmap 리셋 발생 → gsettings 방식으로 대체
- X11 세션 기준; Wayland는 별도 접근 필요
- dotfiles 관리: install.sh에서 gsettings 명령 포함, autostart는 심볼릭 링크

## 관련 노트

- [[Linux 개발환경 dotfiles 부트스트랩 구조 패턴]]
- [[snap 패키지 샌드박스 제약과 대안 선택 기준]]
