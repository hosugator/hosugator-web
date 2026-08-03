---
created: 2026-07-29
updated: 2026-07-29
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - python
  - openssl
  - dll
  - pytest
  - debugging
publish: true
---
## Context
Windows CI에서 pytest가 테스트를 한 건도 수집하기 전에 죽었다. 오류는 `ImportError: DLL load failed while importing _ssl`이었다. 왜 테스트 러너가 SSL 때문에 죽는지, `_ssl`이 무엇인지 몰라 스택 트레이스를 읽을 수 없었다.

## Insight
### 용어 정리 — DLL, 확장 모듈, OpenSSL

| 용어                         | 뜻                                                        | 이번 사례의 파일               |
| -------------------------- | -------------------------------------------------------- | ----------------------- |
| DLL (Dynamic Link Library) | 실행 시점에 로드되는 기계어 코드 묶음. Linux의 `.so`에 해당                  | `libcrypto-1_1-x64.dll` |
| 확장 모듈                      | C로 작성해 컴파일한 Python 모듈. Windows에서는 확장자가 `.pyd`이지만 실체는 DLL | `_ssl.pyd`              |
| OpenSSL                    | TLS와 암호 연산을 구현한 C 라이브러리. Python은 이걸 직접 구현하지 않고 갖다 쓴다     | 아래 두 개                  |
| ├ `libcrypto`              | 암호 프리미티브 (해시·대칭키·공개키 연산)                                 | `libcrypto-1_1-x64.dll` |
| └ `libssl`                 | 그 위에 얹은 TLS 프로토콜                                         | `libssl-1_1-x64.dll`    |

`1_1`은 OpenSSL 1.1 계열이라는 뜻이다. Python 3.10은 1.1.1을 쓰고, 3.11+ 는 3.x를 쓴다.

### 밑줄로 시작하는 모듈 이름은 C 구현체를 가리키는 관례다

```
ssl.py    ← 파이썬으로 쓴 편의 계층 (인증서 검증 옵션, 컨텍스트 객체 등)
  └ _ssl  ← 실제 암호 연산을 하는 C 확장 모듈 (_ssl.pyd)
```

`ssl.py` 안에는 이런 줄이 있다.

```python
import _ssl   # if we can't import it, let the error propagate
```

주석이 의도를 말해준다 — 여기서 실패하면 감추지 말고 그대로 올려보내라. 그래서 우리가 최상위에서 그 오류를 봤다. `socket`/`_socket`, `datetime`/`_datetime`도 같은 구조다.

### 로드 실패는 아래에서 위로 전파되므로 최상위 오류는 진짜 원인이 아니다

이번 실패의 전체 사슬이다.

```
pytest 시작
 └ setuptools 엔트리포인트 'pytest11' 스캔      ← 설치된 pytest 플러그인을 자동 탐색
    └ anyio 임포트                              ← 비동기 I/O 라이브러리. pytest 플러그인을 제공한다
       └ anyio._core._sockets → import ssl
          └ ssl.py → import _ssl
             └ _ssl.pyd 로드 → 의존 DLL 필요
                └ libcrypto-1_1-x64.dll  ← ★ OS가 차단
```

두 가지가 여기서 보인다.

첫째, 우리 코드는 전혀 관여하지 않았다. `anyio`는 우리가 직접 쓰지 않는 전이 의존성인데, pytest가 설치된 플러그인을 자동으로 찾아 로드하기 때문에 임포트된다. 그래서 테스트 수집 이전 단계에서 죽었고, 결과가 "97 passed"가 아니라 0건 실행이었다.

둘째, 오류가 지목한 이름과 실제 막힌 파일이 다르다.

```
오류 메시지     : _ssl                      ← 임포트를 요청한 모듈
실제 차단된 파일 : libcrypto-1_1-x64.dll    ← 그 모듈이 끌어오다 막힌 DLL
```

Windows의 DLL 로더는 실패 사유를 호출자에게 파일 단위로 알려주지 않는다. 그래서 애플리케이션 오류만으로는 어떤 파일이 문제인지 알 수 없고, OS 쪽 로그를 봐야 한다. 이번에도 CodeIntegrity 이벤트 로그에서 파일명을 얻었다.

일반화하면 이렇다. `DLL load failed while importing X`에서 X는 증상이고, 원인 파일은 X의 의존성 중에 있다. 조사할 것은 X가 아니라 X가 무엇을 끌어오는지다.

### 이 실패 유형을 구분하는 법

`DLL load failed`는 사유가 여러 개라 메시지 뒷부분이 결정적이다.

| 뒷부분 | 실제 원인 |
|---|---|
| `지정된 모듈을 찾을 수 없습니다` | 의존 DLL이 없다 — 배포 누락, PATH 문제 |
| `지정된 프로시저를 찾을 수 없습니다` | DLL이 있지만 버전이 다르다 — 다른 OpenSSL이 먼저 잡힘 |
| `애플리케이션 제어 정책에서 이 파일을 차단했습니다` | 파일이 있고 맞지만 OS가 실행을 거부 ← 이번 사례 |

같은 `ImportError`처럼 보여도 조사 방향이 완전히 다르다. 앞의 두 개는 파일과 경로 문제이고, 마지막은 [[Application control verdicts come from a model so a missing signature does not predict the outcome]] 문제다.

확인은 한 줄로 재현된다.

```powershell
<대상 python.exe> -c "import ssl; print('OK', ssl.OPENSSL_VERSION)"
```

전체 CI를 돌리지 않고 인터프리터 하나만 지목해 검증할 수 있다 — 이번에 판정을 확정한 방법이다.

## Related
- [[Application control verdicts come from a model so a missing signature does not predict the outcome]] — 이 DLL을 막은 정책
- [[A Python distribution is a build choice so the same version number differs in signing and linkage]] — 어느 배포본의 DLL이 막히는지
- [[Deployment size is decided by what gets linked not by the implementation language]] — Python이 네이티브 라이브러리에 얹혀 있다는 같은 사실의 다른 결과
- [[Defensive error handling converts porting bugs into silent feature loss]] — 오류가 원인을 가리는 다른 형태
