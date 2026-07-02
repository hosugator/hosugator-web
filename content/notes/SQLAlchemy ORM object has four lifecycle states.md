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
  - session
  - database
publish: true
---
## Context
GF-88 쉐도잉에서 `db.close()` 이후에도 ORM 객체의 데이터에 접근 가능한 이유를 파악하다 객체 상태 모델 전체를 처음 정리했다. "세션 닫히면 데이터도 사라진다"는 오해를 직접 검증하며 교정했다.

## Insight

### 상태 전이 흐름
```
Transient → (db.add) → Persistent → (db.close) → Detached
                                  → (db.delete + commit) → Deleted
```

| 상태 | 설명 |
|------|------|
| Transient | 세션 등록 전. `Post(...)` 생성 직후. id=None |
| Persistent | 세션이 추적 중. 쿼리 결과 또는 add 후 commit된 객체 |
| Detached | 세션 닫혔지만 Python 변수가 참조 중. 새 쿼리 불가 |
| Deleted | `db.delete()` 후 commit 전 |

### 세션이 닫혀도 데이터는 Python 메모리에 남는다
Detached 상태에서 이미 로드된 필드는 접근 가능하다. 새 SQL을 실행할 수 없을 뿐이다. 가비지 컬렉션은 Python 참조가 없어질 때 발생한다 — 세션 닫힘과 무관하다.

### refresh()가 필요한 이유
DB가 독자적으로 값을 변경해도 메모리의 Persistent 객체는 갱신되지 않는다.
```python
self.repo.increment_view_count(post_id)  # DB: view_count = 6
# 메모리의 db_post.view_count 는 아직 5
self.repo.db.refresh(db_post)            # DB에서 재조회 → 6으로 갱신
```

### 웹 요청에서의 실제 수명
FastAPI `yield db` 패턴에서 세션은 응답 전송 후 닫힌다. ORM 객체는 요청 처리 함수의 스코프를 벗어나면 참조가 사라지고 GC된다. 실질적 수명 = 요청 하나.

## Related
- [[SQLAlchemy 로딩 전략]] — Detached 상태가 joinedload 필요성과 연결됨
- [[ACID]] — commit/rollback 트랜잭션 모델
