---
created: 2026-06-05
updated: 2026-06-09
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - k3d
  - k3s
  - kubernetes
  - local-dev
publish: true
---
## Context
align-ai Phase 4A에서 로컬 k8s 클러스터가 필요해서 k3d를 처음 설치하고 사용했다. k3s와의 차이가 헷갈렸다.

## Insight
### k3d는 k3s Node를 Docker 컨테이너로 구현한다

```
k3s (실제 운영)          k3d (로컬 개발)
Control Plane = VM       Control Plane = Docker 컨테이너
Worker Node   = VM       Worker Node   = Docker 컨테이너
  └── Pod                  └── Pod
      └── 컨테이너              └── 컨테이너 (컨테이너 안의 컨테이너)
```

k3d가 "다른 컴퓨터인 척"이 아니라 "Node인 척"하는 것이다. Node 역할을 Docker 컨테이너가 수행한다.

### 클러스터 삭제가 Docker 컨테이너 삭제와 동일하다

`k3d cluster delete`하면 Node 역할을 하던 컨테이너들이 제거되어 흔적이 남지 않는다. VM 기반이면 남는 잔재가 없다.

### kubectl은 클러스터 종류와 무관한 범용 클라이언트다

k3d가 `~/.kube/config`에 연결 정보를 자동으로 등록하면, kubectl은 그걸 읽어서 어떤 클러스터든 동일한 명령으로 제어한다. EKS, GKE, k3d 모두 `kubectl get pods`로 동일하게 조회한다.

## Verification

### 2026-06-09: Phase 5 완료. 노트북(Control Plane) + 테스트실 컴퓨터 WSL2(Worker Node) 두 대 클러스터 구성. `kubectl get nodes`에서 두 노드 Ready 확인.

Worker Node 편입 명령:
```bash
curl -sfL https://get.k3s.io | K3S_URL=https://<CP_IP>:6443 K3S_TOKEN=<token> sh -
```
- `K3S_URL`: Control Plane API 서버 주소 (어디에 연결할지)
- `K3S_TOKEN`: 인증 토큰 (누구인지 증명)

WSL2 Worker Node는 Windows 포트 포워딩(`netsh portproxy`) 없이는 외부에서 SSH 접근 불가. Windows IP로 포워딩 설정 후 해결.

## Related
- [[Docker and Ansible over k3s until edge scale justifies HA overhead]] — 실무 배포 맥락
- [[Kubernetes.md]] — k8s 전체 개념
- [[Docker Compose before k8s because scale motivation must precede orchestration learning]] — 학습 계획
- [[Edge deployment separates control plane connectivity from worker node internet access]] — 현장 배포 맥락
