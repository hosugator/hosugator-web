# API 분리
## 개요
### 기존
request: 사진 + 사용자 입력 정보 response: llm 일기 
### 수정
- request: 사진 response: blip 결과
- request: 사용자 입력 정보 + blip 결과 response: llm 일기 + 단어 태그 리스트
