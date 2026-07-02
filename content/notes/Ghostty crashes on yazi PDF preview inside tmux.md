---
created: 2026-05-22
updated: 2026-06-02
type: insight
status: 2-stable
subject: "[[Dotfiles]]"
project: "[[Self-development in 2026]]"
tags:
  - ghostty
  - yazi
  - tmux
  - kgp
publish: true
---
## Context 
yazi로 파일 탐색 중 PDF/PPTX가 있는 디렉토리에 진입하면 Ghostty가 간헐적으로 크래시. tmux 없이 yazi를 직접 실행하면 재현되지 않음.

## Insight
### 크래시는 race condition이 아니라 Ghostty 내부 style table 용량 초과가 직접 원인이다
저널 로그에서 확인된 실제 흐름:
1. yazi가 PDF 미리보기를 위해 `pdftoppm`으로 이미지 생성 (max 1000×1000)
2. Ghostty가 KGP로 이미지 수신 → `page_list` style table이 256 → 512 → 1024 → 2048로 한계치까지 증가
3. 2048 도달 후 더 이상 확장 불가 상태에서 `Gdk: Error flushing display: Resource temporarily unavailable` 발생
4. Ghostty 크래시
간헐적 재현은 PDF 이미지 크기와 시스템 GPU 메모리 상태에 따라 style table overflow 속도가 달라지기 때문.
```
# 실제 로그 패턴
info(page_list): adjusting page capacity styles = 256
info(page_list): adjusting page capacity styles = 512
info(page_list): adjusting page capacity styles = 1024
info(page_list): adjusting page capacity styles = 2048  ← 한계
info(glib): Gdk: Error flushing display: Resource temporarily unavailable  ← 크래시
```

### tmux passthrough가 없으면 동일 파일에서 크래시가 없다
tmux 없이 Ghostty에서 직접 yazi 실행 → 정상 동작. KGP가 tmux 버퍼를 거치지 않으면 페이로드 처리 방식이 달라 style table overflow가 유발되지 않음.

## Verification
- **2026-06-02**: `max_width`/`max_height` 1000 → 500 적용. 효과 모니터링 중.
- **완화 옵션 (적용 순서):**
1. ✅ `yazi.toml` `max_width`/`max_height` 1000 → 500 — KGP 페이로드 크기 감소로 style table overflow 지연
2. `yazi.toml` `image_delay` 추가 — 이미지 전송 전 대기 시간 완화 (1이 효과 없을 때)

## Related

- [[A broken config symlink silently disables all terminal keybinds without error]] — Ghostty config 심링크 관련 이슈
