---
created: 2026-05-18
updated: 2026-05-19
type: insight
status: 2-stable
subject: "[[OS]]"
project: "[[DTK in 2026]]"
tags:
  - nvidia
  - linux
  - gsp
  - runtime-pm
  - kernel
  - workaround
publish: true
---
## Context

[[Nvidia-modset DPMS conflicts with idle-delay makes deadlock]]의 idle-delay 수정이 2026-05-18 재발로 오진단임이 확인됨.

`journalctl -b -1 -p err` 및 `/sys/bus/pci/devices/0000:64:00.0/power/` 분석으로 실제 원인 확인.

**실제 원인**: Runtime PM이 GPU를 D3(전원 차단)으로 진입시킨 후 깨어날 때, GSP 펌웨어 재초기화 중 PFM 콜백이 API lock 없이 들어오는 Race Condition.

- **PFM (Platform Framework Management)**: OS와 GPU 사이의 전원 상태를 조율하는 소프트웨어 인터페이스. NVIDIA 드라이버가 OS에 콜백 함수를 등록해두면, OS가 전원 상태를 변경할 때 해당 함수를 "역으로 호출(callback)"한다.
- **STATE_SYNC_CALLBACK**: D3 복귀 시 OS가 GPU의 전원 상태를 동기화하려고 호출하는 콜백.
- **버그 지점**: D3에서 깨어날 때 GSP 펌웨어가 아직 재초기화 중인 상태(부팅 중)에서 이 콜백이 발화됨. 이 시점에 드라이버의 내부 API lock이 아직 획득되지 않아 Race Condition 발생 → deadlock.

```
# 로그 패턴 (freeze 10~22분 전부터 6초마다 반복)
NVRM: _kgspRpcRecvPoll: GSP RM heartbeat timed out
NVRM: PFM_REQ_HNDLR_STATE_SYNC_CALLBACK during bootup without API lock
→ nvidia-modeset soft lockup → KMS thread deadlock → freeze
```

```
# GPU Runtime PM 설정 확인
/sys/bus/pci/devices/0000:64:00.0/power/control = "auto"  ← D3 허용 상태
```

- Super+L, idle-delay는 트리거가 아님
- GPU 유휴 → autosuspend → D3 → 재시도 loop → 누적 후 deadlock
- deadlock까지 걸리는 시간 가변적 (10~22분 관측, 고정 타이머 없음)
- kernel 6.17 + NVIDIA 595 open module 조합 버그

## Decision

`NVreg_DynamicPowerManagement=0x01` (coarse-grained)으로 D3 진입 차단.

```bash
# /etc/modprobe.d/nvidia-graphics-drivers-kms.conf 에 추가
options nvidia NVreg_DynamicPowerManagement=0x01

sudo update-initramfs -u && sudo reboot
```

`0x01` 선택 이유: D3만 막으면 충분하고 P-state 수준 절전은 유지하기 위해.
(`0x00`은 완전 비활성화로 불필요하게 공격적)

## Consequences

- D3 진입 없으므로 GSP 재초기화 자체가 발생하지 않음
- GPU 아이들 온도 약 5~10°C 상승, 팬 소음 소폭 증가, 배터리 소모 소폭 증가
- 근본 해결 아님 — NVIDIA 595.x 패치 시 이 설정 제거 후 복구 필요

## Verification (2026-05-19)

23시간 16분 업타임 기준 검증 완료.

```
# GSP/PFM 관련 에러 0건 확인
journalctl -b 0 | grep -i "gsp\|heartbeat\|PFM_REQ\|soft lockup" → 0건

# GPU Runtime PM 상태
/sys/bus/pci/devices/0000:64:00.0/power/control = "auto"   ← 커널은 auto 허용
/sys/bus/pci/devices/0000:64:00.0/power/runtime_status = "active"  ← D3 미진입 확인
```

- `power/control = auto`는 정상 — 드라이버 레벨(`NVreg_DynamicPowerManagement=0x01`)에서 D3 진입 차단 중
- 부팅 시 `Failed to get memory pages for NvKmsKapiMemory` 2건 관측 — DRM 초기화 과정의 KMS 메모리 할당 이슈로 GSP 문제와 무관, 동작 영향 없음
- **워크어라운드 유효성 확인됨**
