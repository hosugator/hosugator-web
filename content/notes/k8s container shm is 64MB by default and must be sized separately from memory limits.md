---
created: 2026-06-10
updated: 2026-06-10
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - pytorch
  - dataloader
  - shared-memory
  - linux
publish: true
---
## Context
align-ai 학습 Job에서 DataLoader `num_workers > 0` 설정 시 `RuntimeError: unable to allocate shared memory` 오류 발생. Pod 메모리 limits가 2Gi/4Gi임에도 불구하고.

## Insight
`/dev/shm`(공유 메모리)은 k8s의 `resources.memory`와 **완전히 독립된** 커널 파라미터다. 컨테이너 메모리 limits가 4Gi여도, `/dev/shm`은 도커/k8s 기본값인 **64MB**로 고정된다.
PyTorch DataLoader의 `num_workers > 0`은 프로세스 간 텐서 공유에 `/dev/shm`을 사용한다. 64MB는 배치 크기에 따라 즉시 소진된다.

### 수정 방법
```yaml
volumes:
  - name: dshm
    emptyDir:
      medium: Memory    # tmpfs를 /dev/shm으로 마운트
      sizeLimit: "2Gi"  # 최대 크기
containers:
  - volumeMounts:
      - name: dshm
        mountPath: /dev/shm
```

`emptyDir.medium: Memory`는 RAM 기반 tmpfs 볼륨을 생성한다. `sizeLimit`은 해당 tmpfs의 최대 크기이며, 이는 Pod 전체 메모리 limits 이내여야 한다.

### 왜 memory limits와 별개인가
Linux 커널은 `/dev/shm`을 tmpfs로 구현하며, 컨테이너 런타임(Docker, containerd)은 기본적으로 64MB로 tmpfs를 생성한다. k8s `resources.memory`는 cgroup 메모리 한도로, tmpfs 크기 제어와는 다른 레이어다. 명시적으로 마운트를 덮어써야만 크기가 변경된다.

## Related
- [[k3s NVIDIA device plugin requires nvml strategy and runtimeClassName for GPU access]]
- [[PyTorch wheel bundles CUDA runtime making python slim base sufficient for GPU training containers]]
