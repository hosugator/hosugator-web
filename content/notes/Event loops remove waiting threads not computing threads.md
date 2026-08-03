---
created: 2026-07-28
updated: 2026-07-28
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - concurrency
  - event-loop
  - qt
  - async
  - thread
publish: true
---
## Context
MLA 검사기 사이드바에 GPU 사용률·VRAM을 추가하려 했다. 값은 `nvidia-smi`로 얻는데 측정해보니 30ms이고, 위젯 갱신 주기가 1.5초다. 기존 지표(CPU/RAM)는 `psutil` 동기 호출로 충분했지만 subprocess는 성격이 다르다. `QThread`를 쓸지 `QProcess`를 쓸지 판단하면서 정리했다.

## Insight
### "스레드 없이 비블로킹"은 기다리는 주체가 스레드가 아니라 커널이라는 뜻이다

`subprocess.run`은 내 스레드가 자식이 끝날 때까지 서서 기다린다. `QProcess`는 커널에 "준비되면 알려줘"라고 등록하고 즉시 돌아온다.
혼동하기 쉬운 지점 — 자식 프로세스는 어느 방식이든 병렬로 실행된다. 차이는 내 프로그램이 그걸 기다리느라 스레드 하나를 묶어두는가다.

### 통지 기능은 커널이 기본 제공하고, 프레임워크는 그것을 감싼다

라이브러리가 아니라 시스템 콜이다. 

```
애플리케이션      QProcess.finished / await / callback
프레임워크        Qt: QEventDispatcherGlib (실측)  |  Node: libuv  |  asyncio: selectors
커널              epoll / kqueue / IOCP
```

Qt가 플랫폼별 디스패처를 고르는 것이 `QProcess` 코드가 양 플랫폼에서 그대로 도는 이유다 — Qt 플랫폼 플러그인(`wayland`/`xcb`)과 같은 추상화 방식이다.

### 모든 기다림을 fd 준비 상태로 환원해야 단일 루프가 성립한다

`epoll`은 파일 디스크립터를 감시하는데, 유닉스에서 자식 종료는 fd가 아니라 `SIGCHLD` 시그널로 온다. 모델이 다르다.
그래서 Qt와 libuv는 시그널 핸들러가 파이프에 1바이트를 쓰고 그 파이프를 감시하게 만든다(self-pipe trick). 프로세스 종료·소켓·타이머·키보드 입력이 하나의 형태로 통일되어야 단일 스레드가 전부 처리할 수 있다. 이게 이벤트 루프 방식의 핵심 설계다.

### 판단 기준은 "기다리는가, 계산하는가"다 ← 핵심

이벤트 루프가 통하는 것은 기다림을 커널에 위임할 수 있을 때뿐이다.

```python
_SegTrainWorker(QThread)      # 학습 — 계속 계산한다  → 스레드가 맞다
_GpuInstallWorker(QThread)    # pip install 대기      → 기다리기만 한다
```

대가가 있다 — `install_onnxruntime_gpu`가 `subprocess.run(capture_output=True)`라서 출력이 끝난 뒤에만 온다.
수 GB 다운로드를 몇 분간 피드백 없이 기다리게 되고, 로그 메시지가 그걸 인정하고 있다("수 분 소요될 수 있습니다"). `QProcess`의 `readyReadStandardOutput`이면 pip 출력이 실시간으로 흘렀을 것이다 — 스레드도 없이.

### 종료 경로에서는 블로킹이 정당하다

`QProcess`가 조회 중인 상태로 앱이 닫히면 소멸자가 경고를 낸다("Destroyed while process is still running"). `aboutToQuit`에서 `kill()` + `waitForFinished(500)`으로 정리했다.
`waitForFinished()`는 블로킹이라 GUI에서 금기지만, 종료 경로는 응답성이 무의미하고 확실한 정리가 우선이다. 규칙에 예외가 있는 게 아니라 규칙의 목적(응답성)이 적용되지 않는 구간이다.

## Related
- [[Defensive error handling converts porting bugs into silent feature loss]] — 같은 프로젝트. 파서가 예외를 던지지 않고 None을 반환하는 이유(QProcess 시그널에서 예외는 GUI에서 보이지 않는다)가 이 계보
- [[Cross-platform reproducibility comes from locking resolution not from the manifest format]] — 같은 세션의 의존성 이관
- [[Comparison - Thread Execution Method]] — 스레드 API 오용(start vs run). 이쪽은 스레드 자체가 필요한지의 문제
- [[Thread Execution]] — 스레드 실행 모델
- [[Synchronous · Asynchronous Integration]] — 동기/비동기 통합 관점
