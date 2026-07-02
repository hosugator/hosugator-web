---
created: 2026-02-10
updated: 2026-06-14
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[Go2fit]]"
tags:
  - database
  - alembic
  - migration
  - sqlalchemy
publish: true
---
## Context
초기 설계에서 DB 스키마가 수회 변경되는 과정에서 이력을 관리할 필요성을 느꼈다.

## Insights
### DB 스키마를 코드로 관리한다

코드(SQLAlchemy Model)와 DB 스키마 간의 동기화를 자동화하고, 모든 변경 이력을 버전 관리(Git)하여 환경 간 정합성을 보장함.

### 실무 운영 프로세스

1. Revision 생성: 모델 수정 후 `alembic revision --autogenerate`를 통해 마이그레이션 파일 생성.
2. 코드 검토: 자동 생성된 파이썬 스크립트가 실제 의도와 맞는지 반드시 확인 (Alembic은 컬럼명 변경을 삭제 후 생성으로 오인할 때가 있음).
3. 병합(Upgrade): `alembic upgrade head`로 실제 DB에 반영.

### 주의사항 및 트러블슈팅

- 포트 불일치 및 연결 에러: `env.py` 혹은 `alembic.ini`의 `sqlalchemy.url`이 실제 인프라(ALB/ECS/RDS) 환경 변수와 일치하는지 확인.
- 마이그레이션 꼬임: 여러 브랜치에서 동시에 작업할 경우 버전 트리(Version Tree)가 갈라질 수 있음. 이 경우 `alembic merge`를 통해 가지를 합쳐줘야 함.

### autogenerate는 브랜치 분기 시점의 스냅샷 차이를 기준으로 DDL을 생성한다

두 브랜치가 서로 다른 시점에서 `--autogenerate`를 실행하면 같은 테이블/컬럼을 중복 생성하는 DDL이 만들어진다. `alembic merge heads`로 단일 헤드를 만든 것만으로는 부족하다 — 중복 DDL을 가진 마이그레이션 자체를 수정해야 한다.

## Related
- [[DB Rebuilding · Migration]]
- [[SQLAlchemy 로딩 전략]]