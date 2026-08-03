---
created: 2026-07-27
updated: 2026-08-03
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - kubernetes
  - k3s
  - edge-ai
  - industrial
  - deployment
publish: true
---
## Context
포트폴리오에서 k3s로 AI 데모를 오라클 인스턴스에 배포해본 경험을 바탕으로, 공장 인프라 구상을 세웠다 — 인터넷에 닿는 게이트웨이 PC에 kubectl 신원을 주고, Docker Hub에서 검증된 학습/추론 이미지를 받아 설비들에 뿌리는 구조.
MLA 검사기(GUI 통합 단일 프로세스, Windows 배포)에 이 구상이 맞는지 검토했다.

## Insight
### 오케스트레이터의 자율적 개입 권한이 설비 제어와 상충한다

이게 기술적 제약보다 본질적이다. 쿠버네티스는 좋은 의도로 파드를 죽인다 — liveness probe 실패, 노드 압박 시 eviction, 롤링 업데이트.
검사 중에 판정 프로그램이 재스케줄되면 설비는 신호를 보내고 응답을 기다리는 중이고, 원판이 장비 안에 들어가 있을 수 있다. 컨트롤 플레인이 자율적으로 판단해 개입한다는 성질 자체가 문제다. 프로브 설정을 느슨하게 해서 완화할 문제가 아니라, 권한 모델이 어긋난 것이다.
산업 장비는 무중단 배포보다 계획된 정지 후 검증을 선호한다. 검사 로직이 바뀌었으면 검증 없이 계속 돌리는 게 오히려 위험하기 때문이다. 웹 서비스의 가치 함수(가용성 극대화)와 다르다.

### 하드웨어 통과가 컨테이너 격리를 무력화한다

| 장치 | 필요 조건 |
|---|---|
| GigE 카메라 | `hostNetwork: true` — 검색이 UDP 브로드캐스트(GVCP)라 컨테이너 NAT를 넘지 못한다 |
| 시리얼 조명 | `/dev/ttyUSB` 디바이스 마운트 |
| 설비 TCP | 호스트 네트워크 |
| GUI | X11/Wayland 소켓 마운트 + 로그인 세션 권한 |

GigE Vision은 IP 지정이 아니라 브로드캐스트 검색 + 시리얼 번호 식별 방식이다(`MV_CC_EnumDevices`). `hostNetwork`가 필수인데 그 순간 네트워크 격리가 사라진다. GUI 소켓·디바이스·호스트 네트워크를 다 열면 컨테이너가 제공하는 격리가 거의 남지 않는다. 복잡도만 지불하는 거래가 된다.

### 모델을 이미지에 구우면 배포 단위가 후퇴한다

모델은 코드가 아니라 데이터다. 이미지에 넣으면 모델 하나 바꾸려고 이미지 재빌드 + 재배포가 되고, 지금은 `.onnx` 파일 교체 + 레시피의 `model_id` 변경으로 끝나는 일이 훨씬 무거워진다.

### 구분선은 "하드웨어에 직결되어 실시간 판정을 하는가"다

그 경계 안쪽만 네이티브 단일 프로세스로 남고, 바깥은 전부 클라우드 네이티브로 가도 된다. 구상을 버릴 게 아니라 경계를 한 칸 물리는 문제다.

## Decision
설비 PC는 k8s 노드로 만들지 않고 클라이언트로 유지한다. 게이트웨이 PC는 컨트롤 플레인이 아니라 아티팩트 중계 + 결과 수집 역할로 정의하고, 방향을 push가 아니라 설비가 가져가는 pull로 잡는다.

```
[클라우드/사내 k8s]  학습 Job (GPU)  ← 구상대로. 헤드리스·배치·하드웨어 무관
                     모델 레지스트리 (MinIO/S3/MLflow)
                     결과 대시보드 (FastAPI + React)
        │ 인터넷 (게이트웨이만)
[공장 OT망]          게이트웨이 PC: 아티팩트 중계 + 결과 수집
        │ 공유 폴더 / 파일 전송
                     설비 PC × N: 네이티브 Windows 실행. 모델 교체 = 파일 + model_id 변경
```

## Related
- [[Air-gapped factory ML deployment uses gateway PC as pull bridge not Argo CD push]] — 게이트웨이 pull 브리지 패턴의 선행 노트
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]] — 설비 PC가 클라이언트라는 동일 결론의 다른 근거(SDK 지원 여부)
- [[OrtSession hot-swap enables zero-downtime model updates without restarting C SDK process]] — 세션 교체로 무중단 갱신하는 동일 메커니즘
- [[Docker and Ansible over k3s until edge scale justifies HA overhead]] — 소규모 현장에서 k3s를 미루는 결정
- [[Edge deployment separates control plane connectivity from worker node internet access]] — 게이트웨이만 인터넷에 두는 구조
- [[Deployment size is decided by what gets linked not by the implementation language]] — 무엇을 배포할지(학습/추론 분리)
- [[On-device edge architecture guarantees ultra-low latency]] — 온디바이스 판정의 지연 근거
