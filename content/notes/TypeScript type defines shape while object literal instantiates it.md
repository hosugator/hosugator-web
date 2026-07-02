---
created: 2026-06-26
updated: 2026-06-26
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - typescript
  - interface
  - type
  - abstraction
  - frontend
publish: true
---
## Context
Align-AI 6단계 준비 중 `types.ts`의 `,` vs `;` 구분자 차이를 설명하다가, interface와 object literal이 각각 다른 문법 전통에서 왔다는 걸 처음 만났다. "object literal은 하드코딩 개념이고, interface는 추상화 수준이 더 높은 거네"라는 연결이 즉각 나왔다.

## Insight
### type/interface는 계약이고, object literal은 그 계약의 구체적 값이다

```ts
// type — 추상화. "이런 형태여야 한다"는 계약
type InferenceResult = { status: string; line1_px: number }

// object literal — 구체화. 실제 값이 메모리에 올라감
const result = { status: "ok", line1_px: 1265 }
```

Python으로 보면 동일한 패턴이다:

```python
class InferenceResult(TypedDict):   # interface 역할 — 추상화
    status: str
    line1_px: int

result = {"status": "ok", "line1_px": 1265}  # object literal 역할 — 구체화
```

### TypeScript에서 type과 interface가 공존하는 건 역사적 이유다

`interface`가 먼저 있었고 `;`를 구분자로 썼다. 나중에 `type`이 추가됐는데 더 범용적이라 지금은 `type`이 주로 쓰인다. 둘 다 같은 역할을 한다. object literal은 값 문법이라 `,`를 쓰고, type/interface는 계약 문법이라 `;`를 쓰는 게 관례인 이유가 여기서 나온다.

## Related
- [[Type systems implement fail-fast by shifting error detection from runtime to compile time]] — type 선언이 왜 필요한지의 이유
