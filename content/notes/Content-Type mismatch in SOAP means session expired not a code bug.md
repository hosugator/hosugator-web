---
created: 2026-05-20
updated: 2026-05-20
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[DTK in 2026]]"
tags:
  - web
  - erp
  - soap
  - http
  - session
  - content-type
publish: true
---
## Context
경영지원팀에서 ERP 오류 화면을 공유하며 원인을 물어왔다. 에러 메시지와 HTML 코드만 보고 원인을 파악해야 했다.

## Insight
### Content-Type 불일치 에러는 서버가 예상과 다른 형식을 반환했다는 신호다

```
Error: 응답 메시지의 콘텐츠 형식 text/html이(가) 바인딩의 콘텐츠 형식 text/xml과 일치하지 않습니다
```

"바인딩의 콘텐츠 형식"이 핵심 단서. 이건 WCF(Microsoft 웹 서비스 프레임워크) 용어로 "이 연결은 XML을 주고받기로 약속되어 있다"는 의미. 코드를 몰라도 에러 문구 자체에 답이 있다.

### HTML 안의 변수명과 경로가 원인을 직접 말해준다

```javascript
console.log("Home의 ErrorLogin 오픈")
window.top.location.href = '/'; //Home/Login/
```

`ErrorLogin`, `/Home/Login/` → 세션 만료 시 로그인 페이지를 반환하는 전형적인 패턴.

### 리다이렉트 코드가 있어도 실행 안 되는 이유

- 브라우저 요청: HTML 수신 → 렌더링 → JavaScript 실행 → 리다이렉트 작동
- SOAP 클라이언트 요청: HTML 수신 → "XML이 아님" → 즉시 에러 throw → JavaScript 실행 기회 없음

### 재로그인 후에도 동일하면 서버 문제다

| 상황 | 원인 | 조치 |
|---|---|---|
| 재로그인으로 해결 | 세션 타임아웃 | 재로그인으로 충분 |
| 재로그인 후에도 동일 | 서버 측 오류 | ERP 담당자에게 서버 확인 요청 |
| 여러 명 동시 발생 | 서버 문제 확실 | ERP 담당자 영역 |

### 에러 판독 접근법

코드를 몰라도 두 가지만 읽으면 된다:
1. **에러 메시지**: 무엇이 무엇과 다른지 직접 서술되어 있음
2. **변수명/경로**: 개발자가 의도를 코드에 남겨둠 (`ErrorLogin`, `/Home/Login/`)
