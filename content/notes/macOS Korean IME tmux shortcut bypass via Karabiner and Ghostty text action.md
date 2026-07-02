---
created: 2026-05-27
updated: 2026-05-31
type: insight
status: 2-stable
subject: "[[OS]]"
project: "[[Self-development in 2026]]"
tags:
  - macos
  - ime
  - tmux
  - karabiner
  - ghostty
  - keybinding
publish: true
---

## Context

tmux 창/세션 이동 단축키 `Ctrl+Shift+h/l/j/k`를 macOS 한글 IME 모드에서도 동작시키려 했다.
Ubuntu(fcitx5)에서는 이미 동작 — macOS 전용 문제.
배경: [[macOS Korean IME intercepts Ctrl+Shift but not pure Ctrl]]

## Insight

### app 레벨 접근은 모두 실패한다 — HID 레벨만이 IME 이전에 개입 가능하다

시도한 방법과 실패 원인:

| 방법 | 실패 원인 |
|---|---|
| Ghostty `physical:ctrl+shift+h` | IME가 Ghostty보다 먼저 처리 — Ghostty는 변환된 이벤트를 받음 |
| `macos-option-as-alt` + Alt+hjkl | Alt+letter도 macOS Korean IME가 가로챔 |
| Karabiner identity mapping (→ 그대로 재주입) | 재주입 키도 동일 파이프라인을 다시 통과해 IME가 다시 가로챔 |
| Ctrl+F9-F12 리매핑 | MacBook F10=음소거, F11=볼륨 다운, F12=볼륨 업 — 미디어 키 충돌 |
| Ctrl+F13 리매핑 → tmux `bind -n C-F13` | F13은 레거시 terminfo에 없음 → Ghostty가 PTY에 아무 바이트도 안 보냄 |

**진단 방법 — `new_tab` 테스트**: Ghostty에 `keybind = ctrl+f13=new_tab` 추가 후 Ctrl+Shift+H를 누르면 새 탭이 열림 → Karabiner 체인은 살아있음을 확인. 문제는 그 이후 Ghostty→PTY 구간이었다.

### Ghostty는 terminfo에 없는 F-key를 PTY로 전달하지 않는다

`cat | xxd`로 확인: Ctrl+F13은 레거시 터미널 인코딩에 시퀀스가 없으므로 Ghostty가 bytes를 전혀 보내지 않았다. `tmux-256color` terminfo도 kf13 이상 Ctrl 조합은 미정의.

해결책: Ghostty keybind에서 `text:` 액션으로 커스텀 시퀀스를 PTY에 직접 씀. tmux는 `user-keys`로 해당 시퀀스를 등록해 바인딩.

### tmux `if-shell` 한 줄 멀티커맨드는 세 번째부터 잘린다

```tmux
if-shell 'check' "cmd1; cmd2; cmd3"  # cmd3 미실행 확인됨 (tmux show-hooks -g로 검증)
```
훅 등록은 반드시 hook마다 별도 `if-shell` 줄로 분리해야 한다.

### 세션 전환 훅은 `after-switch-client`가 아닌 `client-session-changed`다

tmux 3.6에서 `after-switch-client`는 `show-hooks -g` 목록에 아예 없다 — 명령어에 대응하는 `after-*` 훅이 구현되지 않은 경우. 세션 전환 이벤트에는 `client-session-changed`를 써야 한다.

- `after-select-pane` → pane 이동
- `after-select-window` → 창 이동
- `client-session-changed` → 세션 전환

### MacBook 내장 키보드는 Karabiner가 grab해도 변환을 적용하지 않는다

Karabiner 로그에 `Apple Internal Keyboard hid queue value monitor is started (grabbed)`가 찍히더라도, `cat | xxd`로 확인하면 변환 결과가 아닌 원본 KKP가 나온다.

- 외부 키보드 한글 모드 → `\x1b[5001~` (Karabiner가 변환 ✓)
- 내장 키보드 영어 모드 → `\x1b[104;6u` (KKP Ctrl+Shift+h — 변환 없음)
- 내장 키보드 한글 모드 → `\x1b[12631;6u` (KKP Ctrl+Shift+ㅗ — IME가 먼저 변환)

12631 = U+3157 = `ㅗ` (두벌식 'h'). 한글 모드에서 KKP codepoint가 한글 자모 Unicode 값으로 바뀐다.

**한글 KKP를 tmux user-keys로 잡으려 했으나 실패**: `extended-keys on`의 KKP 파서가 user-keys 바이트 매칭보다 우선하므로 `\e[12631;6u`를 user-keys로 등록해도 발화하지 않는다.

**Ghostty keybind가 KKP 인코딩 이전에 개입할 수 있다**: IME 변환 후 Ghostty가 받는 이벤트는 `Ctrl+Shift+ㅗ`다. Ghostty keybind에서 한글 모음 문자를 직접 key name으로 사용할 수 있다.

```
keybind = ctrl+shift+ㅗ=text:\x1b[5001~  # h에 해당하는 한글 모음
keybind = ctrl+shift+ㅓ=text:\x1b[5002~  # j
keybind = ctrl+shift+ㅏ=text:\x1b[5003~  # k
keybind = ctrl+shift+ㅣ=text:\x1b[5004~  # l
```

이렇게 하면 외부 키보드(Karabiner → F13 경로)와 동일한 `\x1b[5001~`-`5004~`가 PTY에 전송되어 tmux User0-3 바인딩이 동일하게 발화한다.

## Decision

**4가지 경로가 동일한 tmux User0-3 바인딩에 수렴하도록 설계**

| 키보드 | 언어 | 경로 |
|---|---|---|
| 외부 | 한글 | Karabiner HID → Ctrl+F13 → Ghostty text: → `\x1b[5001~` |
| 외부 | 영어 | Karabiner HID → Ctrl+F13 → Ghostty text: → `\x1b[5001~` |
| 내장 MacBook | 영어 | KKP `\x1b[104;6u` → tmux `bind -n C-S-h` |
| 내장 MacBook | 한글 | IME h→ㅗ → Ghostty `ctrl+shift+ㅗ` keybind → `\x1b[5001~` |

내장 키보드 영어 모드는 `bind -n C-S-h` (KKP 경로), 나머지 3개는 User0-3 경로로 처리된다.

F13-F16을 선택한 이유: MacBook 키보드에 없는 키 → 미디어 키·시스템 단축키 충돌 없음.
`\x1b[5001~`-`5004~`: CSI 파라미터 5001-5004는 어떤 표준에도 정의되지 않아 충돌 없음.

Karabiner `to`에 `"modifiers": ["control"]` 명시 필수:
생략 시 물리적으로 눌린 Shift가 유지되어 Ctrl+Shift+F13이 주입됨.

**IME 자동 영어 전환**: macOS는 `im-select`(brew install daipeihust/tap/im-select), Linux는 `fcitx5-remote -c`. `command -v` 조건부로 플랫폼 자동 감지.

**Ubuntu 이중 바인딩**: `set -g extended-keys on` + `bind -n C-S-h/j/k/l` — KKP 직접 수신. macOS에서는 Karabiner가 먼저 가로채므로 충돌 없음.

**Ghostty 설정 분리**: `config.mac` / `config.linux` 완전 분리. 사용자 경험(Ctrl+Shift+hjkl)은 동일, 내부 배관만 플랫폼별로 다름.

## Consequences

- 외부 키보드/내장 키보드, 한글/영어 모드 모두에서 Ctrl+Shift+hjkl로 창/세션 이동 (macOS)
- 패널/창/세션 이동 시 IME 자동 영어 전환 (macOS: im-select, Linux: fcitx5-remote)
- Karabiner 시스템 권한(Input Monitoring + Accessibility + 특권 데몬) 필요
  - 재부팅 후 Input Monitoring 권한이 누락될 수 있음 — 누락 시 `/Library/Application Support/org.pqrs/Karabiner-Elements/Karabiner-Core-Service.app`을 수동 추가
- tmux 2.6+ 필요 (user-keys 지원)

## Related

- [[macOS Korean IME intercepts Ctrl+Shift but not pure Ctrl]] — 근본 원인 분석
- [[Using vim-tmux-navigator for unified pane navigation]] — 전체 이동 체계 맥락
