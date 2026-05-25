---
created: 2025-12-23
tags:
  - Amazon_S3
  - S3_Inventory
  - S3_Batch_Operations
reference:
  - "[[S3]]"
---
# S3 Inventory & Batch Operations

## 정의 (Definition)
수백만 개 이상의 대규모 객체 목록을 자동으로 추출하고 이를 기반으로 일괄 작업을 수행하는 관리형 데이터 자동화 관리 도구 세트

## 핵심 맥락 (Context & Why)
### Problem
버킷 내 객체가 수백만 개 이상일 경우 표준 API를 이용한 목록 조회는 시간과 비용이 과다하게 발생하며 개별 객체에 대한 암호화나 태그 변경 작업을 수동으로 처리하기 불가능함 
### Solution
S3 Inventory를 통해 저비용으로 객체 명단을 확보하고 S3 Batch Operations를 활용하여 서버 관리 없이 수십억 개의 객체에 대한 일괄 작업을 안정적으로 수행함

## 작동 원리 (Mechanism) 
### 대규모 객체 관리 프로세스
버킷 내 Inventory 설정 활성화 -> 지정된 주기마다 객체 메타데이터 보고서(CSV/ORC/Avro) 생성 -> Batch Operations에서 해당 보고서를 매니페스트로 지정 -> 실행할 작업(Copy, Tagging 등) 선택 -> 작업 실행 및 결과 보고서 수신

## 유비 및 비교 (Analogy & Comparison)
### It's like
수백만 명의 학생이 있는 학교에서 전수 조사를 하기 위해 교실마다 찾아다니는 대신(Standard List API), 교무처에서 전체 학생 명부를 뽑고(Inventory) 그 명부를 바탕으로 전교생에게 한꺼번에 가정통신문을 발송하는 것(Batch Operations)과 같음
### vs (유사 개념): 
 - S3 Inventory & Batch Operations: 대규모 객체 리스트를 생성하고 이를 바탕으로 실제 작업을 수행하는 일괄 처리 서비스
 - Standard List API: 프로그래밍 방식으로 실시간 객체 목록을 가져오지만 대규모 환경에서는 성능 저하와 비용 상승의 원인이 됨

## 예시 및 구조 (Example/Structure)
기존 버킷의 비암호화 객체들을 일괄 암호화할 때 사용: `Inventory 보고서 생성` -> `Batch Operations의 Copy 작업을 선택하여 암호화 옵션 적용 후 실행`