---
created: 2026-05-15
updated: 2026-05-15
type: adr
status: 2-stable
subject: "[[MOC - Business]]"
project: "[[dtk_corning]]"
tags:
  - documentation
  - information-architecture
  - business
---
# ADR: 비즈니스 프로젝트 문서 아키텍처

## Context

Corning 대리점 추진 프로젝트를 운영하면서 문서가 쌓이기 시작했다. 초기에는 `meetings/`(미팅 로그), `corning/`(계약 문서) 정도로 시작했으나 아래 문제들이 발생했다.

- **명명 규칙 혼재**: 같은 폴더 안에 `NNN_kebab.md`(정적 분석)와 `YYYYMMDD_topic.md`(시계열 기록)가 섞여 있었다.
- **내부/외부 문서 혼재**: `meetings/`가 내부 회의록과 Corning 외부 미팅을 모두 담고 있어 오해를 유발했다.
- **원본 파일 처리 미흡**: PDF, docx 원본 파일이 분석 문서와 같은 레벨에 놓여 구분이 어려웠다.

기존 패턴으로 해결하려 했다.
- **PKM flat 구조**: 개인 인사이트 연결망에는 맞지만, 거래처·계약이라는 명확한 계층 관계가 있는 비즈니스 문서에는 맞지 않았다.
- **ADR/RFC/SPEC 3계층(개발용)**: 기술 의사결정 추적에는 적합하나, 커뮤니케이션 로그·원본 문서 관리 개념이 없었다.

비즈니스 맥락 전용 구조가 필요하다고 판단했다.

## Decision

각 도메인 폴더(거래처 또는 주제 단위) 하위에 다음 3-tier 구조를 적용한다.

```
{domain}/
  000_moc.md              ← 인덱스
  NNN_kebab.md            ← 정제된 참조·분석 문서 (의사결정 단일 진실 공급원)
  logs/
    YYYYMMDD_topic.md     ← 시계열 활동 기록 (미팅, 발송 이메일, 수신 회신)
  resources/
    원본.pdf / 원본.docx   ← 원본 문서 (NNN_ 문서에서 링크로만 참조)
```

내부/외부 구분은 폴더 이름으로 한다.
- `internal/` — DTK 내부 검토·분석
- `corning/` — Corning과의 공식 커뮤니케이션

**핵심 원칙**: 루트의 NNN_ 문서만 읽으면 "무엇을 왜 결정했는지" 파악 가능해야 한다. logs/와 resources/는 맥락 추적 및 근거 참조용이다.

## Consequences

**긍정적**
- 명명 규칙 혼재 해소. 폴더 위치만 보면 파일 성격을 즉시 파악할 수 있다.
- 거래처가 추가되어도 동일한 패턴을 그대로 적용할 수 있다. (`samsung/`, `lg/` 등)
- 루트 NNN_ 문서가 오염되지 않아 의사결정 흐름 추적이 용이하다.

**트레이드오프**
- 단순 프로젝트에는 과한 구조일 수 있다. 문서가 10개 미만이라면 flat이 더 실용적이다.
- `logs/` 가 분산되어 있어 "전체 최근 활동 조회"는 불편하다. (의도적 트레이드오프 — 거래처별 맥락 추적이 더 중요)

## 관련 노트

- [[3계층 문서 아키텍처 - 관심사별 SSOT 분리 원칙]]
- [[Document Architecture]]
