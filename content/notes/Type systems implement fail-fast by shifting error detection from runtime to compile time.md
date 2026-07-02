---
created: 2026-06-26
updated: 2026-06-26
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - typescript
  - pydantic
  - fail-fast
  - pipeline
  - type-safety
publish: true
---
## Context
Align-AI 6단계 준비 중 `types.ts`의 필요성을 설명하다가, "Pydantic을 써도 문제를 경험한 적이 없는데 왜 필요한지 체감이 안 된다"는 말에서 시작된 논의. Pydantic과 TypeScript가 같은 원칙을 구현하고 있다는 걸 처음으로 연결했다.

## Insight
### 파이프라인이 길수록 잘못된 값의 추적이 어려워진다

파이프라인은 데이터가 단계별로 변환되며 흘러가는 처리 흐름이다.

```
ML:  이미지 → 전처리 → 모델 → 후처리 → 결과
Web: 사용자 입력 → API → DB → 응답 → UI 렌더링
```

각 단계의 출력이 다음 단계의 입력이 되기 때문에, 어느 단계에서 잘못된 값이 들어오면 그 이후 전체가 오염된다. 파이프라인이 길고 복잡할수록 발생 지점과 증상 지점의 거리가 멀어진다.

### Fail-fast는 문제를 발생 즉시 차단한다

Fail-fast는 잘못된 상태를 감지하면 즉시 멈추는 원칙이다. 반대는 Fail-silent — JavaScript가 `undefined`를 만나도 조용히 흘려보내는 게 대표적이다.

```
Fail-silent: data.gap_px → undefined → NaN → "간격: NaN" (사용자가 발견)
Fail-fast:   data.gap_px 없음 → 빌드 실패 → 배포 안 됨 (개발자가 발견)
```

### 타입 시스템은 오류 발견 시점을 런타임에서 컴파일 타임으로 당긴다

같은 원칙을 CI/CD 맥락에서 **Shift-left**라고 부른다 — 검증을 파이프라인의 왼쪽(초기)으로 당긴다는 의미.

```
런타임 오류  → 사용자가 발견, 역추적 비용 높음
빌드 타임 오류 → 개발자가 발견, 수정 비용 낮음
```

TypeScript와 Pydantic은 같은 전략을 각자의 레이어에서 구현한다:

```
FastAPI Pydantic → 서버 경계에서 스키마 강제
TypeScript types → 프론트 경계에서 스키마 강제
```

### Pydantic으로 문제를 경험한 적이 없다는 건, Pydantic이 막아줬기 때문이다

"타입 시스템이 없었으면 터졌을" 사건들이 조용히 차단된 것이지, 문제가 없었던 게 아니다. 파이프라인이 짧고 혼자 짤 때는 체감이 안 된다. 협업이 시작되거나, 6개월 후 자신이 코드를 다시 볼 때 비로소 체감된다.

## Related
- [[API Route should pass request body directly unless inspection or modification is needed]] — Fail-silent의 실제 사례 (undefined 흘러가는 패턴)
- [[Static Analysis Tool]] — 타입 시스템은 정적 분석 도구의 일종
