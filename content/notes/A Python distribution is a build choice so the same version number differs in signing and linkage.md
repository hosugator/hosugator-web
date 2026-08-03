---
created: 2026-07-29
updated: 2026-07-29
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - python
  - uv
  - packaging
  - toolchain
publish: true
---
## Context
"Python 3.10.20"이 하나의 물건이라고 생각했다. 그런데 CI에서 실패한 3.10.20과 검증에서 통과한 3.10.11은 **서명 여부가 달랐고**, 그 차이가 잡의 성공을 갈랐다. 같은 버전 번호가 같은 파일을 뜻하지 않는다.

## Insight
### CPython은 구현체 이름이고, 배포본은 그것을 누가 빌드했는지다

**CPython**은 Python의 표준 구현체 — 언어 명세를 C로 구현한 것이다. 다른 구현체로 PyPy(JIT), GraalPy(JVM) 등이 있다. "파이썬을 쓴다"고 할 때 사실상 CPython을 쓴다.

uv의 디렉터리 이름이 이 정보를 그대로 담고 있다.

```
cpython-3.10.20-windows-x86_64-none
   │       │        │       │      └ libc 변형 (Linux는 gnu / musl, Windows는 none)
   │       │        │       └────── CPU 아키텍처
   │       │        └────────────── OS
   │       └─────────────────────── 버전
   └─────────────────────────────── 구현체
```

**여기에 "누가 빌드했는지"는 안 적혀 있다.** 그런데 그게 이번 문제의 핵심이었다.

### 같은 버전이라도 배포본에 따라 서명·설치 방식·용도가 다르다

| | **python.org 공식** | **uv 관리 Python** |
|---|---|---|
| 빌드 주체 | Python Software Foundation | Astral (`python-build-standalone` 프로젝트) |
| 코드 서명 | Authenticode, **PSF 인증서** | **없음** |
| 설치 방법 | 설치 프로그램 실행, 관리자 권한 | 압축 해제만, 권한 불필요 |
| 설치 위치 | `C:\Program Files\...` 등 보호된 경로 | 아무 폴더 (프로젝트 안이어도 됨) |
| 재배치 | 어려움 (경로가 박혀 있음) | **자유** — 폴더째 옮겨도 동작 |
| 설계 목적 | 사람이 설치해서 쓰는 것 | **도구가 자동으로 내려받아 쓰는 것** |

`python-build-standalone`은 "어디에 풀어놔도 동작하는 Python"을 만드는 프로젝트다. uv·Rye·Bazel 같은 도구가 사용자 개입 없이 특정 버전을 확보하려고 쓴다.

**그 설계 목표가 서명이 없는 이유와 직결된다.** 서명은 발행자가 인증서로 보증하는 절차이고, 재배치 가능한 자급자족 빌드는 "설치 없이 어디든 풀기"를 목표로 하므로 OS의 설치·신뢰 체계 밖에 놓인다. 편의를 얻는 대가로 신뢰 근거를 잃는다.

실측 확인이 이 표를 그대로 보여줬다.

```
uv 관리 3.10.20        libcrypto-1_1-x64.dll   NotSigned
                       libssl-1_1-x64.dll      NotSigned
                       _ssl.pyd                NotSigned
                       → import ssl : ImportError (정책 차단)

python.org 3.10.11     libcrypto-1_1.dll       Valid  CN=Python Software Foundation
                       libssl-1_1.dll          Valid  CN=Python Software Foundation
                       _ssl.pyd                Valid  CN=Python Software Foundation
                       → import ssl : OK  OpenSSL 1.1.1t
```

**같은 사실의 다른 사례**가 [[VS Code binary is Microsoft proprietary despite MIT source]]다. 소스가 같아도 배포 바이너리는 다른 물건이다 — 거기서는 라이선스가, 여기서는 서명이 갈렸다.

### 바이너리 릴리스가 끝난 버전은 설치 가능한 최신이 고정된다

Python 릴리스는 수명 단계에 따라 배포 형태가 바뀐다.

```
bugfix 단계    → 소스 + 설치 프로그램(바이너리 릴리스)   ← 그냥 설치하면 된다
security 단계  → 소스만                                  ← 직접 컴파일해야 한다
```

3.10은 security 단계이고 **3.10.11이 마지막 바이너리 릴리스**다. 3.10.12 이후는 보안 패치가 소스로만 나온다. 그래서 python.org 경로를 택하면 3.10.11로 고정되고, 그보다 새 패치를 원하면 직접 빌드하거나 서명 없는 배포본을 쓰는 수밖에 없다.

반대로 uv 관리 Python이 3.10.20을 줄 수 있는 이유가 이것이다 — Astral이 소스에서 직접 빌드하기 때문이다. **편의와 최신성이 같은 선택지에 묶여 있고, 서명이 반대편에 있다.**

### uv가 어느 Python을 쓰는지는 두 축으로 결정된다

혼동하기 쉬운 두 환경변수를 구분해둔다.

| 변수 | 값 | 뜻 |
|---|---|---|
| `UV_PYTHON_PREFERENCE` | `managed` (기본) | uv 관리본을 **우선** |
| | `system` | 시스템 설치본을 우선 |
| | **`only-system`** | 관리본을 **후보에서 제외** |
| | `only-managed` | 시스템 설치본을 후보에서 제외 |
| `UV_PYTHON_DOWNLOADS` | `automatic` (기본) | 없으면 **내려받는다** |
| | **`never`** | 내려받지 않는다 |

`never`만으로는 부족하다. **이미 내려받아둔 관리본이 남아 있으면 그것을 쓴다.** 실제로 러너의 `.uv-python`에는 두 개가 쌓여 있었다.

```
.uv-python/
  cpython-3.10-windows-x86_64-none      ← 구버전 레이아웃 잔재 (캐시로 복원됨)
  cpython-3.10.20-windows-x86_64-none   ← 새로 내려받은 것
```

그래서 후보 자체를 배제하는 `only-system`이 필요하고, `never`는 "시스템에 없으면 조용히 우회하지 말고 실패하라"는 안전장치로 함께 둔다. **두 변수의 역할이 겹치지 않는다** — 하나는 무엇을 쓸지, 하나는 없을 때 어떻게 할지를 정한다.

### 인터프리터 교체는 락 재생성을 요구하지 않는다

`uv.lock`은 특정 패치 버전이 아니라 `requires-python = "==3.10.*"` 범위에 대해 **유니버설 해석**돼 있다 — 플랫폼과 패치 버전을 아우르는 하나의 해답을 담는다([[Cross-platform reproducibility comes from locking resolution not from the manifest format]]).

그래서 3.10.20 → 3.10.11 교체에 락 변경이 필요 없다. **락이 고정하는 것은 패키지이고, 인터프리터는 락의 입력 조건**이라는 계층 구분이 여기서 실질적 이득으로 나타난다.

## Related
- [[Application control verdicts come from a model so a missing signature does not predict the outcome]] — 서명 없는 배포본이 막히는 이유
- [[Python's ssl module is a wrapper over OpenSSL DLLs so a blocked DLL surfaces as an unrelated import error]] — 그 차단이 나타난 오류 형태
- [[VS Code binary is Microsoft proprietary despite MIT source]] — 소스와 배포 바이너리가 다른 물건이라는 같은 구분
- [[Linux app packaging formats trade portability for system integration]] — "의존성을 어디에 두느냐"가 같은 축. AppImage 의 설치 불필요 성질이 python-build-standalone 과 같다
- [[Cross-platform reproducibility comes from locking resolution not from the manifest format]] — 락과 인터프리터의 계층 구분
- [[Signing requirements conflict with a provisioning channel not with hermetic builds]] — 어느 배포본을 쓸지의 판단 기준
- [[pyproject.toml extends requirements.txt with build metadata needed for PyPI distribution]] — 패키징 계층 개념
