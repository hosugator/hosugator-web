---
created: 2026-06-05
updated: 2026-06-08
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - argocd
  - gitops
  - ci-cd
publish: true
---
## Context
align-ai Phase 4A에서 Argo CD를 처음 설치하고 실제로 연결했다. "Argo CD가 GHCR을 감지하는 건지 코드를 감지하는 건지" 혼동이 있었다.

## Insight
### Argo CD는 Git의 manifest YAML을 감시하고 컨테이너 레지스트리를 직접 감시하지 않는다

```
❌ 오해: git push → Argo CD가 새 이미지 감지 → 배포
✅ 실제: git push → CI가 이미지 빌드 → CI가 manifest 이미지 태그 업데이트 → Argo CD가 manifest 변경 감지 → 배포
```

### CI와 CD의 역할 분리가 명확하다

```
GitHub Actions (CI)
  1. 테스트
  2. 이미지 빌드 + GHCR push
  3. deployment.yaml 이미지 태그 업데이트 + git push  ← 이 단계가 핵심 연결고리

Argo CD (CD)
  4. deployment.yaml 변경 감지
  5. 클러스터에 새 이미지로 자동 배포
```

3번 단계(CI가 manifest 업데이트)가 없으면 이미지가 바뀌어도 Argo CD는 모른다.

### Git이 배포 이력이자 롤백 수단이 된다
manifest를 Git으로 관리하면 `git revert`만으로 이전 버전으로 롤백 가능하다. 배포 히스토리가 자동으로 git log에 남는다.

## Verification
- 2026-06-08: align-ai Phase 4B 완료. `git push` → CI 빌드+GHCR push → `deployment.yaml` SHA 태그 업데이트 커밋 자동 생성 → Argo CD `Synced` → `kubectl get deployment`에서 새 이미지 태그 확인. 전체 흐름 end-to-end 검증 완료.

## Related
- [[GHCR over Docker Hub until external distribution is needed]] — CI 이미지 빌드 결과물
- [[CI manifest commit triggers infinite loop without paths-ignore on manifest directory]] — Phase 4B 구현 시 만난 함정
- [[Docker Compose before k8s because scale motivation must precede orchestration learning]] — 학습 계획
- [[Kubernetes.md]] — k8s 개념
- [[Argo CD self-healing silently restarts Jobs in monitored directories]] — self-healing이 batch Job에 적용될 때의 함정
- [[GITHUB_TOKEN commits do not trigger downstream workflows]] — CI→CD 트리거 연결 시 만난 제약
