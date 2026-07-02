---
created: 2026-05-21
updated: 2026-05-21
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[Edge AI LMR]]"
tags:
  - electron
  - desktop
  - frontend
  - architecture
  - 
publish: true
---

## Context

현장 ML 프로젝트 UI 기술 스택 검토 중, 실제 앱 예시를 나열하다가 발견한 패턴. 카카오톡, 슬랙, 옵시디언, VS Code, Notion, Discord — 직관적으로 "네이티브 앱"처럼 보이는 것들이 전부 Electron이었다.

## Insight

### 현대 데스크톱 앱의 사실상 표준은 Electron이다

Electron = Chromium(크롬 엔진) + Node.js를 앱 창으로 감싼 것. HTML/CSS/JS로 만든 웹페이지가 그대로 데스크톱 앱이 된다. VS Code에서 Ctrl+Shift+I를 누르면 크롬 개발자 도구가 그대로 열린다.

### 직접 확인 방법

`Ctrl+Shift+I` → 크롬 개발자 도구가 뜨면 Electron 앱.

### 무거운 이유가 여기 있다

슬랙, 디스코드가 RAM을 많이 먹는 이유는 크롬 엔진을 앱마다 내장하기 때문. 앱 하나가 브라우저 탭 하나를 여는 것과 동일한 메모리 구조.

### Tauri는 이 문제를 OS 브라우저 엔진 재사용으로 해결

크롬을 내장하지 않고 Windows는 Edge, Mac은 Safari 엔진을 빌려써서 앱 크기가 5~10MB로 줄어든다. 단, OS마다 렌더링이 미세하게 다를 수 있고 백엔드가 Rust라 진입장벽이 있다.
