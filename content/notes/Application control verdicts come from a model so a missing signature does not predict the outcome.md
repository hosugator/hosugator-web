---
created: 2026-07-29
updated: 2026-07-29
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - windows
  - security
  - code-signing
  - ci-cd
publish: true
---
## Context
공용 개발 PC의 GitLab 러너에서 Windows 잡이 실패했다. 원인은 **Smart App Control**이었다.

처음 이 노트를 쓸 때 "신뢰 근거는 코드 서명과 평판 두 가지뿐이고, 둘 다 없으면 차단된다"고 정리했다. **그 모델이 틀렸다.** 서명도 평판도 없는 PyInstaller 빌드가 통과하는 것을 관측하면서 드러났다.

## Insight
### 이 이슈의 이름 — 계층마다 다르다

| 계층 | 이름 | 이번 사례 |
|---|---|---|
| 일반 개념 | **애플리케이션 제어**(application control) | — |
| 커널 기능 | **코드 무결성**(Code Integrity) | 이벤트 로그 `Microsoft-Windows-CodeIntegrity` |
| 정책 엔진 | **WDAC** (Windows Defender Application Control) | Policy ID `{0283ac0f-...}` |
| 소비자용 이름 | **Smart App Control (SAC)** | 이것이 켜져 있었다 |
| 구형 정책 엔진 | **AppLocker** (그룹 정책 기반) | 켜져 있었으나 무관 |

**SAC는 WDAC 정책 하나에 붙은 사용자 친화적 이름**이다. UI에는 "스마트 앱 제어"만 보이지만 로그는 CodeIntegrity/WDAC 용어로 남는다. 이 대응을 모르면 로그를 못 찾는다.

### 판정은 규칙이 아니라 모델 추론이다

내가 세웠던 모델은 이랬다.

```
서명 있음      →  통과
평판 있음      →  통과
둘 다 없음     →  차단      ← 이게 틀렸다
```

반증이 명확했다. PyInstaller로 빌드한 exe 세 개(해시 전부 다름)를 SAC 환경에서 실행한 결과다.

| 빌드 | 서명 | 평판 | 결과 |
|---|---|---|---|
| 1차 | 없음 | 없음(세상에 하나뿐인 파일) | **5/5 기동** |
| 2차 | 없음 | 없음 | 3/3 실행 거부 |
| 3차 | 없음 | 없음 | 5/5 실행 거부 |

같은 속성을 가진 세 파일이 다른 결과를 받았다. **"서명 없음 + 평판 없음"이 결과를 결정하지 않는다.**

SAC는 파일이 안전할지를 **추정하는 모델**이다. 입력이 서명·평판만이 아니라 파일 구조, 알려진 소프트웨어와의 유사성 등을 포함하고, 모델 출력은 역치 근처에서 뒤집힌다. 서명 없는 파일 두 개가 다른 판정을 받는 것은 이 설계 안에서 이상하지 않다.

**규칙 기반이라고 가정하면 관측이 설명되지 않고, 관측을 오동작으로 오해한다.**

### 서명은 위임된 신뢰이고 평판은 그 통계적 대체물이다

두 근거의 성질이 다르다. [[Bootstrap resolves circular dependency by establishing initial trust through out-of-band means]]의 구조가 그대로 적용된다.

```
서명   CA 계층이라는 외부 수단으로 신뢰를 확립한다
       → 증거가 파일 안에 있다. 불변이고 이동해도 유지된다
       → 판정이 결정적이다

평판   "세상이 이미 무사히 써왔다"는 관측 통계로 대체한다
       → 증거가 클라우드에 있다. 가변이고 파일에 붙어 다니지 않는다
       → 판정이 비결정적이다
```

**Linux에 평판 기반 판정이 없는 이유가 여기서 보인다** — 배포판 저장소가 큐레이션된 신뢰 출처 역할을 이미 한다. Windows는 그게 없어서 통계로 대체했다.

그리고 역설이 하나 나온다. **평판은 새 파일에 불리하다.**

```
갓 나온 보안 패치   → 아직 안 퍼짐 → 평판 없음 → 막힐 수 있음
3년 묵은 옛 버전     → 널리 퍼짐   → 평판 있음 → 통과
갓 빌드한 릴리스     → 세상에 하나 → 평판 없음 → 막힐 수 있음
```

"흔한 것"과 "안전한 것"이 어긋난다.

### 판정은 파일 사본 단위로 내려지고 그 사본에 대해서는 안정적이다

같은 바이트가 위치에 따라 동시에 다른 판정을 받았다.

```
러너 빌드 폴더의 _ctypes.pyd        차단
%APPDATA% 사본 (같은 해시)          통과      ← 동시각 관측
검증 클론 사본 (같은 해시)          통과
```

그런데 **하나의 사본에 대해서는 일관됐다** — 러너 사본은 5회 연속 재시도에서 5/5 차단, 45분간 42건. 시간이 지나면(수 시간 단위) 뒤집히기도 한다.

**"불규칙"이 아니라 "사본마다 다르고 예측할 수 없다"가 정확하다.** 그래서 재시도는 대응책이 아니다 — 같은 사본을 다시 실행할 뿐이다.

### 차단된 실제 파일은 애플리케이션 오류가 아니라 OS 로그에 있다

```
애플리케이션 : ImportError: DLL load failed while importing _ssl   ← 요청한 모듈
OS 로그      : ...attempted to load ...\DLLs\libcrypto-1_1-x64.dll ← 실제 차단된 파일
```

이름이 다르다. 애플리케이션 오류만 보면 잘못된 파일을 조사한다.

| ID | 뜻 |
|---|---|
| `3076` | 감사 — 차단하지 않았지만 정책 위반 (평가 모드의 흔적) |
| `3077` | **실제 차단** |
| `3033` | 서명 수준 미달로 로드 실패 |
| `3089` | 위 이벤트의 서명 정보 (Correlation Id로 짝을 맞춘다) |

```powershell
Get-WinEvent -LogName 'Microsoft-Windows-CodeIntegrity/Operational' -MaxEvents 30 |
  Where-Object { $_.Id -in 3076,3077,3033 } | Select-Object TimeCreated, Id, Message
```

### 조절 수단이 하나도 없다

이게 SAC가 개발·빌드 기계에 부적합한 결정적 이유다.

| | 감사 모드 | 경로 예외 | 사용자 무시 |
|---|---|---|---|
| AppLocker / WDAC | ✅ | ✅ | — |
| SmartScreen | — | — | ✅ "실행" |
| **SAC** | ❌ | ❌ | ❌ |

그리고 **끄면 다시 켤 수 없다**(재설치 필요). 클린 설치된 Windows 11에서만 자동으로 켜지므로, 기계 일생의 첫 몇 시간에 결정되고 그 뒤로 바뀌지 않는다.

개발 머신은 서명도 평판도 없는 바이너리를 매일 만들어 실행하는 것이 일이다. **소비자 기기용 프리셋을 개발 기계에 적용한 것이 이번 마찰의 정확한 위치**이고, Microsoft 자신도 개발자 기계에는 끄라고 안내한다.

## Decision
러너 호스트에서 SAC를 껐다(2026-07-29). 코드를 바꾸지 않고 같은 커밋으로 5회 재검증해 5/5 성공을 확인했다(직전 5회는 5/5 실패).

**서명된 인터프리터 조달로 우회하지 않은 이유** — 설비 PC도 SAC 없이 셋업하기로 했으므로, 러너에만 SAC가 있으면 러너가 대상 환경을 대표하지 못한다. 그리고 서명본으로는 배포 문제가 해결되지 않는다(우리 exe가 여전히 막힌다).

**전환 조건** — 우리가 셋업하지 못하는 장비에 배포하게 되면 코드 서명을 도입한다. 그때는 exe만이 아니라 번들의 미서명 파일 전부에 서명한다.

## Related
- [[A non-deterministic component in the verification environment destroys the implication CI sells]] — 이 판정 성질이 CI에 왜 치명적인지
- [[Bootstrap resolves circular dependency by establishing initial trust through out-of-band means]] — 서명이 신뢰를 확립하는 구조
- [[Python's ssl module is a wrapper over OpenSSL DLLs so a blocked DLL surfaces as an unrelated import error]] — 차단이 애플리케이션에 나타난 형태
- [[A Python distribution is a build choice so the same version number differs in signing and linkage]] — 어느 배포본이 서명돼 있는지
- [[Signing requirements conflict with a provisioning channel not with hermetic builds]] — 조달 채널 선택의 판단
- [[Elimination beats tracing only when each hypothesis has a cheap observable]] — OS 로그를 먼저 보는 것이 가설 나열보다 빠르다
