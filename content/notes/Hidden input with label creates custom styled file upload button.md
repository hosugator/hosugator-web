---
created: 2026-07-01
updated: 2026-07-01
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - css
  - html
  - frontend
  - ux
  - pattern
publish: true
---
## Context
Align-AI Phase 2에서 `<input type="file" />`이 브라우저 기본 스타일로 노출되어 있었다. SaaS 수준 디자인 목표에 맞게 커스텀 버튼으로 교체하면서 처음 만난 패턴이다.

## Insight
### input을 숨기고 label이 클릭 영역을 담당한다

```tsx
<label className="cursor-pointer inline-flex items-center px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800">
  <input type="file" onChange={handleChange} className="hidden" />
  이미지 업로드
</label>
```

`<label>`을 클릭하면 연결된 `<input>`의 파일 선택창이 열린다 — HTML 표준 동작이다. `<input>`을 `hidden`으로 숨기고 `<label>`을 원하는 대로 스타일링하면 된다.

### cursor-pointer가 필요한 이유

`<label>`은 기본 커서가 화살표다. `<a>` 태그는 브라우저가 자동으로 pointer를 준다. `<label>`, `<div>` 같이 클릭 가능하지만 기본 커서가 화살표인 요소에는 `cursor-pointer`를 명시해야 한다.

### optional prop으로 텍스트를 변경 가능하게

같은 컴포넌트를 빈 상태(긴 안내문)와 이미지 있는 상태(짧은 "이미지 변경") 두 곳에서 쓸 때:

```tsx
type Props = {
  label?: string  // optional — 넘기지 않으면 기본값 사용
}

{label ?? "Image Upload"}
```

## Related
- [[Inline elements flow horizontally while block elements break to a new line by default]] — label의 display 동작
- [[Padding expands background and click area while margin creates transparent space between elements]] — label 클릭 영역 설계
