---
created: 2026-05-08 14:00
updated: 2026-05-08 14:00
status: 2-stable
type: insight
subject: "[[AI]]"
project: "[[AOI]]"
tags:
  - aoi
  - visionpro
  - industrial-vision
  - gige-vision
  - edge-ai
  - hmi
  - deployment
publish: true
---
## 스펙트럼 구조

산업용 AOI 소프트웨어 선택지는 C++ 네이티브 → 웹 기반 HMI 방향으로 스펙트럼을 형성한다.

```
네이티브 (결정론적 타이밍, 고비용)
  VisionPro (C#/.NET + Cognex 독점 라이브러리)
  HALCON (C++/C#, MVTec)
  OpenCV C++ 직접 연동
            ↓
  Python + OpenCV (프로토타이핑 표준)
  Gradio / Streamlit (내부 ML 데모 표준)
  React + FastAPI (ML 제품 업계 현재 표준)
웹 기반 (유연성, 오픈소스)
```

## 각 옵션의 실제 트레이드오프

### VisionPro (C#/.NET)

**강점**
- 수십 년간 검증된 산업 표준. 공장 현장에서 "Cognex 써요"라고 하면 구매 결정이 빠름
- 결정론적 타이밍: Windows RT 또는 전용 하드웨어와 결합해 마이크로초 단위 타이밍 보장 가능
- GigE Vision, Camera Link, CoaXPress 등 산업 카메라 프로토콜 드라이버 내장
- Blob analysis, 패턴 매칭, 캘리브레이션 등 비전 알고리즘이 검증된 구현으로 제공됨

**약점**
- 라이선스 비용이 높음 (개발 라이선스 + 배포 라이선스 별도)
- 딥러닝 커스터마이징 제한: Cognex ViDi를 쓰거나 외부 모델을 제한된 인터페이스로 연동해야 함
- C#/.NET 생태계에 묶임 — Python ML 코드와 통합 시 별도 브리지 필요

### Gradio / Streamlit

**강점**
- Python 개발자가 5분 만에 UI 있는 ML 데모 제작 가능
- 내부 팀 데모, 모델 검증용으로 업계 표준

**약점**
- 고객 납품 제품에는 미적합: UI 커스터마이징 한계, 브랜딩 불가, 성능 한계
- 실시간 카메라 스트림 처리에 구조적 제약

### React + FastAPI

**현재 ML 제품 개발 업계 표준인 이유**
- React: 완전한 UI 커스터마이징, 고객 납품 수준 UI 가능
- FastAPI: Python이므로 ML 코드와 동일 런타임, 타입 안전성, 자동 API 문서
- 오픈소스 스택이라 라이선스 비용 없음
- Docker로 패키징하면 환경 재현 가능한 배포 단위 확보

## 핵심 개념 정리

### GigE Vision
산업용 카메라와 PC를 기가비트 이더넷으로 연결하는 표준 프로토콜(AIA 표준). USB Vision과 함께 현재 산업 카메라의 양대 표준.

- 케이블 최대 100m (USB3는 5m 이내)
- 다중 카메라를 하나의 NIC에서 관리 가능
- Python에서: `aravis` 또는 `harvesters` 라이브러리로 접근

```python
# Harvesters 예시
from harvesters.core import Harvester
h = Harvester()
h.add_file('/usr/lib/libGevTL.cti')  # GenTL 프로듀서
h.update()
ia = h.create()  # ImageAcquirer
ia.start()
buffer = ia.fetch()
```

### 결정론적 타이밍 (Deterministic Timing)
네트워크 카메라 트리거나 PLC 인터락 신호를 마이크로초 단위로 보장해야 하는 요구사항. 일반 Linux + Python은 OS 스케줄러 때문에 수 밀리초 지터가 발생한다.

- AOI에서 요구되는 경우: 고속 라인에서 스트로브 조명 + 카메라 트리거 동기화
- 렌즈 성형 공정처럼 단건 검사(사이클 완료 후 추론) 방식이면 결정론적 타이밍 불필요

### GIL과 GPU Starvation
Python의 GIL(Global Interpreter Lock)은 CPU-bound 연산을 다중 스레드로 병렬화하지 못하게 막는다. 단, GPU 연산(PyTorch CUDA 호출)은 GIL 밖에서 실행되므로, 이미지 전처리(CPU)와 모델 추론(GPU)을 분리하면 실질적인 병렬성 확보 가능.

## 현업 배포 패턴: Edge PC 독립 실행

LMR AOI 프로젝트가 채택한 패턴과 그 이유:

```
공장 Edge PC (인터넷 연결 없음)
  ├── FastAPI 서버 (추론 + UI 서빙)
  ├── 학습된 PatchCore 모델 (로컬 파일)
  ├── SQLite (이력 데이터)
  └── React UI (dist/ 빌드 결과물)

클라우드 (선택적, 연결 시에만)
  └── 모델 재학습 / 원격 모니터링
```

**이 패턴을 선택하는 이유**
1. 공장 OT망은 외부 인터넷 연결을 기피하거나 금지함 (보안 정책)
2. 네트워크 장애 시에도 생산 라인이 멈추면 안 됨 (가용성)
3. 이미지 전송 레이턴시 없이 로컬에서 즉시 추론 가능 (실시간성)

**클라우드를 쓰는 경우**
클라우드는 실시간 추론이 아닌 모델 재학습(야간 배치), 원격 모니터링, 펌웨어 업데이트 경로로만 사용. 이 경우에도 Edge PC가 먼저 VPN 터널을 열고 클라우드에 접속하는 방식 (클라우드가 공장 네트워크에 직접 접근하지 않음).

## 관련 노트

- [[Edge AI 배포 전략 - Docker vs 모델 파일]] — 고사양/저사양 PC별 배포 전략
- [[EdgeAI LMR - 배포 아키텍처]] — LMR 프로젝트 배포 상세
- [[Different role among Vite React FastAPI Node.js in web application]] — FastAPI 선택 근거
- [[ML 개발 환경 전략 - venv vs conda vs Docker]] — Docker ML 환경
