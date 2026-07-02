---
created: 2026-06-02
updated: 2026-06-02
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - docker
  - pytorch
  - deployment
  - debugging
publish: true
---
## Context
align-ai 학습 컨테이너를 처음 실행했을 때 GPU는 정상 인식됐으나 DataLoader에서 즉시 실패했다.
에러: `RuntimeError: unable to allocate shared memory for file </torch_...>: Resource temporarily unavailable`.

## Insight
### Docker 컨테이너의 기본 shm 크기는 64MB로 PyTorch DataLoader에 부족하다
PyTorch DataLoader는 `num_workers > 0`일 때 멀티프로세스로 데이터를 로딩한다.
워커 프로세스 간 데이터 공유에 `/dev/shm` (shared memory)를 사용하는데, Docker 컨테이너의 기본 shm 크기가 64MB라 배치 × 이미지 크기 × 워커 수 합계를 감당하지 못한다.

### docker-compose.yml에 shm_size를 명시해야 한다
```yaml
services:
  train:
    shm_size: '2gb'
```
학습 이미지 크기(align-ai: 512×512 grayscale)와 배치 크기, 워커 수에 따라 필요량이 다르다. 대부분의 ML 학습 환경에서 2GB면 충분하다.

### 대안: num_workers=0으로 싱글프로세스 DataLoader
`shm_size` 설정 없이 `DataLoader(num_workers=0)`으로 바꾸면 shm을 사용하지 않는다. 다만 데이터 로딩이 GPU 연산과 직렬화되어 학습 속도가 저하된다.

## Related
- [[Docker Compose before k8s because scale motivation must precede orchestration learning]] — 같은 Compose 실습 맥락
- [[PyTorch wheel bundles CUDA runtime making python slim base sufficient for GPU training containers]] — 같은 세션의 다른 배포 발견
