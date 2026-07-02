---
created: 2026-05-31
updated: 2026-06-05
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Go2fit]]"
tags:
  - pytest
  - testing
  - fixture
publish: true
---
## Context
GF-88 테스트 인프라 버그 수정 과정에서 `db_session` fixture와 TestClient가 서로 다른 DB를 바라보는 문제를 디버깅하다 fixture의 동작 원리와 yield의 역할을 처음으로 명확히 이해했다.

## Insight
### Fixture는 yield로 setup과 teardown을 한 함수 안에 분리한다
```python
@pytest.fixture
def db_session():
    session = SessionLocal()  # setup
    yield session             # 테스트 실행 지점
    session.close()           # teardown: yield 이후 코드는 정리 전용
```
파라미터 이름이 fixture 이름과 일치하면 pytest가 자동 주입한다.

### generator를 next()로만 소비하면 finally가 실행되지 않는다
`lambda: next(get_session())`처럼 쓰면 generator가 중간에 멈춘 채로 남아 `finally`(세션 닫기)까지 도달하지 못한다. 세션이 열린 채로 남으면 TRUNCATE가 row lock 대기로 hang된다.

### Scope로 fixture 생명주기를 제어한다
| scope         | 생성/소멸 시점     |
| ------------- | ------------ |
| function (기본) | 테스트 함수마다     |
| module        | 파일(모듈) 단위    |
| session       | 전체 테스트 실행 1회 |

## Related
- [[Test function wraps production code with test dependencies]] — fixture가 교체하는 게 무엇인지에 대한 mental model
- [[SQLAlchemy ORM object has four lifecycle states]] — 세션 닫힘과 Detached 상태
