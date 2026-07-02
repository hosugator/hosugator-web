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

fetch 후 특정 파일의 변경 내용을 자세히 보고 싶을 때 어떤 순서로 명령어를 사용하는지 궁금했다. log / diff / show의 역할 구분이 헷갈렸던 상황.

## Insight

### 줌아웃에서 줌인으로 좁혀가는 것이 핵심 패턴이다

```bash
# 1. 원격 변경사항 가져오기 (merge 없이)
git fetch origin

# 2. 새로 들어온 커밋 목록 확인 (줌아웃)
git log HEAD..origin/main --oneline

# 3. 전체적으로 무엇이 달라졌는지
git diff HEAD origin/main

# 4. 특정 파일 하나만 좁혀서 (줌인 시작)
git diff HEAD origin/main -- src/auth.py

# 5. 그 파일을 건드린 커밋 하나를 자세히
git show <커밋ID> -- src/auth.py

# 6. (선택) 그 커밋 시점의 파일 전체 내용
git show <커밋ID>:src/auth.py
```


### 세 명령어의 역할이 다르다

| 명령어        | 질문           | 대상       |
| ---------- | ------------ | -------- |
| `git log`  | 어떤 커밋들이 있었나  | 히스토리 전체  |
| `git diff` | 지금 뭐가 달라져 있나 | 두 상태 사이  |
| `git show` | 이 커밋 하나는 뭔가  | 특정 커밋 하나 |

## Related

- [[git fetch separates download from merge to enable safe diff inspection]] — fetch가 merge 없이 분리되는 이유, diff 비교 대상 3종
- [[git log follow tracks file history across renames unlike plain git log]] — log -p 상세, git show 세 가지 사용법
- [[git-internals-snapshot-and-pointer]] — git 내부 구조 (HEAD, 커밋 포인터)
