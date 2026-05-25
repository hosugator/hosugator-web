---
created: 2025-10-20
tags: [정보처리기사, python, set, iterable, data_structure]
reference:
  - "[[정보처리기사 - hub]]"
---
# Python Set
## 정의
순서·중복이 없는 파이썬의 컬렉션 자료형
## 특징
`{}`로 표현한다
## 요소
### add()
`set.add(element)` 형태로 사용하며, 한 번에 단일 원소만 추가한다. 추가하려는 원소가 이미 집합에 존재하면 이 작업은 무시된다.
### update()
`set.update(iterable)` 형태로 사용하며, 입력받은 Iterable 객체의 모든 원소를 집합에 개별적으로 추가한다. 이 과정에서 중복된 원소는 자동적으로 무시된다.