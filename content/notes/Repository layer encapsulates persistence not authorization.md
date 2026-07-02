---
created: 2026-05-31
updated: 2026-05-31
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[Go2fit]]"
tags:
  - architecture
  - layered-architecture
  - repository-pattern
  - authorization
publish: true
---
## Context
GF-88에서 댓글 수정/삭제 구현 시 권한 검증을 어느 레이어에 둘지 결정해야 했다. "레포는 모른다"는 표현이 처음에는 파일 위치 개념으로 오해됐고, 함수 시그니처 관점으로 정정하면서 원리가 명확해졌다.

## Insight

### Repository의 함수 시그니처가 책임 범위를 결정한다
```python
# repository: user_id를 받지 않는다 → 권한 판단 불가능
def delete_comment(self, comment_id: int) -> bool: ...

# service: user_id를 받는다 → 권한 판단 가능
def delete_comment(self, comment_id: int, user_id: UUID) -> None: ...
```
"레포는 모른다"는 파일이 어디 있느냐가 아니라, 함수가 어떤 정보를 받도록 설계됐느냐의 문제다.

### 레이어별 단일 책임
```
endpoint.py   → HTTP 입출력, 상태코드 결정
service.py    → 비즈니스 로직, 권한 검증, HTTPException
repository.py → DB 쿼리만. 누가 요청했는지 모름
```

### 교체 가능성이 분리의 실용적 이유다
DB를 PostgreSQL → MongoDB로 교체할 때 repository.py만 다시 쓰면 된다. service와 endpoint는 변경 없음. 각 레이어가 "위 레이어의 인터페이스만 알고 아래 레이어의 구현은 모르기" 때문이다.

## Related
- [[SQLAlchemy ORM object has four lifecycle states]] — repository가 다루는 ORM 객체
- [[Database Migration Management with Alembic]] — 같은 프로젝트 스택
