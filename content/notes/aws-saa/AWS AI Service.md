---
created: 2026-01-23
tags:
  - aws
  - ai
  - ml
  - cloud
---
# AWS AI Service

## 본질 (Essence)
전문적인 머신러닝 지식 없이도 API 호출만으로 시각, 음성, 언어 분석 기능을 애플리케이션에 즉시 도입할 수 있는 도구 모음.

## 구조 (Mechanism)
- **Amazon Transcribe (귀)**: 음성을 텍스트로 변환 (Speech-to-Text). 속기사처럼 녹음된 파일이나 실시간 음성을 글로 기록함.
- **Amazon Translate (번역기)**: 텍스트를 다른 언어로 번역. 다국어 서비스 대응을 위한 핵심 도구.
- **Amazon Comprehend (머리)**: 텍스트 속의 감정, 주요 구문, 개체명을 분석 (Natural Language Processing). 문맥을 '이해'하는 단계.
- **Amazon Polly (입)**: 텍스트를 자연스러운 음성으로 변환 (Text-to-Speech). 텍스트를 읽어주는 '앵무새(Parrot)' 역할.
- **Amazon Lex (대화)**: 대화형 인터페이스(챗봇) 구축. Alexa의 심장으로, 사용자의 의도를 파악하여 대화를 이어감.
- **Amazon Rekognition (눈)**: 이미지 및 비디오에서 객체, 사람, 텍스트, 장면 등을 인식하고 분석.

## 확장 (Connection)
- **연결**: Transcribe(듣기) -> Translate(번역) -> Comprehend(분석) -> Polly(말하기) 순으로 조합하여 인간의 소통 과정을 자동화 가능.
- **응용**: 고객 콜센터 녹음본을 분석하여 상담 만족도를 자동 리포트하거나, 외국어 뉴스 영상을 실시간 자막화하고 번역하는 파이프라인 구축.

---
See Also: 
- 