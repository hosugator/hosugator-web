---
created: 2026-07-01
updated: 2026-07-01
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - javascript
  - react
  - jsx
  - tailwind
  - frontend
publish: true
---
## Context
Align-AI History 페이지에서 선택된 항목에 배경색을 주기 위해 조건부 클래스를 className에 넣어야 했다. 일반 따옴표로는 JS 표현식을 넣을 수 없어서 템플릿 리터럴을 처음으로 쓰게 됐다.

## Insight
### 조건부 클래스는 템플릿 리터럴 + 삼항 연산자 조합으로 표현한다

```tsx
// ❌ 일반 따옴표 — 정적 문자열만 가능
className="p-4 hover:bg-gray-100"

// ✅ 템플릿 리터럴 — JS 표현식 삽입 가능
className={`p-4 hover:bg-gray-100 ${selectedId === item.id ? "bg-gray-200" : ""}`}
```

- `{}` — JSX에서 "여기서부터 JS"
- 백틱(`` ` ``) — 템플릿 리터럴 시작
- `${}` — 템플릿 리터럴 안에서 JS 표현식 삽입

### 구조 분해

```
className={`고정클래스 ${조건 ? "참일때클래스" : ""}`}
                ↑ JS 표현식 (삼항 연산자)
```

조건이 거짓일 때 `""` (빈 문자열)을 넣으면 클래스가 추가되지 않는다.

### 실제 사용 예시

```tsx
// 선택된 항목 강조
className={`p-4 cursor-pointer hover:bg-gray-100 ${
  selectedId === item.id ? "bg-gray-200" : ""
}`}

// 상태에 따른 텍스트 색상
className={`text-sm ${status === "ok" ? "text-green-600" : "text-red-600"}`}
```

## Related
- [[Array find and filter take a callback function that receives each element not the value itself]] — HistoryPanel 같은 맥락에서 나온 패턴
