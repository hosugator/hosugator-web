---
created: 2026-01-15
tags:
  - Database
  - Data_Structure
  - Indexing
---
# Indexing: B-Tree vs. Hashing

## 본질 (Essence)
도서관의 '찾아보기 목록(B-Tree)'과 사물함의 '열쇠 번호(Hashing)'의 차이

## 구조 (Mechanism)
- **B-Tree Index (RDS)**: 데이터를 계층적으로 정렬하여 관리합니다. 특정 값뿐만 아니라 범위(Range) 검색에 최적화되어 있으며, 여러 열(Column)에 생성하여 다양한 검색 경로를 제공합니다.
- **Hashing (DynamoDB)**: 키 값을 함수에 넣어 데이터의 물리적 위치를 즉시 산출합니다. 극강의 단건 조회/쓰기 성능을 보장하지만, 범위 검색이나 다중 열 검색에는 제약이 큽니다.

## 확장 (Connection)
- **연결**: DynamoDB가 '속도'를 위해 입구를 하나로 제한한 것이라면, RDS 인덱스는 '편의성'을 위해 여러 개의 뒷문을 만든 것입니다.
- **응용**: 검색 조건이 다양한 복잡한 비즈니스 로직에는 **B-Tree(RDS)**를, 정해진 키값으로 대량의 데이터를 빠르게 처리할 때는 **Hashing(DynamoDB)**을 선택합니다.

---
See Also: 
- [[Hash Function]]
- [[Index Search]]