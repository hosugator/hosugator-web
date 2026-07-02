---
created: 2026-03-26 10:09
updated: 2026-03-26 10:09
type: insight
status: 1-draft
subject: "[[PKM]]"
project: "[[Edge AI LMR]]"
tags:
  - 
  - 
  - 
  - 
publish: true
---
# Cross-Platform Dotfiles and Shared Aliases Strategy

## Summary
macOS(M3 MacBook), Linux(WSL/Ubuntu), Windows 환경을 아우르는 지능형 설정 관리 체계(Dotfiles)를 구축함. 단일 저장소()를 통해 기기 간 지능과 작업 효율(Alias)을 공유하며, OS 자동 감지 로직을 통해 플랫폼 간 이질성 해결.

## 🚀 Intelligent Terminal Shortcuts (Aliases)

각 단축키는 기기 간 동일한 사용자 경험(UX)을 제공하며, 작업 속도를 획기적으로 향상시키도록 설계됨.

### 1. Git Productivity (Essential)
- **`gs`**: `git status` | 현재 파일 상태 및 브랜치 위치 확인.
- **`ga`**: `git add` | 수정된 파일의 스테이징.
- **`gc`**: `git commit` | 일반 커밋 수행.
- **`gca`**: `git commit -am` | **(High Frequency)** 수정된 모든 파일의 추가와 커밋을 동시에 수행.
- **`gp`**: `git push` | 원격 저장소로 동기화.
- **`gl`**: `git log --oneline --graph --all` | 전체 브랜치 흐름의 시각적 파악.
- **`lg` (Git Alias)**: `git lg` | **(Visual Masterpiece)** 색상과 그래프가 포함된 초정밀 로그 뷰어.

### 2. System Utilities (Comfort)
- **`ll`**: OS 자동 감지 기반의 리스트 출력.
  - **Linux**: `ls -lah --color=auto` (GNU 표준 색상)
  - **macOS**: `ls -lahG` (BSD 스타일 색상)
- **`cls`**: `clear` | 터미널 화면 정돈.
- **`.. / ...`**: `cd .. / cd ../..` | 상위 디렉토리로의 빠른 이동.
- **`h`**: `history` | 과거 실행한 명령어 검색 및 추적.
- **`dot`**: `cd ~/dotfiles && git log --oneline` | 설정 변경 이력의 즉시 확인.

## 🏗️ Architecture Design (Multi-OS Support)

1. **Shared Git Config (`.gitconfig_shared`)**:
   - 사용자 정보(Seungwan Hong / hosugator@gmail.com)와 범용 별칭(lg, ci, co 등)을 중앙 관리.
   - 각 기기의 `~/.gitconfig`에서 `[include]` 섹션을 통해 이 파일을 공유하여 보안과 효율을 동시에 달성.

2. **Conditional Loading (aliases.sh)**:
   - `uname` 명령어를 사용하여 macOS와 Linux를 실시간으로 판별.
   - 명령어 옵션의 차이(예: ls color 옵션)를 조건문으로 처리하여 하나의 설정 파일로 여러 장비 지원.

3. **Symbolic Link Strategy**:
   - 설정 파일의 알맹이는 `~/dotfiles`에, 시스템 인식 경로는 `~/.gemini` 등 원래 자리에 위치시킴으로써 관리의 단일화(Single Source of Truth) 구현.

## Next Steps
- 개인 맥북(M3 Air)에서 `git clone ~/dotfiles` 후 심볼릭 링크를 통한 환경 동기화 테스트.
- `.bashrc` 외에 `.zshrc`(macOS 기본)를 위한 호환성 코드 추가 검토.