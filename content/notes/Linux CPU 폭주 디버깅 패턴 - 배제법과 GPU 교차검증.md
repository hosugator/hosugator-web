---
created: 2026-05-07
updated: 2026-05-11 14:59
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[AOI]]"
tags:
  - linux
  - debugging
  - gpu
  - process
  - nvidia
  - wayland
publish: true
---
## problem
btop 모니터링을 하다가, Linux에서 특정 프로세스(ghostty)가 CPU를 비정상적으로(20%) 점유하는 문제를 발견했다.
GPU 가속 터미널이 CPU를 과도 점유하는 것은 이치에 맞지 않고, 지속될 경우에는 GPU 가속의 이점을 상쇄하는 문제점이다.

### goal
CPU 폭주의 원인은 복수의 후보(IME, FUSE hang, GPU 드라이버 busy-wait 등)가 동시에 의심된다. 
각 후보를 하나씩 관측 가능한 지표로 배제해야 근본 원인을 특정할 수 있다.

## how

### 1. 배제법 순서

```
ps aux → 프로세스 단위 CPU 확인 (범인 특정)
     ↓ 범인 PID 확보
/proc/PID/wchan → 커널 대기 지점 확인 (블로킹 원인 배제)
     ↓ FUSE hang이면 fuse_request_wait 등 출력
ps -L -o tid,pcpu,stat,wchan → 스레드 단위 상태 (스핀 패턴 확인)
     ↓ Rl 상태 스레드 다수 → userspace busy-wait
nvidia-smi → GPU 점유율 확인 (CPU↔GPU 교차검증)
```

### 2. 각 명령의 판독 포인트

| 명령                      | 보는 것               | 정상 vs 이상                                                  |
| ----------------------- | ------------------ | --------------------------------------------------------- |
| `ps aux`                | `%CPU`, `TIME+` 누적 | TIME+가 실행시간과 비례하지 않으면 폭주                                  |
| `cat /proc/PID/wchan`   | 커널 wait 함수명        | `poll_schedule_timeout` = I/O 대기 정상, `fuse_*` = FUSE hang |
| `ps -L ... stat`        | 스레드 상태 `R/S/Rl`    | `Rl` 다수 = userspace busy-loop                             |
| `nvidia-smi`            | GPU Util %         | CPU 300% + GPU 0% = CPU가 GPU 타이밍을 busy-wait 중             |
| `echo $WAYLAND_DISPLAY` | 디스플레이 프로토콜         | 비어있으면 X11 → GLX vsync 경로 사용                               |

### 3. vsync busy-wait 패턴
GPU 렌더링 앱에서 `window-vsync = true` 설정 시, 드라이버가 vblank 대기를 **sleep** 대신 **busy-loop**으로 구현하면 CPU가 폭주한다. 특히 신형 GPU + 미성숙 드라이버 조합에서 발생하기 쉽다.

- **증상**: CPU 200~400%, GPU Util 0%, 렌더 스레드 다수가 `Rl` 상태
- **1차 완화**: 앱 수준 vsync 비활성화(`window-vsync = false`) → CPU 300% → 100% 수준으로 감소
- **2차 완화**: `__GL_YIELD=USLEEP` 환경변수 → NVIDIA OpenGL 드라이버가 동기화 대기 시 busy-wait 대신 usleep() 사용
- **근본 해결**: Wayland 세션으로 전환 → X11 GLX 경로 대신 EGL 사용, 드라이버 버그 우회

## result
ghostty의 CPU 점유율이 대기 상태에서는 0%대로 줄어들었다.
GPU 가속 터미널의 이점을 확보하면서도 기존의 CPU 점유율을 20% 이상 확보하였다.
CPU 폭주로 인해 터미널이 비정상 종료되어 작업 맥락이 날아가던 간헐적 이슈도 함께 해결되었다.

## related
- [[Process State Transition]] — R/S/Rl 프로세스 상태 전이 개념
- [[병렬 처리 - CPU와 GPU의 코어 구조 차이]] — CPU와 GPU 역할 분리 이해
- [[snap 패키지 샌드박스 제약과 대안 선택 기준]] — snap classic confinement
- [[Neovim KGP 이미지·다이어그램 렌더링 스택]] — Ghostty 렌더링 체인 컨텍스트
