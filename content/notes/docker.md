---
created: 2026-02-10
updated: 2026-02-10
type: insight
status: 1-draft
subject: "[[Infra]]"
project: "[[Hosugator Web]]"
tags:
  - category
  - keyword
publish: true
---
## Docker & Docker Compose (도커)
오늘의 역할: '독립적인 이사 박스' (Containerization)
이전 ECS 환경에서는 AWS가 이 박스들을 관리해 줬다면, 오늘은 승완 님의 EC2 안에서 직접 이 박스들을 쌓아 올렸습니다.
- 환경 격리: cureat-api와 nginx-proxy가 서로 다른 방(컨테이너)에서 돌게 하여, 한쪽의 설정이 꼬여도 다른 쪽에 영향을 주지 않게 격리했습니다.
- 오케스트레이션 (Compose): docker-compose.yml이라는 설계도 한 장으로 Nginx와 API 서버를 동시에 띄우고, 둘 사이에 가상의 네트워크 주소(예: http://cureat-api:80)로 서로 통신할 수 있는 길을 열어주었습니다.
- 볼륨 마운트: 서버(EC2)에 있는 인증서 파일을 컨테이너 안으로 쓱 밀어 넣어주는(Volumes) 연결 고리 역할을 했습니다.