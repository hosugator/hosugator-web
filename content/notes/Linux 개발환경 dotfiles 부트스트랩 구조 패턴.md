---
created: 2026-05-06 14:53
updated: 2026-05-06 14:53
status: 2-stable
type: insight
subject: "[[Software]]"
project: "[[Self-development in 2026]]"
tags:
  - dotfiles
  - linux
  - devenv
  - bootstrap
publish: true
---
## 핵심 원칙

`install.sh`는 **심볼릭 링크 생성만** 담당하고, 패키지 설치는 목적별 스크립트로 분리한다.

```
dotfiles/
├── install.sh          # 심볼릭 링크만 생성 (빠르고 멱등)
└── scripts/
    ├── install-core.sh  # 터미널/에디터 필수 도구
    ├── install-dev.sh   # 개발 도구 (Docker, Python 등)
    └── install-apps.sh  # GUI 앱 (VS Code, Obsidian 등)
```

## 심볼릭 링크 전략

`install.sh`는 associative array로 링크 맵을 선언하고, 기존 파일 백업 후 `ln -s` 생성:

```bash
declare -A links=(
  ["$DOTFILES_DIR/home/zshrc"]="$HOME/.zshrc"
  ["$DOTFILES_DIR/config/nvim"]="$HOME/.config/nvim"
)

for src in "${!links[@]}"; do
  dest=${links[$src]}
  if [ -e "$dest" ] || [ -L "$dest" ]; then
    mv "$dest" "${dest}.backup_$(date +%Y%m%d%H%M%S)"
  fi
  ln -s "$src" "$dest"
done
```

## OS 분기 패턴

```bash
OS="$(uname)"
if [[ "$OS" == "Linux" ]]; then
  links["$DOTFILES_DIR/config/autostart/foo.desktop"]="$HOME/.config/autostart/foo.desktop"
elif [[ "$OS" == "Darwin" ]]; then
  : # macOS 전용
fi
```

## 설치 스크립트 분리 이유

- `core`: 매 환경 반드시 필요 (zsh, nvim, tmux, 터미널)
- `dev`: 프로젝트 성격에 따라 선택 (Docker, Python)
- `apps`: GUI 환경에서만 필요 (VS Code, Obsidian)

신규 머신에서 GUI 없는 서버 환경이면 `install-core.sh`만 실행하면 된다.

## 관련 노트

- [[Ubuntu 듀얼부팅 설치 실행 가이드]]
- [[Linux 네이티브 전환 결정 - WSL2 한계와 듀얼부팅 플랜]]
