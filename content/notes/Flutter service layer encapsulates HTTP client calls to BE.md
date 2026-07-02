---
created: 2026-06-20
updated: 2026-06-20
type: study
status: 2-stable
subject: "[[App]]"
project: "[[Go2fit]]"
tags:
  - flutter
  - architecture
  - mobile
publish: true
---
## Context
go2fit FE 코드에서 `lib/features/workout/data/services/workout_service.dart`를 처음 접하면서 "services 폴더가 BE의 endpoint 역할인가?"라는 질문이 나왔다. BE 개발 중심으로 FE를 처음 읽다 보니 역할이 반대로 느껴졌다.

## Insight
### FE service layer는 BE endpoint를 호출하는 HTTP 클라이언트다

BE endpoint가 "요청을 받는" 쪽이라면 FE service는 "요청을 보내는" 쪽이다. 즉 BE로 치면 client에 해당한다.

```
UI
  ↓
ViewModel     언제, 무엇을 할지 결정
  ↓
Repository    데이터 출처 추상화 (서버? 로컬?)
  ↓
Service       실제 HTTP 호출 (헤더 구성, 응답 파싱, 에러 처리)
  ↓
BE endpoint   서버에서 요청 받아 처리
```

### Service의 각 메서드는 BE endpoint URL에 1:1 대응한다

`WorkoutService.addManualRecord()` → `POST /api/v1/workout/manual-record`처럼 메서드와 엔드포인트가 직접 매핑된다. 네트워크 호출, 헤더, 응답 파싱, 에러 처리가 모두 여기 모인다.

## Related
- [[Flutter plugin support varies by platform limiting local test targets]] — Flutter 플랫폼 레이어 특성
