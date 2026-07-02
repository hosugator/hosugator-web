---
created: 2026-05-06 14:53
updated: 2026-05-06 14:53
status: 2-stable
type: insight
subject: "[[Software]]"
project: "[[Self-development in 2026]]"
tags:
  - neovim
  - lazyvim
  - kitty-graphics-protocol
  - mermaid
  - image-rendering
publish: true
---

# Neovim KGP 이미지·다이어그램 렌더링 스택

## 전체 체인

```
Ghostty (KGP 터미널)
  └── tmux (allow-passthrough on)
        └── Neovim
              ├── image.nvim (kitty backend)
              │     └── ImageMagick (magick luarock)
              └── custom_mermaid.lua
                    └── mmdc (mermaid CLI)
                          └── puppeteer + chrome-headless-shell
```

## 각 계층 역할

| 계층 | 역할 |
|------|------|
| Ghostty | Kitty Graphics Protocol(KGP) 지원 터미널. GPU 가속 |
| tmux | `allow-passthrough on` 설정으로 KGP 이스케이프 시퀀스를 Ghostty까지 투과 |
| image.nvim | KGP를 이용해 nvim 버퍼에 이미지 렌더링. backend = "kitty" |
| magick luarock | image.nvim의 ImageMagick Lua 바인딩 의존성 |
| mmdc | Mermaid 코드 → PNG/SVG 변환 CLI |
| chrome-headless-shell | mmdc 렌더링 엔진. `npx puppeteer browsers install chrome-headless-shell` (sudo 없이) |

## 설치 순서 주의사항

```bash
# 1. ImageMagick + luarocks
sudo apt install imagemagick libmagickwand-dev luarocks
sudo luarocks install magick

# 2. mermaid CLI
sudo npm install -g @mermaid-js/mermaid-cli

# 3. Chrome headless (반드시 비루트 사용자로)
npx puppeteer browsers install chrome-headless-shell
# sudo로 실행 시 /root/.cache/에 설치되어 mmdc가 찾지 못함
```

## tmux 설정

```tmux
set -g allow-passthrough on
set -ga update-environment TERM
set -ga update-environment TERM_PROGRAM
```

## custom_mermaid.lua 핵심 로직

1. 커서 위치에서 ` ```mermaid ` 블록 탐지
2. 블록 내용을 임시 파일로 저장 → `mmdc -i input.mmd -o output.png`
3. `image.nvim`으로 PNG를 현재 버퍼에 렌더링

`<leader>tm`으로 토글, ON 시 커서가 블록 밖이면 경고 알림.

## 관련 노트

- [[mermaid 다이어그램 종류 가이드]]
- [[Linux 개발환경 dotfiles 부트스트랩 구조 패턴]]
