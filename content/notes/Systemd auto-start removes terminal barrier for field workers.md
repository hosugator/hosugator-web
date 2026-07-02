---
created: 2026-05-21
updated: 2026-05-21
type: insight
status: 2-stable
subject: "[[Automation]]"
project: "[[Edge AI LMR]]"
tags:
  - edge-ai
  - docker
  - systemd
  - deployment
  - ux
  - field
publish: true
---

## Context

현장 설비 PC에 Docker Compose 기반 ML 앱을 배포할 때, 오퍼레이터가 터미널을 모른다는 운용 제약이 생겼다.
`docker compose up` 한 줄조차 현장에서는 UX 장벽이 된다.

## Insight

### 터미널은 개발자 인터페이스다 — 현장 오퍼레이터에게 강요하면 안 된다

해결 패턴:

```
# /etc/systemd/system/aoi-app.service
[Unit]
After=docker.service

[Service]
ExecStart=docker compose -f /opt/aoi/docker-compose.yml up
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable aoi-app   # 부팅 시 자동 시작 등록
systemctl start aoi-app    # 즉시 시작
```

오퍼레이터 동선: **PC 켜기 → 브라우저 열기 (북마크)**. 터미널 없음.

### 오프라인 현장 배포 전체 흐름

```
[인터넷 되는 곳]
docker save myapp:latest | gzip > myapp.tar.gz
→ USB

[현장 PC]
docker load < myapp.tar.gz
systemctl enable aoi-app && systemctl start aoi-app
→ 이후 PC 재부팅해도 자동 복구
```

이 패턴을 쓰면 현장 운용 중 인터넷이 없어도 되고, 담당자 부재 시에도 PC 재시작만으로 서비스가 복구된다.

## 관련 노트

- [[Docker and Ansible over k3s until edge scale justifies HA overhead]] — docker save/load 배포 전략 결정 맥락
- [[Edge AI 배포 전략 - Docker vs 모델 파일]] — 배포 계층 전략 전반
