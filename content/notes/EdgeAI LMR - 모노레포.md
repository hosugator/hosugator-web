---
created: 2026-03-25 10:56
updated: 2026-03-25 10:58
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[Edge AI LMR]]"
tags:
  - 
publish: true
---
## 🏗 프로젝트 구조 (Monorepo)

- **`apps/`**: 실행 가능한 어플리케이션
    - `hmi-dashboard`: React 18 & Tailwind v4 기반의 산업용 HMI 대시보드
    - `data-engine`: Node.js 기반의 PLC 통신 및 시뮬레이션 서버
- **`packages/shared`**: 프론트엔드와 백엔드가 공유하는 공통 타입 및 Zod 스키마
- **`docs/`**: 시스템 설계 및 기술 문서
    - `reports/`: 일별 개발 및 분석 보고서
    - `reference/`: 기술 배경 및 초기 기획 자료
- **`tests/`**: Playwright 기반의 E2E 및 통합 테스트

## 🚀 시작하기

루트 디렉토리에서 다음 명령어를 사용하여 전체 시스템을 통합 실행할 수 있습니다.

```
# 의존성 설치
npm install

# 전체 시스템(HMI + Data Engine) 통합 실행
npm run dev

# 개별 서비스 실행
npm run dev:hmi    # 대시보드만 실행 (Port 3000)
npm run dev:engine # 데이터 엔진만 실행 (Port 3001)
```

## [](#-%ED%95%B5%EC%8B%AC-%EA%B8%B0%EC%88%A0-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98)📊 핵심 기술 아키텍처

1. **데이터 아키텍처**: `Cycle_ID` 중심의 시공간적 추적성과 독립 자산 모델(설비-금형-센서 분리) 채택.
2. **네트워크 전략**: 저성능 PLC 부하 경감을 위한 MQTT Push 및 Binary Batching 적용.
3. **XAI 시각화**: 진단 근거(Diagnostic Basis) 및 판단 경로(Decision Path)를 통한 AI 처방의 투명성 확보.

## [](#-%EC%A3%BC%EC%9A%94-%EB%AC%B8%EC%84%9C-%EC%9D%B8%EB%8D%B1%EC%8A%A4)📚 주요 문서 인덱스

- [데이터 아키텍처 및 상세 명세](/InternalProject/PJT-EDGE-AI-LMR/-/blob/init/monorepo/docs/Data_Architecture.md)
- [AI 모델 아키텍처 및 추론 전략](/InternalProject/PJT-EDGE-AI-LMR/-/blob/init/monorepo/docs/Model_Architecture.md)
- [최신 개발 통합 보고서](/InternalProject/PJT-EDGE-AI-LMR/-/blob/init/monorepo/docs/reports/20260325_Report_Integrated_Development_History.md)