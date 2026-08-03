---
created: 2026-07-31
updated: 2026-07-31
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - testing
  - api-design
  - observability
  - gpu
  - methodology
publish: true
---
## Context
앱이 "GPU 가속: 사용 중"이라 표시하면서 실제로는 CPU로 추론하고 있었다. 판정에 쓴 것이 `onnxruntime.get_available_providers()`였는데, GPU를 가려도(`CUDA_VISIBLE_DEVICES=""`) 목록에 `CUDAExecutionProvider`가 그대로 남았다.

같은 함정을 이미 `torch.cuda.is_available()`에서 고쳐놓고도 다른 라이브러리에서 반복했다는 것이 출발점이었다.

## Insight
### 선언은 빌드를 기술하고, 실행만이 이 기계를 기술한다

두 함수가 답하는 질문이 내가 묻고 싶은 질문과 달랐다.

```
get_available_providers()   →  "이 빌드에 컴파일된 provider 는 무엇인가"
torch.cuda.is_available()   →  "드라이버가 붙었는가"
내가 묻고 싶은 것            →  "이 PC 에서 지금 GPU 로 계산되는가"
```

**"할 수 있다"는 대개 빌드 시점의 사실이고, 필요한 것은 실행 시점의 사실이다.** 이름이 `available`이라 같은 것처럼 읽히는 게 함정의 절반이다.

### 조용한 폴백이 있으면 LBYL도 EAFP도 무력화된다

파이썬에는 이 문제의 표준 대립쌍이 있는데, 여기서는 둘 다 답을 주지 못했다.

```
LBYL  Look Before You Leap        먼저 묻는다   →  목록에 CUDA 가 있다고 답한다
EAFP  Easier to Ask Forgiveness   해보고 잡는다  →  CUDA 만 요청해도 예외 없이 CPU 로 떨어진다
```

**둘 다 안 되는 조건이 "조용한 폴백"이다.** 라이브러리가 사용자를 위해 우아하게 실패해줄수록 호출자는 실패를 관측할 수 없다. 그래서 세 번째 방법이 필요하다 — **해본 다음 결과를 읽는다.** `session.get_providers()`가 그 "결과 읽기"였다.

실측 판정 비용은 82바이트 모델로 7ms였다. **비용이 장벽이 아니라, 물어보면 된다는 습관이 장벽이었다.**

### 세 번째 사례가 코드 밖에서 나왔다는 것이 이 원리의 범위를 보여준다

같은 날 같은 형태를 세 번 만났다.

| 선언 | 실제 |
|---|---|
| `cuda_ready: True` | CPU 로 추론 중 |
| 라벨 "GPU 가속: 사용 중" | CPU 로 추론 중 |
| pytest 마커 `slow`, 설명 "수 분 걸리는 테스트" | 4건 5.4초, 학습 완주 테스트는 **0.05초** |

셋째는 코드가 아니라 **메타데이터**다. 그런데 피해가 같은 종류였다 — 이름이 "무겁다"고 말해서 "학습 파이프라인은 이미 검증되고 있다"고 읽혔고, 실제로는 세그멘테이션 export 경로가 통째로 미검증이었다.

**대조 장치가 없는 선언은 종류를 가리지 않고 어긋난다.** 값이든, 화면 문구든, 테스트 라벨이든.

### 판정만으로는 조치를 알 수 없어서 사유가 함께 와야 한다

`False`를 정확히 얻어도 무엇을 해야 할지는 여전히 모른다. 원인이 여럿인데 결과가 하나이기 때문이다.

```
no CUDA-capable device is detected           장비·드라이버 확인
libcublasLt.so.12: cannot open shared ...    의존 패키지 누락 → 재설치
CUDA driver version is insufficient          드라이버 갱신
```

셋 다 관측되는 결과는 "CPU 로 폴백"으로 같다. 그래서 판정 함수의 반환을 `(bool, reason)`으로 두었다. **사유는 로그가 아니라 값이어야 한다** — 소비자가 화면·로그·테스트 실패 메시지로 셋이고, `core` 계층은 UI 로거에 의존할 수 없다.

라이브러리가 원인을 `stdout`에 `print`로만 흘리는 경우까지 있었다. 로거 레벨로는 막히지 않아 `stdout`을 갈아끼워 받아냈는데, **그때 "모르는 형태면 원문을 접어서라도 넘긴다"가 중요했다.** 삼킨 쪽이 유일한 통로가 되므로 거기서 버리면 원인을 볼 방법이 사라진다.

### 실행 판정을 도입해야 비로소 단정을 걸 수 있다

이게 실용적인 귀결이다. 조회 기반 판정으로는 테스트를 쓸 수 없다 — 항상 참이니까.

```
조회 판정   assert providers 에 CUDA 가 있다     GPU 가 없어도 통과한다. 무의미
실행 판정   assert 실제로 CUDA 로 돌았다          회귀를 잡는다
```

그리고 **"GPU 없는 러너에서 실패한다"는 반론은 단정을 빼는 대신 조건을 다는 것으로 풀린다.** `GPU가 있으면 CUDA를 써야 한다`로 두면 장비 문제는 skip이 되고, 있는 곳에서는 회귀를 잡는다. 나는 처음에 문제와 해법을 함께 보고도 "그래서 안 한다"로 마무리했었다.

## Decision
**판정 함수는 조회하지 않고 최소 실제 작업을 실행해 결과를 읽는다. 반환은 `(가능 여부, 사람이 읽을 수 있는 사유)`이고, 결과는 프로세스 수명 동안 캐시한다.**

- 사유는 `core`가 문자열로 반환하고 로그는 호출자(`ui`)가 한다 — 소비자가 여럿이고 계층 경계를 넘을 수 없다
- 프로브는 실패 원인이 될 수 있는 부분만 `try`로 감싼다. 넓은 `except`는 오타 같은 프로그래머 오류를 환경 문제로 번역한다(실제로 `log_severity_level` 오타가 "CUDA를 쓸 수 없음"이라는 그럴듯한 진단으로 위장됐다)
- 실행 판정이 생긴 뒤에는 그것을 단정하는 테스트를 함께 넣는다. 그러지 않으면 다음 변경에서 조용히 되돌아간다

**전환 조건**: 프로브 비용이 기동 시간에서 유의미해지면 지연 실행으로 바꾼다. 지금은 7ms라 기동 시 한 번으로 충분하다.

## Related
- [[A non-deterministic component in the verification environment destroys the implication CI sells]] — 같은 축의 앞 단계. 그쪽은 검증 *환경*의 결정성, 이쪽은 검증 *질문*의 정확성
- [[A running deployment proves a past build worked not that current source still builds]] — 같은 형태. 선언이 다른 시점·다른 대상에 대한 진술이라는 것
- [[Application control verdicts come from a model so a missing signature does not predict the outcome]] — 선언(서명)의 유무가 결과를 결정하지 않았던 사례
- [[GPU stacks support different hardware at each layer so one layer's verdict does not speak for another]] — 왜 층마다 따로 판정해야 하는지의 구조적 이유
- [[A workaround becomes debt the moment the gap it covered closes]] — 같은 날 같은 프로젝트에서 나온 짝. 그쪽은 코드가 낡는 방식
- [[Test Oracle]] — "무엇이 정답인지 어떻게 아는가"의 일반 문제
- [[Comparison - Validation and Verification]] — 검증과 확인의 구분
- [[Elimination beats tracing only when each hypothesis has a cheap observable]] — 싼 관측 지점을 만드는 것이 판정의 전제
