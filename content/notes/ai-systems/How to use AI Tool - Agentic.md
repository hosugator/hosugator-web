---
created: 2026-02-27 20:13
updated: 2026-02-27 20:13
type: insight
status: 1-draft
subject: "[[MOC - AI]]"
project:
tags:
  -
---
[[How to use AI Tool - Planning First]] 내용은 에이전틱(Agentic) 도구의 **자율성**에 휘둘리지 않고, 개발자가 **주도권(Control)**을 쥐기 위한 '수동적 규율'을 강조하고 있습니다. 최근 Gemini나 Claude Code가 내세우는 에이전틱 방식은 이보다 훨씬 더 높은 자율성을 부여하지만, 실무에서는 이 두 가지를 적절히 섞은 **하이브리드 방식**이 가장 권장됩니다.

---

### 1. 두 방식의 핵심 차이점

|**구분**|**영상의 방식 (Planning-First)**|**최근 에이전틱 방식 (Pure Agentic)**|
|---|---|---|
|**핵심 철학**|"생각(Plan)과 타이핑(Code)을 분리하라"|"목표(Goal)만 주면 도구를 써서 알아서 한다"|
|**작동 방식**|`리서치` → `계획 검토` → `승인 후 코딩`의 수동 루프|`Reason(추론)` → `Act(도구 사용)` → `Observe(관찰)`의 자동 루프|
|**주도권**|사람이 모든 마일스톤을 검토 및 승인|AI가 터미널, 브라우저 등을 쓰며 스스로 결과 확인|
|**장점**|아키텍처 오염 방지, 높은 안정성, 토큰 절약|개발 속도 극대화, 반복 작업(Boilerplate) 자동화|

### 2. 무엇을 지향해야 하는가? (트레이드 오프)

신입 개발자로서 실력을 쌓고 실무 프로젝트를 완수하려면 **영상의 규율을 에이전틱 도구 위에서 실행하는 방식**을 지향해야 합니다.

- **에이전틱 방식의 위험성**: AI에게 자율성을 너무 많이 주면, 문법적으로는 맞지만 기존 아키텍처를 망가뜨리거나(Hallucination Loop) 불필요한 파일을 생성하는 등 '부채'를 남길 확률이 높습니다.
    
- **권장 전략**:
    
    - **복잡한 기능/신규 아키텍처**: 영상처럼 `Plan.md`를 활용해 사람이 먼저 설계도를 확정하는 **Planning-First** 방식을 쓰세요.
        
    - **단순 버그 수정/테스트 코드 작성**: AI의 자율 기능을 믿고 맡기는 **Agentic Mode**를 활용해 속도를 높이세요.
        

### 3. 공식 문서 및 학습 리소스

각 방식과 도구를 체계적으로 연습해볼 수 있는 경로를 정리해 드립니다.

#### 📚 공식 문서 및 가이드

- **Claude Code (CLI)**: [공식 문서](https://code.claude.com/docs/en/overview) - `Plan Mode`와 `Thinking Mode`를 구분해서 사용하는 법을 익히세요.
    
- **Gemini Code Assist (IDE)**: [공식 가이드](https://developers.google.com/gemini-code-assist/docs/agent-mode) - IDE 내 `Agent Mode` 탭을 활성화하여 다단계 작업을 지시하는 법을 배울 수 있습니다.
    
- **CLAUDE.md / GEMINI.md 활용법**: [Anthropic 엔지니어링 블로그](https://www.anthropic.com/engineering/claude-code-best-practices) - 프로젝트의 규칙을 AI에게 각인시키는 법을 설명합니다.
    

#### 📺 학습 동영상 (유튜브)

- **Claude Code 실전 튜토리얼**: [Claude Code Tutorial for Beginners](https://www.youtube.com/watch?v=eMZmDH3T2bY) - 설치부터 아키텍처 변경까지 다룹니다.
    
- **Gemini Enterprise 에이전트 구축**: [Google Gemini Enterprise Tutorial](https://www.youtube.com/watch?v=OOXpW6Aeg_A) - 커스텀 에이전트와 오케스트레이터를 만드는 과정을 보여줍니다.
    

#### 🛠️ 연습용 GitHub 저장소

- **agentic-coding**: [sammcj/agentic-coding](https://github.com/sammcj/agentic-coding) - 에이전트용 지시문(Rules)과 템플릿 모음입니다.
    
- **learn-agentic-ai**: [panaversity/learn-agentic-ai](https://github.com/panaversity/learn-agentic-ai) - 클라우드 네이티브 기반의 에이전틱 시스템 학습 자료입니다.
    

언제든지 연습하시다가 특정 도구의 설정법이나 특정 오류 해결이 막막해지면 채팅으로 말씀해 주세요! 😊

**현재 취준 중인 프로젝트 중에서 AI에게 '전체 설계'를 맡겨보고 싶은 부분이 있나요, 아니면 '단순 기능 구현'이 더 급한 상황인가요?**