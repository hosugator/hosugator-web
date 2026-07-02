---
created: 2026-06-05
updated: 2026-06-05
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Go2fit]]"
tags:
  - pytest
  - testing
  - fixture
  - fastapi
publish: true
---
## Context
GF-88 테스트 디버깅 중 fixture와 TestClient가 각각 다른 DB를 바라보는 문제를 해결하면서, 테스트 코드가 프로덕션 코드와 어떤 관계인지 처음으로 명확히 이해했다.

## Insight
### test_ 함수는 프로덕션 함수를 test 환경으로 감싸는 wrapper다

프로덕션 함수는 동일하고, fixture가 넘기는 의존성(DB 세션)만 다르다.

```python
def create_user(db: Session, user_data: UserCreate):  # 프로덕션 함수
    ...

def test_create_user(db_session):           # wrapper: test DB로 호출
    result = create_user(db=db_session, ...)

@app.post("/users")
def route(db = Depends(get_db)):            # 프로덕션 라우터: real DB로 호출
    return create_user(db=db, ...)
```

테스트를 통과한 로직 = 프로덕션에서 실행될 로직이 보장되는 이유가 여기 있다.

### FastAPI + TestClient 조합에서는 dependency_overrides로 의존성을 교체해야 한다

TestClient는 앱을 직접 실행하므로 fixture DB 세션만 만들어서는 TestClient가 쓰는 `get_db()`를 교체할 수 없다.
`app.dependency_overrides[get_db] = _override_get_db`로 FastAPI의 의존성 주입 지점을 직접 덮어써야 fixture DB와 TestClient DB가 일치한다.
`dependency_overrides`는 별도 라이브러리가 아니라 FastAPI 내장 기능이다.

## Related
- [[pytest fixture separates setup and teardown through yield]] — yield로 setup/teardown을 분리하는 메커니즘
- [[SQLAlchemy ORM object has four lifecycle states]] — 세션 닫힘과 Detached 상태
