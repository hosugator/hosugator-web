---
created: 2025-12-23 Tue
tags: [comparison, decision_making]
reference:
  - "[[Amazon S3]]"
  - "[[Amazon DynamoDB]]"
---
# Comparison - Data Repository vs Data Management

## 비교 목적 (Objective)
데이터의 크기 및 접근 단위에 따른 최적의 저장 방식(객체 vs 항목) 선정

## 요소별 상세 비교 (Feature Matrix)
| 비교 기준 | [[Amazon S3]] | [[Amazon DynamoDB]] |
| :--- | :--- | :--- |
| **관리 단위** | 객체(Object/File) 전체 | 항목(Item/Row) 단위 |
| **접근 제어** | 파일 단위의 읽기/쓰기 | 속성(Attribute) 단위의 정교한 필터링 |
| **비용 효율** | 대용량 데이터 보관 시 유리 | 소규모 데이터의 빈번한 조작 시 유리 |
| **검색 능력** | 파일 명 위주의 단순 검색 | 인덱스를 활용한 다양한 조건 검색 |

## 선택 기준 및 로직 (Selection Criteria)

### [[Amazon S3]]를 선택해야 하는 경우
* 데이터 하나당 크기가 수 MB 이상으로 크며, 내용 전체를 한 번에 소비하는 경우 (이미지, 영상, 로그 파일)
* 데이터 보관 단가를 낮추는 것이 시스템 유지의 핵심 지표인 경우
* 분석 도구가 파일 전체를 스캔하여 배치 처리를 수행해야 하는 경우

### [[Amazon DynamoDB]]를 선택해야 하는 경우
* 데이터 하나당 크기는 수 KB로 작지만, 그 수가 수억 개이며 특정 조건으로 즉시 찾아야 하는 경우
* 데이터의 특정 부분(예: 사용자의 포인트 정보만 수정)만 실시간으로 빈번하게 업데이트해야 하는 경우
* 애플리케이션의 상태 값이나 세션 정보처럼 짧은 지연 시간(Low Latency)이 생명인 경우

---
**Conclusion:**
데이터를 '덩어리'로 보관하고 잊어버린다면 S3를, 데이터를 '세밀하게' 쪼개서 수시로 대화한다면 DynamoDB를 선택함