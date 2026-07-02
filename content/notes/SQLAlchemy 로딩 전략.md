---
created: 2026-05-31
updated: 2026-05-31
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Go2fit]]"
tags:
  - sqlalchemy
  - orm
  - database
  - performance
publish: true
---
## Context
go2fit GF-88 쉐도잉 과정에서 `joinedload(Comment.user)`가 왜 필요한지 이해하려다 lazy load의 동작 원리와 N+1 문제 전체를 처음으로 체계적으로 파악했다.

## Insight

### Lazy load는 관계 속성에 접근하는 순간 쿼리를 실행한다
`db.query(Post).first()` 는 posts 테이블만 가져온다. `post.user`에 접근하는 순간 별도 SELECT가 실행된다. 세션이 닫혀 있으면 이 시점에 에러가 발생한다.

### Joinedload는 최초 SELECT에서 JOIN으로 한 번에 가져온다
```python
db.query(Post).options(joinedload(Post.user)).first()
# SELECT posts.*, users.* FROM posts JOIN users ON posts.user_id = users.id
```
결과는 같지만 쿼리가 1회로 끝난다.

### N+1 문제는 루프에서 lazy load가 발생할 때 일어난다
```
posts 100개 조회 → 1회
루프에서 post.user 접근 → 100회
총 101회 (N+1)

joinedload 사용 → 1회로 끝
```

### Joinedload가 필요 없는 경우
연관 객체가 필요 없을 때 (삭제 전용 조회 등). 불필요한 JOIN은 오히려 비용.

## Verification
GF-88에서 `delete_comment`는 joinedload 없이 작성. `get_comment_by_id`는 서비스에서 `user_id` 비교와 스키마 직렬화가 필요하므로 joinedload 포함.

## Related
- [[SQLAlchemy ORM object has four lifecycle states]] — 세션 닫힘 후 Detached 상태와의 관계
- [[Database Migration Management with Alembic]] — 동일 ORM 스택
- [[ACID]] — 원자적 쿼리와의 연결
