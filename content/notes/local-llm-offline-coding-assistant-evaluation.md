---
created: 2026-05-12
updated: 2026-05-12
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - local-llm
  - ollama
  - aider
  - offline
  - coding-assistant
publish: true
---

# 로컬 LLM 오프라인 코딩 어시스턴트 도입 가능성 평가

## Context

공장 출장 시 오프라인 환경에서 AI 어시스턴트 사용 가능성을 검토해달라는 선임 요청으로 실사용 테스트 진행.
테스트 환경: RTX 5070 Laptop GPU (8GB VRAM), 32GB RAM.

테스트 스택:
- Ollama + Open Interpreter (범용 에이전트)
- Ollama + Aider (코드 편집 특화)
- 모델: Gemma4 E4B (Q4, ~5GB VRAM), Qwen2.5-Coder 7B (~6.6GB VRAM), Qwen2.5-Coder 14B (49%/51% CPU-GPU 혼합)

## Decision

**챗봇(Q&A) 용도로는 실용적이나, 코드 검토·자율 수정 용도로는 현재 하드웨어 기준으로 도입 부적합.**

구체적 평가:

| 용도 | 4B/7B | 14B (CPU 오프로드) | 비고 |
|------|-------|-------------------|------|
| 단순 Q&A | 가능 | 가능 | 실용적 |
| 파일 분석 | 불안정 | 보통 | 경로 환각 발생 |
| 코드 수정 | 부적합 | 불안정 | 지시 무시, 미완성 리팩터링 |
| 자율 멀티파일 작업 | 불가 | 불가 | Claude Code 수준 불가 |

핵심 병목은 **모델 크기(파라미터 수)**이며 툴링 문제가 아님.

Claude Code 수준의 유용성을 위해서는 최대 파라미터 모델(31B+)을 VRAM 내에서 온전히 구동할 수 있는 하드웨어가 필요.

## Consequences

**파일 시스템 접근**: 로컬 LLM 자체에는 파일 권한이 없으므로 Aider(코드 편집), Open Interpreter(범용 에이전트) 같은 래퍼 프로그램이 필수.

**서비스화 시**: Ollama가 `localhost:11434`에 REST API를 기본 제공하므로 챗봇 서비스 구성은 가능. 다만 파일 시스템 접근 도구는 별도 구현 필요.

**접근성**: Ollama 설치 후 모델 pull만으로 즉시 사용 가능. 진입 장벽은 예상보다 낮음.

**오프라인 대안**: 출장 전 Claude Code로 분석·작업을 완료하고 결과물을 지참하는 것이 현재로서는 더 실용적.

**자율 에이전트 도구 동향**: Devin($500/월), OpenHands(오픈소스) 등 목표만 주면 스스로 계획·실행·검증하는 자율 에이전트가 등장했으나 현재는 얼리어답터 단계. Claude Code auto mode가 동일 개념을 로컬에서 구현한 것. 2~3년 내 현업 표준화 가능성 있음.
