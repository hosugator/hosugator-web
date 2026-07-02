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
  - layout
  - frontend
  - react
publish: true
---
## Context
Align-AI Phase 2에서 `<Badge>`, `<Button>`, `<Card>`를 코드에서 동일하게 나열했는데 Badge와 Button은 한 행에, Card만 아래 줄에 위치했다. 명시적인 레이아웃 코드 없이 이런 배치가 된 이유를 처음으로 인식했다.

## Insight
### HTML 요소의 기본 display 값이 배치를 결정한다

```
inline 요소 — 옆으로 나란히 흐른다
  → <span>, <a>, <Badge>(inline-flex), <Button>(inline-flex)

block 요소  — 새 줄에서 시작한다
  → <div>, <p>, <Card>(div 기반), <ul>
```

코드에서 동일하게 나열해도 배치가 달라지는 이유: 각 요소의 기본 display 값이 다르기 때문이다.

### shadcn 컴포넌트의 기본 display

shadcn의 `<Badge>`와 `<Button>`은 내부적으로 `inline-flex`로 구현되어 있다. `<Card>`는 `div` 기반이라 `block`. 이 때문에 Badge/Button은 한 행에, Card는 다음 행에 위치한다.

### 명시적으로 배치를 제어하려면

```
block   — 줄 전체를 차지하게 만들기 (Link를 버튼처럼 만들 때 block 추가)
flex    — 자식 요소를 가로 or 세로로 정렬
grid    — 2축 레이아웃
inline  — 블록 요소를 인라인으로
```

## Related
- [[Padding expands background and click area while margin creates transparent space between elements]] — block + padding 조합으로 클릭 영역 제어
- [[Frontend UI development follows structure, data flow, behavior, polish order]] — 레이아웃은 구조 단계에서 결정
