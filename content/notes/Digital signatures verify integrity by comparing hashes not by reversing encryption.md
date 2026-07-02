---
created: 2026-06-23
updated: 2026-06-29
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - security
  - cryptography
  - tls
  - mtls
  - kubernetes
publish: true
---
## Context
align-ai k3s 클러스터의 kubeconfig 구성요소(CA 인증서, 클라이언트 인증서, 개인키)를 분석하다가 mTLS 인증 흐름 전체를 질문으로 밟아가며 이해했다. 여러 번 헷갈렸던 암호화/복호화 방향을 이번에 구조적으로 정리했다.

## Insight
### 서명 검증은 역복호화가 아니라 해시 비교다

```
송신 (CA가 인증서 발급)
  인증서 내용 → SHA-256 해시 → CA 개인키로 암호화 → 서명값
  인증서 + 서명값 배포

수신 (kubectl이 검증)
  인증서 내용 → SHA-256 해시              → 해시 A  (직접 계산)
  서명값      → CA 공개키로 복호화         → 해시 B  (CA가 만든 원본)
  A == B → 검증 완료
```

해시는 단방향이라 역산 불가. "역복호화"가 아니라 양쪽에서 독립적으로 해시를 계산해서 비교하는 구조다.

### mTLS는 SSH와 달리 양방향 인증이다

```
SSH (단방향)
  서버 → 클라이언트 검증
  클라이언트가 서버를 검증하는 장치 없음 (known_hosts로 보완)

mTLS (양방향)
  kubectl → API server 인증서 검증 (가짜 서버 방지)
  API server → kubectl 인증서 검증 (신뢰할 클라이언트인지)
  → 둘 다 통과해야 명령 수행
```

API server도 개인키 + CA 서명 인증서를 보유한다. kubeconfig에 API server 인증서가 없는 이유는 CA 인증서 하나로 서버 검증까지 커버하기 때문.

### kubeconfig 3요소의 역할

```
certificate-authority-data  ← CA 공개키 (API server 인증서 검증용)
client-certificate-data     ← 내 신분증 (CA가 서명, 공개해도 됨)
client-key-data             ← 내 도장 (로컬 생성, 절대 외부 전송 안 함)
```

개인키는 클라이언트가 직접 생성하고 CA를 거치지 않는다. CA는 클라이언트의 공개키(CSR)만 받아서 서명해줄 뿐이다.

### k3s 토큰은 TLS 성립 이전의 부트스트랩 수단이다

TLS가 동작하려면 네트워크 연결과 초기 신뢰가 먼저 있어야 한다. k3s에서는 이 순환을 토큰으로 끊는다.

```
1단계: Tailscale → 네트워크 연결 확보
2단계: k3s 토큰  → 초기 신뢰 부트스트랩 (관리자가 out-of-band 전달)
3단계: k3s TLS   → 인증서 발급 후 이후 모든 통신

토큰 형식: K10<CA해시>::<사용자>:<비밀값>
  → CA 해시 포함: 에이전트가 서버를 첫 접속 시 검증
  → 접속 성공 후: k3s CA가 에이전트 인증서 발급
  → 이후: 토큰 불필요, 인증서 기반 mTLS로 전환
```

TLS 자체가 성립하기 위한 전제 조건은 두 가지다: 네트워크 레이어(연결)와 초기 신뢰(부트스트랩). 인증해주는 쪽(서버)이 명시적으로 신뢰 수단을 먼저 전달해야 한다.

## Related
- [[SSH authentication uses private key on client and public key on server]] — SSH(단방향)와 mTLS(양방향)의 구조 비교
- [[kubeconfig grants cluster access over HTTPS without SSH, making it a security boundary]] — 이 구조를 담는 파일의 보안 경계 의미
- [[Bootstrap resolves circular dependency by establishing initial trust through out-of-band means]] — 부트스트랩 개념 상위 노트