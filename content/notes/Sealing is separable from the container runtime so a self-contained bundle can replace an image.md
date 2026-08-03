---
created: 2026-07-29
updated: 2026-07-29
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - containerization
  - packaging
  - deployment
  - windows
publish: true
---
## Context
Windows 설비에 배포하는 프로그램의 개발-운영 환경 불일치를 없애려고 "이미지로 관리하는 게 맞지 않나"를 검토했다. 결론은 **이미 그에 가까운 것을 쓰고 있었다**는 것이었고, 그 과정에서 "이미지의 이점"을 뭉쳐서 생각하고 있었음을 알게 됐다.

[[Containerization orchestration and CI-CD address packaging runtime and delivery as separate concerns]]가 세 관심사를 분리해뒀는데, 그 분리를 **선택적으로 채택할 수 있다**는 데까지 가지 않았다.

## Insight
### 봉인은 컨테이너 없이도 살 수 있다

컨테이너가 실제로 제공하는 것은 셋뿐이다.

```
봉인   봉인된 루트 파일시스템
격리   namespace
자원   cgroup
```

**생애주기 관리는 하나도 들어 있지 않다.** `docker run`한 프로세스가 죽으면 컨테이너도 끝이고 아무도 되살리지 않는다. 재시작·헬스체크·상태 조회는 전부 **감시자**의 기능이다 — dockerd의 `--restart`, systemd, kubelet([[Pod resource exhaustion is handled by kubelet and probes not by Service]]).

그리고 세 축 중 **봉인만 따로 살 수 있다.**

| 봉인 수단 | 생태계 |
|---|---|
| 컨테이너 이미지 | 범용 |
| **PyInstaller onedir** | Python |
| `dotnet publish --self-contained` | .NET |
| AppImage | Linux 데스크톱 |

이름도 있다 — **self-contained deployment**, **xcopy deployment**. Windows에서 확립된 패턴이고 Microsoft가 .NET에서 권장한다. 설비·장비 소프트웨어에서 특히 흔하다.

### 레시피와 산출물을 구분해야 한다

내가 뭉쳐서 본 지점이다. 락파일과 번들은 같은 역할이 아니다.

| 우리 것 | 컨테이너 대응 | 성질 |
|---|---|---|
| `pyproject.toml` + `uv.lock` | **Dockerfile + 락** | 레시피. 대상 기계에서 해석·설치가 일어난다 |
| `dist/앱/` (onedir) | **이미지** | 산출물. 복사하면 끝 |

**락파일은 이미지가 아니라 이미지를 만드는 지시서다.** 그래서 대상 기계에 도구·네트워크·인덱스 접근이 필요하고 그 과정이 실패할 수 있다. 번들은 필요 없다.

두 개가 서로를 대체하지 않고 단계가 다르다 — **락파일은 빌드 시점 재현성, 번들은 배포 시점 일관성**을 담당한다.

### 봉인 수단끼리의 차이는 한 층뿐이다

| | self-contained 번들 | 컨테이너 이미지 |
|---|---|---|
| 인터프리터·런타임 | ✅ | ✅ |
| 패키지·네이티브 라이브러리 | ✅ | ✅ |
| 재배포 런타임 (vcruntime 등) | ✅ | ✅ |
| **libc · 배포판 사용자 공간** | ❌ | ✅ |
| OS 커널·드라이버 | ❌ | ❌ |
| 장치 SDK (호스트 설치) | ❌ | ❌ |
| 로케일 | ❌ | ❌ |
| 실행 통제 정책 | ❌ | ❌ |

**차이가 `libc` 한 줄이고, 단일 OS 배포에서는 그 층의 변동이 작다.** 여러 배포판을 지원해야 하면 이 한 줄이 결정적이지만, Windows 전용이면 한계 이득이 작다.

### 봉인은 경계를 없애지 못하고 좁힌다

아래 네 줄은 **양쪽 다 봉인하지 못한다.** 그리고 이 프로젝트에서 실제로 잡은 버그를 나눠보면 그쪽이 위험한 쪽이었다.

| 버그 | 봉인이 없애나 | 이유 |
|---|---|---|
| 플랫폼 전용 API 부재 (`CREATE_NO_WINDOW`, `os.startfile`) | ✅ | 플랫폼이 하나가 되면 분기가 사라짐 |
| 드라이브 문자 하드코딩 | ✅ | 같음 |
| **cp949 디코딩 실패** | ❌ | `ping.exe`는 **호스트 바이너리**다. 봉인 안에 없다 |
| CUDA 가용성 오판 | ❌ | GPU 드라이버가 호스트에 있다 |
| 장치 SDK 경로·부재 | ❌ | 호스트 설치 + 커널 드라이버 |

**3 대 3이고, 봉인이 못 없애는 쪽이 조용히 실패한다.** 그래서 봉인을 도입해도 경계 검증은 남는다 — 줄어들 뿐이다.

이것이 [[A non-deterministic component in the verification environment destroys the implication CI sells]]와 짝을 이룬다. 봉인 가능한 부분은 보장으로 바꾸고, 봉인 불가능한 경계는 실기에서 검증한다. **둘은 경쟁이 아니라 분할이다.**

## Decision
**배포 봉인은 PyInstaller onedir를 유지한다.** 별도로 컨테이너 이미지를 도입하지 않는다.

근거는 두 가지다.

1. **한계 이득이 작다** — onedir이 이미 인터프리터·패키지·네이티브 DLL을 봉인한다. 이미지가 추가하는 것은 `libc` 층이고 Windows 단일 플랫폼에서는 변동이 작다.
2. **못 봉인하는 것이 같다** — 드라이버·장치 SDK·로케일·실행 정책은 양쪽 다 밖에 있고, 우리 버그의 절반이 거기 있었다.

**표준 관행 대비 유일한 미달 항목은 코드 서명이다.** 포장 형태는 표준이고 버전 고정은 평균보다 엄격한데, 서명이 없다. 지금까지 "서명 없어도 실행된다"에 의존해왔고 그것이 무기한 참이 아님을 확인했다([[Application control verdicts come from a model so a missing signature does not predict the outcome]]).

**전환 조건**: 다중 배포판(Linux) 지원이 필요해지면 `libc` 층 봉인이 의미를 갖는다. 우리가 셋업하지 못하는 장비에 배포하게 되면 코드 서명을 도입한다.

## Related
- [[Containerization orchestration and CI-CD address packaging runtime and delivery as separate concerns]] — 세 관심사 분리. 이 노트는 그것을 선택적으로 채택할 수 있다는 확장
- [[Sealing moves uncertainty into lifecycle management so its net gain depends on change frequency]] — 봉인의 비용 쪽
- [[Linux app packaging formats trade portability for system integration]] — "의존성을 어디에 두느냐"가 같은 축. AppImage의 설치 불필요 성질이 onedir과 같다
- [[Cross-platform reproducibility comes from locking resolution not from the manifest format]] — 레시피 쪽의 재현성
- [[Deployment size is decided by what gets linked not by the implementation language]] — 봉인 대상의 크기를 결정하는 것
- [[A non-deterministic component in the verification environment destroys the implication CI sells]] — 봉인 불가능한 경계를 무엇으로 다루는가
- [[Application control verdicts come from a model so a missing signature does not predict the outcome]] — 미서명 번들이 드러낸 한계
