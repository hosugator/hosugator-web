---
created: 2026-05-07
updated: 2026-05-07
type: insight
status: 2-stable
subject: "[[OS]]"
project: "[[AOI]]"
tags:
  - linux
  - wayland
  - fcitx5
  - ime
  - korean
  - locale
publish: true
---
## problem
X11에서 Wayland로 전환 시 fcitx5 한글 입력이 깨지는 가장 흔한 원인은 `GTK_IM_MODULE=fcitx`의 무조건 설정과 `ko_KR.UTF-8` 로케일 미설치다.
GTK4는 Wayland에서 `text-input-v3` 프로토콜로 IME와 직접 통신한다. `GTK_IM_MODULE`을 강제 설정하면 이 경로를 무시하고 GTK3 방식의 직접 연결을 시도하는데, GTK4/Wayland에서는 제대로 동작하지 않아 입력이 깨진다.

## decision

### 1. 환경변수 설정 원칙

| 변수 | X11 | Wayland | 이유 |
|------|-----|---------|------|
| `GTK_IM_MODULE=fcitx` | ✅ 필요 | ❌ 제거 | GTK4는 Wayland 프로토콜로 자체 처리 |
| `QT_IM_MODULE=fcitx` | ✅ 필요 | ❌ 제거 | Qt6도 동일 |
| `XMODIFIERS=@im=fcitx` | ✅ 필요 | ✅ 필요 | fcitx5가 자신을 찾는 범용 힌트 |

### 2. 올바른 조건부 설정 패턴 (~/.zshrc, ~/.profile)
```bash
if [ "$XDG_SESSION_TYPE" = "x11" ]; then
    export GTK_IM_MODULE=fcitx
    export QT_IM_MODULE=fcitx
fi
export XMODIFIERS=@im=fcitx
```

### 3. 환경변수 오염 제거 위치
`GTK_IM_MODULE`이 여러 곳에 중복 설정될 수 있다:
- `/etc/environment` — 시스템 전역, 세션 프로토콜 무관하게 적용됨 → **무조건 제거**
- `~/.profile` — bash 로그인 쉘 → 조건부 처리
- `~/.zshrc` → 조건부 처리
- 앱별 env 설정(예: Ghostty config의 `env =`) → 조건부 처리 또는 제거

### 4. 한글 입력 깨짐 증상별 원인

| 증상 | 원인 | 해결 |
|------|------|------|
| 터미널에서 커밋 문자가 `?`로 출력 | `ko_KR.UTF-8` 로케일 미설치 | `sudo apt install language-pack-ko` |
| IME 전환은 되나 글자가 `<ffffffff>`로 표시 | preedit 프로토콜 불일치 | 터미널 앱 재시작, GTK_IM_MODULE 확인 |
| GTK 앱에서 한글 입력 안 됨 | `GTK_IM_MODULE` 강제 설정으로 Wayland 경로 차단 | 해당 변수 제거 |
| fcitx5 트리거 키 작동 안 함 | 키심 불일치 | 트리거 키가 실제 키심과 일치하는지 확인 |

## result

**근본 원인**: `GTK_IM_MODULE=fcitx`가 `/etc/environment`에 무조건 설정되어 있었던 것. GTK4는 Wayland에서 `text-input-v3` 프로토콜로 IME와 직접 통신하는데, 이 변수가 그 경로를 차단하고 GTK3 방식을 강제해 입력이 깨졌다.

**디버깅 경로**:
1. `echo $XDG_SESSION_TYPE`으로 현재 세션이 wayland임을 확인
2. `GTK_IM_MODULE`이 설정된 위치를 `/etc/environment` → `~/.profile` → `~/.zshrc` → 앱별 설정 순으로 탐색
3. `/etc/environment`에 무조건 설정된 것을 발견 → 세션 프로토콜 무관하게 항상 적용되는 것이 원인으로 특정

**해결**:
- `/etc/environment`에서 `GTK_IM_MODULE`, `QT_IM_MODULE` 제거
- `~/.zshrc`에 `XDG_SESSION_TYPE` 기반 조건부 분기 적용
- `sudo apt install language-pack-ko`로 `ko_KR.UTF-8` 로케일 설치

**결과**: Wayland 세션에서 fcitx5 한글 입력 정상 동작. X11 세션에서도 조건부 분기로 기존과 동일하게 동작.

## related
- [[Linux 키보드 리매핑 계층 - hwdb xkb xmodmap 비교]] — Caps Lock을 Hangul 키심으로 리매핑하는 방법
- [[Ubuntu X11 Caps Lock 한글 리매핑 패턴 (fcitx5)]] — X11 시절 설정과의 비교
- [[snap 패키지 샌드박스 제약과 대안 선택 기준]] — snap 앱에서 env 설정 방식