---
created: 2026-05-26
updated: 2026-05-26
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - pkm
  - adr
  - zettelkasten
  - naming
publish: true
---

## Context

`K3s adr-lmr-edge-배포전략-docker-vs-k3s.md` 노트의 제목을 명제형으로 바꾸는 과정에서 도출. "K3s is over-engineering for small computer system" 같은 명제형을 검토하다가, ADR의 제목이 일반 insight 노트의 명제형과 다른 기준을 가져야 한다는 사실을 확인했다.

## Insight

### Zettelkasten 명제형과 ADR 제목은 다른 인식론적 성격을 가진다

Zettelkasten 명제형 제목은 **인식론적 주장** — 세계가 어떻게 작동하는지에 대한 클레임이다. "그렇다/아니다"로 검증·반박 가능해야 노트로서 가치가 있다.

ADR 제목은 **결정 기록** — "이 맥락에서 이 결정을 내렸고, 언제 번복할 수 있는가"가 핵심 정보다. 나중에 결정이 뒤집혀도 ADR이 "틀린" 게 아니라 조건이 바뀐 것이고, 그래서 status가 `superseded`가 된다.

### ADR 제목 권장 형식: 결정 + 전환 조건

```
"A over B until C"
"A because B, revisit when C"
```

예시:
- `Docker and Ansible over k3s until edge scale justifies HA overhead`
- `K3s HA requires three control planes making it impractical for small edge clusters`

반면 `K3s is over-engineered for small edge clusters`는 insight 명제형이지, ADR 제목으로는 전환 조건이 빠져 있어 불완전하다.

### 타입별 제목 컨벤션이 달라도 일관성이 있다

ADR이 insight와 다른 제목 컨벤션을 쓰는 것은 원칙의 예외가 아니다. ADR이라는 타입 자체가 다른 성격의 정보를 담기 때문에, 제목 형식도 그 성격에 맞게 달라지는 것이다.

→ 관련: [[ADR should have status, context, decisions and consequences]]
