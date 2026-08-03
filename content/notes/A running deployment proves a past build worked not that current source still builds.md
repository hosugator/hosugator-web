---
created: 2026-07-09
updated: 2026-07-16
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - ci
  - docker
  - arm64
  - onnx
  - drift
  - deployment
publish: true
---
## Context
align-ai 데모를 Oracle(arm64)에 올리려고, CI를 건드리기 전에 로컬 buildx로 arm64 이미지를 빌드·검증했다. 
로컬 클러스터엔 align-ai-inference 파드가 12일째 잘 돌고 CI도 green이었는데, 현재 HEAD를 arm64로 새로 빌드하니 컨테이너가 기동조차 안 됐다.
연달아 3건의 잠복 버그가 드러났고, 전부 arm64와 무관한 소스 드리프트였다.

## Insight
### 돌아가는 배포는 "과거 빌드가 됐다"의 증명이지 "현재 HEAD가 빌드된다"의 증명이 아니다
돌던 파드의 이미지는 옛 커밋(sha 06bb27a) 으로 빌드된 것이었다.
그 후 리팩토링으로 드리프트가 HEAD에 쌓였지만, 아무도 HEAD를 새로 빌드하지 않아 드러나지 않았다.
"지금 서비스가 살아있다"는 사실은 배포된 아티팩트에 대한 진술이지 소스 최신 상태에 대한 진술이 아니다.

### 새 빌드를 강제하는 변경이 잠복 드리프트를 드러낸다
arm64 요구가 HEAD로부터의 fresh build를 강제했고, 그 순간 드리프트가 표면화됐다.
arch 전환뿐 아니라 의존성 업그레이드·클린 체크아웃·재현 빌드 등 "처음부터 다시 빌드"를 강제하는 모든 계기가 같은 역할을 한다.
반대로 캐시된 증분 빌드·기존 이미지 재사용은 드리프트를 덮는다.

### CI가 green이어도 통합 경로는 안 잡힌다
`ci.yml`의 테스트는 pytest(단위)라 서빙 경로(server.py의 `load_model` 호출부·onnx 입출력 이름·반환 튜플 언패킹)를 exercise하지 않았다.
[[Each infrastructure layer removes one dependency and reveals source code as the true bottleneck]]의 "CI 통과 = 소스 자기완결성 증명"은 테스트가 커버하는 범위 안에서만 참이다. 
빌드→기동→엔드포인트 호출을 실제로 돌리는 검증만이 통합 드리프트를 잡는다.

### 드리프트의 근원은 "한쪽만 바뀐 공유 계약"이다
세 버그 모두 server.py와 predict_onnx 사이의 암묵 계약이 한쪽만 갱신돼 생겼다:

1. `latest`의 의미가 "best 복제" → "최신 epoch 저장"(전이학습용)으로 바뀜 → 서빙이 엉뚱한 걸 가리킴.
2. `load_model` 시그니처가 `(product)` → `(product, ckpt_arg)`로, 반환이 세션 → `(session, version)` 튜플로 변경.
3. onnx 입력 이름이 `x` → `input`으로 변경(export_onnx).

호출부(server.py)가 이 변경들을 안 따라갔다. 계약을 바꾼 리팩토링은 반대편 호출부·통합 테스트를 같이 갱신해야 드리프트가 안 남는다.

## Decision
### 20260709

서빙 모델은 전용 `serving.onnx`(best 체크포인트를 export한 자체완결 단일 파일)로 두고, 학습 산출물(`latest`=epoch, `best_v`=버전)과 분리한다. 그리고 CI/GitOps에 push하기 전에 로컬에서 arch-native fresh build + 엔드포인트 검증을 먼저 한다.

- 서빙 아티팩트를 `latest`(의미가 바뀐다)에 의존하지 않게 이름으로 고정 → 계약 안정.
- `serving.onnx`는 가중치 내장(external `.data` 불필요)이라 이미지에 파일 하나만 담으면 됨 → 트림·IP 최소화에도 유리.
- 로컬 우선 검증이 이번에 3건을 CI 전에 잡았다 — 그냥 push했으면 멀티아치 이미지도 깨지고 로컬 Argo가 깨진 걸 배포했을 것.

> 전환 조건: CI에 빌드+기동+/predict 스모크 테스트를 추가하면 로컬 선검증 의존을 줄일 수 있다(그때 이 관행을 CI로 승격).

## Related
- [[Docker isolates runtime environment while CI verifies build-time reproducibility]] — CI가 검증하는 재현성의 범위와 이번의 사각(통합 경로).
- [[Each infrastructure layer removes one dependency and reveals source code as the true bottleneck]] — "CI 통과=자기완결 증명"의 전제와 한계.
- [[hosugator - infra - oracle k3s rebuild log]] — 같은 멀티데모 인프라 작업의 앞 단계(cureat).
- [[Commit small model files directly and use GitHub Releases for large binaries]] — serving.onnx를 레포에 커밋하는 아티팩트 전략.
- [[학습된 모델의 직렬화와 역직렬화]] — .pth→onnx export 맥락.
- [[Roll back the deployment not the history]] — 배포와 이력을 분리해 다루는 결정
