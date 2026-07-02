---
created: 2026-06-11
updated: 2026-06-11
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - deployment
  - industrial
  - sdk
publish: true
---
## Context
팀과 점심 미팅에서 현재 설비 PC 배포 방식을 처음 파악했다. 기존 시스템은 C 기반 SDK를 개발하고, 설비 PC에 원격 접속해서 빌드된 바이너리만 배포하는 방식이다. Git 활용도가 낮은 이유를 이해하지 못하고 있었는데, 이번에 맥락이 잡혔다.

## Insight
### C 바이너리 배포는 소스를 장치에 둘 필요가 없어 git이 배포 레이어에서 불필요하다

Python/Node 같은 인터프리터 언어는 소스 코드 자체가 실행 파일이라 git pull이 배포 수단이 될 수 있다. C는 컴파일된 바이너리만 있으면 실행되므로 장치에 소스가 없어도 된다. git은 소스를 관리하는 도구인데, 장치에 소스가 없으니 배포 관점에서 git이 끼어들 자리가 없다.

### 소스를 설비에 두지 않는 것은 IP 보호 목적도 있다

설비 PC는 고객사 현장에 설치된다. 소스 코드가 장치에 있으면 유출 리스크가 생긴다. 바이너리만 배포하면 역공학은 가능하지만 소스 수준의 노출은 막을 수 있다.

### 현재 팀의 배포 파이프라인과 우리 ML 파이프라인은 다른 레이어에서 동작한다

```
팀 현행 시스템
  C SDK 개발 → 빌드(바이너리) → 원격 접속 → 설비 PC에 바이너리 복사

우리 ML 파이프라인
  Python 모델 학습 → ONNX export → Docker 이미지 빌드 → k8s 배포
```

두 시스템이 만나는 접점은 **"ML 추론 결과를 C SDK가 어떻게 받아 처리하는가"** 다. 현재는 별개로 동작하고 있어 인터페이스 설계가 향후 핵심 과제가 될 것 같다.

## Decision
ONNX Runtime C API(OrtSession)를 C SDK에 직접 임베딩하는 방식을 채택한다. 설비 PC에 Python 런타임이나 HTTP 서버를 띄울 필요 없이 C 바이너리 하나로 추론까지 처리한다.
**ONNX 파일 배포 흐름**: 게이트웨이 PC(Linux)가 HTTP 파일 서버를 운영하고, 설비 PC C SDK가 주기적으로 pull한다. Argo CD나 k8s가 설비 PC에 push하는 게 아니라 설비 PC가 스스로 가져온다.

```
게이트웨이 PC  →  학습 완료 → /models/에 .onnx 저장 → HTTP 파일 서버 expose
설비 PC C SDK →  파일 서버 폴링 → 새 .onnx 감지 → OrtSession hot-swap
```

**전환 조건**: 설비 PC에서 다중 모델 동시 실행이나 복잡한 배포 전략이 필요해지면 FastAPI 추론 서버 분리를 재검토한다.

## Related
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]] — 유사한 엣지 배포 토폴로지
- [[OrtSession hot-swap enables zero-downtime model updates without restarting C SDK process]] — C SDK에서 ONNX 모델 무중단 갱신 방법
- [[Air-gapped factory ML deployment uses gateway PC as pull bridge not Argo CD push]] — 공장 격리 환경 배포 패턴
- [[Docker image contains only code and packages, runtime data mounts via hostPath volumes]] — 이미지와 모델 파일의 분리 원칙
- [[ML training skip logic using image layer fingerprint avoids redundant training]] — 우리 ML 파이프라인
