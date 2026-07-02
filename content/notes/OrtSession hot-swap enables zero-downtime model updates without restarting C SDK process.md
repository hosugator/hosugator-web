---
created: 2026-06-11
updated: 2026-06-11
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - onnx
  - c-sdk
  - edge-ai
  - deployment
publish: true
---
## Context
엣지 AI 아키텍처를 설계하면서 설비 PC(C SDK)에서 추론 모델을 어떻게 갱신할지 논의했다. 설비 PC는 k8s 없이 C 바이너리로 동작하는데, 새 ONNX 파일이 게이트웨이 PC에서 배포됐을 때 기존 추론 중단 없이 갱신하는 방법이 필요했다.

## Insight
### OrtSession은 ONNX 모델을 메모리에 로드하는 C API 객체다

ONNX Runtime C API에서 `OrtCreateSession()`으로 모델 파일을 메모리에 로드하고, `OrtRun()`으로 추론을 실행한다. 하나의 세션이 하나의 모델 파일을 고정적으로 참조한다.

```c
OrtSession* session;
OrtCreateSession(env, model_path, session_options, &session);
OrtRun(session, NULL, input_names, inputs, 1, output_names, 1, outputs);
```

### 원자적 포인터 교체로 제로 다운타임 hot-swap이 가능하다

새 ONNX 파일이 도착하면:
1. 새 모델 파일로 새 OrtSession 생성 (병렬 실행)
2. 포인터를 원자적으로 교체 (`_Atomic` 또는 뮤텍스 보호)
3. 기존 세션이 처리 중인 요청이 완료될 때까지 대기
4. 기존 세션 해제

```
기존: [session_old] ← active pointer ← 추론 스레드
      [session_new] ← 준비 완료

교체: [session_old] ← draining (마지막 요청 완료 후 해제)
      [session_new] ← active pointer ← 추론 스레드
```

k8s 없이도 롤링 업데이트와 동일한 효과를 달성한다.

### 파일 변경 감지 → 새 세션 생성 → 교체의 흐름은 구현 단계별로 분리된다

| 단계 | 구현 방법 |
|---|---|
| 파일 변경 감지 | `inotify` (Linux) 또는 폴링 |
| 새 세션 로드 | 백그라운드 스레드에서 `OrtCreateSession()` |
| 교체 | 뮤텍스 락 + 포인터 교체 |
| 드레이닝 | 기존 세션 참조 카운트 = 0 확인 후 해제 |

## Decision
설비 PC 추론 모델 갱신 방식으로 OrtSession hot-swap을 채택한다. 설비 PC에 k8s를 도입하지 않아도 무중단 배포가 가능하고, C 바이너리 내에서 자체 처리되어 별도 오케스트레이션이 불필요하다.
**전환 조건**: 설비 PC가 다중 모델 동시 추론이나 복잡한 배포 전략이 필요해지면 k8s(또는 유사 오케스트레이터) 도입을 재검토한다.

## Related
- [[C-based industrial SDK distributes binary not source for device simplicity and IP protection]] — 설비 PC 배포 방식 전반
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]] — 게이트웨이 vs 설비 PC 역할 분리 구조
- [[Air-gapped factory ML deployment uses gateway PC as pull bridge not Argo CD push]] — ONNX 파일이 게이트웨이에서 어떻게 전달되는지
