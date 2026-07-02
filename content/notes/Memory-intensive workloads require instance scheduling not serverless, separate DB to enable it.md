---
created: 2026-06-22
updated: 2026-06-22
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Go2fit]]"
tags:
  - cloud
  - cost-optimization
  - architecture
  - serverless
publish: true
---
## Context
사이드 프로젝트(Flutter 앱 + FastAPI + Postgres + 동영상 포즈 분석)의 OCI 인스턴스 비용이 월 4만원 발생. 비용 절감 방법을 탐색하는 과정에서 워크로드 특성과 비용 구조의 관계를 정리했다.

## Insight
### 메모리 집약적 워크로드는 서버리스로 대체 불가능하다

```
동영상 프레임 디코딩 + 포즈 추정 모델 → 8GB RAM 필요
서버리스(Fly.io, Railway 무료) → 256MB~512MB
→ 대체 불가
```

[[Cost-Optimized Compute Solutions]]의 "Consumption Model Matching" 원칙에서 간헐적 워크로드 → Lambda/서버리스가 맞다고 하지만, **메모리 요구량이 서버리스 한계를 초과하면 인스턴스 스케줄링이 유일한 선택지**가 된다.

### 처리 레이어 분리가 현실적인 비용 최적화다

```
무거운 처리 (동영상 분석) → 고사양 인스턴스, 요청 올 때만 on
가벼운 레이어 (API, DB)  → 경량 서비스 또는 managed로 분리
```

트래픽이 거의 없는 테스트 단계라면 인스턴스 수동 on/off가 가장 단순하다.

### DB를 앱 서버와 분리하면 인스턴스 on/off가 자유로워진다

```
DB가 같은 인스턴스
  → 인스턴스 중지 = DB도 중지 (접근 불가)

DB 분리 (Supabase 무료 Postgres 등)
  → 인스턴스 on/off와 무관하게 데이터 영속성 유지
  → 앱 서버만 껐다 켰다 가능
```

Supabase는 managed PostgreSQL이라 기존 Postgres 코드 그대로 연결 URL만 바꾸면 된다. 마이그레이션도 `pg_dump / psql` 한 번으로 가능.

### GitOps 클러스터는 재시작 시 자동 복원된다

k3s 기반 클러스터의 경우:

```
sudo systemctl stop k3s   → 클러스터 전체 종료 (비용 절감)
sudo systemctl start k3s  → Argo CD가 GitHub manifest sync → 자동 복원
```

인스턴스를 껐다 켜도 GitOps가 SSOT이기 때문에 상태가 보장된다.

## Decision
현재 사이드 프로젝트 구조:
- 테스트 단계, 트래픽 전무 → 인스턴스 수동 on/off로 비용 절감
- DB를 Supabase로 분리하면 인스턴스 종료 시에도 데이터 접근 가능
- 실서비스 전환 시 처리 레이어 분리(고사양 Job 인스턴스) 재검토

## Related
- [[Cost-Optimized Compute Solutions]] — 소비 모델 매칭 원칙. 메모리 제약이 서버리스 선택 불가 조건임을 추가.
- [[Each infrastructure layer removes one dependency and reveals source code as the true bottleneck]] — 인프라 레이어 분리 원칙
