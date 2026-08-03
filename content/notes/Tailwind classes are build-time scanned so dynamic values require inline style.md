---
created: 2026-07-06
updated: 2026-07-06
type: study
status: 2-stable
subject: "[[Web]]"
project: "[[Align AI]]"
tags:
  - tailwind
  - css
  - frontend
publish: true
---
## Context
Align AI Stats 페이지에서 Gap Distribution bar를 만들 때 막대 너비를 비율로 설정해야 했다. 
Tailwind 클래스로 시도했으나 동적 값이 동작하지 않아 inline style로 전환했다.

## Insight
### Tailwind는 빌드 타임에 클래스 목록을 스캔한다

Tailwind는 빌드 시 소스코드에서 클래스명을 문자열로 찾아서 CSS를 생성한다. 
런타임에 동적으로 조합된 클래스명은 스캔되지 않아 스타일이 적용되지 않는다.

```tsx
// 동작 안 함 — 빌드 시 "w-66.7%" 같은 클래스를 찾지 못함
className={`w-${(count / maxGapCount) * 100}%`}

// 동작함 — 런타임 계산값을 직접 전달
style={{ width: `${(count / maxGapCount) * 100}%` }}
```

### 사용 기준

```
고정 스타일     → Tailwind 클래스 (h-5, bg-blue-400, rounded)
동적 계산 값    → inline style (width %, transform, top/left 좌표 등)
```

inline style은 Tailwind와 병용 가능하다. 고정 부분은 className, 동적 부분은 style로 분리한다.

```tsx
<div
  className="h-5 bg-blue-400 rounded"     // 고정 → Tailwind
  style={{ width: `${ratio * 100}%` }}    // 동적 → inline
/>
```

## Related
- [[Padding expands background and click area while margin creates transparent space between elements]] — CSS 공간 모델
