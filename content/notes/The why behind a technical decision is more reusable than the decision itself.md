---
created: 2026-05-27
updated: 2026-05-27
type: post
status: 3-superseded
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - linkedin
  - pkm
  - knowledge-management
publish: true
---

→ [[ADR documents the decision PKM extracts the principle]]

## Source

[[PKM outlasts any project and is the single source of truth that skills derive from]] — PKM→적용→구현 업데이트 방향 원칙
[[pkm-역할-재정의]] — 1,295개 노트 후 PKM을 "백과사전"에서 "개인 결정·인사이트 로그"로 재정의한 경험
[[Personal artifacts outlast project attribution when work becomes subsidiary to a larger effort]] — 프로젝트가 끝난 후 개인 기여의 흔적이 사라지는 구조
[[ADR type is unsuitable for personal PKM because it carries team collaboration semantics]] — 팀 도구 형식을 개인 PKM에 그대로 적용했을 때의 실패 구조
[[Old PKM protocol blocked practical learning from being stored]] — 잘못된 프로토콜이 가장 중요한 기록을 차단하는 역설

## Draft

**다음 프로젝트에서 같은 실험을 반복하고 있다면, 기억력이 아니라 저장 위치가 문제다.**

batch_size를 왜 그렇게 설정했는지. 그 라이브러리를 왜 선택했는지. 그 아키텍처 결정 뒤에 어떤 트레이드오프가 있었는지.

이 "왜"들은 프로젝트 코드 어디에도 없다.

ADR에 기록했더라도, 그 ADR은 그 레포 안에 남는다. git blame은 값이 바뀐 시점을 보여주지, 왜 그 값이었는지는 보여주지 않는다. 그리고 내 기억은 프로젝트 간 경계를 지키지 못한다.

나는 수백 개의 노트를 쌓은 후에야 내 PKM이 잘못 설계됐다는 걸 알았다. "모든 걸 기록한다"는 원칙이 정작 가장 중요한 것들을 차단하고 있었다. LLM에게 물어볼 수 있는 개념 정의를 저장하느라, "내가 왜 이 결정을 내렸는가"는 빠졌다.

재사용 가능한 건 결정이 아니라 결정의 이유다.

"batch_size를 32로 설정했다"는 그 프로젝트에서만 유효하다. "GPU 메모리와 training stability 사이에서 이 기준으로 선택했다"는 다음 프로젝트에서도 꺼낼 수 있다. 데이터 전처리 방식이든, API 호출 전략이든, 환경 설정이든 — 원리는 맥락을 넘어서 작동한다.

```
원리 (PKM — 프로젝트를 넘어서는 SSOT)
  → 프로젝트별 적용 (레포·팀 위키)
    → 구현 (코드·설정)
```

*ADR은 프로젝트와 함께 닫힌다. PKM은 내가 어디서든 꺼낼 수 있다.*
