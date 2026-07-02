---
created: 2026-05-07
updated: 2026-05-07
type: insight
status: 3-superseded
subject: "[[Software]]"
project: "[[Self-development in 2026]]"
tags:
  - linux
  - x11
  - xmodmap
  - tty
  - dbus
  - gnome
  - fcitx5
  - korean-input
publish: true
---

# X11 xmodmap 리매핑 휘발 문제 - TTY 전환과 세션 재개 패턴

## 핵심 문제

xmodmap으로 설정한 키 리매핑은 **X 서버 세션에 종속**된다. GNOME settings daemon이 XKB를 재초기화하는 이벤트가 발생하면 리셋된다.

TTY 전환(`Ctrl+Alt+F3` → `Ctrl+Alt+F2`)이 대표적인 트리거다.

```
TTY 전환 복귀
  → GNOME settings daemon이 XKB 재초기화
  → keycode 66 = VoidSymbol (gsettings caps:none 기준)
  → xmodmap Hangul 리매핑 소실
```

## xmodmap 리셋 트리거 목록

| 트리거 | 설명 |
|---|---|
| TTY 전환 후 복귀 | gnome-settings-daemon XKB 재초기화 |
| `setxkbmap` 실행 | xmodmap 전체 초기화 |
| X 서버 재시작 | 세션 자체 초기화 |
| 일부 앱의 XKB 직접 조작 | 드문 케이스 |

## 진단 명령어

```bash
# 현재 keycode 66 매핑 상태 확인
xmodmap -pke | grep " 66 "

# 감시 스크립트 실행 여부 확인
ps aux | grep hangul-remap-watch | grep -v grep

# 세션 신호 실시간 모니터링
gdbus monitor --system --dest org.freedesktop.login1

# 스크립트 동작 로그 확인
cat /tmp/hangul-watch.log
```

## 해결 시도 흐름

### 시도 1: GNOME ScreenSaver DBus 감지 (실패)

- **실패 이유**: TTY 전환은 ScreenSaver 이벤트를 발생시키지 않음

### 시도 2: 폴링 방식 (동작하지만 비효율)

```bash
while true; do
    mapped=$(xmodmap -pke 2>/dev/null | grep "keycode  66 " | grep -c "Hangul")
    [ "$mapped" -eq 0 ] && xmodmap -e "keycode 66 = Hangul" 2>/dev/null
    sleep 2
done
```

### 시도 3: dbus-monitor --system (실패)

- **실패 이유**: 일반 사용자는 시스템 버스 전체 도청 권한 없음 (`AccessDenied`)
- `dbus-monitor`는 전체 버스를 도청하는 방식 → 정책상 차단
- `gdbus`는 특정 서비스의 특정 경로만 구독 → 허용됨

### 시도 4: 특정 세션 경로 gdbus 감지 (실패)

```bash
gdbus monitor --system --dest org.freedesktop.login1 \
  --object-path /org/freedesktop/login1/session/_2
```

- **실패 이유**: `loginctl list-sessions`가 반환한 세션 ID(2)와 실제 x11 세션의 DBus 경로(_32)가 달랐음
- TTY 전환 시 별도 세션이 생성되며 ID가 부팅마다 변동

### 시도 5: 전체 login1 gdbus 감지 + 파이프 버퍼링 해결 (실패)

```bash
gdbus monitor --system --dest org.freedesktop.login1 | while read -r line; do ...
```

- **실패 이유**: 파이프 연결 시 gdbus 출력이 Full buffered로 전환되어 즉시 전달 안 됨
- `stdbuf -oL`로 Line buffered 강제 적용하여 해결

### 시도 6: 타이밍 문제 (실패 → 최종 해결)

- xmodmap 실행은 됐으나(`MATCHED` 로그 확인) GNOME이 그 직후 XKB를 다시 덮어씀
- `sleep 0.5` → GNOME 초기화보다 먼저 실행되어 덮어써짐
- **해결**: xmodmap을 1초 간격으로 3회 반복 실행하여 GNOME 초기화 완료 후에도 적용

## 최종 해결 스크립트

```bash
#!/bin/bash
xmodmap -e "keycode 66 = Hangul" 2>/dev/null

stdbuf -oL gdbus monitor --system --dest org.freedesktop.login1 2>/dev/null | \
while IFS= read -r line; do
    if [[ "$line" == *"Session"* ]] && [[ "$line" == *"Active"* ]] && [[ "$line" == *"true"* ]]; then
        sleep 1 && xmodmap -e "keycode 66 = Hangul" 2>/dev/null
        sleep 1 && xmodmap -e "keycode 66 = Hangul" 2>/dev/null
        sleep 1 && xmodmap -e "keycode 66 = Hangul" 2>/dev/null
    fi
done
```

## 핵심 개념 정리

| 개념 | 역할 |
|---|---|
| **xmodmap** | X11 키코드 → 키심 런타임 재매핑. 세션 영구 적용 아님 |
| **autostart .desktop** | GNOME 로그인 시에만 실행. TTY 복귀에는 트리거 안 됨 |
| **logind (loginctl)** | systemd 세션 관리자. TTY 전환 시 세션 Active 상태 변경 |
| **DBus --session** | 사용자 세션 버스 (GNOME, fcitx5 등) |
| **DBus --system** | 시스템 전체 버스 (logind, udev 등) |
| **dbus-monitor** | 버스 전체 도청 방식 → 일반 사용자 권한 차단 |
| **gdbus monitor** | 특정 서비스/경로 구독 방식 → 허용됨 |
| **stdbuf -oL** | 파이프 연결 시 Line buffered 강제. 즉시 전달 보장 |
| **IFS=** | read 시 앞뒤 공백 제거 방지. 줄 전체를 그대로 읽음 |
| **2>/dev/null** | stderr 버림 |
| **2>&1** | stderr를 stdout으로 합쳐서 파이프/파일로 전달 |

## 관련 노트

- [[Ubuntu X11 Caps Lock 한글 리매핑 패턴 (fcitx5)]]
- [[Linux 개발환경 dotfiles 부트스트랩 구조 패턴]]
