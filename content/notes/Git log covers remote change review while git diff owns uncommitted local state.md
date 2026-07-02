---
created: 2026-06-01
updated: 2026-06-01
status: 2-stable
type: study
subject: "[[Software]]"
project: "[[Self-development in 2026]]"
tags:
  - git
  - workflow
publish: true
---

## Context

fetch 이후 원격 변경사항 검토 워크플로우를 익히면서, `git diff`와 `git show`가 실제로 얼마나 필요한지 의문이 생겼다. `git log -p`만으로 대부분 해결되는 게 아닌가 하는 질문에서 출발.

## Insight

### git log / log -p는 원격 변경사항 검토에서 주력이다

fetch 이후 원격 변경사항을 검토하는 맥락에서는 `git log`와 `git log -p`로 대부분 해결된다.

```bash
git log HEAD..origin/main --oneline  # 들어온 커밋 목록
git log -p HEAD..origin/main         # 커밋별 diff 포함
git log -p HEAD..origin/main -- 파일명  # 특정 파일만
```

### git diff는 커밋되지 않은 로컬 상태 전용이다

`git diff`(인자 없음)는 HEAD가 아니라 **스테이징 영역(index)**과 비교한다. 이 영역은 `git log`가 접근할 수 없는 곳이라 대체 불가다.

```
[작업 디렉토리] → git add → [스테이징(index)] → git commit → [HEAD]
```

```bash
git diff           # 작업 디렉토리 vs 스테이징 — add 안 한 것만
git diff --staged  # 스테이징 vs HEAD — add 했지만 commit 안 한 것
git diff HEAD      # 작업 디렉토리 vs HEAD — 미커밋 전체 (staged + unstaged)
```

`git diff`만 치면 `git add`한 내용은 보이지 않는다. 커밋 전 전체 변경사항을 확인하려면 `git diff HEAD`가 정확하다.

### git show는 특정 시점 파일 원본 조회에서 유일하다

`git log -p`는 diff(변경분)만 보여준다. 특정 커밋 시점의 파일 전체 내용이 필요하면 `git show`만 가능하다.

```bash
git show <커밋ID>:파일명  # 그 시점의 파일 스냅샷 (diff 아님)
```

### 용도 요약

| 상황 | 도구 |
|---|---|
| 원격 변경사항 검토 (fetch 이후) | `git log`, `git log -p` |
| 커밋 전 로컬 상태 확인 | `git diff`, `git diff --staged`, `git diff HEAD` |
| 특정 시점 파일 원본 조회 | `git show <커밋ID>:파일명` |

## Related

- [[Git remote inspection workflow narrows from fetch through log diff to show]] — fetch 이후 줌인 워크플로우 전체
- [[git log follow tracks file history across renames unlike plain git log]] — log -p 상세, merge 커밋 diff 동작
- [[git fetch separates download from merge to enable safe diff inspection]] — fetch/merge 분리 이유
- [[git-internals-snapshot-and-pointer]] — HEAD, index, 커밋 포인터 내부 구조
