---
created: 2026-05-22
updated: 2026-05-22
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Edge AI LMR]]"
tags:
  - pcloud
  - access-control
  - dvc
  - iam
  - webdav
publish: true
---

## Context

DVC remote를 pCloud에 연결할 때 WebDAV 자격증명(username + password)이 계정 전체를 열어준다는 문제를 발견했다. AWS IAM처럼 특정 폴더에만 접근 가능한 자격증명을 만들 수 있는지 찾다가 "Invite to folder" 방식을 확인했다.

## Insight

### pCloud는 IAM/앱 비밀번호가 없고 "Invite to folder + 전용 계정"이 대안이다

| 방식 | 자격증명 노출 범위 | DVC 사용 가능 |
|---|---|---|
| 본계정 WebDAV | pCloud 전체 | 가능 |
| Share link | 없음 (공개 URL) | 불가 (WebDAV 아님) |
| Invite to folder + 전용 계정 | 초대된 폴더만 | 가능 |

**Share link는 브라우저용 HTTP 링크라 DVC WebDAV remote로 연결할 수 없다.**

### Invite to folder 작동 방식

1. 초대받은 사람은 pCloud 계정이 있어야 초대를 수락할 수 있다
2. 수락하면 해당 계정의 pCloud 루트에 공유 폴더가 나타난다
3. WebDAV 접속 시 공유받은 폴더만 보인다 — 초대한 계정의 나머지 데이터는 노출되지 않는다
4. 권한(read/write)은 초대 시 설정한 값이 그대로 적용된다

### CI/자동화 환경 패턴

사람이 없는 환경(CI 서버)에서는 전용 pCloud 계정을 생성해 초대한다:

```bash
# CI 서버 DVC 설정
dvc remote add -d pcloud webdavs://webdav.pcloud.com/
dvc remote modify pcloud user "lmr-dvc@gmail.com"   # 전용 계정
dvc remote modify --local pcloud password "..."      # .dvc/config.local (gitignore)
```

자격증명 유출 시: 초대 취소 → 계정 교체. 개인 pCloud는 영향 없음.

[[DVC manages ML data versions the way git manages code]] · [[Git LFS over symlinks for binary repo files because symlink targets break on clone]]
