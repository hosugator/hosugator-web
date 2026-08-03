---
created: 2026-07-13
updated: 2026-07-13
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Align AI]]"
tags:
  - sql
  - database
  - data-modeling
  - postgresql
  - docker
publish: true
---
## Context
ADR-012 구현 중 PostgreSQL StatefulSet을 띄운 뒤 `db/schema.sql`을 직접 작성하면서 "이 작업이 통상 뭐라고 불리는지", "이미지에 별도 설치 과정이 왜 없었는지", "`.sql`이 파이썬 라이브러리 개념인지"를 연달아 물었다.

## Insight

### 데이터 모델링은 개념 → 논리 → 물리 3단계로 진행된다

```
개념적 모델 — Entity와 관계만 (ERD)
논리적 모델 — 테이블, 컬럼, 타입, PK/FK까지 구체화
물리적 모델 — 특정 DB 엔진 문법으로 실제 DDL 작성·실행
```

`schema.sql`의 `CREATE TABLE` 작성은 물리적 모델링 단계다. 버전 관리되며 순차 적용되는 이런 DDL 스크립트를 마이그레이션이라 부른다.

### 이 작업은 인프라 프로비저닝과 애플리케이션 코드 사이에 위치한다

```
1. 인프라 프로비저닝 — StatefulSet, PVC
2. 데이터 모델링/스키마 — 지금 하는 것
3. 애플리케이션 코드 — INSERT/SELECT
4. API 계층
5. 프론트엔드 연결
```

이 순서가 강제되는 이유는 아래 계층이 안정화되어야 위 계층이 그 위에서 안전하게 짜여지기 때문이다 — 테이블 구조가 안 정해진 채로 앱 코드를 먼저 짜면 스키마가 바뀔 때마다 코드도 계속 고쳐야 한다.

### SQL은 벤더 공통 표준 언어, `.sql`은 그 언어로 쓰인 텍스트 파일일 뿐

SQL은 ANSI/ISO가 표준화한 언어라 Postgres, MySQL, SQLite 등 서로 다른 회사의 DB 소프트웨어가 핵심 문법(`SELECT`, `CREATE TABLE`, `WHERE`)을 공유한다.
다만 벤더별 확장 문법(`gen_random_uuid()`, `JSONB`는 Postgres 전용)이 있어 완전히 이식 가능하진 않다. 
`.sql` 파일 자체는 실행 파일이 아니라 `.yaml`이 YAML 문법으로 쓰인 텍스트인 것처럼 그냥 평문 텍스트고, 각 DB 벤더의 클라이언트 프로그램(`psql`, `mysql`, `sqlite3`)이 읽어서 한 줄씩 실행한다.
Python과는 무관하다 — Python은 이후 psycopg 같은 라이브러리로 같은 SQL 문자열을 프로그램 안에서 다루는 단계에서 등장한다.

### psql은 컨트롤러가 아니라 postgres 서버에 말 거는 클라이언트다

Postgres 공식 이미지 안에는 서버 바이너리(`postgres`)와 클라이언트 바이너리(`psql`)가 함께 패키징되어 있을 뿐, 개념적으로는 완전히 다른 층위다.
`postgres` 서버가 FastAPI 서버 역할이라면, `psql`은 그 서버에 요청을 보내는 브라우저/`fetch()`에 해당한다 — k8s의 StatefulSet 같은 컨트롤 플레인 Controller와는 무관하다.

### 컨테이너 이미지는 빌드 시점에 이미 "설치"가 끝나있다

`apt install postgresql` 같은 전통적 설치는 이미지가 빌드될 때 이미 수행된 작업이다. k8s가 이미지를 pull해서 실행하는 건 그 완성된 환경을 시작만 하는 것 — 별도 설치 단계가 필요 없다. Postgres 컨테이너가 최초 실행 시 하는 유일한 초기화는 `initdb`다: 데이터 디렉토리(`/var/lib/postgresql/data`)가 비어있으면 시스템 카탈로그를 생성하고, 이미 데이터가 있으면(PVC에 남아있으면) 건너뛰고 기존 데이터로 바로 서버를 시작한다. 이건 "설치"가 아니라 "데이터 부트스트랩"이다.

## Related
- [[Docker image contains only code and packages, runtime data mounts via hostPath volumes]] — 대조되는 짝: 그 노트는 "모델·데이터는 이미지에 안 들어있다"는 이야기, 이 노트는 "소프트웨어 자체(Postgres 바이너리)는 이미지 빌드 시 이미 설치되어 있다"는 이야기. 같은 "이미지 안에 뭐가 있는가" 질문의 다른 측면
- [[Database Migration Management with Alembic]] — 지금은 raw SQL을 직접 관리하는 가장 단순한 단계이고, Alembic 같은 도구로 추상화하는 건 이후 단계
- [[StatefulSet rebinds the same PVC via deterministic pod naming, not automatic data replication]] — 이 스키마가 실제로 저장되는 PVC/PV 메커니즘
