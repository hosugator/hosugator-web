---
created: 2025-09-30 22:59
updated: 2026-02-17 11:49
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Intel AI for Future Workforce]]"
tags:
  - 
publish: true
---
```dataview
TABLE
	updated,
	created,
	status
FROM ""
WHERE project = this.file.link
OR subject = this.file.link
SORT status ASC, updated DESC, created DESC
```
자료조사 자동화 서비스

사용자에게 입력 데이터를 받는다 (텍스트 입력, 문서 등)
데이터로부터 키워드를 추출한다
지정된 사이트나 공공 데이터에서 크롤링과 api로 자료를 수집한다
수집된 자료와 키워드 간의 유사도를 비교한다
유의미한 유사도가 있는 자료를 사용자에게 반환한다
추가 기능으로는 자료를 시각화하거나, 정리본으로 변환한다

검토하면서 보니, 사용자가 데이터 소스 원천을 특정하는 의미는 있으나, LLM의 딥 리서치가 이미 자료조사 자동화를 충분히 수행하고 있다.

#nlp #idea #research