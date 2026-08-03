---
created: 2026-07-13
updated: 2026-07-20
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[Align AI]]"
tags:
  - abstraction
  - parameterization
  - software-design
publish: true
---
## Context
Align-AI 데이터 계층 작업 하루 동안 SQL 파라미터 바인딩(`%s`), k8s Secret/env 주입, CI의 이미지 태그 문자열 치환, Helm의 템플릿+`values.yaml`을 연달아 만졌다.
마지막에 Helm을 설명받다가 이것들이 전부 같은 동작의 반복이라는 걸 깨달았다.

## Insight
### 프로그래밍은 "반복되는 구조에서 값을 분리해내는" 행위의 무한 반복이다

같은 날 만난 사례만 모아도 전부 동일한 패턴이다.

| 층위             | 고정된 구조                                 | 분리해낸 값                       |
| -------------- | -------------------------------------- | ---------------------------- |
| SQL 쿼리         | `INSERT INTO ... VALUES (%s, %s, ...)` | 파라미터 튜플                      |
| k8s Deployment | container spec                         | `env`로 주입되는 DB_HOST/PASSWORD |
| CI 파이프라인       | `deployment.yaml` 전체                   | 이미지 태그 한 줄                   |
| Helm           | 템플릿 매니페스트                              | `values.yaml`                |
| 함수 일반          | 함수 본문(로직)                              | 인자(argument)                 |
| TypeScript 제네릭 | `useState<T>`의 내부 로직                   | `<T>`에 들어가는 실제 타입            |
| React 컴포넌트     | JSX 구조                                 | `props`로 들어오는 값              |

### 이 분리는 규모가 커질 때마다 한 단계 위에서 다시 일어난다 — 프랙탈적 반복

```
함수 호출이 반복 → 함수(구조) + 인자(값)로 분리
함수 정의 자체가 반복(타입만 다름) → 제네릭(구조) + 타입 파라미터(값)로 분리
설정값이 반복 → 코드(구조) + env/Secret(값)로 분리
배포 파일이 반복(태그만 다름) → 매니페스트(구조) + CI 자동 치환(값)으로 분리
매니페스트 자체가 반복(환경별로) → 템플릿(구조) + values.yaml(값)으로 분리
```

각 층위는 새로운 원리가 아니라, 바로 아래 층위에서 반복이 누적되자 그 반복 단위 자체를 다시 구조/값으로 쪼갠 것이다.
함수 → 제네릭/템플릿 → 프레임워크 → 플랫폼 도구(Helm 등)로 갈수록 "무엇을 반복 가능한 구조로 고정할 것인가"의 대상이 한 단계씩 커질 뿐, 동작 자체는 동일하다.

### 실전 적용: 새 도구를 만나면 "뭘 구조로 고정하고 뭘 값으로 빼냈는가"부터 물으면 된다

이 질문 하나로 새 프레임워크·도구의 핵심을 빠르게 파악할 수 있다.
SQL 파라미터 바인딩이 인젝션을 막아주는 이유도 같은 원리다 — 쿼리 구조와 값이 완전히 분리되어 있어, 값에 뭐가 들어오든 구조(명령어) 자체로 재해석될 수 없기 때문.

### 제네릭은 "타입 힌트"가 아니라 여러 자리에 걸친 타입 관계를 유지하는 변수다

일반 타입 힌트(`x: number`)는 값의 타입을 하나로 고정한다. 제네릭(`x: T`)은 그 타입 자체를 나중에 채워질 자리로 남겨두는데, 단순히 "빈칸이라 뭐라도 채운 것"이 아니다 — 같은 이름 `T`가 함수 시그니처의 여러 자리(입력/출력)에 반복 등장함으로써 "이 자리들은 실제로 무엇이 오든 서로 같은 타입이어야 한다"는 관계를 컴파일러에게 계속 유지시키는 게 핵심이다.
이게 그냥 `any`로 타입 체크를 포기하는 것과의 결정적 차이다 — `any`도 빈칸을 채운 것처럼 보이지만, 입력과 출력 사이의 관계 자체를 아예 잊어버리게 만든다. 제네릭은 관계를 유지한 채로 타입만 비워두는 것이다.

"제네릭"이라는 이름도 같은 원리를 반영한다 — 타입마다 동일한 로직(`identityNumber`, `identityString`, ...)을 중복해서 쓰는 대신, 어떤 타입에도 일반적으로(generically) 적용되는 하나의 코드를 쓴다는 뜻. 타입 이론에서는 이를 parametric polymorphism이라 부른다.

## Related
- [[TypeScript type defines shape while object literal instantiates it]] — 타입(구조)과 실제 값(인스턴스)의 분리라는 같은 원리를 TypeScript 층위에서 먼저 다룸
- [[Writing a schema.sql file is physical data modeling between infra provisioning and application code]] — 이 인사이트가 나온 당일 작업의 SQL 파라미터 바인딩 사례
- [[StatefulSet rebinds the same PVC via deterministic pod naming, not automatic data replication]] — 같은 날 k8s 층위에서 구조(Pod 이름 규칙)와 값(실제 데이터)의 분리를 다룸