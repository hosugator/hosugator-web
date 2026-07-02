---
created: 2026-05-22
updated: 2026-05-22
type: insight
status: 3-superseded
subject: "[[Software]]"
project: "[[Edge AI LMR]]"
tags:
  - git
  - lfs
  - binary
  - devops
publish: true
---

## Context

프로젝트 문서 디렉토리에 PDF, 이미지, PPTX 같은 바이너리 파일을 포함해야 했다. 일반 git으로 추적하면 델타 압축이 불가해 레포가 빠르게 비대해진다.

**검토한 대안:**
1. **gitignore + pCloud 심링크** — 바이너리를 pCloud에 두고 git 레포에 심링크
   - 문제: 심링크 대상 디렉토리를 git이 이미 추적 중이면 파일 삭제 이벤트로 처리됨. 다른 환경(맥북)에서 clone 시 링크 즉시 깨짐.
2. **Git LFS** — 바이너리 포인터만 git에 커밋, 실제 파일은 LFS 서버에 별도 저장.

## Decision

Git LFS 채택. 기준: **git = 코드/텍스트, 바이너리 콘텐츠 = LFS**.

`.gitattributes`에 확장자 기준 일괄 적용 (파일별 예외 없이 확장자로 통일):
```
*.pdf *.pptx *.ppt  filter=lfs diff=lfs merge=lfs -text
*.png *.jpg *.jpeg  filter=lfs diff=lfs merge=lfs -text
*.bmp *.tif *.tiff  filter=lfs diff=lfs merge=lfs -text
```

`git lfs install`은 머신 1회, `.gitattributes`는 레포별 설정. 기존 추적 파일은 `git lfs migrate import`로 재작성.

## Consequences

- GitHub/GitLab 계정당 LFS 스토리지 공유 (GitHub 무료 1GB)
- clone 시 LFS 미설치 환경은 포인터 파일만 받음 (`git lfs pull` 별도 필요)
- pCloud를 바이너리 SSOT로 쓰는 방식은 불채택 — 수동 동기화 부담, git 워크플로우와 분리
- GB~TB 규모 ML 데이터가 생기면 LFS 대신 DVC + pCloud WebDAV 전환 검토 → [[DVC manages ML data versions the way git manages code]]

→ [[Git LFS on self-hosted GitLab fails silently when external_url points to internal hostname]]
