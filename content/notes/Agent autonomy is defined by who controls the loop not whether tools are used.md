---
created: 2026-06-24
updated: 2026-06-24
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - agent
  - llm
  - react
  - autonomy
publish: true
---
## Context
align-ai LLM 에이전트 로드맵에서 tools.py(Stage 3)와 react.py(Stage 5)를 순서대로 구현한 뒤 "tool을 쓰는 순간부터 에이전트인가, ReAct부터인가?"라는 질문이 생겼다. 두 파일의 구조적 차이를 비교하면서 에이전트의 정의 기준을 직접 도출했다.

## Insight
### 루프를 누가 제어하는가가 에이전트의 분기점이다

```
tools.py:
  if message.tool_calls:
      execute()     ← 코드가 흐름을 제어
  else:
      print(answer)
  → 1회성 분기. 모델은 툴을 선택했을 뿐, 다음 행동을 결정하지 않는다.

react.py:
  while True:
      response = api_call()
      if not message.tool_calls:
          break     ← 모델이 "이제 됐다"고 판단할 때 루프 종료
      execute_tools()
  → 루프 지속 여부를 모델이 매 턴 결정한다.
```

tools.py는 "툴을 쓰는 LLM", react.py는 "자율적으로 행동하는 에이전트"다.

### "에이전트"는 마케팅 용어로 오염되어 있다

tool use 수준도 "에이전트"로 부르는 경우가 많다(LangChain, 공식 문서 등). 학술적으로 엄밀히 따지면 자율적 루프 제어가 있어야 에이전트다. 커뮤니케이션 맥락에 따라 단어의 범위가 달라진다.

### 루프 제어권이 모델로 넘어갈수록 결과를 예측하기 어려워진다

tools.py는 "호출 1번, 결과 1번"으로 행동 범위가 고정된다. react.py에서는 모델이 몇 번 반복할지, 어떤 순서로 툴을 부를지를 런타임에 결정한다. 이 자유도가 복잡한 문제를 풀 수 있는 힘이 되지만, 동시에 예측 불가능성과 디버깅 난이도를 높인다.

## Related
- [[ReAct agent loop uses message history accumulation as the reasoning trace]] — 루프 구조 구현 상세
- [[Agentic AI가 일으키는 out of the loop]] — 루프 제어권이 모델로 넘어갈 때 인간이 소외되는 구조
- [[AI 에이전트 시대 실무자의 이해 수준 — 무엇을 알아야 하는가]] — 에이전트 시대 실무자 이해 맥락
- [[Agent heuristics must be recalibrated through outcome tests not theoretical reasoning]] — 에이전트 규칙 품질 관리의 중요성
