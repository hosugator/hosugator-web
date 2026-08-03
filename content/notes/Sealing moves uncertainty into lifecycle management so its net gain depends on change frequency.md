---
created: 2026-07-29
updated: 2026-07-29
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - containerization
  - deployment
  - trade-off
  - windows
publish: true
---
## Context
Windows 설비 PC에서 Linux 이미지(WSL2 경유)를 쓸지 검토했다. 환경 일관성이라는 이득은 명확했는데, **이득만 세고 비용을 세지 않고 있었다.** 비용이 어디서 나오는지 정리하니 학습과 추론에서 답이 반대로 나왔다.

## Insight
### 봉인은 불확실성을 없애지 않고 생애주기 관리로 옮긴다

컨테이너 안의 환경 변수는 사라진다. 그런데 **그것을 띄우고 살려두는 층이 봉인 밖에 새로 생긴다.**

Windows에서 Linux 컨테이너를 무인으로 유지하려면 이렇게 쌓아야 한다.

```
Windows 서비스 또는 스케줄 작업
  └ wsl.exe 로 배포판 기동        WSL2 는 서비스가 아니다. 첫 호출까지 안 뜨고 유휴 시 종료된다
      └ dockerd 기동              Docker Desktop 은 사용자 세션에 묶인다
          └ 컨테이너 기동
              └ 헬스체크 + 재시작  직접 구현
```

이 층의 성질이 나쁘다.

| | 봉인 안 | 감시 스크립트 |
|---|---|---|
| 버전 관리 | 다이제스트로 고정 | 호스트 파일. 앱과 함께 버전 관리 안 됨 |
| 재현성 | 보장 | Task Scheduler 설정·자격증명·`.wslconfig`에 의존 |
| CI 검증 | 가능 | **불가** — 부팅 시나리오를 CI에서 못 돌린다 |

**봉인해서 없앤 성질이 그대로 밖에서 재발한다.**

### 감시자와 감시 대상의 계층이 맞아야 신호가 전달된다

이게 비용의 근원이다. 문제는 "Windows에 생애주기 표준이 없다"가 아니다 — 네이티브 프로세스에는 있다(서비스/SCM). **없는 것은 컨테이너를 이해하는 감시자다.**

```
Linux    systemd ──▶ 컨테이너        계층 일치. 종료 코드·헬스가 그대로 전달
         kubelet ──▶ 파드

Windows  SCM ──▶ wsl.exe ──▶ dockerd ──▶ 컨테이너
         └ SCM 이 보는 "살아 있음"은 wsl.exe 의 상태다.
           컨테이너가 죽어도 SCM 은 정상으로 본다
```

**감시자가 엉뚱한 것을 보고 있으면 재시작 의미가 합성되지 않는다.** 각 층이 자기 실패 의미를 따로 갖고 서로를 모른다.

그리고 계층을 맞추려면 오케스트레이터가 필요한데, 설비에서는 이미 배제한 선택지다 — [[Orchestrator autonomy conflicts with equipment control so equipment PCs stay clients]]. 자율적 재배치·재시작이 설비 제어와 충돌한다.

```
컨테이너 생애주기를 제대로 얻으려면  →  오케스트레이터
오케스트레이터는 설비에 부적합       →  이미 내린 결론
따라서 설비의 컨테이너는             →  임시 조립 감시에 머문다
```

### 순이득은 시간에 따라 다르게 쌓인다

```
이득 ≈ (봉인 대상의 복잡도) × (그 대상의 변경 빈도)
비용 ≈ (생애주기 관리 복잡도) × (운영 기간)  +  도입 1회 비용
```

**이득은 변경할 때 실현되고 비용은 매 부팅마다 지불된다.** 스택이 안 바뀌면 이미지는 아무것도 벌지 못하면서 감시 비용만 낸다.

이 프로젝트에 대입하면 답이 갈린다.

| | 봉인 복잡도 | 변경 빈도 | 운영 기간 | 순이득 |
|---|---|---|---|---|
| 학습 | 큼 (torch·CUDA·cuDNN 조합) | 중간 (버전 업그레이드) | 개발 시간, 유인 실행 | **양** |
| 추론(설비) | 작음 (onnxruntime) | **거의 0** | 수년, 24시간 무인 | 음 |

### 추론의 변경 빈도가 0에 가까운 이유

**자주 바뀌는 건 런타임이 아니라 모델이다.** 그리고 모델 교체는 산출물 파일 하나를 바꾸는 것이라 재이미지화가 필요 없다.

```
바뀌는 것    ONNX        →  파일 교체로 끝. 이미지 무관
안 바뀌는 것  onnxruntime  →  봉인해도 벌 게 없다
```

**업데이트 분리라는 이미지의 주된 이득을 이미 파일 경계로 얻고 있다.** 이미지를 넣으면 *변하지 않는 것을 분리하는* 두 번째 경계가 추가되는 셈이다.

### 계산의 절반은 판단이 아니다

"현장 유지보수 역량", "팀의 이미지 이해도" 같은 요인은 **역치의 위치**를 정한다. 그런데 항의 크기는 상당 부분 객관적이다.

| 객관적으로 정해지는 것 |
|---|
| 봉인 대상의 의존성 복잡도 (측정 가능) |
| 대상 플랫폼에 **컨테이너용 생애주기 표준이 있는가** |
| 실패 표면 중 봉인 안쪽 비율 |
| 봉인 대상의 변경 빈도 |

컨테이너가 리눅스 서버에서 잘 통하는 이유가 두 번째 줄이다 — systemd·kubelet이 옮겨간 복잡도를 흡수해서 비용이 거의 0이다. Windows 설비 PC에는 그 표준이 없어 우리가 만들어야 하고, **팀 역량이 올라가도 만들어야 하는 것은 그대로다.**

## Decision
**학습은 이미지로, 설비 추론은 네이티브로 간다.**

```
학습    Linux 이미지 (WSL2 또는 별도 Linux 머신), 다이제스트 고정
        → 유인 실행이라 감시 층이 필요 없다. 비용 ≈ 0
        → torch·CUDA 조합을 봉인. 이득이 가장 큰 지점

추론    Windows 네이티브 + PyInstaller onedir
        → Windows 서비스로 감시. 계층 일치. 비용 ≈ 0
        → 봉인은 onedir 이 이미 제공
```

**다이제스트로 고정한다** — 태그를 쓰면 어제 검증한 것과 오늘 배포되는 것이 다르다. `uv.lock`이 필요했던 이유와 같은 원리가 한 층 위에서 반복된다([[latest tag forces imagePullPolicy Always bypassing local image cache]]).

**전환 조건**
- 설비 PC가 Linux가 되면 계층 불일치가 사라지고 추론 쪽 계산이 뒤집힌다. 그 판단은 장치 SDK의 Linux 실기 검증에 달려 있다
- 추론 런타임이 복잡해지면(예: 다시 torch를 끌어오게 되면) 봉인 이득이 커진다
- 학습을 설비 PC에서 무인으로 돌리게 되면 학습 쪽에도 감시 비용이 붙어 계산이 바뀐다

## Related
- [[Sealing is separable from the container runtime so a self-contained bundle can replace an image]] — 봉인의 이득 쪽
- [[Orchestrator autonomy conflicts with equipment control so equipment PCs stay clients]] — 계층을 맞추려면 필요한 것이 왜 설비에 부적합한지
- [[Docker and Ansible over k3s until edge scale justifies HA overhead]] — 같은 모양의 결정. 규모가 정당화할 때까지 상위 계층을 채택하지 않는다
- [[Containerization orchestration and CI-CD address packaging runtime and delivery as separate concerns]] — 봉인·감시·전달의 관심사 분리
- [[Pod resource exhaustion is handled by kubelet and probes not by Service]] — 감시가 누구의 역할인지
- [[latest tag forces imagePullPolicy Always bypassing local image cache]] — 다이제스트 고정의 필요
- [[Place the seam where the data crossing it is small and cold]] — 어디를 잘라야 하는가
