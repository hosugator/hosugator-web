---
created: 2025-11-02 16:00
tags:
  - go2fit
  - core
  - config
  - session
  - 
reference:
updated: 2026-02-19 19:09
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[Go2fit]]"
publish: true
---
## Child
```dataview
TABLE
	updated,
	created,
	status
FROM ""
WHERE project = this.file.link
OR subject = this.file.link
SORT status ASC, updated DESC, created DESC
```

# Core Process
##  `core/config.py`의 역할 (설정 중앙 집중화)
`config.py`는 애플리케이션에서 사용하는 모든 설정값을 한 곳에 모아 관리하는 파일입니다.
- 역할 요약: 애플리케이션의 환경(Environment)을 정의하고, `database.py`나 `services/auth.py` 등 다른 모듈에 일관된 설정 정보를 제공합니다.

|구현 요소|역할|
|---|---|
|`Settings` 클래스|설정 구조 정의: DB 연결 정보, JWT 키, 프로젝트 이름 등 모든 설정 항목을 정의합니다. Pydantic `BaseSettings`를 사용해 `.env` 파일을 자동으로 읽어와 데이터 타입을 검증합니다.|
|`settings` 객체|전역 접근점: `Settings()` 클래스의 인스턴스를 생성하여 프로젝트 전체에서 `from core.config import settings`를 통해 모든 설정값에 쉽게 접근할 수 있도록 합니다.|
|`DATABASE_URL`|단일 연결 문자열: DB 접속에 필요한 `User`, `Password`, `Host` 등의 개별 정보를 취합하여 SQLAlchemy가 바로 사용할 수 있는 단일 문자열 형식으로 변환합니다.|
##  `core/database.py`의 역할 (DB 연결 및 세션 관리)
`database.py`는 `config.py`에서 얻은 정보를 바탕으로 SQLAlchemy와 DB 간의 실제 통신 메커니즘을 설정합니다.
### `engine` (엔진)의 역할: DB와의 물리적 연결
```
engine = create_engine(settings.DATABASE_URL, ...)
```
- 역할: SQLAlchemy와 PostgreSQL DB 간의 통신 통로를 담당하는 핵심 객체입니다.
- 비유: 데이터베이스 서버까지 가는 '고속도로' 또는 DB 서버에 접속하는 '전화선' 자체입니다. `engine`은 DB 연결을 유지하고, 필요할 때 세션(`SessionLocal`)을 생성할 수 있는 능력을 제공합니다.
- 세부 기능: `create_engine` 함수에 전달된 `DATABASE_URL`을 해석하고, DB 드라이버(psycopg2)를 사용하여 DB 서버와 연결을 초기화합니다.
### `SessionLocal` (세션 팩토리)의 역할: 세션 생성 준비
```
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```
- 역할: 실제 DB 작업을 수행하는 '세션' 객체를 만들 준비를 하는 생성기(Factory)입니다.
- 비유: DB 서버에 접속하는 '전화기'입니다. 이 전화기를 이용해 필요할 때마다 새로운 통화(세션)를 시작할 수 있습니다.
- 주요 기능: DB 트랜잭션의 기본 설정(예: `autocommit=False`)을 정의하며, 어떤 엔진(`bind=engine`)에 연결할지 지정합니다.
### `Base` (기반 객체)의 역할: ORM 모델의 뼈대
```
Base = declarative_base()
```
- 역할: 프로젝트의 모든 SQLAlchemy ORM 모델 (예: `models/user.py`의 `User` 클래스)이 상속받아야 하는 기본 클래스입니다.
- 주요 기능: 파이썬 클래스를 PostgreSQL의 실제 테이블 구조와 매핑시키는 데 필요한 메타데이터와 기능을 제공합니다. `main.py`에서 테이블을 생성할 때(`Base.metadata.create_all()`) 이 `Base`를 상속받은 모든 클래스를 찾아서 실행합니다.
### `get_db()`의 `db` 객체 역할: 요청별 작업 공간
```
def get_db():
    db = SessionLocal()
    # ...
    yield db
    # ...
```
- 역할: FastAPI의 하나의 HTTP 요청이 DB 작업을 수행할 때 할당되는 작업 공간(Session) 객체입니다.
- 비유: DB와의 '한 번의 통화' 또는 '업무용 책상'입니다.
- 주요 기능:
    1. `db = SessionLocal()`: 새로운 세션을 생성하여 해당 요청을 전담하게 합니다.
    2. `yield db`: 이 세션을 FastAPI 라우터(`read_users_me(db: Session = Depends(get_db))`)에 주입하여 DB 작업(조회, 저장 등)을 수행하게 합니다.
    3. `finally: db.close()`: 요청이 완료되면 세션을 닫아 DB 연결 리소스를 즉시 해제합니다. 이는 서버의 안정성과 리소스 효율성을 보장하는 핵심 패턴입니다.