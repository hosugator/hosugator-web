---
created: 2026-04-21
updated: 2026-04-21
subject: "[[Software]]"
project: "[[Edge AI LMR]]"
type: insight
status: 1-draft
tags:
  - sql
  - integrity
  - optimization
publish: true
---
# SQL EXISTS와 SELECT 1을 활용한 무결성 검증

\`SELECT 1\`과 \`EXISTS\` 조합은 데이터의 실제 내용이 아닌 존재 여부만을 효율적으로 확인하기 위한 패턴이다.

## 핵심 원리
1. **SELECT 1**: 데이터베이스 엔진에게 조건에 맞는 행을 찾으면 실제 데이터를 읽지 말고 단순 상수 '1'만 반환하도록 지시하여 성능을 최적화한다.
2. **EXISTS**: 서브쿼리의 결과가 존재하는지 여부를 불리언(True/False)으로 반환한다.

## 무결성 검증 패턴 (NOT EXISTS)
부모 테이블에 존재하지 않는 자식 데이터(Orphan data)를 찾기 위해 \`WHERE NOT EXISTS\`를 사용한다.

\`\`\`sql
SELECT COUNT(*) FROM SENSOR_STREAM_1S s
WHERE NOT EXISTS (
    SELECT 1 FROM PROCESS_CYCLE c WHERE c.cycle_id = s.cycle_id
)
\`\`\`
- 위 쿼리는 센서 데이터 중 그에 대응하는 공정 사이클 정보가 누락된 데이터의 개수를 정확히 찾아내어 데이터 무결성을 검사한다.
