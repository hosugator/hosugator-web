---
created: 2026-01-15
tags:
  - Database
  - Performance
  - Query_Optimization
  - index
---
# Index Search & Row Identification (인덱스 탐색 메커니즘)

## 본질 (Essence)
색인(Index)에서 지름길을 찾아 주소를 알아낸 뒤, 실제 집(Row)으로 찾아가 나머지 정보를 확인하는 2단계 과정

## 구조 (Mechanism)
1. **Index Seek (Up & Down)**: 정렬된 B-Tree 구조를 타고 내려가 조건에 맞는 키값과 그에 대응하는 물리적 주소(RID/Pointer)를 찾습니다.
2. **Index Leaf Scan**: 조건에 부합하는 결과가 여러 개라면, 정렬된 잎(Leaf) 노드를 옆으로 읽으며 모든 주소를 수집합니다.
3. **Key Look-up**: 수집된 주소를 바탕으로 실제 데이터 테이블에 접근하여 인덱스에 포함되지 않은 나머지 열의 값을 확인하고 최종 필터링합니다.

## 확장 (Connection)
- **연결**: 데이터의 값과 물리적 주소 연결은 'Key Look-up' 단계에서 완성됩니다.
- **응용**: 만약 검색 성능을 더 높이고 싶다면, 여러 열을 하나의 인덱스로 묶는 '복합 인덱스(Composite Index)'를 생성하여 탐색 단계를 줄일 수 있습니다.

---
See Also: 
- 