---
created: 2026-06-30
updated: 2026-06-30
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - browser
  - file-upload
  - blob
  - performance
  - architecture
publish: true
---
## Context
Align-AI 대시보드에서 사용자가 업로드한 이미지를 추론 후 캔버스에 표시하려고 했다. 파일은 이미 클라이언트에 있는데, 서버에서 다시 받아와야 하는가를 고민하다가 `URL.createObjectURL`을 발견했다.

## Insight
### 파일 전송과 파일 표시는 별개의 채널로 분리할 수 있다

```
전송 채널: 파일 → formData → 서버(추론) → 결과 JSON 반환
표시 채널: 파일 → URL.createObjectURL() → blob:// URL → <img src>
```

두 채널이 같은 파일 바이너리를 쓰지만 서로 독립적으로 동작한다. 서버는 처리 결과만 반환하면 되고, 표시는 클라이언트가 이미 갖고 있는 데이터로 해결한다.

### URL.createObjectURL은 브라우저 메모리에 임시 주소를 만든다

```ts
const url = URL.createObjectURL(file)
// → "blob:http://localhost:3000/7f3a2b1c-4d5e-..."
<img src={url} />
```

서버 업로드 없이 `<img>`, `<video>` 등에 바로 사용 가능. 탭 닫기·새로고침 시 소멸한다.

### 아끼는 비용은 업로드가 아니라 "다시 받아오는 왕복"이다

업로드 비용(클라이언트 → 서버)은 동일하게 발생한다. 절약되는 건 서버가 파일을 저장하고 URL을 만들어 클라이언트에 돌려주는 두 번째 왕복이다.

```
절약 전: 업로드 → 서버 저장 → URL 반환 → 클라이언트가 다시 요청 → 이미지 수신
절약 후: 업로드 → (서버는 결과만 반환) → 클라이언트 메모리에서 바로 표시
```

### 적용 패턴: 서버가 파일 자체를 돌려줄 필요 없을 때

- 이미지 업로드 → 추론 결과(JSON)만 필요
- 동영상 업로드 → 처리 결과(요약, 분류, 변환 파일)만 필요
- 서버에 저장하더라도 표시는 클라이언트 로컬 데이터 활용 가능

서버가 원본 파일을 그대로 돌려줘야 하는 경우(예: 리사이즈, 포맷 변환 결과물)에는 이 패턴이 맞지 않는다.

## Related
- [[API Route should pass request body directly unless inspection or modification is needed]] — 파일 전송 시 API Route 설계 원칙
- [[Browser events pass DOM state to handler functions enabling file upload pipelines]] — 파일 업로드 이벤트 처리 흐름
