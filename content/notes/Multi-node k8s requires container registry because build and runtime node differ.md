---
created: 2026-06-28
updated: 2026-06-28
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - k3s
  - docker
  - mlops
  - registry
publish: true
---
## Context
k3s 단일 노드에서 멀티 노드로 전환하면서 이미지 빌드와 실행이 다른 노드에서 일어나는 구조적 변화를 이해했다. 단일 노드에서는 보이지 않던 경계가 멀티 노드에서 명확히 드러난다.

## Insight
### 단일 노드는 로컬 캐시를 공유하지만 멀티 노드는 레지스트리를 반드시 경유해야 한다

```
단일 노드: 빌드 노드 = 실행 노드 → 로컬 이미지 캐시 사용 가능
멀티 노드: 빌드 노드 ≠ 실행 노드 → 레지스트리가 유일한 전달 경로
```

```
빌드 머신: docker build → docker push → 레지스트리 (ghcr.io, Docker Hub 등)
실행 노드: k3s가 pull → Pod 실행
```

단일 노드에서 "레지스트리 없이도 잘 됐다"는 경험이 멀티 노드 전환 시 혼란을 만드는 원인이다.

### ML 학습 파이프라인의 전체 흐름

```
1. 학습 코드 작성 + Dockerfile 작성
2. docker build -t myrepo/train:v1 .
3. docker push myrepo/train:v1
4. Job manifest 작성 (image: myrepo/train:v1)
5. kubectl apply -f train-job.yaml
6. k8s 스케줄러: GPU 자원 보유 노드에 배치
7. 해당 노드: 이미지 pull → 학습 실행
8. 결과를 PVC 또는 외부 스토리지에 저장
```

### Pod 종료 시 컨테이너 내부 데이터는 사라진다

학습 모델을 보존하려면 Pod 실행 중에 외부 저장소에 저장해야 한다. hostPath 볼륨으로 특정 노드의 경로를 마운트하면 pCloud 같은 동기화 폴더로 자동 백업 가능하다.

```yaml
volumes:
- name: pcloud-storage
  hostPath:
    path: /Users/hong/pCloud/models
```

단, hostPath는 특정 노드에 종속되므로 `nodeSelector`로 실행 노드를 고정해야 한다.

## Related
- [[Docker image contains only code and packages, runtime data mounts via hostPath volumes]] — hostPath 볼륨 패턴의 원리
- [[Worker node provides compute but job submission only requires kubeconfig not cluster membership]] — 팀원이 job을 제출하는 구조
