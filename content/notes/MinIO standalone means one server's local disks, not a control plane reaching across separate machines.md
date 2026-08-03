---
created: 2026-07-23
updated: 2026-07-23
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[AOI]]"
tags:
  - minio
  - object-storage
  - kubernetes
  - architecture
publish: true
---
## Context
AOI 설비 10대(하루 150GB)의 원본 이미지 저장 확장성을 가늠하다가 MinIO를 처음 접했다. "설비 10대에 부착된 디스크를 하나의 컨트롤 플레인이 관리하는 것"을 standalone 모드라고 생각했는데, 이게 정확히 distributed 모드의 정의였다는 걸 교정받으며 개념이 정리됐다.

## Insight
### MinIO는 하드웨어가 아니라, HTTP로 말하는 자체 호스팅 S3다

AWS S3와 동일한 REST API(PUT/GET + 서명 인증)를 구현한 오픈소스 소프트웨어로, 자기 서버에 직접 설치해 돌린다.
HTTP 기반이라 클라이언트 OS는 완전히 무관하다(Windows/Linux/macOS 다 붙음) — 서버 OS도 리눅스가 필수는 아니고 관례적 권장일 뿐이다.
[[Object Storage System]]이 다루는 "평면 구조·API 기반 접근"이라는 객체 스토리지 일반론을, MinIO는 자체 인프라 위에서 그대로 재현한 것이다.

### Standalone과 Distributed는 "디스크가 몇 개인가"가 아니라 "디스크가 몇 대의 물리 서버에 걸쳐 있는가"로 갈린다

```
Standalone  = MinIO 프로세스 1개가, 자신이 돌아가는 서버 1대에 로컬로 붙은 디스크 여러 개를 관리
Distributed = 여러 대의 서버 각각에서 MinIO 프로세스가 돌며, 서로 통신해 각자의 로컬 디스크를 하나의 통합 네임스페이스로 묶음 (소거부호로 노드/디스크 장애 대비)
```

"설비 10대에 부착된 디스크를 하나가 관리한다"는 그림은 물리적으로 분리된 여러 대의 디스크를 하나로 묶는 것이므로 정의상 distributed다.
Standalone은 애초에 로컬 디스크만 보므로, 다른 컴퓨터에 물리적으로 있는 디스크는 관리 대상이 될 수 없다 — "컨트롤 플레인이 하나면 standalone"이라는 직관은 틀렸다. 

### 검사 설비 자체를 스토리지 노드로 쓰면 리소스 경합과 가용성 결합이 동시에 생긴다

설비 10대가 스스로 distributed MinIO 클러스터를 이루면, 설비의 실시간 추론 작업과 스토리지 노드 역할(다른 노드 요청 처리·리밸런싱)이 같은 머신에서 경쟁한다.
게다가 설비 한 대가 점검으로 꺼지면 소거부호가 요구하는 최소 쿼럼에 걸려, 검사와 무관한 이유로 스토리지 전체 가용성이 흔들릴 수 있다.

올바른 구조는 역할을 분리하는 것:
설비 10대는 순수 클라이언트(업로드만), 전용 저장 서버 1대가 standalone MinIO로 로컬 디스크 여러 개(JBOD — MinIO 자체 소거부호가 이미 중복을 처리하므로 RAID까지 얹으면 이중 적용으로 용량만 낭비)를 관리한다.
이 구조의 대가는 그 저장 서버 1대가 단일 장애점(SPOF)이 된다는 것 — 디스크 장애는 소거부호로 버티지만 서버 자체 장애는 못 막고, 필요해지면 그때 저장 서버를 여러 대로 늘려 진짜 distributed로 전환한다.

### 디스크 확장은 자동 인식이 아니라 "풀(pool)" 단위의 계획된 배치 작업이다

MinIO는 시작 시 지정한 디스크들을 소거부호 세트로 묶어 관리한다.
디스크 하나를 물리적으로 꽂는다고 기존 세트에 자동 편입되지 않는다 — 확장은 새 디스크 묶음을 새 풀로 추가하고 서버를 재구성/재시작하는 방식이며, 기존 데이터와 신규 풀 간 재분배(`mc admin rebalance`)도 명시적 명령이 필요하지 저절로 일어나지 않는다.
그래서 "부족해지면 계속 추가"가 아니라 "기존 풀과 비슷한 규모로 배치 증설을 계획"해야 한다.

### MinIO는 k8s의 스토리지 버전이 아니라, k8s가 돌릴 수 있는 저장 서비스다

k8s는 컴퓨트(컨테이너)를 여러 서버에 걸쳐 스케줄링·장애복구하는 오케스트레이터이고, MinIO는 그 자체가 저장 서비스다 — 층이 다르다.
"k8s의 스토리지 버전"에 정확히 대응하는 건 Rook(Ceph 등을 k8s 오퍼레이터로 관리, "Storage Orchestration for Kubernetes"를 표방)이지만, MinIO보다 훨씬 무겁고 지금 규모(10대/150GB일)엔 과하다.

이미 k3s를 운영 중이라면(hosugator 개인 인프라) MinIO를 StatefulSet으로 선언적으로 관리하는 게 합리적이다 — 이미 지불 중인 오케스트레이션 비용에 얹는 한계비용이 작고 GitOps 흐름과도 맞는다.
다만 전제 두 가지가 [[StatefulSet rebinds the same PVC via deterministic pod naming, not automatic data replication]]에서 이미 확인된 함정과 정확히 같다:
- (a) k3s `local-path-provisioner`는 노드의 로컬 경로일 뿐이라 그 노드가 사라지면 데이터도 사라짐 
- (b) `replicas`를 올려도 데이터가 자동 복제되지 않는 것처럼, MinIO 레플리카도 서로 다른 물리 노드에 있어야 소거부호가 의미 있다 — 노드가 1~2대뿐이면 distributed의 이점이 없으니 standalone이 오히려 정직한 선택이다.

## Related
- [[StatefulSet rebinds the same PVC via deterministic pod naming, not automatic data replication]] — PVC/local-path의 노드 결속, replicas 비복제 오해가 MinIO distributed 모드에도 동일하게 적용됨
- [[Object Storage System]] — 객체 스토리지 일반론(평면 구조, API 기반 접근); MinIO는 이를 자체 인프라에 재현한 구현체
- [[Raw data value is insurance against future information needs unknowable at storage time]] — 같은 AOI 저장 전략 논의의 앞 단계(무엇을 저장할지); 이 노트는 그다음 단계(어떻게 저장할지)
- [[S3 accrues as recurring OpEx while self-hosted MinIO front-loads cost as one-time CapEx]] — 이 아키텍처 위에서의 비용 비교(다음 단계)