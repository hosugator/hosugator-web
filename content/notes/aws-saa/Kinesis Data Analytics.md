---
created: 2025-11-14
tags: [aws_saa, kinesis, analytics, sql, stream, realtime, managed]
reference:
  - https://docs.aws.amazon.com/kinesis/latest/analytics/what-is.html
---
# Amazon Kinesis Data Analytics
## 정의
Kinesis Data Streams·Firehose·Kafka 등의 스트림에 대해 표준 SQL로 실시간 분석·집계·필터링을 수행하는 완전 관리형 스트림 분석 서비스
## 원리
- 스트림 레코드를 in-memory window (시간·개수 기반)로 묶음
- SQL 구문으로 SELECT·WHERE·GROUP BY·JOIN 실행
- 결과를 동일 스트림, Firehose, Lambda, S3 등으로 실시간 출력
## 특징
- SQL 만으로 윈도우 집계(5초, 1분, 슬라이딩, 세션) 가능
- Auto Scaling : 처리량 증가 시 Task(=KPUs) 자동 증가(최대 512)
- Lambda UDF : 사용자 정의 함수로 복잡한 변환 추가
- Exactly-once 처리, 실패 시 자동 복구
## 비교
[[Athena]] 는 S3 파일 기반 배치 분석,  
Kinesis Data Analytics는 스트림 기준 실시간 분석
## 예시
1. 주문 스트림에서 1분 윈도우로 지역별 매출 합계 실시간 계산
2. 결과를 Firehose → Redshift 로 전달, 대시보드에서 초단위 갱신
3. 이상 집계(매출 0원) 발생 시 Lambda UDF 로 즉시 SMS 발송
## 해설
- in-memory : 스트림 데이터를 디스크가 아닌 메모리(RAM) 에만 올려 실시간 집계·윈도우 연산을 빠르게 수행  
- Lambda UDF : 사용자 정의 함수를 Lambda 함수로 만들어 SQL 안에서 호출(예: 복호화, 특수 계산)  
- exactly-once : 중복 없이 한 번만 처리를 보장, 실패 복구 시에도 같은 레코드를 두 번 집계하지 않음