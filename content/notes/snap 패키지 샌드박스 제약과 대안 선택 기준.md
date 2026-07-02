---
created: 2026-05-06 14:53
updated: 2026-05-06 14:53
status: 2-stable
type: insight
subject: "[[Software]]"
project: "[[AOI]]"
tags:
  - linux
  - snap
  - package-management
  - devtools
publish: true
---
## snap confinement 종류

| 유형        | 파일시스템 접근          | 대표 예시                     |
| --------- | ----------------- | ------------------------- |
| `strict`  | 제한됨 (AppArmor 정책) | 대부분의 snap 패키지             |
| `classic` | 제한 없음             | nvim, ghostty, code, yazi |
| `devmode` | 개발용 임시 해제         | -                         |

## 실제 문제 사례

`snap install lazygit --classic`이 없어 strict 모드로 설치 시 `~/.cache/nvim/` 접근 불가 → lazygit 실행 시 permission denied.

WPS Office snap 버전에서 슬라이드쇼 전체화면 전환 불가. `WAYLAND_DISPLAY=`, `QT_QPA_PLATFORM=xcb` 환경변수 우회 모두 실패. AppArmor strict confinement이 Wayland 프로토콜 및 fullscreen 요청을 차단. snap 제거 후 공식 deb 설치로 해결 — deb는 `shared-mime-info`, `desktop-file-utils`를 통해 MIME 타입·시스템 통합이 정상 등록됨.

**해결**: 공식 GitHub 릴리즈에서 바이너리를 직접 `/usr/local/bin`에 설치:

```bash
LAZYGIT_VERSION=$(curl -s https://api.github.com/repos/jesseduffield/lazygit/releases/latest \
  | grep tag_name | cut -d: -f2 | tr -d '", ' | cut -c2-)
curl -Lo /tmp/lazygit.tar.gz \
  "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"
tar xf /tmp/lazygit.tar.gz -C /tmp lazygit
sudo install /tmp/lazygit /usr/local/bin
```

## 도구별 설치 방법 선택 기준

| 도구 | 권장 방법 | 이유 |
|------|---------|------|
| nvim | `snap --classic` | 최신 버전 추적, classic 가능 |
| ghostty | `snap --classic` | 공식 snap 채널 |
| lazygit | GitHub 바이너리 | strict snap 없음, 파일시스템 접근 필요 |
| VS Code | `snap --classic` | classic 지원 |
| Docker | `apt` | 시스템 수준 통합 필요 |
| WPS Office | `deb` | fullscreen/MIME 시스템 통합 필요 |

## 원칙

- 해당 도구의 snap confinement 타입 확인: `snap info <package> | grep confinement`
- `classic` 가능하면 snap 사용 (자동 업데이트)
- `strict` + 파일시스템 접근 필요 → apt 또는 공식 바이너리
