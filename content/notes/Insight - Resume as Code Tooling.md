---
created: 2026-05-17
updated: 2026-05-17
type: insight
status: 2-stable
subject: "[[Portfolios]]"
tags:
  - resume
  - tooling
  - slidev
  - typst
  - workflow
  - comparison
  - engineering-practice
publish: true
---

# Insight — Resume as Code: 도구 비교 및 전략

> 이력서를 Figma 대신 코드로 관리할 때, 어떤 도구 스택이 최적인가?  
> 결론 먼저: **단기는 Slidev 개선, 장기 전환 대상은 Typst.**

---

## 1. 비교 매트릭스

| | **Slidev** | **Typst** | HTML + Puppeteer | LaTeX |
|---|---|---|---|---|
| 학습 비용 | ✅ 이미 구성됨 | ⚠️ 새 언어 (1-2일) | ✅ 웹 표준 | ❌ 높음 |
| 한국어 지원 | ✅ Google Fonts | ✅ 시스템 폰트 직접 | ✅ | ⚠️ xeCJK 필요 |
| CSS/스타일 추상화 | ⚠️ 글로벌 클래스 (우회) | ✅ 언어 레벨 함수 | ✅ 완전 지원 | ⚠️ 패키지 의존 |
| PDF 렌더링 | ⚠️ 브라우저 경유 | ✅ 네이티브 | ⚠️ 브라우저 경유 | ✅ 네이티브 |
| 콘텐츠·스타일 분리 | ⚠️ HTML 인라인 혼재 | ✅ 함수 파라미터 | ⚠️ | ⚠️ |
| ATS 친화성 | 보통 | 높음 | 보통 | 높음 |
| 발표자료 겸용 | ✅ | ❌ | ❌ | ❌ |
| Hot Reload | ✅ Vite | ✅ typst-preview | ✅ (설정 필요) | ❌ |

---

## 2. 심층 평가

### 🥇 Typst — 장기 최선의 대안

현재 가장 빠르게 성장하는 과학·기술 문서 도구. LaTeX의 표현력과 현대적 문법을 결합하고, Rust 기반으로 컴파일 속도가 수십 ms 수준.

**핵심 강점:**
- **PDF 네이티브 생성**: 브라우저 렌더링 없이 직접 PDF. 폰트 임베딩·벡터 품질 보장
- **함수 레벨 추상화**: 콘텐츠와 스타일 완전 분리 가능

```typst
#let job-entry(company, role, period, bullets) = grid(
  columns: (130pt, 1fr), gutter: 16pt,
  [*#company* \ #text(fill: accent)[#role] \ #text(fill: muted)[#period]],
  for b in bullets [ • #b \ ]
)

// 사용: 내용에만 집중
#job-entry("DTK", "AI Developer", "26.03 — Present", (
  "Edge AI & AOI 이상탐지 시스템. Anomalib 기반 AUROC 99.99% 달성.",
  "AlignAI: U-Net Segmentation으로 정렬 프로세스 100% 자동화.",
))
```

**단점:**
- 새 언어 학습 (문법은 Markdown+Python 중간 수준, 1-2일 투자)
- 생태계가 LaTeX보다 아직 작음 (빠르게 성장 중)
- `typst.app`에서 브라우저 기반 편집 가능 → 진입 장벽 낮음

### 🥈 Slidev — 현재 선택, 충분히 개선 가능

프레젠테이션 도구 위에 이력서를 올리는 구조적 어색함은 있으나, **글로벌 CSS 클래스 추상화**로 유지보수 문제의 80%를 해결할 수 있음.

**핵심 문제와 해결책:**

| 문제 | 해결 |
|---|---|
| `style="font-size:9.5px;font-weight:..."` 장황 | 글로벌 CSS 클래스 (`r-sec`, `r-badge` 등) |
| 색상값이 HTML 전체에 散在 | CSS Custom Properties (`:root { --c-a: #059669 }`) |
| 타이포 크기 변경 시 전체 수정 | `.r-p`, `.r-sm`, `.r-xs` 클래스 한 곳 수정 |

**Slidev 한계 (글로벌 클래스로 해결 불가):**
- 브라우저 렌더링 의존 → PDF export 미세 차이 가능
- 발표용 aspect ratio를 A4로 우회하는 구조적 hack

### 🥉 HTML/CSS + Puppeteer

웹 표준 완전 활용. 하지만 페이지 브레이크 제어(`break-inside: avoid`)가 까다롭고, 별도 빌드 스크립트 필요. Slidev 대비 실질적 장점 없음.

### ❌ LaTeX

학술·해외 지원의 gold standard. 한국어 처리(xeCJK + 별도 폰트 설정)와 긴 학습 곡선이 현 목적에 과도함.

---

## 3. 디자인 평가 — 현재 Slidev 이력서

### 강조색 #059669 (Emerald-600)

| 항목 | 평가 |
|---|---|
| WCAG 대비비 (on white) | 4.53:1 → AA 기준 통과 |
| 뱃지 (#dcfce7 bg / #15803d text) | 6.5:1 → AAA 기준 통과 |
| 시각적 인상 | "성장·혁신·기술" — 과하지 않고 개성 있음 |
| 한국 AI 기업 맥락 | 적합. 보수적 기업은 Navy 고려 가능 |

**결론:** 현재 초록 팔레트는 잘 선택됨. 더 진한 `#047857`(Emerald-700)으로 대비 5.4:1 확보도 가능하나 필수는 아님.

### 타이포그래피

- **Inter + Noto Sans KR**: CJK·라틴 혼용 이력서의 현재 최선 조합
- **Weight 대비 (900 → 800 → 700 → regular)**: 계층 구조 명확
- **Monospace 메타 텍스트** (날짜, 푸터): 기술적 성격 강조, 잘 작동함

### 레이아웃

- 좌측 보더 카드(`border-left: 2px solid accent`) 모티프: 일관성 있음
- 타임라인 세로 구분선(`border-right`): 클린
- **개선 여지**: 섹션 구분선이 너무 연함 → 약간 진한 `#d1fae5`도 고려

---

## 4. 전환 전략 결론

```
지금:  Slidev + CSS 토큰/클래스 추상화  →  유지보수성 확보
언제:  이력서 구조 안정화 후             →  Typst 전환 검토
```

**Slidev 유지 근거 (현재):**
1. 이미 작동하는 환경 (전환 비용 > 단기 편익)
2. 발표자료·이력서 동일 소스 관리 가능
3. CSS 클래스 추상화로 핵심 DX 문제 해결

**Typst 전환 트리거:**
- 이력서 구조가 안정화되어 콘텐츠 변경만 빈번해질 때
- 해외 지원 등 PDF 인쇄 품질이 더 중요해질 때
- `typst watch resume.typ` 워크플로우로 1시간 내 프로토타입 가능

---

## 참고

- [[slides.md]] — 현재 Slidev 이력서 소스
- [[Master Resume - ver3.0.md]] — 마스터 에셋
- [[Engineering Practice - Document Architecture]] — DaC 원칙
