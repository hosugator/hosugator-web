---
created: 2026-05-27
updated: 2026-05-27
type: study
status: 1-draft
subject: "[[Software]]"
project: "[[Align AI]]"
tags:
  - neovim
  - pyright
  - lsp
  - config
publish: true
---

## Context

align-ai 코드 쉐도잉 중 Ruff와 Pyright가 unused import를 중복으로 표시했다. Ruff에게 위임하고 Pyright의 unused import 경고를 끄려고 `pyrightconfig.json`에 아래 두 방식을 시도했으나 둘 다 효과 없었다.

```json
{ "reportUnusedImport": "none" }

{ "diagnosticSeverityOverrides": { "reportUnusedImport": "none" } }
```

nvim 재시작 후에도 Pyright가 `"X" is not accessed`를 계속 표시했다.

## Insight

### 미해결 — 원인 불명

pyrightconfig.json이 Neovim의 Pyright LSP에 제대로 로드되는지 확인이 필요하다. 가능한 원인:

- mason으로 설치한 pyright가 pyrightconfig.json을 다른 경로에서 읽을 수 있음
- LazyVim의 pyright 설정이 pyrightconfig.json을 override할 수 있음
- `shadow/` 서브디렉토리에서 config 탐색 경로가 달라질 수 있음

## Verification

해결 시 이 섹션에 업데이트할 것.
