---
created: 2026-07-16
updated: 2026-07-16
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - grpc
  - rpc
  - protocol
publish: true
---
## Context
"실시간 추론=WebSocket, 설비 확대=MQTT, HTTP보다 안정성이 필요하면 gRPC"라는 도식으로 정리하다가, gRPC를 고르는 이유를 "안정성"으로 착각하고 있었음을 정정했다. 
[[RPC for Easy Remote Call]]에서 이미 RPC 대 HTTP/REST의 차이(함수 호출 대 자원 다루기)는 정리해뒀지만, gRPC가 정확히 무엇으로 우위를 갖는지는 다루지 않았다.

## Insight
### gRPC는 HTTP의 대체재가 아니라 HTTP/2 위에 얹힌 것이다
WebSocket·MQTT처럼 독립적인 별개 프로토콜이 아니라, gRPC는 HTTP/2를 전송 계층으로 그대로 쓴다.
따라서 "네트워크 연결이 덜 끊긴다"는 식의 안정성 차이는 애초에 존재하지 않는다 — 결국 같은 TCP(HTTP/2 기반) 위에서 동작하므로 연결 신뢰성 자체는 동일하다.

### 실제 차별점은 두 가지
- 성능: Protocol Buffers(바이너리 직렬화)가 JSON보다 훨씬 작고 빠르게 파싱됨.
- 스키마/타입 안정성: `.proto` 파일로 요청/응답 구조를 엄격히 정의 → 클라이언트/서버 코드 자동 생성, 필드 타입 불일치를 컴파일 타임에 방지.

### 선택 기준 정정
gRPC를 고르는 진짜 이유는 "HTTP보다 안 끊겨서"가 아니라 "타입 안전성이 중요한 내부 서비스 간 통신(마이크로서비스)"이거나 "매우 잦은 호출에서 직렬화 성능이 병목이 되는 경우"다.

### 호출 코드 자체가 "URL+dict"에서 "스키마 기반 생성 코드"로 바뀐다
```python
# HTTP: URL 문자열과 JSON key를 직접 다룸 — 오타/타입 불일치는 런타임에야 발견
resp = await httpx.post("http://inference-service:9000/predict", json={"image": data})
result = resp.json()["output"]

# gRPC: .proto로 미리 정의한 계약을 protoc가 코드로 생성, 그 생성 코드를 호출
response = await stub.Predict(inference_pb2.PredictRequest(image=data))
result = response.output
```
즉 gRPC의 실익은 "이 성능/스키마 안정성이 실제 호출 코드에서 무엇을 바꾸는가"로 보면 더 명확하다 — 오타나 필드 불일치를 런타임 대신 코드 생성/빌드 시점에 미리 잡아내는 것(early failure). HTTP/JSON은 계약이 문서로만 존재해 어긋나도 요청이 일단 나가버리지만, gRPC는 `.proto` 계약 자체가 코드가 되어 어긋나면 빌드가 실패한다.

## Related
- [[RPC for Easy Remote Call]] — RPC 일반론(함수 호출 vs 자원 지향)의 하위 사례로 gRPC의 구체적 우위를 보완
