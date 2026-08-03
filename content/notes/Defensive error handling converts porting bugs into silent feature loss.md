---
created: 2026-07-27
updated: 2026-08-03
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - porting
  - cross-platform
  - qt
  - error-handling
publish: true
---
## Context
Windows 전용으로 개발된 22,000줄 PySide6 앱(MLA AOI 검사기)을 Ubuntu 24.04에서 돌려봤다. 실행 가능성을 검토하는 게 목적이었는데, 예상과 정반대 결과가 나왔다. 앱은 첫 시도에 떴고, 대신 기능들이 조용히 사라져 있었다.

## Insight
### 이식 비용은 GUI 계층이 아니라 플랫폼 API 몇 지점에 응집된다

Qt가 창 시스템을 플러그인으로 추상화하기 때문에(`xcb`/`wayland`/`offscreen`) GUI 22,000줄이 소스 수정 0으로 리눅스에서 렌더링됐다. 실제 Windows 결합은 다섯 군데뿐이었다.
이식 견적을 낼 때 코드 총량이나 GUI 규모로 추정하면 크게 틀린다. 크로스플랫폼 프레임워크를 쓰고 있다면 비용은 프레임워크 밖으로 나가는 호출 지점의 개수다.

### 방어적 예외 처리가 이식 실패를 크래시가 아니라 무증상으로 바꾼다

발견된 문제 중 프로그램을 죽인 것은 하나도 없었다. 전부 조용히 기능만 없어졌다.

```python
for drive in ("C:\\", "D:\\"):
    try:
        psutil.disk_usage(drive)
    except OSError:
        continue          # ← 리눅스에서 전부 걸러짐 → 디스크 위젯이 통째로 소멸
```

`os.startfile`은 `lambda` 안에 있어 클릭 시 트레이스백만 찍히고 앱은 살아남았다. GUI 앱이라 stderr가 사용자에게 보이지 않으니 버튼이 그냥 반응 없는 상태가 된다.
크래시는 신호다. 조용한 축소는 신호가 없다. 방어적 `try/except`는 프로덕션 견고성을 위해 넣지만, 이식 상황에서는 진단 정보를 파괴하는 장치로 역전된다.

## Decision
### 20260727

플랫폼 분기는 `sys.platform`으로 명시하고, 폴백할 때는 반드시 사유를 로그로 남기는 방식을 택했다. 조용한 폴백을 금지하는 것이 핵심이다.

- `os.startfile` → `QDesktopServices.openUrl` (프레임워크가 플랫폼별 처리)
- ping → OS별 인자·타임아웃 단위 분기 (`-n/-w` ms vs `-c/-W` s)
- 디스크 → Windows는 드라이브 문자, 그 외는 `/` + 데이터 루트가 별도 마운트일 때만 추가
- SDK 탐색 → OS별 레이아웃 후보 목록 + 실패 사유를 `MVS_ERROR`에 보존
- 네이티브 후킹 → 비Windows에서 설치 자체를 건너뛰고 `None` 반환

전환 조건: 지원 플랫폼이 3개를 넘으면 분기가 호출부에 흩어지므로, 플랫폼 추상화 계층을 별도 모듈로 분리한다.

## Related
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]] — 현장 Windows / 서버 Linux 생태계 분리의 배경
- [[A broken config symlink silently disables all terminal keybinds without error]] — 무증상 실패의 동일 패턴
- [[Argo CD self-healing silently restarts Jobs in monitored directories]] — 자동화가 조용히 개입하는 사례
- [[CUDA capability must be verified by executing a kernel not by querying availability]] — 같은 이식 작업에서 나온 무증상 실패 사례
