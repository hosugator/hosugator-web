---
created: 2026-06-29
updated: 2026-06-29
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Go2fit]]"
tags:
  - jwt
  - authentication
  - security
  - web
publish: true
---
## Context
Go2fit 백엔드에서 JWT 인증을 직접 구현한 뒤, Align AI k3s mTLS 동작을 분석하다가 두 방식이 왜 계층이 다른지를 탐구했다. TLS는 서버 신원만 기본 검증하고, 클라이언트 신원은 앱 레이어에서 JWT로 별도 처리한다는 분리 구조를 이해했다.

## Insight

### JWT 구조는 header.payload.signature

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9   <- header  (base64url)
.eyJzdWIiOiJ1c2VyX2lkIiwiZXhwIjoxMjM0fQ  <- payload (base64url)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  <- signature
```

**Header**: 알고리즘(`alg: RS256`) + 타입(`typ: JWT`)
**Payload**: `sub`(사용자 ID), `exp`(만료), `iat`(발급), `jti`(고유 ID), 커스텀 claim
**Signature**: `RSA_SHA256(header.payload, 서버_개인키)` — 서버만 생성 가능

### 검증은 서명 확인 → exp → payload 순서이며 DB 조회 없다

```
1. 서버 공개키로 signature 복호화 → 해시값 B
2. header + payload 직접 해시 → 해시값 A
3. A == B → 서명 유효 (토큰이 서버 발급임을 증명)
4. exp 확인 → 만료 여부
5. payload에서 claim 추출 → 사용자 ID, 권한 등
```

user table 조회 없이 암호화 서명이 신뢰의 근거가 된다. 서버 개인키를 소유한 쪽만 유효한 서명을 생성할 수 있다.

### access token ≈ JWT, refresh token은 opaque string

| | access token | refresh token |
|---|---|---|
| 형태 | JWT (자체 검증 가능) | opaque string (서버 저장) |
| 수명 | 단기 (15분~1시간) | 장기 (7일~30일) |
| 취소 | 만료 전 취소 불가 | DB에서 즉시 삭제 가능 |
| 용도 | API 인증 | access token 재발급 |

JWT는 서명만으로 검증되기 때문에 만료 전 취소 수단이 없다. 그래서 수명을 짧게 하고, 취소 가능한 refresh token이 갱신을 담당한다.

### JTI는 JWT에 고유 ID를 부여해 추적을 가능하게 한다

`jti` claim = UUID 형태의 토큰 고유 식별자.

```
서버가 사용된 jti 목록을 관리하면:
  → 일회성 토큰 구현 (비밀번호 재설정 링크)
  → 특정 토큰만 선택적 취소
```

단, jti 검증은 DB 조회가 필요하므로 statelessness를 일부 희생한다. 단순 API 인증에서는 exp로만 만료를 처리하고 jti는 생략한다.

### HMAC vs RSA — 배포 규모가 결정한다

```
HMAC-SHA256: 단일 비밀키
  서명 = 검증 = 같은 키 → 비밀키 공유 필요
  모놀리식 또는 소규모 서비스에 적합

RSA/ECDSA: 개인키/공개키 쌍
  개인키(서버)로 서명, 공개키로 검증
  공개키는 외부 배포 가능
  → 마이크로서비스의 각 서비스가 서명 서버 호출 없이 독립 검증
```

### 웹 서비스가 JWT를 쓰는 이유 — 인증서 발급은 수백만 사용자에게 스케일하지 않는다

TLS의 기본 구조는 서버 검증만이다 (단방향). 클라이언트 인증서를 추가하면 mTLS가 되지만:

```
k8s 노드 간 통신 → mTLS 적합 (노드 수십~수백, CA로 인증서 발급 가능)
일반 웹/앱 서비스 → mTLS 불가 (익명 사용자 수백만, 인증서 발급 운영 불가)
```

해결책: 클라이언트 신원을 앱 레이어로 내린다.

```
TLS:  서버 신원 (transport layer) — CA 서명 인증서, 1회 발급
JWT:  클라이언트 신원 (application layer) — 서버가 직접 발급
```

로그인 성공 → 서버가 JWT 직접 발급 → 이후 요청마다 JWT 제시. CA 없이 앱 서버가 신뢰 앵커가 된다.

## Related
- [[Digital signatures verify integrity by comparing hashes not by reversing encryption]] — JWT 서명 검증의 기반 원리 (A==B 해시 비교 구조)
- [[SSH authenticates at OS level while HTTPS authenticates at API level through CA chain]] — TLS(서버 검증)와 JWT(클라이언트 검증)의 계층 분리 맥락
- [[Bootstrap resolves circular dependency by establishing initial trust through out-of-band means]] — TLS 성립 전제, JWT는 TLS 위에서 동작
- [[Feat - Login and JWT verification]] — Go2fit 구현 기록
