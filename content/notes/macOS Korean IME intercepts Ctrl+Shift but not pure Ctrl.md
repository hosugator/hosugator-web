---
created: 2026-05-27
updated: 2026-05-27
type: insight
status: 2-stable
subject: "[[OS]]"
project: "[[Self-development in 2026]]"
tags:
  - macos
  - ime
  - keyboard
  - karabiner
  - ghostty
publish: true
---

## Context

Ghostty+tmux 환경에서 Ctrl+Shift+hjkl 단축키를 한글 IME 모드에서 누르면 아무 반응이 없었다.
같은 키 조합이 Linux(Ubuntu+fcitx5)에서는 한글 모드에서도 정상 동작했던 것과 대비됨.
[[Ctrl key combinations bypass IME on Linux]] 에서는 "Ctrl 기반 키는 IME를 bypass한다"고 정리했지만, macOS에서는 달랐다.

## Insight

### macOS Korean IME는 Shift+letter 조합을 Ctrl 유무에 관계없이 가로챈다

macOS의 한국어 IME는 Apple TSM(Text Services Manager) 레이어에서 동작한다.
TSM은 Shift+H 같은 조합을 보면 이를 한글 자모(ㅗ)로 변환 처리하는데, 앞에 Ctrl이 붙어 있어도 이 변환이 먼저 일어난다.
결과적으로 앱(Ghostty 포함)은 "Ctrl+Shift+H"가 아닌 "Ctrl+한글자모" 이벤트를 받거나, 아무 이벤트도 받지 못한다.

반면 **순수 Ctrl+letter**(Shift 없음)은 ASCII 제어 문자(0x01-0x1A)를 생성하며, TSM이 이를 언어 입력이 아닌 제어 신호로 간주해 변환하지 않는다.
→ Ctrl+h/j/k/l (pane 이동)은 한글 모드에서도 동작, Ctrl+Shift+h/j/k/l (창/세션 이동)은 동작 안 함.

### Ghostty의 `physical:` 키바인드 접두사도 macOS IME를 우회하지 못한다

Ghostty는 `physical:ctrl+shift+h` 형식으로 물리적 키 위치를 기반으로 바인드할 수 있다고 문서화되어 있으나, macOS에서는 Ghostty 자체가 이미 IME 처리를 거친 이벤트를 받기 때문에 효과가 없다. IME 변환은 OS 레벨, Ghostty 수신은 그 이후.

### HID 레벨에서 키를 가로채는 Karabiner-Elements만이 IME 이전에 개입할 수 있다

Karabiner는 IOKit HID 드라이버 레벨에서 동작한다. 이 레벨은 TSM(IME)보다 아래에 있어서, Karabiner가 키 이벤트를 리매핑하면 IME는 원래 키 이벤트를 아예 볼 수 없다.
→ Ctrl+Shift+H → Karabiner(HID) → Ctrl+F13 으로 바꾸면, IME는 F13 이벤트만 보고 변환하지 않는다.

## Verification

Karabiner로 Ctrl+Shift+H → Ctrl+F13 리매핑 후 `cat | xxd` 테스트:
- 한글 모드: Ctrl+F13 Ghostty 수신 확인 (new_tab 테스트로 검증)
- F-key는 IME 변환 대상이 아님을 확인
