---
created: 2026-05-08
updated: 2026-05-08
type: insight
status: 2-stable
subject: "[[OS]]"
project: "[[AOI]]"
tags:
  - adr
  - linux
  - gnome
  - dpms
  - usb-c
  - philips
  - nvidia
  - hardware
publish: true
---
# ADR: Philips USB-C 모니터 DPMS 복구 — OSD USB 대기 모드 설정

## Context

Gigabyte AERO X16 (NVIDIA RTX 5070 + AMD iGPU 하이브리드) + Philips 27E1N1600AE (USB-C, card2-DP-2) 환경에서 GNOME 화면 잠금 후 idle-delay 경과 → DPMS off 시 모니터 3(USB-C)가 잠금 해제 후 자동 복구되지 않는 문제.
이전 ADR([[adr-gnome-dpms-polling-방식-전환]])에서 xrandr 폴링 → Mutter DisplayConfig API 사이클 방식을 시도했으나 근본 해결이 되지 않았다. 이후 다음을 모두 시도했으나 효과 없음:
- `echo detect > /sys/class/drm/card2-DP-2/status`
- `sudo modprobe -r ucsi_acpi && modprobe ucsi_acpi`
- `sudo chvt 3 && chvt 2` (VT 전환)
- `ddcutil setvcp 0xD6 0x01` (DDC/CI 전원 명령)
- NVIDIA Runtime PM 비활성화
### 진단 결과
DPMS off 후 `cat /sys/class/drm/card2-DP-2/status` = `disconnected`. 물리 버튼 누를 때만 `connected`로 변경됨. dmesg에 NVIDIA/DRM 관련 커넥터 이벤트 전무.

## Decision
Philips 27E1N1600AE OSD에서 **USB 대기 모드: 켜기** + **스마트 전원: 끄기** 로 변경.
근본 원인은 소프트웨어가 아니라 모니터 OSD 설정이었다. USB 대기 모드가 OFF이면 DPMS off 시 USB-C 포트 전원 자체가 차단된다. NVIDIA 드라이버 입장에서는 물리적 케이블 탈거와 동일 → HPD 소멸 → DRM disconnected → OS에서 복구 방법 없음.
USB 대기 모드 ON으로 변경하면 DPMS off 중에도 USB-C 포트 유지 → DP Alt Mode 유지 또는 wake 시 즉시 재협상 → HPD 정상 → GNOME이 monitors.xml 기반으로 자동 복구.

## Consequences
- 모니터 3이 잠금 해제 시 자동 복구됨 ✅
- monitor-unlock-fix.py 스크립트 및 systemd 서비스 불필요 → 삭제
- USB 대기 모드 ON은 모니터 대기 중에도 USB-C 포트에 전력 공급 → 미미한 전력 소모 증가 (트레이드오프)

## 연결 노트
- [[adr-gnome-dpms-polling-방식-전환]] — superseded된 이전 접근법
- [[하드웨어-증상을-시스템-신호로-디버깅하는-방법론]] — 이 문제 디버깅 과정에서 얻은 방법론 인사이트
