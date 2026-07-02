---
created: 2026-05-07
updated: 2026-05-08
type: insight
status: 2-stable
subject: "[[OS]]"
project: "[[AOI]]"
tags:
  - linux
  - keyboard
  - wayland
  - xkb
  - udev
  - korean
publish: true
---
## problem
Linux 키 리매핑은 커널부터 디스플레이 서버까지 여러 계층에서 가능하다. 
Wayland 전환 시 상위 계층(xmodmap, 일부 XKB)이 동작하지 않아 하위 계층(hwdb)으로 내려가야 한다.
- xmodmap은 X11 레이어에서만 작동해 Wayland에서 무시된다. 
- XKB 커스텀 옵션은 rules 파일에 등록된 것만 GNOME이 인식한다. 
이 두 방법이 막히면 커널 입력 레이어인 hwdb가 유일한 디스플레이 서버 독립적 해결책이다.

## decision

### 1. 리매핑 계층 구조

```
물리 키 입력
    ↓
[1] hwdb (udev) — 스캔코드 → 키코드 변환, 커널 레벨
    ↓
[2] XKB — 키코드 → 키심(keysym) 변환, 디스플레이 서버 레벨
    ↓
[3] xmodmap — X11 전용, XKB 위에서 키심 재정의
    ↓
앱 수신
```

### 2. 방법별 비교

| 방법 | 계층 | X11 | Wayland | 재로그인 필요 | 특이사항 |
|------|------|-----|---------|-------------|---------|
| `hwdb` | 커널 | ✅ | ✅ | ❌ (`udevadm trigger`) | 가장 범용적 |
| `XKB options` | 디스플레이 | ✅ | ✅ | ✅ | rules 파일 등록된 옵션만 |
| `xmodmap` | X11 | ✅ | ❌ | ❌ | Wayland에서 완전 무시 |

### 3. hwdb로 Caps Lock → Hangul 리매핑

```
# /etc/udev/hwdb.d/90-hangul-caps.hwdb

# AT/PS2 내장 키보드 (스캔코드 0x3a = Caps Lock)
evdev:atkbd:*
 KEYBOARD_KEY_3a=hangeul

# USB 키보드 (HID usage 0x70039 = Caps Lock)
evdev:input:b0003v*p*e*
 KEYBOARD_KEY_70039=hangeul
```

적용:
```bash
sudo systemd-hwdb update && sudo udevadm trigger
```

### 4. hwdb 적용 후 fcitx5 설정
hwdb가 Caps Lock을 `KEY_HANGEUL`(= `Hangul` 키심)로 바꾸므로:
- fcitx5 트리거: `Caps_Lock` ❌ → `Hangul` ✅
- xkb-options: `caps:none` **불필요** — hwdb가 scancode를 커널에서 완전히 교체하므로 XKB/gsettings 레벨에 Caps Lock keycode 자체가 도달하지 않음. Lock 모디파이어가 활성화될 여지가 없다.

### 5. XKB 커스텀 옵션이 동작하지 않는 이유
`gsettings xkb-options`에 `custom_file(group_name)` 형식을 넣어도 GNOME은 이를 무시한다. XKB options는 `/usr/share/X11/xkb/rules/evdev.lst`와 `evdev.xml`에 등록된 이름만 인식하기 때문이다. 심볼 파일만 만들고 rules에 등록하지 않으면 적용되지 않는다.

## related
- [[Wayland IME 환경변수 설정 패턴 - fcitx5 X11 Wayland 분기]] — 리매핑 후 fcitx5 설정
- [[X11 xmodmap 리매핑 휘발 문제 - TTY 전환과 세션 재개 패턴]] — xmodmap의 한계와 이 노트의 배경
- [[Linux CPU 폭주 디버깅 패턴 - 배제법과 GPU 교차검증]] — Wayland 전환 동기
