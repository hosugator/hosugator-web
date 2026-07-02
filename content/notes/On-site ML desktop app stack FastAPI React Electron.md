---
created: 2026-05-21
updated: 2026-05-21
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - adr
  - electron
  - fastapi
  - react
  - ml
  - desktop
publish: true
---
## Context

현장 설비 PC에서 학습 + 추론을 모두 수행하는 데스크톱 ML 앱 개발. 기존 팀은 MFC(C++) 중심이고, 나만 ML 엔지니어 신입으로 합류. React, Python, FastAPI 경험 있음. UI 퀄리티가 사내 도구 이상은 되어야 하고, 기존 팀과 코드베이스 충돌을 최소화해야 한다.

선택지:
- PyQt 단독: Python만으로 UI + ML 처리
- Electron + Python 분리: React UI + FastAPI 백엔드
- MFC + Python IPC: 기존 팀 스택 연장

## Decision

**FastAPI (Python) + React → Electron 래핑** 구조 채택.

- 1단계: FastAPI + React를 localhost 브라우저로 먼저 구동 (패키징 없이 빠른 프로토타입)
- 2단계: 검증 후 Electron으로 래핑하여 설치 파일로 배포
- 설비 제어 코드(C++)는 기존 팀이 유지, FastAPI가 그 데이터를 읽어오는 구조로 분리

**Tauri 미채택 이유**: 백엔드가 Rust 필요 → 현재 팀 역량에 맞지 않음.  
**PyQt 미채택 이유**: UI 퀄리티 한계, 배포 복잡도.  
**MFC 확장 미채택 이유**: ML 생태계(PyTorch 등)가 Python 중심이라 C++ 혼합 시 복잡도 급증.

## Consequences

- ML 로직과 UI가 완전히 분리되어 독립적으로 개발 가능
- 기존 MFC 팀과 인터페이스만 정의하면 병행 개발 가능
- GPU 학습이 필요하면 Docker + nvidia-container-toolkit 세팅 추가 필요
- Electron 앱이 시작될 때 Python 프로세스를 백그라운드로 함께 띄우는 IPC 구조 필요

## Related
- [[Most branded desktop apps are Electron web wrappers]]
