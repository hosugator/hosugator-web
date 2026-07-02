---
created: 2026-06-01
updated: 2026-06-01
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Self-development in 2026]]"
tags:
  - git
  - workflow
publish: true
---
## Context

zettelkasten 원격 저장소에서 맥북 커밋을 리눅스로 가져오는 과정에서 `git fetch`와 `git pull`의 차이를 실습으로 확인. `git merge origin/main` 이후 MOC - Inbox.md 충돌이 발생해 직접 해결.

## Insight

### git fetch는 다운로드와 병합을 분리해 안전한 검토를 가능하게 한다

`git pull`은 fetch + merge를 한 번에 실행한다. `git fetch`는 리모트 변경사항을 로컬에 다운로드만 하고 작업 파일은 건드리지 않는다.

```bash
git fetch                          # 다운로드만
git log HEAD..origin/main --oneline  # 어떤 커밋이 왔는지 확인
git diff HEAD..origin/main --stat    # 어떤 파일이 바뀌었는지 확인
git merge origin/main              # 확인 후 병합 결정
```

### HEAD..origin/main 표기는 "A에 없고 B에만 있는 것"을 의미한다

```
HEAD..origin/main  → 로컬에 없고 리모트에만 있는 커밋
origin/main..HEAD  → 리모트에 없고 로컬에만 있는 커밋
```

`..`은 차집합 연산자다. A..B = B - A.

### git diff의 세 가지 비교 대상

```bash
git diff                  # 커밋 안 된 변경사항 (unstaged)
git diff HEAD             # 커밋 안 된 전체 (staged + unstaged)
git diff origin/main..HEAD  # 커밋된 변경사항 (브랜치 간)
git diff --stat           # 파일 목록과 변경 규모만
```

`git status`의 "N개 커밋만큼 앞에 있습니다"는 파일 수가 아니라 커밋 수다.

## Related

- [[git-internals-snapshot-and-pointer]] — 포인터(HEAD) 개념
