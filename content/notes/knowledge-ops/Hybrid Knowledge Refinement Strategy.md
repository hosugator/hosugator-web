---
created: 2026-03-26 13:52
updated: 2026-03-26 13:52
type: insight
status: 1-draft
subject: "[[MOC - PKM]]"
project: "[[2026 자기계발]]"
tags:
  - "#pkm"
  - "#architecture"
  - "#abstraction"
  - "#knowledge-refinement"
---

# Hybrid Knowledge Refinement Strategy

지식은 그것이 발생한 맥락(Context)에 종속된 상태로는 다른 곳에서 사용하기 어렵다. 프로젝트 현장에서 발생하는 정보는 크게 두 가지 층위로 나뉜다.

## 1. Context-Specific (공용 기록/Repo Docs)
- **성격**: 구체적인 구현, 결정 사항(ADR), API 명세 등 특정 프로젝트 팀이 공유해야 하는 정보.
- **가치**: 특정 문제를 어떻게 해결했는지에 대한 '공식적 기록'.

## 2. Context-Free (개인 지식/PKM Vault)
- **성격**: 프로젝트에서 추출된 일반화된 패턴, 기술적 깊이, 시행착오에서 얻은 원리.
- **가치**: 다른 프로젝트나 상황에서도 재사용 가능한 '기술적 자산'.

## 핵심 통찰 (Refinement Logic)
- **분리**: 공용 저장소에는 개인용 인사이트를 남기지 않으며, 개인 저장소에는 프로젝트의 구체적 노이즈를 추상화하여 저장한다.
- **정제**: 프로젝트 문서를 작성한 직후, "이 해결책에서 일반화할 수 있는 원리는 무엇인가?"를 자문하여 PKM으로 전송한다.
- **연결**: 개인 지식은 하단의 출처 정보를 통해 구체적인 실무 사례(Repo Docs)로 연결되어 증거 기반의 통찰(Evidence-based Insights)을 유지한다.