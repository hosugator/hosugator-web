---
created: 2026-06-11
updated: 2026-06-11
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - security
  - kubeconfig
publish: true
---
## Context
Argo CD 멀티클러스터 구조를 논의하면서 `argocd cluster add`가 어떻게 동작하는지 설명하다가 kubeconfig의 보안 함의를 짚었다. SSH 없이도 클러스터를 완전히 제어할 수 있다는 점이 처음엔 의외였다.

## Insight
### kubeconfig는 클러스터 접근에 필요한 모든 것을 담은 자격증명 파일이다

```yaml
clusters:
  - cluster:
      server: https://192.168.1.10:6443  # API 서버 주소
      certificate-authority-data: ...     # 클러스터 CA 인증서
users:
  - user:
      client-certificate-data: ...  # 클라이언트 인증서
      client-key-data: ...          # 클라이언트 개인키
```

kubectl과 Argo CD 모두 이 파일을 읽어 k8s API와 직접 HTTPS 통신한다. SSH는 전혀 관여하지 않는다.

### 파일 하나 + 네트워크 경로(6443)만 있으면 클러스터 전체를 제어할 수 있다

```
kubeconfig 보유자
  └── HTTPS 6443 → k3s API 서버 → 인증 통과 → 모든 리소스 제어 가능
```

SSH 접속이나 호스트 로그인 없이도 pod 생성·삭제·exec, secret 조회까지 가능하다. 파일이 곧 열쇠다.

### 보호는 두 레이어로 한다

| 레이어 | 방법 | 막는 것 |
|---|---|---|
| 네트워크 | 방화벽으로 6443 차단, VPN 필요 | 파일 유출돼도 네트워크 접근 불가 |
| 권한 | RBAC으로 자격증명 권한 최소화 | 접근해도 할 수 있는 것을 제한 |

현재 우리 k3s는 `server: https://127.0.0.1:6443`으로 로컬에서만 접근 가능해 외부 노출 위험이 없다. 현장 배포 시 실제 IP로 바꾸는 순간 방화벽 설정이 필수가 된다.

### `argocd cluster add`는 kubeconfig에서 자격증명을 읽어 Argo CD 내부 DB에 등록한다

현장 k3s의 `/etc/rancher/k3s/k3s.yaml`을 가져와 `server`를 실제 IP로 교체한 뒤 등록하면 Argo CD가 해당 클러스터를 원격 관리할 수 있다.

## Related
- [[Argo CD is a deployment coordinator not a runtime dependency, k3s self-heals without it]] — kubeconfig를 사용해 원격 클러스터를 등록하는 구조
- [[Digital signatures verify integrity by comparing hashes not by reversing encryption]] : 디지털 서명의 암호화/복호화를 통한 인증 원리 이해