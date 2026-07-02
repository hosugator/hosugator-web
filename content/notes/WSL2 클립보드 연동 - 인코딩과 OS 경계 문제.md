---
created: 2026-04-28 11:49
updated: 2026-04-28 11:49
type: insight
status: 1-draft
subject: "[[CS]]"
project: "[[Edge AI LMR]]"
tags:
  - wsl2
  - clipboard
  - encoding
  - tmux
  - windows
  - linux
publish: true
---
## 핵심 원칙

WSL2와 Windows는 같은 하드웨어 위에서 돌아가는 두 개의 별개 OS다.  
클립보드도 마찬가지로 각자 따로 존재하기 때문에, "연결"을 명시적으로 만들어줘야 한다.

---

## 클립보드가 뭔가

프로그램들이 텍스트나 이미지를 임시로 공유하는 OS가 관리하는 공용 메모장이다.

```
메모장에서 Ctrl+C
    → OS 클립보드에 텍스트 저장
Chrome에서 Ctrl+V
    → OS 클립보드에서 텍스트 읽기
```

OS가 중간에서 중재하기 때문에, 같은 OS 안의 프로그램들끼리는 자유롭게 복사/붙여넣기가 된다.

---

## 문제: WSL2는 별도 OS다

WSL2는 [[CS_하드웨어와_소프트웨어의_층위적_이해]]에서 다룬 VM(가상 머신) 방식이다.  
Linux 커널이 Windows 커널과 별도로 실행되므로, 클립보드도 따로 존재한다.

```
[Windows 클립보드]          [Linux(WSL2) 클립보드]
  Word, Chrome, 메모장         tmux, vim, terminal
        │                              │
        └──────────?──────────────────┘
                  직접 연결 안 됨
```

> WSLg(Windows Subsystem for Linux GUI)가 이 둘을 연결해주는 역할을 한다.  
> 하지만 환경에 따라 한쪽 방향(Windows→Linux)만 안정적으로 동작하는 경우가 있다.

---

## 문제: 문자 인코딩이 다르다

복사된 텍스트는 결국 컴퓨터 안에서는 숫자(바이트) 로 저장된다.  
"어떤 문자를 어떤 숫자로 표현하는가"의 규칙이 인코딩(Encoding) 이다.

```
"한" 이라는 글자를 저장할 때:
  UTF-8 (Linux 표준):  0xED 0x95 0x9C  (3바이트)
  CP949  (Windows 한국어 표준): 0xC7 0xD1  (2바이트)
```

<!-- 💡 같은 "한"이지만 저장된 숫자가 완전히 다르다. 한쪽 규칙으로 쓰고, 다른 쪽 규칙으로 읽으면 → 글자가 깨진다. -->

| 환경 | 사용 인코딩 |
|------|------------|
| WSL2 (Ubuntu) | UTF-8 |
| Windows 한국어 | CP949 (코드페이지 949) |

`clip.exe`가 한글을 깨뜨리는 이유: WSL이 UTF-8로 텍스트를 파이프(`|`)로 넘기면, `clip.exe`는 CP949 규칙으로 읽어버린다. 다른 번역기로 읽는 셈이다.

---

## 시도한 방법들과 왜 실패했나

### 시도 1: `clip.exe` 직접 파이프
```bash
echo "한글" | clip.exe
```
실패 이유: UTF-8 바이트를 CP949로 해석 → 깨짐

### 시도 2: `iconv`로 UTF-16LE 변환 후 clip.exe
```bash
echo "한글" | iconv -f UTF-8 -t UTF-16LE | clip.exe
```
실패 이유: `clip.exe`가 UTF-16LE를 인식하려면 파일 맨 앞에 BOM(번호판 같은 식별자)이 필요한데, 없으면 무시됨

### 시도 3: `wl-copy` (Wayland 클립보드 도구)
```bash
echo "한글" | wl-copy
```
부분 성공: Linux 쪽 Wayland 클립보드에는 정확히 저장됨.  
실패 이유: WSLg가 Wayland → Windows 방향 동기화를 이 환경에서 하지 않았음.

또 다른 문제: tmux 안에서 실행 시 `WAYLAND_DISPLAY`, `XDG_RUNTIME_DIR` 환경변수가 tmux 세션에 없어서 `wl-copy`가 Wayland 소켓 자체를 찾지 못함.

```
tmux 세션 환경변수:   WAYLAND_DISPLAY = (없음)  ← wl-copy가 어디에 써야 할지 모름
실제 쉘 환경변수:     WAYLAND_DISPLAY = wayland-0
```

<!-- 💡 tmux는 시작 시점의 환경변수를 캡처한다. 나중에 환경변수가 추가되어도 tmux 세션 안에는 반영이 안 된다. -->

### 시도 4: PowerShell `Set-Clipboard` stdin 파이프
```bash
echo "한글" | powershell.exe -Command "$input | Set-Clipboard"
```
실패 이유: PowerShell의 `InputEncoding`이 기본값 CP949 → stdin을 CP949로 읽어버림

---

## 최종 해결: UNC 경로 + PowerShell 파일 읽기

Windows는 WSL 파일시스템에 네트워크 드라이브처럼 접근할 수 있다.  
경로 형식: `\\wsl.localhost\Ubuntu\경로`

```
[WSL]                           [Windows]
/tmp/.tmux_clip (UTF-8 파일)
        │
        └──→ \\wsl.localhost\Ubuntu\tmp\.tmux_clip
                        │
              PowerShell이 직접 읽기
              ([System.IO.File]::ReadAllText(..., UTF8))
                        │
                Set-Clipboard에 전달
                        │
              [Windows 클립보드] ✅
```

왜 이게 되나:  
PowerShell이 파일을 읽을 때 인코딩을 명시적으로 지정할 수 있다. stdin 파이프처럼 "어디서 온 건지 몰라서 기본값 CP949로 읽는" 문제가 없어진다.

---

## 최종 구조 (tmux 기준)

```
복사 (Linux → Windows):
  copy mode에서 y 또는 마우스 드래그
        ↓
  tmux-copy-to-win 스크립트 실행
        ↓
  선택된 텍스트를 /tmp/.tmux_clip 에 UTF-8로 저장
        ↓
  PowerShell이 \\wsl.localhost\Ubuntu\tmp\.tmux_clip 읽기 (UTF-8 명시)
        ↓
  Windows 클립보드에 저장 ✅

붙여넣기 (Windows → Linux):
  Prefix + ]
        ↓
  powershell.exe Get-Clipboard (OutputEncoding=UTF8 명시)
        ↓
  \r 제거 후 tmux 버퍼에 로드
        ↓
  tmux paste-buffer ✅
```

---

## 일반화: OS 경계를 넘는 데이터 전달 원칙

이 문제에서 배운 패턴은 클립보드에만 해당하지 않는다.

1. 인코딩을 항상 명시하라: 두 환경이 다른 인코딩을 쓸 때, stdin/stdout 파이프는 묵시적으로 실패한다. 파일 경유 + 인코딩 명시가 더 안전하다.
2. 환경변수는 프로세스 시작 시점에 고정된다: tmux, screen, nohup 등 분리된 프로세스 안에서는 환경변수가 최신 값이 아닐 수 있다.
3. OS 간 공유 파일시스템을 활용하라: WSL의 `/mnt/c/` (Windows→Linux) 또는 `\\wsl.localhost\` (Linux→Windows)는 인코딩 변환 없이 바이트를 그대로 공유하는 신뢰할 수 있는 채널이다.

---

## 관련 노트

- [[CS_하드웨어와_소프트웨어의_층위적_이해]] — 가상화(VM)와 커널 분리 구조
