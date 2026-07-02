---
created: 2026-06-23
updated: 2026-06-23
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - argocd
  - gitops
  - kubernetes
publish: true
---
## Context
Argo CD self-healing이 sync와 같은 말인지 물었다. 두 개념이 구분된다는 것을 학습했다.

## Insight
### Sync와 self-healing은 동일한 apply 동작의 서로 다른 트리거다

| 개념 | 트리거 조건 | 방향 |
|---|---|---|
| Sync (auto) | Git manifest 변경 감지 | Git → 클러스터 |
| Self-healing | 클러스터 상태가 Git과 달라졌을 때 (drift) | 클러스터 drift → re-sync |

Self-healing은 sync의 특수한 트리거다. "누군가 클러스터를 직접 건드렸을 때 자동으로 sync 실행"이 self-healing.

### Application spec에서 두 개념은 분리된 플래그다

```yaml
syncPolicy:
  automated:           # auto-sync 활성화 (Git 변경 → 자동 apply)
    prune: true        # Git 삭제 → 클러스터 삭제
    selfHeal: true     # 클러스터 drift 감지 시 자동 re-sync
```

`automated`만으로는 Git 변경에만 반응한다. `selfHeal: true`를 추가해야 `kubectl` 등 out-of-band 변경도 되돌린다.

## Related
- [[Argo CD self-healing silently restarts Jobs in monitored directories]] — selfHeal이 batch Job을 의도치 않게 재시작한 사례
- [[Argo CD watches Git manifest and CI must update manifest to trigger deployment]] — Argo CD auto-sync의 기본 동작 원리
- [[Argo CD SSOT enforcement is layered across automated sync, prune, and selfHeal]] — 옵션 조합에 따른 SSOT 강제 수준
- [[Bootstrap resolves circular dependency by establishing initial trust through out-of-band means]]