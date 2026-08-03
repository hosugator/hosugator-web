---
created: 2026-07-10
updated: 2026-07-20
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - kubernetes
  - gitops
  - architecture
  - ci-cd
  - multi-cluster
publish: true
---
## Context
오라클(서빙) Argo 허브를 완전 GitOps로 전환한 뒤, "그럼 align-ai의 노트북(dev/GPU) 클러스터와 오라클(서빙) 클러스터를 왜 계속 분리해야 하는가"를 처음부터 다시 따졌다. 
처음엔 "dev 클러스터에서 검증 후 서빙에 승격"이라는 틀로 접근했는데, 대화를 거치며 그 틀 자체가 틀렸다는 걸 알게 됐다.

## Insight
### 이미지 검증은 클러스터가 아니라 CI가 담당해야 한다

노트북(x86+GPU)과 오라클(ARM64+CPU 전용)은 아키텍처 자체가 다르다. 노트북에서 "잘 됐다"는 게 오라클에서 실제로 잘 될지를 검증해주지 못한다 — 오히려 거짓 안전감을 준다. 
게다가 노트북 GPU 클러스터의 실제 용도는 "서빙 예행연습"이 아니라 align-ai 자체의 모델 개발·학습(train Job)이다.
검증은 CI 안에서 실제 빌드된 이미지를 직접 실행해 `/health`·`/predict`를 호출하는 스모크 테스트로 대체하는 게 더 정확하고(오라클과 동일한 실행 조건 재현) 가볍다(별도 클러스터·브랜치 불필요).

### 그럼에도 클러스터를 합치면 안 되는 이유는 blast radius와 신뢰 경계다

컨트롤플레인(API 서버·etcd)은 워크로드가 어느 노드에서 도는지와 무관하게 클러스터 전체가 공유한다:

- API 서버/etcd 공유: dev 실험(Job 대량 생성·삭제, 이벤트 폭주)이 API 서버 응답성을 떨어뜨리면, 서빙 pod의 프로브·롤아웃과 Argo CD의 reconcile 루프까지 같이 느려진다 — pod가 어디서 도는지와 무관하게 API 서버 하나를 같이 쓰기 때문이다.
- 클러스터 스코프 리소스는 네임스페이스로 못 막는다: CRD·ClusterRole·admission webhook·kube-system DaemonSet(오늘 만진 nvidia-device-plugin이 정확히 이 예시)은 네임스페이스 경계 밖에 있다. dev 쪽 실수가 서빙 네임스페이스까지 그대로 전파된다.
- 신뢰 경계가 가장 크다: 개인 노트북은 하드닝되지 않고, 다른 용도로도 쓰이고, 물리적으로 이동한다. 이게 클러스터 워커 노드가 되는 순간 그 노드의 kubelet 자격증명이 공격 표면이 되고, 보안 수준은 가장 약한 노드로 수렴한다 — 공개 서빙 트래픽과 개인 기기가 같은 신뢰 도메인에 놓인다.

### "여러 클러스터를 하나처럼 관리"는 이미 Argo 허브-스포크로 해결되어 있다

클러스터를 합치고 싶었던 실제 동기(학습 Job도 한 곳에서 보고 싶다)는 어제 만든 Argo CD 허브-스포크로 이미 충족된다.
클러스터(=신뢰·장애 도메인)를 합치지 않고도, 오라클 허브 하나에서 노트북의 학습 Job과 오라클의 서빙 상태를 전부 본다. "합쳐야 편하다"는 근거는 이미 해소되어 있어서 병합 이유로 안 남는다.

### 배포 클러스터는 똑똑할 필요가 없다 — 오히려 아무것도 안 하는 게 맞는 설계다

신뢰는 상류(CI 스모크 테스트 → hosugator-infra manifest)에서 이미 검증되어 흘러온다. 
배포 클러스터의 역할은 그 검증된 선언적 상태를 예측 가능하게 반영하는 것 하나뿐이다.
변수(dev 실험, 이질적 신뢰 수준의 노드)가 적을수록 사고 시 원인 후보가 줄어 진단이 빨라진다 — "프로덕션은 지루해야 한다(boring production)"는 SRE 원칙과 같은 얘기다.

## Decision
### 20260710
오라클(서빙)과 노트북(dev/GPU 학습) 클러스터 분리를 유지한다. 근거를 "검증 필요성"에서 "blast radius + 신뢰 경계"로 명확히 교체했다. 이미지 검증은 각 CI에 스모크 테스트(빌드된 이미지 컨테이너 실행 → `/health`·`/predict` 호출 → 응답 검증)를 추가해서 대체하고, `hosugator-infra` manifest 업데이트는 그 테스트를 통과한 뒤에만 실행되도록 만든다.
- 전환 조건: dev 클러스터의 실험적 변경이 오라클에 실제로 영향을 준 사례가 관측되면(현재는 이론적 리스크일 뿐 실측된 적 없음) 네트워크/API 레벨 격리를 추가 강화 검토. 반대로 노트북이 서버급으로 전용화되어 신뢰 경계가 실질적으로 무의미해지는 시점엔 병합 재검토.

## Related
- [[hosugator-infra hosts the App of Apps registry until a second Argo CD instance exists]] — 같은 blast radius 논리를 클러스터 계층이 아니라 Argo CD 컨트롤 플레인 계층에 유비 적용
- [[A cluster is the hard isolation boundary between domains while a namespace divides within one]] — 원 결정, 오늘 근거를 검증→blast radius/신뢰로 좁혀서 재확인
- [[Migrating Argo CD to a new hub does not carry over TLS SAN, repo secrets, or Job exclusions automatically]] — 허브-스포크가 "합치지 않고 통합 관리"를 이미 달성한 방법
- [[Argo CD treats every manifest in its watched path as desired state regardless of filename intent]] — 배포 클러스터가 "똑똑하지 않아야" 하는 이유의 실제 사례
- [[DaemonSet without a nodeSelector assumes every node can run the pod]] — 클러스터 스코프 리소스가 네임스페이스 경계를 넘어 전파된 실제 사례
