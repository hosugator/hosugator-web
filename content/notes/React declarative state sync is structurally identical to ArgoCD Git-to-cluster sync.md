---
created: 2026-06-25
updated: 2026-06-25
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - react
  - argocd
  - declarative
  - frontend
  - kubernetes
publish: true
---
## Context
React를 처음 접하면서 "왜 순수 JS 대신 React를 쓰는가"를 이해하는 과정에서, 이미 체득한 ArgoCD의 동작 방식과 동일한 패턴임을 발견했다. 이 연결이 머리에 확 들어오는 계기가 됐다.

## Insight
### React의 상태→DOM 동기화는 ArgoCD의 Git→클러스터 동기화와 구조가 같다

```
Git manifest  ←→  클러스터 실제 상태   (ArgoCD가 동기화)
선언한 데이터  ←→  DOM 실제 상태       (React가 동기화)
```

| | ArgoCD | React |
|---|---|---|
| 원하는 상태 선언 | Git YAML manifest | JSX + 상태(state) |
| 실제 상태 | 클러스터 실행 중인 리소스 | 브라우저 DOM |
| 동기화 주체 | ArgoCD controller | React 라이브러리 |
| 개발자 역할 | "이렇게 배포되어야 한다"만 선언 | "데이터가 이렇면 화면은 이렇다"만 선언 |

이 패턴을 **선언형(Declarative)**이라 부른다. "어떻게 할지(How)"가 아니라 "무엇이어야 하는지(What)"를 선언하면 도구가 현재 상태와 diff해서 맞춰준다.

### 순수 JS DOM 조작은 ArgoCD 없이 kubectl로 리소스를 직접 수정하는 것과 같다

React 없이 순수 JS로 DOM을 업데이트하면 데이터가 바뀔 때마다 어떤 DOM 요소를 어떻게 바꿀지 개발자가 전부 추적해야 한다. ArgoCD 없이 `kubectl edit`으로 리소스를 직접 수정하는 것처럼, 추적 부담이 온전히 개발자에게 남는다. 컴포넌트가 10개가 넘으면 버그의 온상이 된다.

## Related
- [[HTML CSS JS DOM JSX Babel React each occupy a distinct layer in web]] — 기초 재료 정리
- [[Argo CD sync and self-healing are distinct trigger conditions for applying Git state]] — ArgoCD sync 동작 원리
- [[Next.js Tailwind shadcn over Vite React for learning minimal UI as backend engineer]] — 스택 선택 결정
