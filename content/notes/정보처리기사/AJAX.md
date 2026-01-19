---
created:
  2025-10-15 
tags: [정보처리기사, ajax, asynchronous_communication, web_technology]
reference:
  - "[[정보처리기사 - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`
# AJAX (Asynchronous JavaScript and XML)
## 정의
전체 페이지를 새로고침하지 않고 서버와 데이터를 교환하여 웹 페이지의 일부분만 비동기적으로 업데이트할 수 있게 해주는 웹 개발 기술의 집합
## 원리
AJAX는 JavaScript와 XHR 객체를 결합하여 웹 페이지의 동적인 상호작용을 가능하게 하는 기술이다.
브라우저가 가지고 있는 XMLHttpRequest 객체를 이용하여 서버와 통신한다.
전체 페이지를 새로 고치지 않고도 페이지 일부만을 위한 데이터를 로드하는 기법이다.
HTML만으로는 구현하기 어려운 다양한 작업을 웹 페이지에서 구현하여 이용자가 웹 페이지와 자유롭게 상호작용할 수 있도록 하는 기술이다.
## 질문: 웹에만 활용되는가
AJAX의 기술적 핵심은 비동기 통신이지만, 구현체인 XHR 객체 의존성으로 인해 웹 환경에서 가장 흔하게 사용된다.
### 웹 환경 의존성
일반적 사용처는 XMLHttpRequest 객체가 웹 브라우저의 내장 기능이므로, 프론트엔드(웹 페이지)와 웹 서버 간의 통신 기술로 널리 사용된다.
AJAX는 웹 페이지에서 사용자 경험(UX)을 크게 개선한 기술로 평가된다.
### 웹 외 환경 활용
AJAX의 개념인 비동기 HTTP 통신은 웹 환경에 한정되지 않는다.
서버 측 JavaScript 환경인 Node.js에서는 axios나 fetch API 같은 모듈을 사용하여 웹과 동일한 비동기 HTTP 통신을 수행한다.
웹 기술 기반의 모바일 앱이나 데스크톱 앱에서도 내부적으로 브라우저 엔진을 포함하여 이와 유사한 비동기 통신 기술이 활용된다.
