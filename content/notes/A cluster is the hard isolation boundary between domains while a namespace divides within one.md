---
created: 2026-07-09
updated: 2026-07-09
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - kubernetes
  - cluster
  - namespace
  - argo-cd
  - multi-cluster
  - isolation
publish: true
---
## Context
align-ai 데모를 Oracle 서빙 클러스터(cureat이 사는 곳)에 얹을지 논의하다, "dev 클러스터와 서빙 클러스터를 하나로 합치고 namespace로 나누면 되지 않나? 노트북 GPU까지 묶어 고성능 통합 클러스터를 만들면?"이라는 질문이 나왔다. 
여기서 클러스터라는 경계가 namespace와 무엇이 다른지, VM/노드가 클러스터에 어떻게 귀속되는지를 정립했다.

## Insight
### 클러스터는 도메인 간 하드 경계, 네임스페이스는 도메인 내 소프트 경계
- 네임스페이스 = 한 클러스터 안에서 앱/팀/환경을 나누는 소프트 격리. control plane·datastore·노드 커널을 공유하고 RBAC·쿼터·이름공간으로 나눔.
- 클러스터 = 네트워크·신뢰·장애 도메인 사이의 하드 격리. control plane·datastore·신뢰(CA·토큰)·네트워크가 완전 분리.

### 노드(kubelet)는 정확히 한 클러스터에 속한다
클러스터 소속의 단위는 VM이 아니라 노드 = kubelet 인스턴스다. 하나의 kubelet은 하나의 control plane에만 가입한다.
- 한 머신을 두 클러스터의 공유 bare-metal 노드로 못 넣는다 — k3s 두 벌이 포트(6443/10250)·CNI(flannel의 호스트 iptables)·런타임을 두고 충돌.
- "한 머신에 여러 클러스터"는 nested(k3d/kind) 로만 — 그땐 컨테이너로 만든 별개 노드들이 각자 클러스터에 속하는 것이지, 같은 노드가 공유되는 게 아니다. 

### 클러스터를 나누는 기준은 자원이 아니라 "도메인이 다른가"
자원 다양성(GPU·ARM·x86 혼합)이나 원격 위치는 분리 이유가 아니다 — k8s는 이종 노드를 nodeSelector/taint로 지원하고, Tailscale로 원격 노드도 연결된다. 
진짜 기준은 네 가지 도메인 차이:
- 가용성: control plane은 노드가 "상시 켜진 서버"라 가정. 자고 이동하는 노트북은 `NotReady` flapping을 유발.
- Blast radius: 한 클러스터는 control plane·datastore를 공유 → 공유 요소가 깨지면(잘못된 RBAC, datastore 고갈, 업그레이드 실수) 클러스터 전체 영향. dev 실수가 public 서빙을 죽일 수 있다.
- 신뢰 오염: 클러스터는 하나의 신뢰 단위. 노드는 CA·토큰·Secret에 접근. 보안 수준은 가장 약한 노드로 수렴 → 말랑한 개인 노트북을 서빙 클러스터에 넣으면 전체가 노트북 수준으로 내려감.
- 라이프사이클: dev는 자주 재부팅·실험(잦은 변경), 서빙은 드물게·신중히. 합치면 하나의 주기를 강요당함.

### 분리된 클러스터는 병합이 아니라 멀티클러스터 GitOps로 통합한다
"한 화면에서 여러 클러스터 관리"는 클러스터를 합쳐서가 아니라 Argo CD 멀티클러스터(hub-and-spoke) 로 얻는다.
허브 하나가 자기 자신 + 원격 클러스터들을 관리(각 클러스터에 SA 등록 + apiserver 6443 네트워크 도달). → 하드 격리(별도 클러스터) + 통합 관리(UI 하나)를 동시에. 
hub-and-spoke가 존재하는 이유가 이것 — 별도 클러스터가 정상 전제이고 병합 없이 관리를 통합. 

> 허브↔스포크 연결은 6443을 공개하지 않고 Tailscale로 (앞서 정리한 zero-trust 접근과 동일 기제).

## Decision
### 20260709
hosugator 인프라: 오라클 = 서빙 전용 단일 클러스터(격리·안정). 학습(GPU)은 노트북 로컬 job 단위로 별도. 두 클러스터를 멀티클러스터 Argo(허브=오라클, Tailscale 연결)로 통합 관리한다.
기각:
- dev+서빙 병합 후 namespace 분리: 다른 도메인이라 soft 경계로 부족(blast radius·신뢰·라이프사이클).
- 오라클을 두 클러스터에 공유 노드로: k3s 두 벌 충돌로 불가.
- 크로스-로케이션 GPU 풀 클러스터: WAN 인터커넥트 한계로 실익 없음 + 서빙은 GPU 미사용.

> 전환 조건: 학습을 k8s로 관리할 필요가 커지면 별도 dev 클러스터(CP는 상시 서버, 오라클 미포함)를 만들고 Argo 스포크로 추가. 여전히 서빙과는 분리.

## Related
- [[k8s namespace and node are orthogonal axes, pod exists at their intersection]] — 클러스터 내부의 namespace↔node 축(이 노트의 하위 층).
- [[Kubernetes components divide into client control plane and node planes]] — 클러스터 구성요소 지도(이 논의의 트리거).
- [[Argo CD is a deployment coordinator not a runtime dependency, k3s self-heals without it]] — Argo를 미뤘던 근거, 이번에 멀티클러스터로 승격 검토.
- [[Argo CD watches Git manifest and CI must update manifest to trigger deployment]] — align-ai가 이미 쓰는 GitOps 흐름.
- [[kubeconfig grants cluster access over HTTPS without SSH, making it a security boundary]] — 클러스터 접근·신뢰 경계.
- [[Multi-node k8s requires container registry because build and runtime node differ]] — 노드 간 이미지 공유가 레지스트리로만 되는 이유.
- [[Air-gapped factory ML deployment uses gateway PC as pull bridge not Argo CD push]] — 다른 배포 도메인의 토폴로지 대비.