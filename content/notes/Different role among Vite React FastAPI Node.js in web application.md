---
created: 2026-05-08 14:00
updated: 2026-06-18
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[AOI]]"
tags:
  - vite
  - react
  - fastapi
  - nodejs
  - web-stack
  - ml-deployment
  - docker
publish: true
---
## Context
web-app을 구성하는 각 기술 스택이 무엇을 담당하는지를 모른다면, 기술 종속적이 된다. 또는 각 도구가 하는 일을 혼동하면 "Node.js를 완전히 제거할 수 있다"는 잘못된 전제를 갖게 된다.
Vite는 Node.js 위에서 돌아가는 도구다. "Vite를 쓴다 = Node.js가 필요하다"는 등식이 성립한다. Node.js Express(비즈니스 로직 서버)를 FastAPI로 교체해도, Vite를 쓰는 한 개발 환경에서 Node.js 런타임은 남는다.

## Insight
### 각 도구의 차이

| 도구                  | 역할                   | 담당 시점              |
| ------------------- | -------------------- | ------------------ |
| **Vite**            | JS/TS 빌드 도구 (번역기)    | 개발 시 번들링, HMR      |
| **React**           | UI 프레임워크             | 브라우저에서 실행          |
| **Node.js**         | Vite가 실행되는 JS 런타임    | 개발 환경              |
| **Node.js Express** | HTTP 서버              | 개발 + 배포 환경 (교체 대상) |
| **FastAPI**         | Python HTTP 서버 + API | 배포 환경에서 Express 대체 |

### 개발 환경 vs 배포 환경의 Node.js 역할 차이

```
개발 환경
  Node.js 런타임 (필수)
    └── Vite dev server (HMR, 번들링)
    └── Express 서버 (API, ML 브리지)   ← FastAPI로 교체 가능
  Python 가상환경
    └── ML 모델 (subprocess or 별도 프로세스)

배포 환경 (FastAPI 전환 후)
  Node.js 런타임 (빌드 도구로만 사용)
    └── npm run build → dist/ 생성 후 역할 종료
  Python (FastAPI)
    └── dist/ 정적 파일 서빙
    └── API 라우트 (/infer, /train 등)
    └── ML 호출 (동일 프로세스 내 import)
```


### ML 프로젝트에서 FastAPI가 Node.js Express보다 적합한 이유
#### Node.js Express + Python subprocess 구조에서 발생하는 문제:

```
  aoi-console (Vite, port 5174)
  data-engine (Node.js Express, port 3001)  ← 제거 대상
    └── python infer_worker.py (subprocess)
	
Node.js Express
  → spawn python infer.py   (프로세스 간 통신)
  → stdin/stdout JSON       (직렬화 오버헤드)
  → ML 모델 cold-start      (매 요청 or Worker 패턴 필요)
```

#### FastAPI로 전환하면:

```
  aoi-console (Vite, port 5174) → npm run build → dist/
  ml-server (FastAPI, port 8000)
    ├── GET /            → dist/ 정적 서빙
    ├── POST /infer      → ml.aoi.infer 직접 호출
    ├── POST /train      → ml.aoi.train 직접 호출
    └── GET /eval        → ml.aoi.eval 직접 호출
	
FastAPI
  → import ml.infer         (동일 Python 프로세스 내)
  → 함수 호출               (직렬화 없음)
  → 모델 startup에서 로드    (cold-start 1회)
```

Node.js Worker 패턴(stdin/stdout + Promise 큐)이 해결하던 문제(cold-start 비용 제거, 동시 요청 처리)는 FastAPI의 startup 이벤트 + async 엔드포인트가 더 깔끔하게 해결한다.
Node.js Worker 패턴은 언어 장벽(JS ↔ Python) 때문에 어쩔 수 없이 붙인 다리였고, FastAPI 전환은 그 다리 자체가 필요 없어진 구조다. Python GIL의 한계는 있지만, I/O 대기 시간의 작업 전환(async)과 C++ 추론 엔진([[How to inference with sole object independent with language]])의 GIL 해제로 ML 서빙 수준의 동시성은 충분히 확보된다.

## Related
- [[Node.js Worker 패턴 - 프로세스 간 통신과 Promise 큐]] — 현재 방식, FastAPI 전환으로 대체됨
- [[Next.js와 FastAPI 기반의 BFF 포트폴리오 아키텍처]] — BFF 패턴 참조
- [[ML 개발 환경 전략 - venv vs conda vs Docker]] — Docker 전환 맥락
- [[Python의 태생적 병렬처리 한계 GIL]] — GIL 제약 원리
- [[PyTorch GIL과 GPU Starvation - CPU·GPU 병렬성의 본질]] — GPU 추론 시 GIL 해제 메커니즘
- [[병렬 처리 - CPU와 GPU의 코어 구조 차이]] — CPU/GPU 코어 구조 비교
- [[프로세스·스레드·CPU·GPU·RAM - 추론 실행 구조의 기반 개념]] — 실행 구조 기반 개념