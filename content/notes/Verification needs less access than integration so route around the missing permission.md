---
created: 2026-07-28
updated: 2026-07-28
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - ci-cd
  - gitlab
  - permissions
  - cross-platform
  - verification
publish: true
---
## Context
Windows 검증을 자동화하려고 GitLab 러너를 등록하려 했는데 `Settings`가 아예 보이지 않았고 `/-/settings/ci_cd`가 404였다. 역할이 **Developer**였고 러너 등록은 **Maintainer**가 필요하다. 권한 요청에는 시간이 걸린다. 그 사이에 아무것도 못 하는가가 문제였다.

## Insight
### 목표를 분해하면 필요 권한이 다르다

"CI로 Windows를 검증한다"를 쪼개보니 요구 권한이 갈렸다.

| 하위 목표 | 필요 권한 | 상태 |
|---|---|---|
| 코드를 Windows 머신에 두기 | 셸 접근 | ✅ |
| 의존성 설치·테스트 실행 | 셸 접근 | ✅ |
| 파이프라인 실행·결과 확인 | Developer | ✅ |
| **러너 등록** | **Maintainer** | ❌ |
| **병합 게이트 설정** | **Maintainer** | ❌ |

막힌 것은 **자동화와 강제**였고, **검증 자체는 아니었다.** 원래 목적("리눅스에서 만든 것이 Windows에서 도는가")은 권한 없이 달성 가능했다.

일반화하면 — **막힌 경로가 목표 전체를 막는지 확인해야 한다.** 표준 경로가 하나 막혔을 때 목표를 포기하는 것과, 목표를 분해해 막히지 않은 부분을 먼저 처리하는 것은 다르다.

### 세 개의 막힌 경로를 각각 우회했다

**① 권한** — Developer로 push와 파이프라인 실행이 가능하다. Maintainer는 게이트(자동 차단)에만 필요하다. 그래서 권한 요청은 병행하고 검증은 진행했다.

**② 네트워크 git 인증** — SSH 비대화형 세션에서 `git fetch`가 실패한다. GCM이 Windows 자격증명 저장소에 접근하려면 대화형 세션이 필요하다(`Unable to persist credentials with the 'wincredman' credential store`).

그런데 그 PC의 팀 폴더에 `origin/chore/ci-windows` ref가 이미 있었다 — **SourceTree가 로그인 세션에서 자동 fetch해둔 것**이다. 네트워크 대신 그 로컬 저장소에서 clone했다. 공용 PC에 개인 자격증명을 평문 저장하는 것도 피할 수 있었다.

**③ 커밋 전달** — 검증 중 발견한 버그를 고친 뒤, 그 커밋을 다시 Windows로 보내야 했다. `git bundle`을 `scp`로 전송했다.

```
git bundle create fix.bundle <base>..chore/ci-windows   # ref 이름이 필요하다
```

SHA를 끝점으로 주면 기록할 ref가 없어 **"빈 번들은 만들지 않습니다"로 거부**한다. 브랜치 이름을 줘야 한다. 번들은 커밋 해시를 보존하므로 파일 복사와 달리 **동일성이 유지**된다.

### 격리는 우회의 부산물이 아니라 이득이었다

팀 작업 폴더 대신 별도 위치에 clone한 것은 처음엔 안전 조치였는데, 그 폴더 상태를 보니 필수였다.

```
.git          다른 PC(DESKTOP-4VI8CAL)에서 복사된 것 — git은 PATH에 없었다
.venv         깨짐. venv는 절대 경로를 내장하므로 복사하면 동작하지 않는다
__.venv       누군가 이름을 바꿔 비활성화한 잔여물
build/ dist/  PyInstaller 산출물
```

**오염된 환경에서 검증하면 실패 원인이 코드인지 환경인지 구분되지 않는다.** 깨끗한 clone에서 돌린 덕에 실패 1건이 명확히 코드 문제로 특정됐다.

### 실측이 CI 설계를 바꿨다 — 호스트 상태에 의존하지 않게

검증 중 uv의 관리 Python 경로(`%APPDATA%\uv\python\cpython-3.10-...`)가 **ReparsePoint**였고 Windows가 통과를 거부했다(`os error 448`). 러너 서비스 계정은 사용자 프로필에 접근하지 못할 수도 있다.

그래서 `.gitlab-ci.yml`에 경로를 프로젝트 상대로 고정했다.

```yaml
UV_CACHE_DIR: .uv-cache
UV_PYTHON_INSTALL_DIR: .uv-python    # 캐시에 포함
```

**CI 설정이 러너 호스트의 상태를 전제하면 러너를 옮길 때마다 깨진다.** 손으로 미리 돌려보지 않았으면 러너 등록 후에 알았을 문제다.

### 검증이 실제로 값을 냈다

권한을 기다렸으면 발견하지 못했을 것들이다.

- Windows 전용 버그 1건 — 한국어 로케일 ping 출력 디코딩 실패 ([[Encoding must be fixed at each boundary not by a process-wide setting]])
- 환경 함정 5건 — uv Python ReparsePoint, 앱 제어 정책(AppLocker/WDAC), git PATH 부재, GCM 비대화형 실패, Windows offscreen 폰트 부재
- **그 PC가 예상보다 나은 환경**이라는 사실 — CUDA가 실제로 동작하고(RTX A4000, sm_86) MVS SDK도 설치돼 있다. "CI로 검증 불가"라고 적어둔 영역 일부가 실제로는 가능하다

## Decision
권한 요청과 검증을 병행했다. 검증은 공용 PC의 **별도 clone**에서 수동으로 수행하고, 팀 작업 폴더는 건드리지 않았다.

- Maintainer 요청은 **게이트 자동화 용도로만** 한정해 요청한다 — 요청 범위가 좁으면 승인이 쉽다
- CI 설정은 러너 호스트 상태에 의존하지 않게 만든다 (uv 경로 프로젝트 상대화)
- 공용 PC에 개인 git 자격증명을 저장하지 않는다. 러너는 CI job token으로 자체 인증하므로 필요가 없다

**전환 조건**: Maintainer를 받으면 러너를 등록하고 수동 검증을 CI로 대체한다. 그때 검증용 clone(`D:\Project\_verify_ci-windows`, 약 8GB)을 삭제한다.

**남긴 판단**: 그 PC는 CUDA와 MVS SDK를 갖췄으므로, 러너 등록 후 GPU 학습·카메라 SDK 로드까지 CI 범위를 넓힐 수 있다. 다만 카메라 실물 연동은 여전히 불가하다.

## Related
- [[Gate only the path that needs verification instead of imposing a team-wide convention]] — 이 CI 구성의 설계. 그 결정이 막힌 지점을 이 노트가 다룬다
- [[Encoding must be fixed at each boundary not by a process-wide setting]] — 이 검증이 찾아낸 버그
- [[Cross-platform reproducibility comes from locking resolution not from the manifest format]] — 검증 대상이었던 lockfile이 Windows에서 정확히 해석됨을 확인
- [[Defensive error handling converts porting bugs into silent feature loss]] — 오염된 환경에서 원인을 구분할 수 없는 것과 같은 구조
- [[GitHub Actions permissions block disables all defaults when any permission is specified]] — CI 권한 모델의 다른 사례
