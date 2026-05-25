---
created: 2026-03-20 10:22
updated: 2026-03-20 14:00
type: execution
status: 2-stable
subject: "[[MOC - AI]]"
project: "[[edge-ai-lmr]]"
tags:
  - 
---
# ADR-002: 에이전트 웹 자동화 및 브라우저 제어를 위한 MCP 선정

**작성일:** 2026-03-20
**상태:** 제안 (Assess/Trial)
**도구 후보:** Microsoft Playwright MCP, Browser Use, Puppeteer MCP

---

## 1. 배경 및 필요성 (Discovery & Context)
- **목적:** 에이전트가 웹 페이지를 직접 탐색하고, 버튼 클릭, 폼 입력 등의 상호작용을 수행하여 복잡한 웹 기반 업무를 자동화함.
- **핵심 요구사항:** 
    - 직접적인 클릭 및 입력 기능.
    - **Headed 모드 (Visible Browser)** 지원을 통한 작업 과정 모니터링.
    - 대규모 언어 모델(LLM)의 컨텍스트 비용을 절감할 수 있는 효율적인 데이터 전송.

---

## 2. 도입 평가 (Tech Radar Assessment)

### 2.1. 후보 1: Microsoft Playwright MCP (권장: ADOPT/TRIAL)
- **특징:** Microsoft에서 공식 관리. Accessibility Tree(Aria) 스냅샷을 사용하여 스크린샷 대비 토큰을 90% 이상 절감.
- **장점:** 가장 안정적이며, `--headed` 플래그 하나로 즉시 시각적 모니터링 가능.
- **단점:** 복잡한 사이트의 경우 스냅샷만으로는 구조 파악이 어려울 수 있음 (Vision 기능 보완 필요).

### 2.2. 후보 2: Browser Use MCP (평가: TRIAL)
- **특징:** '에이전틱(Agentic)' 워크플로우에 최적화된 설계. 다단계 작업을 매우 안정적으로 수행.
- **장점:** 시각적으로 브라우저가 작동하는 모습을 지켜보기에 가장 적합한 UI/UX 제공.

### 2.3. 후보 3: MCP Chrome Extension (평가: ASSESS)
- **특징:** 사용자의 실제 크롬 세션에 연결. 별도의 로그인 없이 평소 쓰던 사이트(메일, 쇼핑 등) 즉시 사용 가능.

---

## 3. 개발자 경험 및 임팩트 분석 (DevEx & Impact)

- **SPACE 프레임워크 관점:**
    - **Efficiency & Flow:** 에이전트가 브라우저 작업을 대신 수행함으로써 개발자는 단순 반복 작업(데이터 수집, 테스트 등)에서 벗어나 고차원적 설계에 집중 가능.
    - **Cognitive Load:** Playwright의 Accessibility Tree 방식은 LLM이 페이지를 더 명확히 '이해'하게 하여 오작동(Hallucination)으로 인한 사용자의 피로도를 줄임.
- **Headed 모드의 가치:** 자동화 과정이 블랙박스가 아닌 시각적 피드백으로 제공되어, 사용자에게 심리적 안정감과 디버깅 편의성 제공.

---

## 4. 최종 제안 및 실행 계획

### **선정 도구: Microsoft Playwright MCP (@playwright/mcp)**

### **실행 설정 (Gemini CLI)**
```bash
gemini mcp add playwright npx -y @playwright/mcp@latest --headed
```

### **다음 단계:**
1. 위 명령어를 통해 Playwright MCP를 설치하고 Headed 모드 작동 여부를 테스트합니다.
2. 특정 웹사이트(예: ERP 관리 페이지 등)에 접속하여 "버튼 클릭" 및 "데이터 추출" 임무를 부여하여 성능을 검증합니다.
