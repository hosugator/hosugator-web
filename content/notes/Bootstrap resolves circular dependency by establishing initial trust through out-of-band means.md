---
created: 2026-06-29
updated: 2026-06-29
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - security
  - distributed-systems
  - tls
  - kubernetes
publish: true
---
## Context
k3s 에이전트 노드 추가 시 토큰이 왜 필요한지를 탐구하다가 도달한 개념. TLS가 성립하려면 먼저 신뢰가 있어야 하는데, 신뢰를 얻으려면 TLS가 필요하다는 순환 문제를 어떻게 푸느냐는 질문에서 출발.

## Insight
### 부트스트랩은 순환 의존성을 외부 수단으로 끊는 과정이다

"신발 끈을 잡아당겨 스스로를 들어올린다"는 표현에서 유래. 자기 자신이 없으면 시작할 수 없는 문제를 더 단순한 외부 수단으로 시작점을 만드는 것이다.

```
TLS 통신하려면 → 인증서(신뢰)가 필요
인증서 받으려면 → 안전한 통신(TLS)이 필요
→ 순환 문제 → out-of-band 수단으로 끊음
```

### TLS 성립을 위한 전제 조건은 두 단계다

```
1단계: 네트워크 레이어 (연결 자체)
  → TCP/IP, Tailscale 등이 먼저 만족되어야 함

2단계: 초기 신뢰 (부트스트랩)
  → 인증해주는 쪽(서버/CA)이 명시적으로 신뢰 수단을 전달해야 함

3단계: TLS
  → 위 두 조건이 충족된 후에야 동작
```

### 부트스트랩 수단은 맥락마다 형태가 다르다

| 맥락 | 순환 문제 | 부트스트랩 수단 |
|---|---|---|
| 브라우저 TLS | 루트 CA가 없으면 HTTPS 불가 | OS 출하 시 루트 CA 사전 탑재 |
| k3s 에이전트 추가 | 인증서가 없으면 API 서버 접속 불가 | 관리자가 토큰을 out-of-band로 전달 |
| SSH 최초 접속 | 공개키가 없으면 서버 검증 불가 | known_hosts 수동 수락 |
| 컴퓨터 부팅 | OS 없이 OS 로드 불가 | BIOS/UEFI가 첫 단계 실행 |

공통 패턴: **인증해주는 쪽이 더 단순한 수단을 먼저 명시적으로 전달한다.**

## Related
- [[Digital signatures verify integrity by comparing hashes not by reversing encryption]] — TLS/mTLS 동작 원리, k3s 토큰이 부트스트랩을 만족하는 구체적 사례
- [[SSH authenticates at OS level while HTTPS authenticates at API level through CA chain]] — SSH known_hosts가 부트스트랩 역할을 하는 맥락
