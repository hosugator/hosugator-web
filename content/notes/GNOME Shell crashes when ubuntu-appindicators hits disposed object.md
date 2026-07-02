---
created: 2026-06-02
updated: 2026-06-02
type: insight
status: 2-stable
subject: "[[OS]]"
project: "[[Self-development in 2026]]"
tags:
  - gnome
  - crash
  - ubuntu
publish: true
---
## Context
2026-06-02 의도하지 않은 시스템 재부팅 발생. 저널 로그를 통해 원인 추적.

## Insight
### 재부팅 원인은 GNOME Shell 어서션 실패 → ubuntu-appindicators 연쇄 크래시였다

```
10:53:51  gnome-shell: meta_window_set_stack_position_no_sync: assertion 'window->stack_position >= 0' failed
10:57:52  gnome-shell: ubuntu-appindicators AppIndicatorsIconActor — has been already disposed (연쇄 에러)
10:58:02  GNOME 세션 종료 → 재부팅
```

`meta_window_set_stack_position_no_sync` 어서션 실패는 GNOME Shell의 창 관리 내부 상태가 불일치할 때 발생하는 알려진 버그다.
이로 인해 `ubuntu-appindicators` 확장의 객체가 이미 소멸된 상태에서 접근되어 연쇄 크래시가 발생했고, 결국 GNOME 세션 전체가 종료됐다.

### 저널 로그가 근본 원인 추적의 유일한 수단이다

재부팅 후에는 재현 단서가 없으므로 `journalctl --since "재부팅 시각 - 10분"` 으로 역추적하는 것이 유일한 접근법이다.

### 비슷해 보이는 동시 이벤트(NVIDIA DRM 오류)는 원인이 아니라 종료 과정의 부산물이다

재부팅 직후 NVIDIA DRM 메모리 오류가 함께 기록됐으나, 이는 GNOME 세션 종료 시 GPU 리소스 정리 중 발생하는 것으로 원인이 아니다. 동시에 기록된 오류를 원인으로 오인하지 않도록 주의.

## Verification
간헐적 발생. 재현 조건 불명확. 재발 시 `ubuntu-appindicators` 확장 비활성화 고려.
