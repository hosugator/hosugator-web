---
created: 2026-06-03
updated: 2026-06-03
type: insight
status: 2-stable
subject: agile
project: "[[Go2fit]]"
tags:
  - jira
  - git
  - branching
  - agile
  - project-management
publish: true
---
## Context
go2fit_ai 3인 팀에서 Jira Sprint/Story 구분이 모호해서 혼란이 있었다. Story를 주 단위 공동 브랜치로 쓰다 보니 Sprint와 역할이 겹쳤고, Epic은 MVP 하나로만 운영해서 타임라인이 복잡했다. Sprint에는 Jira ID가 없어서 브랜치 이름으로 쓰면 이름 변경 시 추적이 끊기는 문제도 있었다.

## Insight
### 각 요소가 서로 다른 축을 담당할 때 혼란이 사라진다

| 요소 | 축 | git |
|---|---|---|
| Epic | 버전 경계 | 공동 브랜치 (`epic/GF-Y-v0.2.0`) |
| Sprint | 시간 단위 | Jira only (브랜치 없음) |
| Story | 기능 단위 | 기능 브랜치 (`story/GF-X-feature`) |
| Task | 구현 작업 | 작업 브랜치 (`task/GF-X-desc`) |

Story가 시간 단위를 겸할 때 Sprint와 역할이 겹친다. Story를 기능 단위로 고정하면 Sprint는 순수 시간 관리 도구가 된다.

### Sprint에 ID가 없다는 게 공동 브랜치로 부적합한 이유다
Sprint 이름은 언제든 변경 가능하므로 git 브랜치 이름으로 쓰면 추적이 끊긴다. Epic은 Jira ID(GF-Y)가 고정되어 있어 브랜치 추적이 안정적이다.

## Decision
```
main
 └── epic/GF-Y-v0.2.0          ← 버전 공동 브랜치
       └── story/GF-90-community   ← 기능 브랜치 (여러 주 걸쳐도 OK)
             ├── task/GF-88-community-db
             └── task/GF-82-fe-clip
```

**네이밍 컨벤션:**
- Epic: `v0.2.0`
- Sprint: `26w23` 또는 날짜 범위
- Story: 기능명 (`커뮤니티 기능`, `인증 기능`)
- Task: 역할 prefix + 목적어 (`BE: DB CRUD 개발`, `FE: 피드 UI 구현`)

**전환 조건:** 팀이 커지거나 기능 영역이 복잡해지면 Epic을 버전 대신 기능 영역(인증, 추천 등)으로 세분화하고 별도 릴리즈 관리 도구 도입.

### Story/Task vs Story/Sub-task

Story/Task 유지가 낫다. Story가 여러 Sprint에 걸치는 경우 Sub-task는 부모 Story의 Sprint를 상속해서 Sprint 배정이 복잡해진다. Task는 Sprint를 독립적으로 배정할 수 있고 백로그 가시성도 좋다. Task는 하나의 Sprint 안에서 완료되어야 하며, Sprint를 넘기면 너무 크게 쪼갠 신호다.

## Consequences
- 타임라인에서 버전별(Epic별) 경계가 명확하게 분리됨
- Story가 여러 Sprint에 걸쳐 진행되어도 구조상 자연스러움
- Sprint는 Jira에서만 존재 → git 추적 불안정 문제 없음
- git 계층이 main → epic → story → task로 3단계가 되어 PR 흐름이 다소 길어짐

## Merge Flow & Rollback
```
task 완료  → story PR 머지 → task 브랜치 삭제
story 완료 → epic PR 머지  → story 브랜치 삭제
epic 완료  → main PR 머지  → epic 브랜치 삭제 + git tag
```

main은 서버(프로덕션)용. Epic 단위로 배포되므로 버전 경계가 명확하다.
보류 기간이 길어질 것 같으면 원격 브랜치도 삭제하고 Jira Task 코멘트에 작업 내용을 남긴다. 브랜치보다 Jira가 더 오래가는 기록이다.


**롤백 전략:**
Epic이 main에 머지될 때 git tag를 찍어두면 즉각 롤백 가능하다.

```bash
# Epic 머지 시
git tag v0.1.0
git tag v0.2.0

# 문제 발생 시
git revert HEAD      # 머지 커밋 되돌리기
git checkout v0.1.0  # 특정 버전으로 이동
```

태그 없이 커밋 해시로도 롤백 가능하지만, 태그가 있어야 팀 전체가 "v0.1.0으로 롤백"이라는 말만으로 즉시 행동할 수 있다.

## Related
- [[Engineering Practice - Agile Collaboration]] — 애자일 협업 실천 노트
- [[Cureat - Jira]] — 이전 프로젝트의 Jira 운영 방식
