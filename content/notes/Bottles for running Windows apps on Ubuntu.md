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
  - bottles
  - kakaotalk
  - adr
publish: true
---
## Context
Ubuntu 24.04 데스크탑에서 카카오톡을 설치해야 함. 선택지: Wine 단독, Bottles(Wine + prefix 격리), Waydroid(Android 컨테이너).

## Decision
**Bottles**를 사용한다. Flatpak으로 설치.

```bash
sudo apt install flatpak
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install flathub com.usebottles.bottles
```

이유:
- Wine 단독은 `~/.wine` 하나를 모든 앱이 공유 → 추후 다른 Windows 앱 추가 시 DLL 충돌·레지스트리 오염 위험
- Bottles는 앱별 prefix 격리로 이 문제를 원천 차단
- 처음부터 Bottles로 시작하면 전환 비용 없음
- Waydroid는 설정 복잡하고 한국 금융앱은 보안 모듈로 실행 불가 → 실용성 낮음

## Consequences
- 카카오톡 Windows 버전을 Bottles 내 별도 bottle에 설치 ✓
- Runner는 기본값 아닌 **Caffe**로 변경해야 실행됨 (Themida DRM 우회)
- 추후 Windows 전용 앱 추가 시 bottle만 새로 생성하면 됨
- **한글 입력 불가** (Wayland + fcitx5 + Wine XIM 조합 문제)
  - XIM 서버 정상, xterm에서는 한글 입력 됨 → Wine XIM 커밋 레이어 문제
  - InputStyle(root/offthespot/overthespot) 모두 시도했으나 실패
  - 시스템 wine 직접 실행도 wine32 의존성 문제로 테스트 불가
  - **우회책**: 다른 앱에서 한글 작성 후 클립보드 붙여넣기
- **파일 다운로드 불가** (Wine Z: 드라이브 쓰기 권한 문제, C: 드라이브 기본 경로도 실패)
  - `flatpak override --user --filesystem=home` 적용해도 해결 안 됨
  - **우회책**: 핸드폰으로 다운로드 후 클라우드 경유

→ [[Wine runs Windows apps on Linux by translating API calls]]
