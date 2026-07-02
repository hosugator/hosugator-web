---
created: 2026-06-23
updated: 2026-06-23
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - ssh
  - https
  - security
  - authentication
  - networking
publish: true
---
## Context
align-ai k3s 클러스터에서 kubectl이 API 서버와 통신하는 방식을 분석하면서, SSH로 서버에 접속하는 것과 kubeconfig로 API를 호출하는 것이 어떻게 다른지 정리했다.

## Insight
### SSH는 OS 레벨, HTTPS는 API 레벨에서 인증한다

```
SSH 접속
  클라이언트 → 포트 22 → 서버 OS (쉘)
  인증: 공개키를 authorized_keys에 직접 등록
  접근 범위: OS 파일시스템, 프로세스, 네트워크 전체

HTTPS(API) 접속
  클라이언트 → 포트 443 → 애플리케이션 (API 엔드포인트)
  인증: CA 서명 인증서 체인
  접근 범위: API가 허용하는 리소스만
```

SSH는 서버 OS에 직접 들어가는 것이고, HTTPS는 서버가 노출한 API를 호출하는 것이다. 도달하는 레이어 자체가 다르다.

### 신뢰 모델이 다르다 — 직접 등록 vs CA 체인

```
SSH: 공개키 직접 등록
  신뢰할 클라이언트의 공개키를 서버 authorized_keys에 수동 등록
  제3자(CA) 없음 — 서버 관리자가 직접 판단

HTTPS(mTLS): CA 체인 위임
  CA가 인증서에 서명 → CA를 신뢰하면 인증서도 신뢰
  서버·클라이언트 모두 CA 공개키로 상대방 검증
```

SSH는 확장성이 낮다 — 신규 클라이언트마다 서버를 직접 수정해야 한다. HTTPS는 CA를 신뢰 앵커로 두기 때문에 인증서만 발급하면 된다.

### 개인 PC에 SSH 접속을 허용하지 않는 이유

SSH 서버(sshd)를 실행하면 포트 22가 열리고 OS 레벨 접근이 노출된다. 서버와 달리 개인 PC는 인가된 사람만 접근하는 환경을 가정하지 않고, OS 레벨 권한은 파괴적이다. 반면 HTTPS API는 포트 443을 열어도 애플리케이션이 허용한 범위만 노출된다.

### kubectl은 SSH가 아닌 HTTPS(mTLS)로 API 서버와 통신한다

kubeconfig에 SSH 키가 없는 이유가 여기 있다. kubectl → API 서버 경로는 애플리케이션 레벨 API 호출이므로 CA 기반 인증서 체인(mTLS)이 맞는 선택이다. SSH는 노드 OS에 직접 들어갈 때(장애 대응, 파일 복사 등)에만 쓴다.

## Related
- [[SSH authentication uses private key on client and public key on server]] — SSH 인증 구조와 키 분리 원칙
- [[Digital signatures verify integrity by comparing hashes not by reversing encryption]] — HTTPS mTLS의 CA 서명 검증 구조
