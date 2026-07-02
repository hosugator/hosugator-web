---
created: 2026-05-20
updated: 2026-05-20
type: insight
status: 2-stable
subject: "[[OS]]"
project: "[[Self-development in 2026]]"
tags:
  - linux
  - wine
  - fcitx5
  - wayland
  - korean
  - xim
  - bottles
publish: true
---

## Context

Ubuntu 24.04 Wayland 세션에서 Bottles(Flatpak) + Caffe runner로 카카오톡을 설치했으나 한글 입력이 안 됨. fcitx5 + Caps Lock 한영 전환 환경.

X11로 돌아갈 수 없는 이유: NVIDIA RTX 5070 드라이버의 GLX vsync busy-wait 버그로 Ghostty CPU 20%+ 폭주 발생 → Wayland 유지 필수. → [[Linux CPU 폭주 디버깅 패턴 - 배제법과 GPU 교차검증]]

## Insight

### 실패 지점은 XIM 서버가 아니라 Wine의 XIM 커밋 레이어다

진단 과정:

```
fcitx5 XIM 서버 등록 확인 (XIM_SERVERS=fcitx) ✓
xterm에서 한글 입력 정상 ✓  ← XIM 자체는 정상
Caps Lock 토글 Wine 안에서 작동 ✓  ← XIM 연결도 정상
조합창 표시됨 ✓  ← fcitx5가 키 이벤트 수신 중
커밋 후 Wine 입력창에 텍스트 미전달 ✗  ← 여기가 실패 지점
```

XIM 서버도 정상, fcitx5도 정상, XIM 연결도 됐는데 커밋만 안 됨 → Wine이 XIM commit 이벤트를 받아서 Windows 앱으로 전달하는 레이어에서 실패.

### InputStyle 세 가지 모두 실패

`HKEY_CURRENT_USER\Software\Wine\X11 Driver` → `InputStyle`:
- `overthespot` (기본): 커서 위치 조합창, 커밋 안 됨
- `root`: 화면 좌상단 조합창, 커밋 안 됨
- `offthespot`: 커서 근처 조합창, 커밋 안 됨

입력 스타일이 문제가 아니라 Wine XIM 구현 자체의 한계로 보임.

### Bottles 환경변수 설정은 맞지만 효과 없음

```
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
```

이 변수들이 있어야 fcitx5 XIM에 연결되고 조합창이 뜨지만, 커밋 전달 문제는 해결 안 됨.

### 우회책: 클립보드 붙여넣기

다른 앱(터미널, 에디터)에서 한글 작성 → 복사 → 카카오톡 입력창에 붙여넣기.

## Verification

향후 Wine 버전 업데이트나 Wayland-native Wine 지원이 추가되면 재시도 가치 있음.

→ [[Bottles for running Windows apps on Ubuntu]]
→ [[Wine runs Windows apps on Linux by translating API calls]]
→ [[Linux 키보드 리매핑 계층 - hwdb xkb xmodmap 비교]]
