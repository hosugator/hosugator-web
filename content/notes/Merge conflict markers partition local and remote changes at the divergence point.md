---
created: 2026-06-01
updated: 2026-06-01
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Self-development in 2026]]"
tags:
  - git
  - merge
publish: true
---
## Context

MOC - Inbox.md에서 실제 merge 충돌 발생 — 맥북(20260531)과 리눅스(20260529/28)가 같은 파일 맨 위에 각자 날짜 섹션을 추가해서 충돌. 터미널에서 직접 마커를 확인하고 편집으로 해결.

## Insight

### 충돌 마커는 로컬과 리모트의 분기 내용을 구분한다

```
<<<<<<< HEAD
(내 로컬 버전)
=======
(리모트 버전)
>>>>>>> origin/main
```

마커가 파일에 남아있어도 `git commit`은 된다. git이 자동으로 막지 않으므로 직접 확인해야 한다.

```bash
git diff --check   # 마커 잔존 여부 검사. 없으면 아무것도 출력 안 함
```

### fast-forward는 로컬에 새 커밋이 없을 때 포인터만 이동한다

```
ff 가능:    리모트 A→B→C, 로컬 A→B  →  로컬 포인터를 C로 이동 (merge 커밋 없음)
ff 불가능:  리모트 A→B→C, 로컬 A→B→D  →  merge 커밋 M 생성 (부모 2개: C, D)
```

merge 커밋이 특별한 이유는 부모가 2개라는 점이다. 일반 커밋은 부모가 1개.

### 충돌 해결 워크플로우

```bash
git merge origin/main       # 충돌 발생
git status                  # 충돌 파일 목록 확인
nvim "파일명"               # 편집기로 마커 제거 후 저장
git diff --check            # 마커 잔존 확인 (선택)
git add "파일명"
git commit
```

nvim에서 diffview.nvim 설치 시: `:DiffviewOpen` → 3-way diff로 시각적 해결 가능.

## Related

- [[git fetch separates download from merge to enable safe diff inspection]] — 병합 전 검토 워크플로우
- [[git-internals-snapshot-and-pointer]] — 포인터·커밋 구조
