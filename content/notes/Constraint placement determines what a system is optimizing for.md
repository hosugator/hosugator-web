---
created: 2026-05-28
updated: 2026-05-28
type: post
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - linkedin
  - system-design
  - constraints
  - workflow
publish: true
---

## Source

- [[Constraints belong at the output stage when output quality scales with input diversity]] — 핵심 원칙 및 인풋/아웃풋 제약 구분 기준
- [[linkedin-post skill reads all semantically related notes and constrains only the output claim]] — 이 원칙을 실제 스킬 설계에 적용한 결정
- [[Skill instructions are load-bearing only if their absence causes LLM mistakes]] — 스킬 규칙의 목적 중심 설계 원칙

## Draft

**LLM 비용을 아끼려다 결과를 망쳤다. 결과를 살리려다 비용을 날렸다. 문제는 양이 아니라 위치였다.**

토큰이 비용이 되면서 컨텍스트를 줄이게 됐다. 줄일수록 결과가 나빠지는 경우가 있었다. 어떻게 아껴야 하는지 몰랐다.

그러다 같은 LLM을 쓰는 두 작업에 완전히 다른 설계를 하고 있다는 걸 알았다.

뭘 읽어야 할지 이미 아는 작업이 있다. 코드 리뷰, 특정 문서 요약처럼 범위가 정해져 있다. 같은 내용을 다시 읽는 건 낭비다. 인풋을 제한하면 효율이 오른다.

뭐가 관련 있는지 모른 채 시작하는 작업이 있다. 기술 포스트 초안, 아이디어 합성처럼 넓게 읽을수록 예상 못한 연결이 생기고 결과의 깊이가 달라진다. 인풋을 제한하면 합성이 얕아진다. 제약은 아웃풋에만 — 주장을 하나로 좁히는 데서.

같은 LLM, 같은 질문 — 정답이 정반대인 이유는 작업의 구조다.

*지금 내 작업은 인풋을 아끼면 아웃풋이 줄어드는 구조인가, 늘어나는 구조인가.*

## Variant (A/B 테스트용 — 긍정 프레임)

**LLM 컨텍스트를 얼마나 줘야 하는지, 상반된 조언이 공존한다.**
