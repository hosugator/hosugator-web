---
created: 2026-06-29
updated: 2026-06-29
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - docker
  - ci-cd
  - devops
  - build
publish: true
---
## Concept

소스코드가 소프트웨어가 되는 과정은 두 단계로 나뉜다.

```
소스코드 → [빌드] → 아티팩트(Docker 이미지) → [실행] → 동작하는 서비스
              ↑                                      ↑
         빌드 환경 의존성                       런타임 환경 의존성
```

Docker와 CI는 같은 문제(재현성)의 서로 다른 단계를 각각 잠근다.

### 런타임 환경 의존성 — Docker가 해결하는 것

이미지가 **실행될 때** 필요한 것들이다.

- Python 버전, 시스템 라이브러리, OS 환경

Docker는 이것들을 이미지 안에 고정해서 "어디서 실행해도 동일한 환경"을 보장한다. → **실행 재현성**

### 빌드 환경 의존성 — CI가 해결하는 것

이미지를 **만들 때** 필요한 것들이다.

- pip 버전, 로컬 캐시 상태, 개발자 머신에 전역 설치된 패키지

```
개발자 로컬: requirements.txt에 빠진 패키지가 전역 설치되어 있음
  → 로컬 빌드 성공
CI 깨끗한 환경: 해당 패키지 없음
  → 빌드 실패 → 누락 발견
```

CI는 매 빌드를 오염 없는 환경에서 시작해 "누가 빌드해도 동일한 결과물"을 보장한다. → **빌드 재현성**

### 정리

| | 해결 시점 | 보장하는 것 |
|---|---|---|
| Docker | 실행 시 | 어디서 실행해도 동일한 환경 |
| CI | 빌드 시 | 누가 빌드해도 동일한 결과물 |

## Related
- [[Each infrastructure layer removes one dependency and reveals source code as the true bottleneck]] — CI/CD 전체 파이프라인 맥락, CI의 자기 완결성 검증 역할
