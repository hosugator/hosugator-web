---
created: 2026-05-22
updated: 2026-05-26
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - dvc
  - git
  - ml
  - data-management
  - pcloud
publish: true
---
## Context

LMR 프로젝트에서 ML 학습 데이터가 GB~TB 규모로 커질 경우 Git LFS 한계를 넘는다. pCloud를 데이터 원격 저장소로 활용하는 방법을 찾다가 DVC를 처음 접했다.

## Insight

### DVC는 git과 동일한 포인터 구조를 데이터에 적용한다

git이 파일을 SHA 해시로 추적하듯, DVC는 데이터 파일의 해시 포인터(`.dvc` 파일)만 git에 커밋하고 실제 파일은 원격 저장소에 저장한다.

**해시는 생성 시점 ID가 아니라 파일 내용의 지문이다.** 파일명이 달라도 내용이 같으면 해시가 같고, 내용이 1바이트라도 바뀌면 해시가 완전히 달라진다. 동일 파일이 여러 버전에 걸쳐 쓰이면 원격에 한 번만 저장된다(중복 제거).

**`dvc add`는 경로를 명시적으로 지정한다. 특정 폴더 구조를 강제하지 않는다.**

같은 repo 안에서 여러 경로를 선택적으로 추적할 수 있다:

```bash
dvc add data/train/images/       # 특정 하위 폴더만
dvc add data/annotations/raw.json  # 특정 파일만
dvc add models/weights/best.pt   # 다른 경로도 무관
# data/config/ 등 나머지는 그대로 git 추적
```

**`dvc add`는 로컬 작업만 한다. 원격에 올리는 건 `dvc push`다.**

```bash
# 로컬 작업
dvc add data/train/images/
#  → 파일 내용 해시 계산
#  → .dvc/cache/에 해시명으로 로컬 복사 (내용은 동일, 이름만 해시)
#  → data/train/images.dvc 생성 (해시 기록)
#  → data/train/images/ 를 .gitignore에 추가
#  → 원본 경로는 캐시로의 링크로 대체 (로컬 접근은 그대로 됨)

git add data/train/images.dvc   # 포인터만 git에 커밋
git commit

# 원격 업로드
dvc push   # .dvc/cache/ → pCloud (해시명 그대로 업로드)
```

**pCloud에 저장되는 파일은 변환이 아니라 이름만 해시다.**

```
로컬:    data/train/images/cat001.jpg   ← 원본 JPEG
pCloud:  ab/cdef1234567890...           ← 동일한 JPEG, 이름만 해시
```

인코딩·압축 변환 없음. pCloud의 해시 파일을 직접 다운로드해도 원본 파일로 열린다.

팀원/다른 환경:

```bash
git clone repo   # 코드 + .dvc 포인터
dvc pull         # pCloud 해시 파일 → 로컬 캐시 → 원래 경로로 링크 복원
```

`dvc pull`이 하는 일은 콘텐츠 변환이 아니라 **경로 복원**이다.

### DVC는 원본이 살아있어야 복원 가능한 스냅샷이다

restic과의 혼동 주의:

|            | restic                 | DVC                     |
| ---------- | ---------------------- | ----------------------- |
| 기준축        | 시간                     | git 커밋                  |
| 복원 원리      | 독립 백업본 (원본 소멸해도 복원 가능) | 원격 스토리지 파일이 살아있어야 복원 가능 |
| 원격 파일 삭제 시 | 복원 가능                  | `dvc pull` 실패           |

이 때문에 DVC remote는 **append-only**로 운영해야 한다. 오래된 버전 정리는 `dvc gc`로 git 히스토리에 참조되지 않는 해시만 선택 삭제한다.

**수정/삭제 시 동작:**

| 상황             | 결과                          |
| -------------- | --------------------------- |
| 파일명만 변경        | 해시 동일 (내용 불변)               |
| 파일 내용 수정       | 해시 변경, 기존 .dvc 포인터로 pull 실패 |
| pCloud에서 파일 삭제 | git 기록 남음, dvc pull 실패      |
| dvc gc         | git 미참조 해시만 선택 삭제           |

### Git LFS와의 핵심 차이

| | Git LFS | DVC |
|---|---|---|
| 원격 저장소 | GitHub/GitLab 서버 | S3, GCS, NAS, WebDAV, SSH 등 |
| 용량 제한 | 계정 할당량 | 스토리지 한도만 |
| ML 파이프라인 | 없음 | 실험 추적, 파이프라인 정의 가능 |
| 대상 | 문서·이미지 수십 MB | GB~TB 학습 데이터, 모델 weights |

### DVC는 1 git repo = 1 DVC 단위로 설계된다

`dvc init`은 git repo 루트에서 실행하며 `.dvc/` 설정 디렉토리를 생성한다. 이 `.dvc/`는 데이터 폴더가 아니라 설정·캐시 전용이다.

```
.dvc/
├── config       ← remote 주소, 인증 설정
└── cache/       ← 로컬 콘텐츠 캐시 (자동 관리, 직접 건드리지 않음)
```

pCloud 원격은 프로젝트별로 분리하는 것이 권장된다:

```
pCloud/datasets/
├── lmr-project/       ← 프로젝트 A의 DVC remote (해시 파일들)
└── another-project/   ← 프로젝트 B의 DVC remote
```

pCloud 폴더 생성·파일 이동은 DVC가 자동으로 처리한다. 사람이 pCloud를 직접 조작할 필요 없다.

### pCloud를 DVC 원격으로 연결하는 방법

pCloud는 SSH/SFTP를 지원하지 않는다. 접근 방식 2가지:

**A. FUSE 마운트 방식 (단일 머신, 단순):**

```bash
dvc remote add -d pcloud ~/pCloudDrive/datasets/
```

- pCloud 앱이 실행 중인 환경에서만 동작
- 자격증명 불필요 (앱 로그인으로 대체)
- CI 서버나 팀원 환경에서는 사용 불가

**B. WebDAV 방식 (팀/CI 환경, 범용):**

```bash
dvc remote add -d pcloud webdavs://webdav.pcloud.com/
dvc remote modify pcloud user "이메일"
dvc remote modify --local pcloud password "비밀번호"  # .dvc/config.local (gitignore)
```

- pCloud 앱 없이 어디서든 동작
- `--local` 플래그로 자격증명을 git 추적 제외 파일에 저장

**전환 기준:** 혼자 작업 → FUSE. CI 연동 또는 팀 확장 → WebDAV.

## Related
- [[Git LFS over symlinks for binary repo files because symlink targets break on clone]] · 
- [[PARA over numbered folder taxonomy in pCloud keeps active areas shallow]] · 
- [[pCloud folder-level access control via invite replaces IAM]]
