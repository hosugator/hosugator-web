---
created: 2026-07-29
updated: 2026-07-29
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - ci-cd
  - reproducibility
  - security
  - python
publish: true
---
## Context
Windows CI가 "uv가 내려받은 Python에 서명이 없어 OS 정책에 차단됨"으로 실패했다. 나는 **hermetic 빌드와 서명 집행이 구조적으로 대립한다**고 결론 내리고, 호스트에 Python을 설치해 hermetic을 포기하자고 제안했다.

사용자가 물었다 — "러너가 설치할 때 서명이 있는 버전을 설치하도록 하면 되는 건 아닌지?"

실측하니 그게 됐다. 내 결론이 틀렸다.

## Insight
### 도구의 기본 채널이 가진 성질을 원리로 착각했다

내 추론은 이랬다.

```
① uv가 내려받는 Python에 서명이 없다              ← 사실 (실측)
② 따라서 설치 없이 쓰는 Python에는 서명이 없다      ← ★ 비약
③ 따라서 hermetic과 서명 집행은 대립한다            ← 틀린 결론
```

**②가 표본 하나에서 나온 일반화다.** 내가 본 것은 "설치 없이 쓰는 Python 전체"가 아니라 "uv가 쓰는 채널 하나"였다. 그 채널(`python-build-standalone`)이 서명을 안 하는 것은 그 프로젝트의 선택이고, 같은 성질을 가진 다른 채널이 없다는 뜻이 아니다.

그리고 ③처럼 **원리 수준으로 격상시키면 검증할 생각을 안 하게 된다.** "구조적 대립"이라고 이름 붙인 순간 다른 채널을 찾는 일이 무의미해 보였다. 잘못된 추상화는 탐색을 멈추게 한다.

### 같은 산출물이 여러 채널로 배포되고 채널마다 제약 조합이 다르다

Python 3.10을 예로 실제 채널들을 나열하면 이렇다.

| 채널 | 서명 | 설치 필요 | 재배치 | 패치 최신성 | 대상 |
|---|---|---|---|---|---|
| python.org 설치 프로그램 | ✅ PSF | ✅ 관리자 | ❌ | 3.10.11 고정 | 사람 |
| python.org embeddable zip | ✅ PSF | ❌ | ✅ | 3.10.11 고정 | 앱 임베딩 |
| **NuGet `python` 패키지** | **✅ PSF** | **❌** | **✅** | 3.10.11 고정 | **CI·빌드 자동화** |
| `python-build-standalone` (uv) | ❌ | ❌ | ✅ | 3.10.20 최신 | 도구 자동 조달 |

**NuGet 채널이 정확히 내가 없다고 단정한 조합이다** — 서명이 있고, 설치가 불필요하고, 프로젝트 폴더에 풀어 쓸 수 있다. 애초에 CI를 위해 만든 것이다.

실측 결과가 이 표를 확인해줬다.

```
NuGet python 3.10.11 / 3.13.14
  libcrypto / libssl / _ssl.pyd / python.exe   → 전부 Valid, CN=Python Software Foundation
  import ssl                                    → OK
  uv venv --python <경로>  후 venv 안에서       → OK
```

### 정책에 막히면 목표를 포기하기 전에 다른 채널을 확인한다

일반화하면 이렇다. **도구의 기본 조달 경로가 정책에 막힐 때, 그 목표가 정책과 양립 불가하다고 결론 내리기 전에 같은 산출물의 다른 채널을 확인한다.** 배포 채널이 여러 개인 이유가 바로 서로 다른 제약 조합을 만족시키기 위해서다.

확인할 목록은 대개 정해져 있다.

```
공식 발행자가 내는 것
  ├ 설치 프로그램        서명 있음, 설치 필요
  ├ 압축본 / 포터블      서명 있음, 설치 불필요        ← 자주 간과된다
  ├ 패키지 레지스트리    NuGet · Maven · apt · Homebrew
  └ 컨테이너 이미지      격리까지 함께
제3자가 재빌드한 것
  └ 편의를 얻고 서명을 잃는 경우가 많다               ← 도구의 기본값이 여기일 수 있다
```

**"도구가 알아서 해주는 경로"가 곧 "유일한 경로"는 아니다.** 편의를 위한 기본값이지 제약이 아니다.

### 남는 진짜 대립은 서명과 패치 최신성이다

원래 노트가 찾으려던 대립은 존재하지만 위치가 다르다.

```
서명할 수 있는 것은 발행자뿐이다
  → 발행자가 바이너리 릴리스를 멈추면
    → 그 시점 이후의 패치에는 서명된 배포본이 없다
```

3.10은 **3.10.11이 마지막 바이너리 릴리스**이고 이후는 소스만 나온다([[A Python distribution is a build choice so the same version number differs in signing and linkage]]). 그래서 서명을 택하면 2023년 4월 패치 수준에 묶인다. `python-build-standalone`이 3.10.20을 줄 수 있는 이유가 직접 빌드하기 때문이고, 직접 빌드했으니 PSF 서명이 없다.

**대립하는 것은 hermetic과 서명이 아니라 최신성과 서명이다.** 그리고 이건 우회할 수 없다 — 서명은 발행자만 할 수 있으므로 발행자가 안 내면 존재하지 않는다.

### 물려받은 핀은 검증된 제약이 아니다

같은 종류의 오류를 프로젝트 쪽에서도 발견했다. `setup.bat`의 `uv venv --python 3.10`은 내 작업 전부터 있었고, 근거는 이 주석이었다.

```
# Inspector_MLA 의존성 — labelme_custom 검증 환경과 동일 버전으로 고정
```

즉 3.10은 **이전 프로젝트의 검증 환경을 물려받은 것**이고, 3.10이어야 하는 이유가 확인된 적은 없다. 실측하니 이랬다.

| requires-python | 의존성 해석 |
|---|---|
| `==3.11.*` · `==3.12.*` · `==3.13.*` | ✅ 성공 |
| `==3.14.*` | ❌ `onnxruntime==1.23.2`에 cp314 휠 없음 (cp313까지) |

**3.10은 제약이 아니라 관성이었다.** 그리고 3.10의 보안 지원은 2026년 10월에 끝나므로 어차피 이동해야 한다.

"기존 환경과 같게"는 초기에는 합리적인 선택이다 — 검증 비용을 아낀다. 문제는 그 이유가 사라진 뒤에도 남아서 제약처럼 보이는 것이다. **핀에는 근거와 함께 재검토 시점을 적어야 한다.**

## Decision
**채택하지 않았다 — 정책 자체를 제거했다.** 아래는 결정이 뒤집힌 경위이고, 위의 인사이트(채널 탐색, 물려받은 핀)는 그대로 유효하다.

처음에는 NuGet 서명본 조달로 결정했다. 두 사실이 그 결정을 무효화했다.

**① 설비 PC도 SAC 없이 셋업하기로 했다.** 그러면 러너에만 SAC가 있는 것이 러너를 **비대표적**으로 만든다. 대상 환경에 없는 조건으로 검증하게 된다.

**② 서명본 조달로는 배포 문제가 해결되지 않는다.** 실측이다.

| | 번들 DLL 차단 | 우리 exe |
|---|---|---|
| 미서명 인터프리터로 빌드 | 1건 (`_ctypes`) | 통과 / 차단 / — (빌드마다 다름) |
| **NuGet 서명본으로 빌드** | **0건** | **5/5 차단** |

서명본은 인터프리터 계층을 완전히 정리하지만 **우리가 빌드한 exe는 세상에 하나뿐인 파일**이라 서명도 평판도 없다. 배포물이 안 뜨는 것은 그대로다.

| 선택지 | CI 해결 | 배포 해결 | 되돌리기 |
|---|---|---|---|
| NuGet 서명본 조달 | ✅ | ❌ | 쉬움 |
| **SAC 제거** | **✅** | **✅** | 불가 |
| 코드 서명 도입 | ✅ | ✅ | — (월 $10 + 조직 검증) |

**SAC를 껐다**(2026-07-29). 코드 변경 없이 같은 커밋으로 5회 재검증해 5/5 성공을 확인했다(직전 5회는 5/5 실패). NuGet 변경은 되돌리고 대신 `.python-version`으로 인터프리터 패치를 고정했다 — 서명이 무관해진 뒤에는 NuGet안이 **낡은 패치와 플랫폼별 분기**만 남기기 때문이다.

**전환 조건**: 우리가 셋업하지 못하는 장비에 배포하게 되면 제거가 불가능하므로 코드 서명으로 전환한다. 그때는 exe만이 아니라 번들의 미서명 파일 전부에 서명한다.

**Python 3.13 이동은 여전히 별건이다.** 서명 문제가 사라져 동기는 약해졌지만, 3.10 보안 지원 종료(2026-10)라는 별개 이유가 남아 있다.

## Related
- [[Application control verdicts come from a model so a missing signature does not predict the outcome]] — 정책이 서명을 요구하는 방식
- [[A Python distribution is a build choice so the same version number differs in signing and linkage]] — 채널별 차이의 기술적 근거
- [[Python's ssl module is a wrapper over OpenSSL DLLs so a blocked DLL surfaces as an unrelated import error]] — 차단이 드러난 증상
- [[Elimination beats tracing only when each hypothesis has a cheap observable]] — 같은 사건에서 나온 또 다른 방법론 교훈. 여기서도 값싼 실측이 추론보다 빨랐다
- [[Cross-platform reproducibility comes from locking resolution not from the manifest format]] — 락이 인터프리터 교체를 흡수하는 이유
- [[Gate only the path that needs verification instead of imposing a team-wide convention]] — 팀 영향이 있는 변경을 분리하는 원칙
- [[Existing team familiarity can outweigh a technically superior tool's advantages in real adoption decisions]] — "기존과 같게"가 합리적인 경우와 관성이 되는 경우
