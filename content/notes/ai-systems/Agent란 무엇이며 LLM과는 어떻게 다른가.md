---
created: 2025-10-14 14:47
tags:
  - agent
  - llm
  - 
reference:
updated: 2026-02-17 18:15
type: source
status: 3-publish
subject: "[[MOC - AI]]"
project: "[[MOC - Intel AI for Future Workforce]]"
---
## Child
```dataview
TABLE
	updated,
	created,
	status
FROM ""
WHERE project = this.file.link
OR subject = this.file.link
SORT status ASC, updated DESC, created DESC
```

> Last revised: `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`
## LLM과 Agent의 차이
|구분|LLM (거대 언어 모델)|Agent (AI 에이전트)|
|---|---|---|
|정의|지능의 핵심 엔진|목표를 달성하는 시스템|
|역할|인지 (Cognition) 및 추론 (Reasoning)을 담당하는 핵심 모듈.|LLM을 핵심 두뇌로 사용하여 계획(Planning), 행동(Action), 피드백(Feedback)을 수행하는 자율 시스템.|
|핵심 기능|토큰 예측, 문맥 이해, 지식 생성 및 추론 능력|자율성(Autonomy), 기억(Memory), 도구 사용(Tool Use), 재귀적 개선(Reflection)|
|목적|주어진 프롬프트에 대한 가장 적절한 응답을 생성.|주어진 목표(Task)를 시작부터 끝까지 능동적으로 완수.|
|비유|두뇌 (Brain): 방대한 지식을 가지고 생각하는 능력.|인간 (Human): 두뇌의 명령을 받아 행동하고 환경과 상호작용하는 주체.|
### LLM 기술적 저의
LLM은 대규모 텍스트 데이터셋으로 훈련된 심층 신경망 모델입니다.
핵심 원리: 토큰 예측 (Token Prediction): LLM은 본질적으로 주어진 시퀀스 다음에 올 가장 확률이 높은 토큰(단어, 구두점 등)을 예측하는 역할을 수행합니다.
제한점:
    단기 기억(Context Window): 입력받은 프롬프트의 길이(Context Window)가 제한되어 있어, 그 범위 밖의 과거 정보는 기억하지 못합니다.
    행동 불능 (Inability to Act): LLM 자체는 외부 환경과 상호작용하거나 코드를 실행하거나 웹을 검색하는 등의 '행동(Action)'을 할 수 없습니다.
### Agent (AI 에이전트)의 기술적 정의
AI 에이전트는 LLM의 추론 능력을 자율적으로 목표를 완수하는 시스템으로 확장한 것입니다. 
Agent는 일반적으로 다음의 네 가지 핵심 구성 요소(Agentic Loop)를 포함합니다.

|구성 요소|기술적 용어|역할 (Agent의 확장 기능)|
|---|---|---|
|1. 계획/추론|Planner/Reasoning Engine|복잡한 목표를 작은 단계(Steps)로 나누고, 현재 상태를 분석하여 다음에 취할 최적의 행동을 결정합니다. (LLM이 담당하는 두뇌 역할)|
|2. 기억|Memory (Context & History)|단기 기억 (Short-term, Context Window)을 넘어서는 장기 기억 (Long-term Memory, Vector DB)을 사용하여 과거의 대화, 경험, 실패 기록 등을 저장하고 검색합니다.|
|3. 도구 사용|Tool Use / Action|LLM이 외부 세계와 상호작용할 수 있도록 API 호출, 코드 실행, 웹 검색 등의 도구(Tool)를 사용합니다. 에이전트가 목표를 실행할 수 있게 만듭니다.|
|4. 성찰/개선|Reflection / Evaluation|행동의 결과를 분석하고 성공/실패 여부를 평가하여, 다음 행동 계획을 수정하거나 장기 기억에 오류 원인을 기록하여 스스로 개선합니다.|
## 결론
Agent는 LLM이라는 강력한 추론 엔진을 두뇌로 사용하여, 기억, 도구, 계획, 성찰이라는 구성 요소를 통해 자율적으로 복합 업무를 완수 가능한 자율 시스템을 의미합니다.