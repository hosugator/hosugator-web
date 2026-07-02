---
created: 2026-06-12
updated: 2026-06-12
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - gitops
  - iac
  - ssot
  - software-philosophy
publish: true
---
## Context
align-ai k3s/Argo CD 실습 중 "Argo CD는 Git manifest를 감시하고 클러스터 상태를 맞춘다"는 구조를 이해한 후, 이 패턴이 Terraform(IaC), 문서 관리(DaC)와 동일하다는 것을 합성했다.

## Insight
### 공통 패턴: Git에 원하는 상태를 선언하고 자동화가 실제를 맞춘다

| 도구                 | 도메인 | Git에 선언하는 것     | 자동화가 맞추는 것  |
| ------------------ | --- | --------------- | ----------- |
| Terraform / Pulumi | 인프라 | `.tf`, `.yaml`  | 클라우드 리소스    |
| Argo CD            | 배포  | `manifest.yaml` | k8s 클러스터 상태 |
| DaC                | 문서  | `.md`, `.rst`   | 발행된 문서 사이트  |

패턴은 하나다. 도메인만 다를 뿐이다.

### Git이 SSOT가 되면 도구에 관계없이 동일한 인터페이스를 얻는다

- 변경 이력: git log가 모든 변경의 감사 로그
- 리뷰: PR이 기능·인프라·문서 변경을 동일하게 처리
- 롤백: git revert 하나로 어느 도메인이든 이전 상태 복원
- 자동화 트리거: push 이벤트 하나로 CI/CD, IaC apply, 문서 빌드 모두 연동 가능

### 개발자들이 도메인마다 독립적으로 같은 철학에 도달했다

각 도구는 서로 다른 커뮤니티(인프라 엔지니어, DevOps, 기술 문서 팀)에서 만들어졌지만 결론이 같다. Git을 SSOT로 만들고자 하는 니즈가 도구를 생산한 것이지, 도구가 이 철학을 설계한 것이 아니다.

### Git SSOT의 이점은 애플리케이션이 제약을 충족할 때만 실현된다

운영 수준의 공수 감소·기능 개선(자동 롤백, self-healing, 배포 이력)이 애플리케이션 수준의 설계 제약 추가와 코드 수준의 관리 대상 증가로 전환된 것이다. 복잡성이 사라지는 게 아니라 교환된다.

| 항목                                            | 변화     |
| --------------------------------------------- | ------ |
| 반복 수작업 (수동 배포, 수동 롤백)                         | 제거됨    |
| 반복 수작업에서 발생하던 누락·불일치·휴먼 에러                    | 함께 제거됨 |
| 초기 설정 복잡성 (k8s, Argo CD, 레지스트리, 프로브 구현 등)     | 증가됨    |
| 이전엔 몰라도 됐던 아키텍처 제약 (stateless, idempotency 등) | 새로 추가됨 |

반복 업무를 없애는 대신 구조적 복잡성이 늘어난다. 반복 업무에서 발생하던 복잡성(누락, 불일치)은 제거되지만, 시스템을 유지하기 위한 구조적 복잡성은 새로 생긴다. 규모가 커질수록 전자의 이득이 후자의 비용을 압도한다.

애플리케이션이 충족해야 하는 설계 제약:

| 제약 | 이유 |
|---|---|
| Stateless 설계 | pod 교체·재시작에도 동작 유지되어야 self-healing이 의미 있음 |
| Liveness / Readiness probe | 앱이 응답해야 k8s가 hang을 감지하고 재시작할 수 있음 |
| 멱등성(idempotency) | 같은 manifest를 두 번 apply해도 동일한 결과여야 함 |
| Graceful shutdown | SIGTERM 수신 시 진행 중인 요청을 완료하고 종료해야 롤링 업데이트가 무중단 |

Git SSOT 모델의 구조적 예외:

| 관리 대상  | 문제                                                              |
| ------ | --------------------------------------------------------------- |
| Secret | 보안상 Git에 올릴 수 없어 SSOT에 구멍이 생김. Sealed Secrets, Vault 등 별도 도구 필요 |
| 이미지 태그 | latest만으로는 롤백 불가. SHA 또는 버전 태그 전략 별도 필요                         |
| 중앙 로깅  | pod가 죽으면 로그도 사라지므로 외부 수집 필요                                     |

Secret 관리가 특히 아이러니하다. "모든 것을 Git에"라는 원칙의 예외가 보안상 가장 중요한 값이다.

## Related
- [[Argo CD watches Git manifest and CI must update manifest to trigger deployment]] — GitOps 패턴의 구체적 구현. CI가 manifest를 업데이트하는 단계가 Git-SSOT 연결고리
- [[3-tier document architecture satisfy SSOT, audit-trail, and cooperation]] — 문서 도메인에서 SSOT를 구현하는 아키텍처
- [[PKM outlasts any project and is the single source of truth that skills derive from]] — 지식 도메인에서의 SSOT
- [[Stateless design makes any instance interchangeable by externalizing state]] — Git SSOT 이점을 실현하기 위해 애플리케이션이 충족해야 하는 핵심 설계 제약
