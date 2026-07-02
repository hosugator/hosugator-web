---
created: 2026-07-01
updated: 2026-07-01
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - architecture
  - design-principle
  - scalability
  - bff
publish: true
---
## Context
Next.js 서버 컴포넌트가 FastAPI를 직접 호출할 수 있다는 기술적 사실과, 모든 외부 호출을 `/api/`로 통일해야 한다는 설계 원칙이 다른 레벨의 이야기임을 인식했다. "할 수 있다"와 "해야 한다"가 다른 질문이다.

## Insight

### "할 수 있다"와 "해야 한다"는 다른 계층의 질문이다

```
기술적 가능성  — 이 방식이 동작하는가?
관리 가능성    — 이 방식이 유지보수 가능한가?
```

서버 컴포넌트의 FastAPI 직접 호출은 기술적으로 가능하다. 그러나 모든 호출을 `/api/` 경유로 통일하면 단일 관리점이 생긴다 — FastAPI URL 변경, 인증 추가, 로깅을 한 곳에서 처리할 수 있다.

### 규모가 커질수록 관리 가능성이 상대적 우위를 점한다

프로토타입 단계에서는 기술적으로 가능한 최단 경로가 효율적이다. 규모가 커지면 변경 비용이 증가하고, 관리 가능성 — 단일 관리점, 일관된 규칙, 팀 협업 — 이 더 중요해진다.

이 원칙은 API 설계 외에도 범용 적용된다:
- 모듈 간 직접 참조 vs 인터페이스 경유
- 환경 변수 직접 접근 vs 설정 레이어 경유
- DB 직접 쿼리 vs 레포지토리 패턴

## Related
- [[Next.js server components fetch directly while client components require API Route for CORS]] — 이 인사이트가 나온 구체적 맥락
