---
created: 2025-12-23 11:56
tags:
  - Amazon_S3
  - S3_Inventory
  - S3_Batch_Operations
  - 
reference:
  - "[[S3 1]]"
updated: 2026-02-15 11:53
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[MOC - AWS SAA]]"
publish: true
---
# S3 Inventory & Batch Operations
## Essence
수백만 개 이상의 대규모 객체 목록을 자동으로 추출하고, 이를 기반으로 암호화 · 태그 변경 등을 일괄 수행하는 관리형 데이터 자동화 관리 도구 세트
## How
- 대규모 객체 관리 프로세스
	- 버킷 내 Inventory 설정 활성화
	- 지정된 주기마다 객체 메타데이터 보고서(CSV/ORC/Avro) 생성
	- Batch Operations에서 해당 보고서를 매니페스트로 지정
	- 실행할 작업(Copy, Tagging 등) 선택
	- 작업 실행 및 결과 보고서 수신
## Analogy
- It's like
	- 수백만 명의 학생이 있는 학교에서 전수 조사를 하기 위해 교실마다 찾아다니는 대신(Standard List API), 교무처에서 전체 학생 명부를 뽑고(Inventory) 그 명부를 바탕으로 전교생에게 한꺼번에 가정통신문을 발송하는 것(Batch Operations)과 같음
- vs
	 - Standard List API: 프로그래밍 방식으로 실시간 객체 목록을 가져오지만 대규모 환경에서는 성능 저하와 비용 상승의 원인이 됨