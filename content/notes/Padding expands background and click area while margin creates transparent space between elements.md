---
created: 2026-07-01
updated: 2026-07-01
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - css
  - tailwind
  - layout
  - frontend
publish: true
---
## Context
Align-AI Phase 2 사이드바 설계에서 "Align AI" 앱 이름 아래 여백을 줄 때 `mb`와 `pb` 중 무엇을 쓸지, 그리고 클릭 영역을 넓힐 때 왜 padding이 필요한지를 논의하면서 처음으로 명확하게 구분했다.

## Insight

### 판단 기준: 배경색·테두리가 영향받아야 하면 padding, 아니면 margin

```
┌─────────────────┐
│    padding      │ ← 배경색 채워짐, 클릭 영역 포함
│  ┌─────────┐          │
│  │  텍스트          │          │
│  └─────────┘          │
└─────────────────┘
      margin       ← 투명, 배경색 없음
┌─────────────────┐
│  다음 요소                       │
```

### 클릭 영역 확장은 반드시 padding이다

버튼이나 링크의 클릭 영역을 넓히려면 padding을 써야 한다. margin은 투명 공간이라 클릭이 안 된다.

```tsx
// 사이드바 nav 항목 — 글자만 클릭되는 게 아니라 영역 전체가 클릭돼야 한다
<Link className="block py-2 px-3 rounded-md hover:bg-gray-200">
  Inspection
</Link>
```

`block`으로 영역을 만들고 `px`, `py`로 확장한다. margin으로는 불가능하다.

### 실용 기준표

| 상황 | 선택 | 이유 |
|---|---|---|
| 버튼 클릭 영역 넓히기 | padding | 배경/클릭 영역이 채워져야 함 |
| 두 섹션 사이 여백 | margin | 사이 공간은 투명해야 함 |
| 카드 내부 여백 | padding | 카드 배경이 여백까지 채워야 함 |
| 컴포넌트 간 거리 | margin | 투명한 간격 |

## Related
- [[Proximity principle places controls near their effect not near related data]] — 클릭 영역 설계의 UX 맥락
- [[Frontend UI development follows structure, data flow, behavior, polish order]] — padding/margin은 polish 단계
