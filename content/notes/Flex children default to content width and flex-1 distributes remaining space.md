---
created: 2026-07-06
updated: 2026-07-06
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - css
  - flexbox
  - tailwind
  - frontend
publish: true
---
## Context
Align AI Stats 페이지 Direction Distribution 카드가 예상보다 작게 렌더링됐다. flex 컨테이너의 너비가 충분한데도 카드가 contents 너비에만 맞춰졌다. flex-1 추가로 해결했다.

## Insight

### flex 자식은 기본적으로 contents 크기에 맞춰진다

flex 컨테이너가 부모 너비를 100% 채워도, 자식은 내용(value, title) 크기만큼만 공간을 차지한다. title이 value보다 길면 value 너비 안에서 줄바꿈된다.

```
컨테이너: [────────────────────────────────]
자식 기본: [H: 1][V: 2]  ← 내용 크기만큼만
```

### flex-1이 남은 공간을 균등 분배한다

```tsx
<div className="flex gap-4">
  <Card className="flex-1">H</Card>  // 50%
  <Card className="flex-1">V</Card>  // 50%
</div>
```

```
컨테이너: [────────────────────────────────]
flex-1:   [──────── H ────────][──────── V ────────]
```

### grid vs flex 선택 기준

```
grid grid-cols-N  ← 개수가 고정, 균등 분할이 목적
flex + flex-1     ← 개수가 가변, 컨텐츠 추가 시 자동 확장
```

카드 개수가 늘어날 가능성이 있으면 flex-1이 유지보수에 유리하다. grid는 cols 수를 매번 수정해야 한다.

## Related
- [[Padding expands background and click area while margin creates transparent space between elements]] — CSS 공간 모델
- [[Inline elements flow horizontally while block elements break to a new line by default]] — display 기본값과 레이아웃
