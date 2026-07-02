---
created: 2026-05-08
updated: 2026-05-08
type: insight
status: 3-superseded
subject: "[[OS]]"
project: "[[AOI]]"
tags:
  - adr
  - linux
  - gnome
  - xrandr
  - systemd
  - dpms
  - philips
publish: true
---
> **이 결정은 [[adr-philips-usb-standby-fix]]로 대체됨.** 소프트웨어 접근 자체가 근본 원인을 해결하지 못했으며, 진짜 원인은 Philips OSD의 USB 대기 모드 설정이었다.

## Context

Philips 모니터의 Auto Input Off 기능이 USB-C 입력(NVIDIA dGPU 경유)에서 신호가 끊기면 자동으로 다른 입력으로 전환한다. GNOME DPMS가 화면을 끌 때 NVIDIA GPU가 DP 신호를 완전히 차단하기 때문에 모니터가 자동으로 다른 소스로 전환되고, 잠금 해제 후에도 복귀하지 않는 문제가 있었다.
해결책으로 systemd 유저 서비스 + D-Bus 세션 이벤트(screen-unlocked)를 감지해 xrandr로 DP-2 출력을 재활성화하는 스크립트를 작성했다. 문제는 **타이밍**: 잠금 해제 직후 xrandr을 실행하면 GNOME/mutter의 DRM 출력 재활성화가 아직 완료되지 않아 DP-2가 미감지 상태다.
초기 구현: `sleep 2` 후 xrandr 실행 → 2초가 충분하지 않은 케이스 존재.

## Decision

`sleep 2` 고정 대기를 제거하고 **폴링 방식**으로 전환한다.

```bash
# 1초 간격으로 최대 30회 폴링, DP-2 감지 시 즉시 실행
for i in $(seq 1 30); do
    if xrandr | grep -q "DP-2 connected"; then
        xrandr --output DP-2 --auto
        break
    fi
    sleep 1
done
```

선택 이유:
- 고정 대기는 "충분히 오래"를 맞출 수 없다. 시스템 부하에 따라 DRM 재활성화 시간이 달라진다.
- 폴링은 감지 즉시 실행하므로 불필요한 대기도 없고, 느린 케이스도 커버한다.
- 최대 30초 타임아웃으로 무한 루프를 방지한다.

## Consequences

- 정상 케이스: 이전보다 빠르게(1-3초) 모니터 전환 완료
- 비정상 케이스(DP-2 미감지): 30초 후 자동 종료, 사용자 수동 개입 필요
- 트레이드오프: 폴링 중 xrandr 프로세스가 1초 간격으로 실행됨. 부하는 미미하나 이론적 오버헤드 존재.

이 결정은 더 나은 방식(D-Bus DRM 이벤트 직접 구독)이 발견되면 superseded될 수 있다.


## 연결 노트

- [[하드웨어-증상을-시스템-신호로-디버깅하는-방법론]] — 이 결정을 이끌어낸 디버깅 방법론
- [[X11 xmodmap 리매핑 휘발 문제 - TTY 전환과 세션 재개 패턴]] — 유사하게 D-Bus 이벤트 + 폴링 패턴을 사용한 다른 사례
