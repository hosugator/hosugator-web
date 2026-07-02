---
created: 2026-02-10
updated: 2026-02-10
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Go2fit]]"
tags:
  - database
  - sqlalchemy
  - alembic
  - fastpass
  - category
  - keyword
publish: true
---
## Pydantic 스키마 설계: Base-Create-Public 분리
- 문제: API 입출력 모델과 DB 모델이 뒤섞여 보안(비밀번호 노출)이나 유효성 검증의 일관성이 깨짐
- 전략: 스키마를 3단계로 엄격히 분리하여 관리
	- `Base`: 공통 필드 (id, created_at 등)
	- `Create`: 생성 시 필수 필드 (비밀번호 등 민감 정보 포함)
	- `Public`: 외부 노출 필드 (민감 정보 제외, 프론트엔드 전달용)
- 교훈: 초기 설계 시의 귀찮음이 추후 데이터 보안 사고를 막는 가장 저렴한 비용이다.

## SQLAlchemy 성능 최적화: N+1 문제와 로딩 전략
- 핵심: 관계형 데이터 로딩 시 `Lazy Loading`과 `Eager Loading`의 적절한 선택
- 문제점: 
	- `Lazy Loading`: 필요할 때만 불러오지만, 반복문 내에서 쿼리가 폭발(N+1)하여 성능 저하 유발
	- `Eager Loading (joinedload)`: 한 번에 가져오지만, 관계가 복잡해지면 불필요한 대형 조인이 발생
- 실무 적용: 단순 조회는 `Lazy`, 대량 목록이나 통계성 데이터는 `joinedload` 혹은 `selectinload`를 명시적으로 사용한다.

## Alembic 마이그레이션: 운영 환경의 한계
- 상황: DB 구조 변경 시 Alembic을 통한 자동 마이그레이션 시도
- 한계 및 주의사항: 
	- 데이터 유실: 컬럼명 변경 시 Alembic은 '삭제 후 생성'으로 인식할 수 있음 -> 기존 데이터 증발 위험
	- 수동 개입: 복잡한 제약 조건(Unique, ForeignKey) 변경 시에는 자동 생성된 `revision` 파일을 반드시 검토하고 필요시 직접 SQL을 수정해야 함
- 결론: 마이그레이션 도구는 '보조'일 뿐이며, 최종 실행 전 데이터 백업과 스크립트 검증의 책임은 전적으로 개발자에게 있다.

## Insight: 기술적 편리와 비즈니스 가치
- Contemplation: NoSQL(MongoDB)이 유연해서 편해 보일 수 있고, 최신 ORM 기법이 화려해 보일 수 있다.
- 판단 기준: "이 기술 도입으로 인해 다른 팀원이 코드를 읽기 어려워지거나, 운영 단계에서 데이터 정합성이 깨질 위험이 커지는가?"를 항상 자문해야 함. 
- 결론: 개발자의 편리함이 운영의 오버헤드가 된다면, 보수적인 기술 선택(RDB/SQL)이 정답일 확률이 높다.
