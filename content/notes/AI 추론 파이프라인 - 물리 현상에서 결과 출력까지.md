---
created: 2026-04-22
updated: 2026-04-22
type: insight
status: 1-draft
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - machine-learning
  - inference
  - edge-ai
  - pipeline
  - mlops
publish: true
---

## 핵심 원칙

모델 추론은 "정상 패턴을 학습한 가중치 행렬에 데이터를 통과시켜 숫자를 얻는 것"이다.  
파이프라인은 물리 현상 → 전기 신호 → 디지털 데이터 → 전처리 → 추론 → 시각화의 단계로 구성된다.

---

## 단계별 파이프라인

| 단계 | 역할 | 주요 언어/기술 |
|------|------|-------------|
| 물리 → 전기 | 센서·트랜스듀서가 온도·압력을 전압으로 변환 | 하드웨어 (언어 없음) |
| 전기 → 디지털 | PLC·MCU의 ADC가 전압을 숫자로 변환, 산업 프로토콜로 전달 | C, C++, 래더 다이어그램 |
| 수집 → DB | 폴링 데몬이 PLC에서 데이터를 받아 DB에 저장 | Python, Go, Rust |
| 전처리 | DB 데이터를 모델 입력 형태로 변환 (정규화, 특징 추출) | Python, C++ |
| 추론 | 학습된 모델에 전처리 데이터를 넣어 숫자 결과를 얻음 | C++, ONNX Runtime |
| 시각화 | 숫자 결과를 사람이 읽을 수 있는 UI로 표현 | React/TypeScript, Qt |

---

## 추론 단계의 실체

```python
session = ort.InferenceSession("model.onnx")   # 파일 → 메모리 객체 (1회)
result = session.run(None, {"input": data})     # 추론 (매 사이클)
score = result[0][0]                            # 결과: 그냥 숫자
```

모델이 아무리 복잡해도 호출하는 쪽에서 보이는 인터페이스는 동일하다.

---

## 관련 노트

- [[학습된 모델의 직렬화와 역직렬화]] — 모델 파일이 만들어지고 불러지는 원리
- [[How to inference with sole object independent with language]] — 엣지 환경에서 Python 없이 추론하는 구조
