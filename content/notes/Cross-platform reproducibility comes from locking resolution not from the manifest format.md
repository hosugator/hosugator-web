---
created: 2026-07-28
updated: 2026-07-28
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - dependency-management
  - uv
  - python
  - packaging
  - reproducibility
publish: true
---
## Context
MLA 검사기를 Linux·Windows 양쪽에서 운영하기로 하고 의존성 관리를 `requirements.txt`에서 `pyproject.toml`로 옮겼다. 이때 "pyproject.toml이 requirements보다 다중 플랫폼 관리에 효과적인 메타데이터"라고 이해했는데, 검증해보니 귀속이 어긋나 있었다.

## Insight
### 분기선은 매니페스트 형식이 아니라 잠그느냐다

`uv pip compile requirements.txt --universal`을 실행해보니 `requirements.txt`도 플랫폼 마커 22곳이 붙은 universal 산출물을 만든다. 다중 플랫폼 해결은 `pyproject.toml`의 기능이 아니었다.

```
선언 (무엇을 원하는가)        해석 결과 (무엇이 설치되는가)
────────────────────────────────────────────────────────
requirements.txt        →     (없음. 설치 시 매번 재해석)   ← 문제 상태
requirements.txt        →     compile --universal 출력물
pyproject.toml          →     uv.lock
```

문제는 두 번째 칸이 비어 있었다는 것이다. 버전을 pin해도 전이 의존성은 설치 시점에 해석되므로(75개 중 60여 개) 고정되지 않는다.

### lockfile은 플랫폼 차이를 감추는 게 아니라 전부 열거한다

추상화 방향이 반대다. 숨겨서 통일하는 게 아니라, 모든 플랫폼의 답을 미리 적어두고 설치 시 고르게 한다.

```toml
{ name = "colorama",      marker = "sys_platform == 'win32'" }
{ name = "nvidia-cufile", marker = "sys_platform == 'linux'" }
```

torch 항목에 `win_amd64` / `manylinux x86_64` / `manylinux aarch64` 휠이 함께 잠기고, 마커가 39곳 자동 생성됐다. 단일 파일이 양 플랫폼을 담는다.

### pyproject.toml의 고유 가치는 다른 데 있다

|            | 얻는 것                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| PEP 621 표준 | 모든 도구가 같은 파일을 읽는다 (`[tool.ruff]`, `[tool.uv]`)                                                                            |
| 인덱스 명시     | `--extra-index-url`은 PyPI와 PyTorch 인덱스를 둘 다 뒤져 동명 패키지 시 출처가 모호했다. `explicit = true`는 지정 패키지에만 그 인덱스를 쓴다 — 의존성 혼동 표면이 줄어든다 |
| CUDA 빌드 전환 | `[[tool.uv.index]]` URL 한 줄. 지역버전(`+cu126`)을 의존성에 박지 않는다                                                                  |

## Decision
`pyproject.toml` + `uv.lock`으로 이관하고 `requirements.txt`를 제거했다. 양 플랫폼 명령을 `uv sync` / `uv run python -m inspector_mla`로 통일했다.

- `[tool.uv] package = false` — 애플리케이션이므로 프로젝트 자체를 빌드하지 않는다. `[build-system]` 없이 의존성만 관리하고 `PYTHONPATH` 없이 실행된다
- `opencv-python` → `opencv-python-headless` — HighGUI 사용 0건이고 통계는 QtCharts로 그린다. 일반 opencv가 번들한 Qt5 플러그인(`libqxcb.so`)이 PySide6의 Qt6 탐색을 가로채는 문제가 사라져 `QT_PLUGIN_PATH` 우회 코드도 제거했다. 192MB → 158MB
- `.bat`/`.sh`는 shim으로 유지 — Windows 검증을 못 한 상태에서 유일한 진입점을 지우면 동료 환경이 멈춘다

## Related
- [[Duplicated thresholds make a documented workflow step silently unreachable]] — 같은 사실의 복사본이 갈라지는 문제. shim 축소가 그 대응
- [[Deployment size is decided by what gets linked not by the implementation language]] — 무엇을 의존성에 넣을지(dev 그룹 분리, headless)
- [[Copying requirements before source code enables Docker layer cache reuse on dependency install]] — 의존성 파일을 별도 레이어로 다루는 이유
- [[Defensive error handling converts porting bugs into silent feature loss]] — 같은 브랜치의 리눅스 이식 작업
- [[A stray lockfile in a parent directory makes Turbopack misdetect the workspace root and break RSC manifests]] — lockfile 위치가 도구 동작을 바꾼 사례
