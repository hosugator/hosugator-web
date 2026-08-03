---
created: 2026-07-31
updated: 2026-07-31
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - technical-debt
  - architecture
  - dependency-management
  - methodology
publish: true
---
## Context
설정 화면에 "onnxruntime-gpu 설치" 버튼이 있었다. 눌러도 이미 설치된 것을 재설치하고, 활성 조건이 `has_gpu and not cuda_ready`라 **CUDA가 깨진 상황에서 정확히 켜지면서 아무것도 고치지 못했다.**

지우기 전에 이력을 봤다. 버튼이 들어온 커밋(`8e0c88e`)이 lockfile 도입(`ae68872`)보다 **먼저**였다.

## Insight
### 우회로는 결핍의 함수라서, 결핍이 사라지면 근거도 사라진다

버튼이 만들어진 시점의 조건을 복원하면 합리적인 선택이었다.

```
그때   requirements.txt + setup.bat,  lockfile 없음
       → 매니페스트를 고치면 모든 PC 에서 setup 재실행
       → 이미 배포된 PC 를 런타임에 고치는 버튼이 현실적인 탈출구였다

지금   pyproject.toml + uv.lock
       → uv sync 한 번으로 모든 PC 가 같아진다
```

**버튼이 잘못 만들어진 게 아니라, 그것을 필요하게 만들던 결핍이 8개월 전에 사라졌다.** 판단해야 할 것은 "이 코드가 좋은가"가 아니라 **"이것을 필요하게 만든 조건이 아직 있는가"**다.

### 전환 시점에는 아무 신호가 나지 않는다

이게 핵심 문제다. lockfile을 도입한 커밋은 자기가 무엇을 무용하게 만들었는지 알려주지 않았다.

```
우회로 도입   명시적이다. 커밋이 있고 이유가 적힌다
결핍 해소     명시적이다. 커밋이 있고 이유가 적힌다
전환          암묵적이다. 아무 데도 기록되지 않는다
```

**두 사건 사이의 관계는 어느 쪽 커밋에도 없다.** 그래서 우회로는 조용히 남고, 시간이 지날수록 "원래 있던 것"으로 읽힌다.

### 무용해진 우회로는 무해하지 않다

지웠어야 할 이유가 "쓸모없어서"가 아니었다. 남아 있는 동안 **적극적으로 해로웠다.**

```
lock 밖에서 pip 을 쓴다        venv 와 lock 이 어긋난다. 다음 uv sync 가 되돌린다
--upgrade 에 버전 핀이 없다    검증되지 않은 조합이 설비 PC 에 설치될 수 있다
안 고쳐지는데 켜진다           사용자가 원인을 오해한다
```

**우회로가 우회하던 결핍이 해소되면, 그 우회로는 새 메커니즘과 경쟁하게 된다.** 공존이 아니라 충돌이다 — 여기서는 버튼이 lockfile의 보장을 깨는 유일한 경로였다.

### 판별 신호는 "조건이 아직 있는가"이고, 기록해두면 검색 가능해진다

우회로를 지울지 판단할 때 코드를 보면 답이 안 나온다. 코드는 잘 돌아가고 있다. **없는 것을 봐야 한다.**

```
이 코드는 무엇이 없어서 존재하는가
그것이 지금 있는가
```

그래서 앞으로는 우회로에 **해소 조건을 주석으로 남긴다.** "lockfile이 생기면 이 버튼은 불필요하다"가 적혀 있었다면 lockfile 도입 커밋에서 `grep`으로 찾을 수 있었다. **전환에 신호가 없다면 신호를 미리 심어두는 수밖에 없다.**

### 이력 확인이 제거를 정치적으로 만들지 않는다

실무적으로 중요했던 부분이다. 동료가 작성한 코드를 지우는 MR이었는데, **당시 조건에서는 합리적이었다는 것을 확인하고 그것을 설명에 적으니** 성격이 달라졌다.

```
"이 코드는 잘못됐다"        판단에 대한 지적
"이 코드의 전제가 사라졌다"  조건 변화의 반영
```

후자가 사실에도 맞고, 리뷰어가 방어할 필요도 없앤다. **`git log -S`로 도입 시점과 그 무렵의 제약을 복원하는 것이 코드를 읽는 것보다 판단에 직접적이었다.**

## Decision
**버튼과 그 구현(`install_onnxruntime_gpu`, 백그라운드 워커, 다이얼로그)을 제거했다.** 대안(진단 결과 복사 기능 등)을 넣지 않았다 — 필요가 실재하지 않는데 넣으면 같은 종류의 부채를 새로 만든다.

앞으로 **우회로에는 해소 조건을 주석으로 남긴다.** 조건이 생겼을 때 검색으로 찾을 수 있도록.

**전환 조건**: 우리가 셋업하지 못하는 장비에 배포하게 되면 런타임 조치 경로가 다시 필요해질 수 있다. 그때는 lockfile을 깨지 않는 형태(고정 버전, 진단 결과 기반)로 새로 설계한다.

## Related
- [[Abstraction is triggered by the need to share so abstracting the unshared only adds cost]] — 같은 형태. 그쪽은 "필요가 생기기 전", 이쪽은 "필요가 사라진 뒤"
- [[Cross-platform reproducibility comes from locking resolution not from the manifest format]] — 결핍을 해소한 메커니즘. 이 노트의 전환을 일으킨 사건
- [[Verify a capability by exercising it because declarations describe the build not the machine]] — 같은 날의 짝. 버튼을 지울 수 있게 만든 것이 실행 기반 판정이었다
- [[A non-deterministic component in the verification environment destroys the implication CI sells]] — 우회로가 깨뜨리던 보장의 정체
- [[Treating revisiting as failure turns knowledge systems into debt]] — 재방문하지 않으면 부채가 된다는 같은 구조를 지식 시스템에서
- [[Roll back the deployment not the history]] — 이력을 남겨두는 것이 판단의 근거가 된다는 실례
