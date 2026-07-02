---
created: 2026-05-20
updated: 2026-05-20
type: study
status: 2-stable
subject: "[[OS]]"
project: "[[Self-development in 2026]]"
tags:
  - linux
  - flatpak
  - apt
  - snap
  - appimage
  - packaging
publish: true
---
## Context

Bottles를 Flatpak으로 설치하는 과정에서 apt, deb, Flatpak, Snap, AppImage의 차이를 처음 체계적으로 비교했다.

## Insight

### 배포 방식의 핵심 축은 "의존성을 어디에 두느냐"

| 방식 | 의존성 위치 | 배포판 종속 |
|---|---|---|
| apt / deb | 시스템 공유 | Ubuntu/Debian 전용 |
| Flatpak | 앱 내장 | 배포판 무관 |
| Snap | 앱 내장 | 배포판 무관 (Canonical 운영) |
| AppImage | 앱 내장 | 배포판 무관, 설치 불필요 |

"배포판 무관"이란 Ubuntu, Fedora, Arch 등 모든 리눅스에서 동일한 명령어와 방식으로 설치·실행된다는 의미. apt는 Ubuntu에만 있고, Fedora는 dnf, Arch는 pacman을 쓴다.

### Flatpak이 커뮤니티 선호를 받는 이유, 하지만 apt를 대체할 수는 없다

**Flatpak 장점**: 샌드박스 격리, 최신 버전 빠른 배포, 배포판 무관
**Flatpak 한계**:
- 앱마다 라이브러리 중복 → 디스크 사용량 증가
- 샌드박스로 시스템 통합 약함 (프린터 드라이버, 데몬 불가)
- CLI 도구(`git`, `python`, `node`)는 시스템에 직접 설치해야 터미널에서 쓸 수 있음

### 현업 역할 분담

```
apt / deb  → 시스템 도구, 개발 환경, CLI, 드라이버
Flatpak    → 데스크탑 GUI 앱 (브라우저, 에디터, 카카오톡 등)
Snap       → Ubuntu 기본 탑재로 마주치는 경우 있음 (느리다는 불만 많음)
AppImage   → 비공식 배포, 빠른 테스트용
```

→ [[Wine runs Windows apps on Linux by translating API calls]]
