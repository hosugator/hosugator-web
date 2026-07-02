---
created: 2026-05-20
updated: 2026-05-20
type: study
status: 2-stable
subject: "[[OS]]"
project: "[[Self-development in 2026]]"
tags:
  - linux
  - wine
  - windows
  - compatibility
publish: true
---

## Context

Ubuntu 24.04에서 카카오톡을 설치하려다 Wine, Bottles, Waydroid 세 가지 선택지를 처음 비교했다.

## Insight

### Wine은 번역기, Bottles는 번역 부스 격리기, Waydroid는 Android OS 자체 실행

**Wine**: Windows API 호출을 Linux 시스템 콜로 실시간 번역하는 호환 레이어. 가상머신 없이 `.exe`를 리눅스 창으로 바로 띄운다.

**Bottles**: Wine prefix(`~/.wine`)를 앱별로 분리 관리. Docker보다는 Python virtualenv에 가까운 개념 — OS 수준 격리가 아니라 가상 C드라이브와 레지스트리를 앱마다 독립 유지.

```
Wine 단독: 앱 A, B, C가 ~/.wine 하나를 공유 → DLL 충돌, 레지스트리 오염
Bottles:   앱마다 별도 prefix → 서로 격리, 하나 망가져도 다른 앱 무관
```

**Waydroid**: Android OS(AOSP)를 LXC 컨테이너로 Linux 커널 위에 올려서 실행. 번역 없이 Android 앱 그대로 구동.

### 한국 금융앱은 Waydroid에서도 안 된다

토스, 카카오뱅크 등은 루팅 감지 보안 모듈 때문에 Waydroid 환경에서 실행 거부됨. Waydroid의 실용 가치는 한국 사용자 기준으로 낮다.

### 카카오톡 용도라면 Bottles가 최선

- Wine 단독: 설치는 쉽지만 이후 다른 Windows 앱 추가 시 오염 위험
- Bottles: 처음부터 격리 → 나중에 앱 추가해도 관리 비용 없음
- Waydroid: 설정 복잡, 실용성 낮음

→ [[Bottles for running Windows apps on Ubuntu]]
→ [[Linux app packaging formats trade portability for system integration]]
