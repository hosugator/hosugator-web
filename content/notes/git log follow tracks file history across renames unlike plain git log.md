---
created: 2026-06-01
updated: 2026-06-01
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Self-development in 2026]]"
tags:
  - git
  - history
publish: true
---
## Context

diffview.nvim(`<leader>gH`)으로 파일 히스토리를 보니 `git log 파일명`보다 커밋이 더 많이 나왔다. 원인을 확인하다 `--follow` 옵션 차이를 발견.

## Insight

### git log --follow는 파일명 변경 이전 히스토리까지 추적한다

```bash
git log 파일명          # 현재 이름 기준만 — rename 이전 커밋 누락
git log --follow 파일명  # rename 전후 이력 모두 추적
```

diffview.nvim의 `DiffviewFileHistory`는 내부적으로 `--follow`를 사용한다. 터미널에서 같은 결과를 보려면 `--follow`를 명시해야 한다.

### git show의 세 가지 사용 방식

```bash
git show <커밋ID>            # 해당 커밋의 전체 diff (모든 파일)
git show <커밋ID> -- 파일명  # 해당 커밋에서 특정 파일의 diff만
git show <커밋ID>:파일명     # 해당 커밋 시점의 파일 내용 (diff 아님, 스냅샷)
```

`git log -p 파일명`은 해당 파일의 전체 커밋 히스토리를 diff와 함께 보여준다.  
`git log -p -N`에서 merge 커밋은 기본적으로 diff를 표시하지 않는다 (`-m` 추가 시 표시).

## Related

- [[git fetch separates download from merge to enable safe diff inspection]] — git diff/log 워크플로우
- [[Merge conflict markers partition local and remote changes at the divergence point]] — merge 개념
