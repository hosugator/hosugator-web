---
created: 2026-06-24
updated: 2026-06-24
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - agent
  - llm
  - react
  - tool-use
  - function-calling
publish: true
---
## Context
align-ai LLM 에이전트 로드맵 Stage 5 구현 중 ReAct 패턴을 처음 직접 코딩했다. Stage 3(tools.py)에서 단일 툴 호출을 먼저 구현했고, 그것과의 구조적 차이를 비교하면서 ReAct를 이해했다.

## Insight
### 루프 구조가 단일 호출과 ReAct를 가른다

```
tools.py (단일 호출):
  API 호출 → tool_calls 있으면 실행 → 최종 API 호출 → 끝
  코드가 흐름을 제어한다

react.py (ReAct 루프):
  while True:
      API 호출
      tool_calls 없으면 → print + break  ← 모델이 종료 결정
      tool_calls 있으면 → 실행 → messages에 결과 추가 → 반복
```

종료 조건은 코드에 `if not message.tool_calls: break`로 쓰여 있지만, 실제로 tool_calls를 채울지 비울지를 결정하는 것은 모델이다. 코드는 루프 껍데기만 제공한다.

### messages 누적이 reasoning trace가 된다

ReAct 루프가 돌수록 messages 리스트에는 assistant의 tool_calls 요청 + tool role 결과가 쌓인다. 다음 API 호출 때 모델은 이 전체 히스토리를 보고 "이제 충분한가?"를 판단한다.

```
messages:
  [system, user]
  → [system, user, assistant(tool_calls=[get_weather(서울)]), tool(맑음 22°C)]
  → [system, user, ..., assistant(tool_calls=[get_weather(부산)]), tool(흐림, 비 예보)]
  → [system, user, ..., assistant(tool_calls=[get_forecast(부산)]), tool(1일 비...)]
  → [system, user, ..., assistant(content="서울은 맑고 부산은...")]  ← 종료
```

### 한 턴에 여러 툴이 동시 호출될 수 있다

tools.py에서는 `message.tool_calls[0]`으로 첫 번째만 꺼냈다. ReAct에서는 `for tool_call in message.tool_calls`로 전체를 순회한다. 모델이 서울·부산 날씨를 한 번에 요청한 것처럼, 독립적인 호출은 동시에 일어난다.

### **fn_args 언패킹은 함수 인자가 여러 개일 때 필요하다

tools.py는 `fn_args["city"]`로 직접 꺼냈다. ReAct에서는 툴마다 인자 구성이 다르므로 `available_tools[fn_name](**fn_args)`로 dict를 펼쳐 자동 매핑한다.

## Related
- [[Agent autonomy is defined by who controls the loop not whether tools are used]] — ReAct가 "에이전트"로 불리는 이유
- [[LLM agent learning roadmap from API basics to multimodal industrial agent]] — Stage 5 위치
- [[How to use AI Tool - Agentic]] — 에이전트 패턴 활용 맥락
- [[Agentic AI가 일으키는 out of the loop]] — 루프 제어권이 모델로 넘어갈 때의 트레이드오프
- [[Agent heuristics must be recalibrated through outcome tests not theoretical reasoning]] — 에이전트 규칙 품질 관리
