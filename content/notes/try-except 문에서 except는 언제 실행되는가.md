---
created: 2025-09-30 23:07
updated: 2026-02-16 23:19
type: insight
status: 3-publish
subject: "[[Software]]"
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
error가 발생해야만, except 구문으로 넘어오는 게 아니다.
try 구문에 입력되는 값이 없다면, except 구문을 실행하게 된다.
따라서, while True 구문은 대개 try-except 구문과 짝지어 작성된다.
입력값이 없음에도 while True 문이 살아있어, 런타임 에러가 발생하기 쉽기 때문이다.

#try-exception #except #whilt #runtime-error 