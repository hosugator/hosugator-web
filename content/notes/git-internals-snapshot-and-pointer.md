---
created: 2026-05-15
updated: 2026-05-15
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Align AI]]"
tags:
  - git
  - restic
  - backup
  - version-control
publish: true
---
## 핵심 멘탈모델

Git의 두 가지 기본 개념이 다른 도구들로 그대로 확장된다.

| 개념  | Git                | 확장                         |
| --- | ------------------ | -------------------------- |
| 포인터 | 브랜치 = 커밋 해시 하나     | HEAD = 현재 위치 포인터           |
| 스냅샷 | 커밋 = 그 시점 전체 파일 상태 | Restic snapshot = 파일시스템 시점 |

**브랜치는 폴더가 아니다.** 끝 커밋을 가리키는 40바이트 포인터일 뿐이다. 그래서 브랜치 생성/전환이 빠르다.

## 왜 텍스트(코드)에만 Git이 최적인가

텍스트는 압축률이 높다 → 스냅샷 방식이어도 용량 부담이 작다.
바이너리는 델타 압축이 거의 안 된다 → 같은 방식으로 쌓으면 용량이 선형으로 증가한다.

이 차이가 두 가지 도구를 만들어냈다.

- **Git LFS** — 바이너리를 외부 스토리지에 두고 Git엔 포인터만 저장
- **Restic** — 파일시스템 전체를 대상으로 한 스냅샷 버전 관리 (Git의 파일시스템 확장판)

## Restic = 파일시스템용 Git

```
Git:    로컬 워킹트리 → 커밋 → 원격(GitHub)
Restic: 로컬 파일시스템 → 스냅샷 → 원격(pCloud, S3 등)
```

| Git | Restic |
|---|---|
| `git init` + `git remote add` | `restic init` |
| `git commit` + `git push` | `restic backup` |
| `git log` | `restic snapshots` |
| `git checkout` | `restic restore` |

로컬은 항상 작업 공간, 원격이 저장소. 구조가 동일하다.