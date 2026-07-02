---
created: 2026-06-14
updated: 2026-06-14
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[Go2fit]]"
tags:
  - jwt
  - testing
  - oauth
  - devtools
publish: true
---
## Context
GF-88 커뮤니티 API 연동 테스트 중 카카오 OAuth 없이 백엔드 엔드포인트를 직접 검증해야 했다. macOS에서 `kakao_flutter_sdk`가 미지원이고 iOS 26.2 SDK 다운로드가 필요한 상황이라 앱을 통한 로그인이 불가능했다.

## Insight
### OAuth를 우회하는 dev 테스트 패턴은 DB 직접 삽입 + 토큰 수동 발급이다

```bash
# 1. 테스트 유저 삽입
docker exec <db-container> psql -U <user> -d <db> -c \
  "INSERT INTO users (id, kakao_id, nickname) VALUES (gen_random_uuid(), 'test_kakao_999', 'test_user') RETURNING id;"

# 2. JWT 발급 (백엔드 auth 서비스 직접 호출)
python3 -c "
from services.auth import create_access_token
token = create_access_token(data={'sub': '<위에서 반환된 user_id>'})
print(token)
"

# 3. curl 또는 Swagger Authorize에 Bearer 토큰으로 사용
```

### Swagger의 Authorize에는 JWT 토큰 전체를 넣어야 한다 — user_id(UUID)가 아니다
401 에러의 흔한 원인: Authorization 헤더에 `Bearer <user_id>`를 넣는 실수. `Bearer <JWT 토큰 전체>`가 맞다.

### 이 패턴은 JWT가 stateless이기 때문에 가능하다
백엔드는 토큰을 DB에 저장하지 않는다. `JWT_SECRET_KEY`로 서명만 검증하므로 `create_access_token()`을 직접 호출해 발급한 토큰도 완전히 유효하다.

## Decision
dev/staging 환경에서 OAuth 없이 API를 빠르게 검증할 때 이 패턴을 사용한다. 단, `ENV != production` 조건으로 보호된 `/auth/dev/token` 엔드포인트를 만들면 Swagger에서 self-contained 테스트가 가능해진다 — 다음 작업 후보.

## Related
- [[Database Migration Management with Alembic]] — 같은 세션의 dev 환경 구성
