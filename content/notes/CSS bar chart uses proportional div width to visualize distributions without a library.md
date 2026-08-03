---
created: 2026-07-06
updated: 2026-07-06
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - css
  - visualization
  - frontend
  - tailwind
publish: true
---
## Context
Align AI Stats 페이지 Gap Distribution을 시각화할 때 recharts 같은 차트 라이브러리 없이 구현했다. div 너비를 비율로 설정하는 것만으로 충분했다.

## Insight

### div width %로 막대그래프를 만들 수 있다

최댓값 대비 비율을 width로 설정하면 차트 라이브러리 없이 bar chart가 된다.

```tsx
const maxGapCount = Math.max(...Object.values(gapGroups));

{Object.entries(gapGroups).map(([gap, count]) => (
  <div key={gap}>
    <span>{gap}px</span>
    <div
      className="h-5 bg-blue-400 rounded"       // 고정 스타일 → Tailwind
      style={{ width: `${(count / maxGapCount) * 100}%` }}  // 동적 너비 → inline
    />
    <span>{count}</span>
  </div>
))}
```

### 언제 라이브러리가 필요한가

```
CSS bar로 충분  ← 단순 분포, 카테고리별 비교
라이브러리 필요 ← 축/눈금/툴팁/인터랙션/시계열 등
```

Align AI처럼 gap 분포만 보여주는 단순 케이스는 CSS bar가 의존성 없이 더 가볍다.

## Related
- [[Tailwind classes are build-time scanned so dynamic values require inline style]] — 동적 width에 inline style을 써야 하는 이유
