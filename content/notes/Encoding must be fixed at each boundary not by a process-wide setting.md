---
created: 2026-07-28
updated: 2026-07-28
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - encoding
  - cross-platform
  - windows
  - subprocess
publish: true
---
## Context
리눅스에서 개발한 MLA 검사기를 공용 Windows PC에서 검증했다. 테스트 101건 중 **1건만 실패**했는데, `comm.ping()`이 루프백에도 실패했다. 리눅스에서는 통과하던 코드다.

```
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xb9 in position 19
  in subprocess._readerthread -> codecs.decode
```

## Insight
### 한 프로세스 안에 인코딩이 다른 경계가 둘 이상 있으면 전역 설정으로는 못 맞춘다

이 프로그램에는 서로 다른 요구를 가진 경계가 두 개 있었다.

| 경계 | 요구 인코딩 | 이유 |
|---|---|---|
| 콘솔 출력 (테스트 로그, assert 메시지) | UTF-8 | 소스의 한글 문자열 |
| `ping.exe` stdout | **cp949** | 한국어 Windows 시스템 도구의 출력 |

`PYTHONUTF8=1`(PEP 540)은 **프로세스 전역**이다. 켜면 콘솔은 살고 subprocess 디코딩이 죽고, 끄면 반대가 된다. **양쪽 다 이기는 값이 없다.**

CI에 `PYTHONUTF8=1`을 넣은 것이 이 실패를 유발했다는 점이 특히 시사적이다 — 한 문제(콘솔 mojibake)를 고치려고 넣은 설정이 다른 문제를 만들었고, 두 문제가 같은 스위치를 공유했다.

### `text=True`는 "주변 환경을 따른다"는 뜻이고, 그것이 곧 결정을 미루는 것이다

```python
subprocess.run(cmd, capture_output=True, text=True)   # 어떤 인코딩? 환경이 정한다
```

편의 인자로 보이지만 실제로는 **디코딩 결정을 호출 시점의 환경에 위임**한다. 개발 머신과 실행 머신의 로케일이 다르면 같은 코드가 다르게 동작한다. 리눅스에서 이 코드가 통과한 이유는 로케일이 UTF-8이라 **두 경계가 우연히 일치**했기 때문이고, 코드가 옳았기 때문이 아니다.

### 경계마다 명시적으로 처리하면 전역 설정과 무관해진다

```python
r = subprocess.run(cmd, capture_output=True)          # bytes
stdout = r.stdout.decode(errors="replace")            # 이 경계의 결정
```

`errors="replace"`가 핵심이다. 필요한 것은 `"TTL="`가 포함된 한 줄뿐이라 **손실 디코딩이 허용된다.** 요구사항을 좁게 정의하면 인코딩을 정확히 알 필요가 없어진다 — 인코딩을 맞히려 하지 말고, 틀려도 되는 범위를 찾는 편이 견고하다.

### 이 실패도 무증상이었다

`comm.ping()`의 `except Exception`이 `UnicodeDecodeError`를 삼켜 `(False, "Ping 실행 오류: ...")`를 반환했다. 사용자에게는 **"Ping 실패"로만 보인다** — 네트워크 문제와 구별되지 않는다.

[[Defensive error handling converts porting bugs into silent feature loss]]와 정확히 같은 구조다. 예외를 넓게 잡으면 이식 실패가 기능 실패로 위장된다. 이번에는 테스트가 있어서 잡혔다.

### 로케일이 같으면 버그가 숨는다

개발 환경(Linux, UTF-8 로케일)에서는 두 경계가 같은 인코딩이라 이 버그가 존재할 수 없다. **환경 다양성이 없으면 인코딩 버그는 발견 자체가 불가능하다.** 크로스플랫폼 CI의 값이 여기에 있다 — 코드를 두 번 검사하는 게 아니라, 우연한 일치를 제거한다.

## Decision
환경변수가 아니라 코드에서 해결했다. `PYTHONUTF8=1`은 CI에 그대로 유지한다 — 콘솔 출력에는 여전히 필요하고, 이제 subprocess 경계가 그것에 의존하지 않는다.

```python
# comm.ping()
r = subprocess.run([*cmd, host], capture_output=True, timeout=timeout_s + 2, **kwargs)
stdout = r.stdout.decode(errors="replace")
```

**점검 기준으로 삼을 것**: `text=True`나 `encoding=` 없는 텍스트 디코딩이 코드에 있으면, 그 경계가 어떤 인코딩을 받는지 명시돼 있는지 확인한다. 시스템 도구의 출력을 파싱하는 지점이 특히 위험하다.

**전환 조건**: 출력 전체를 정확히 보존해야 하는 요구가 생기면(로그 저장 등) `errors="replace"`로는 부족하다. 그때는 플랫폼별 콘솔 코드페이지를 조회해 명시적으로 지정한다.

## Related
- [[Defensive error handling converts porting bugs into silent feature loss]] — 같은 무증상 실패 구조. 이 버그가 그 계보의 새 사례다
- [[Gate only the path that needs verification instead of imposing a team-wide convention]] — 이 버그를 발견한 CI 구성
- [[Verification needs less access than integration so route around the missing permission]] — 이 버그를 발견한 검증 진행 방식
- [[CUDA capability must be verified by executing a kernel not by querying availability]] — 환경 의존 판정을 코드에서 확인하는 동일 원칙
