---
created: 2026-03-26 09:21
updated: 2026-03-26 09:21
type: insight
status: 1-draft
subject: "[[PKM]]"
project: "[[Edge AI LMR]]"
tags:
  - 
  - 
  - 
  - 
  - 
publish: true
---
# Gemini CLI Hybrid PKM Strategy Setup

## Summary
Gemini CLI와 Obsidian을 결합하여 프로젝트 종속적 맥락(Repo Docs)과 범용적 지식 자산(Obsidian)을 분리 관리하는 최적화된 하이브리드 PKM 워크플로우를 구축함.

## Key Implementation
1. **Memory Fact (Identity)**: 사용자의 지식 관리 중심이 Obsidian임을 전역적으로 각인하여 모든 세션에서 PKM 우선 사고방식 유지.
2. **GEMINI.md (Constitution)**: 
    - **Inquiry Isolation**: 복잡한 조사는 서브 에이전트로 격리하여 메인 세션의 맥락 오염 방지.
    - **Hybrid Storage**: 'How'는 Repo에, 'What/Insight'는 Obsidian에 저장하는 경계선 확립.
3. **obsidian-helper (Skill)**: 
    - ~/zettelkasten 심볼릭 링크를 통한 윈도우 볼트 안정적 접근.
    - 0. index/MOC - Inbox.md 자동 백링크 및 요약문 인덱싱 기능 구현.
    - **Type Classification**: log, insight, source, execution으로 세분화된 지식 분류 체계 적용.
    - **Dependency Logic**: 내용 종속성(Subject)과 맥락 종속성(Project)을 명확히 구분하여 메타데이터 구성.

## Next Steps
- 심층 기술 조사 시 generalist 호출 후 즉시 Obsidian 덤프 프로토콜 실행 테스트.
- 프로젝트별 docs/ 내 ADR 작성 시 Obsidian 내 관련 범용 지식 링크 활용.