---
created: 2026-07-16
updated: 2026-07-16
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - kubernetes
  - service
  - architecture
  - fastapi
publish: true
---
## Context
포트폴리오 데모(S3 정적 웹 + Oracle k3s의 FastAPI, `/api/{slug}`로 단일 서비스 호출-응답)에 DB나 별도 추론 서비스를 추가하면 어떻게 될지 생각하다가, "웹 → 추론 서비스 → DB 저장 서비스 → 웹"처럼 릴레이로 이어질 거라 짐작했는데 실제 구조는 달랐다.

## Insight
### 응답은 릴레이가 아니라 허브 패턴이다
웹은 처음부터 끝까지 하나의 API 서비스하고만 통신한다.
그 API 서비스가 내부적으로 추론 서비스를 호출하고 DB에 저장한 뒤, 자기 자신이 결과를 조합해 웹에 응답한다.
DB나 추론 서비스가 웹에 직접 응답을 돌려주는 구조가 아니다.

```
웹 ──요청──▶ API 서비스 ──응답──▶ 웹   (API 서비스가 유일한 접점)
              │            ▲
              ▼ 호출        │ 결과
          추론 서비스 ───────┘
              │
              ▼ SQL 저장
          postgres-service
```

### DB 접근은 "서비스 간 통신"이지만 API 체이닝과는 성격이 다르다
추론 서비스 호출은 진짜 HTTP 요청-응답(다른 애플리케이션의 라우팅을 거침)이지만, DB 접근은 SQL 드라이버로 데이터 저장소에 직접 연결하는 것이라 별도의 "저장 서비스" 애플리케이션을 만들 필요가 없다. 
두 경우 다 네트워크를 타는 Service-to-Service 트래픽이지만, 하나는 비즈니스 로직이 있는 별도 애플리케이션 호출이고 하나는 저장소 접속일 뿐이다.

### align-ai에서 이미 더 단순한 쪽을 택한 전례가 있다
align-ai 데모의 `/predict` 엔드포인트는 추론 실행 직후 SQL 파라미터 바인딩으로 직접 INSERT를 실행했다 — 별도의 "저장 서비스"를 만들지 않고 하나의 API 서비스가 추론+DB 저장을 모두 책임지는 구조를 이미 선택했다. 
[[In-process calls beat HTTP over loopback, but language boundaries and fault isolation justify the split anyway]]에서 정리한 "굳이 쪼갤 이유가 없으면 안 쪼갠다"는 원칙과 일치한다.

## Related
- [[In-process calls beat HTTP over loopback, but language boundaries and fault isolation justify the split anyway]] — 언제 서비스를 쪼갤지에 대한 상위 원칙
- [[gRPC's edge over HTTP is protobuf performance and type safety, not connection stability]] — 실제로 추론 서비스를 분리한다면 그 호출에 HTTP 대신 gRPC를 고려할 수 있는 지점
