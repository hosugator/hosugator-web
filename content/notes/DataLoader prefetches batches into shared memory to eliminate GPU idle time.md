---
created: 2026-06-22
updated: 2026-06-22
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - pytorch
  - dataloader
  - gpu
  - training
publish: true
---
## Context
align-ai job-train.yaml의 `/dev/shm` 마운트 이유를 파악하면서 DataLoader의 멀티프로세싱 구조를 처음 구체적으로 이해했다. k8s 컨테이너의 기본 /dev/shm 64MB가 PyTorch DataLoader에 왜 부족한지가 출발점.

## Insight
### DataLoader는 GPU 연산과 데이터 준비를 파이프라인으로 분리한다

```
디스크 → CPU workers(num_workers개) → /dev/shm(공유 메모리) → GPU
                                        ↑ 버퍼
```

GPU가 현재 배치를 연산하는 동안 CPU workers가 다음 배치를 미리 준비해둔다. GPU idle time이 없어진다.

### /dev/shm은 큐이지 전체 데이터셋 캐시가 아니다

```
/dev/shm 용량 = 현재 준비 중인 배치 수 × 배치 크기
이미지 수가 늘어도 /dev/shm 필요량은 고정에 가깝다
```

큐가 차면 worker들이 자동 대기(prefetch_factor로 제어). /dev/shm이 무한정 쌓이지 않는다.

### k8s 컨테이너에서 /dev/shm을 명시적으로 확보해야 하는 이유

컨테이너 기본 /dev/shm = 64MB. PyTorch DataLoader가 이를 초과하면 `RuntimeError: DataLoader worker process is killed`가 발생한다.

```yaml
volumes:
  - name: dshm
    emptyDir:
      medium: Memory
      sizeLimit: 2Gi
volumeMounts:
  - name: dshm
    mountPath: /dev/shm
```

`medium: Memory`가 핵심 — 디스크가 아닌 RAM에 마운트.

### VRAM은 연산 공간, RAM(/dev/shm)은 준비 공간이다

```
RAM(/dev/shm) → 이미지 디코딩, 전처리, 배치 조립 (CPU)
VRAM          → 실제 forward/backward 연산 (GPU)
```

데이터셋이 커져도 /dev/shm이 아니라 학습 시간과 디스크 I/O가 병목이 된다.

## Related
- [[Kubernetes liveness and readiness probes catch failures that process existence cannot]] — 같은 job-train.yaml 설정