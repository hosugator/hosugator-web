---
created: 2026-04-30 09:15
updated: 2026-04-30 09:15
status: 1-draft
type: insight
subject: "[[AI]]"
project: "[[Edge AI LMR]]"
tags:
  - python
  - conda
  - venv
  - docker
  - ml
  - dev-environment
publish: true
---
## 다섯 도구의 역할 정의

| 도구        | 레이어    | 역할                                        | Docker 안에서   |
| --------- | ------ | ----------------------------------------- | ------------ |
| **pip**   | 패키지    | Python 패키지 설치 (PyPI)                      | 그대로 사용       |
| **venv**  | 환경 격리  | Python 격리 공간 생성 (pip 전용)                  | 불필요 (컨테이너가 격리) |
| **conda** | 환경+패키지 | Python 버전 + 비Python 의존성(CUDA, cuDNN) 통합 관리 | 불필요 (이미지가 담당) |
| **npm**   | 패키지    | JS 패키지 설치 (pip의 JS 버전)                    | 그대로 사용       |
| **Docker** | OS 레이어 | OS 환경 전체 격리 및 패키징                         | -            |

## Docker 안에서 각 도구의 역할 재분배

Docker를 쓰면 conda와 venv가 하던 일을 Docker가 가져간다.

```
conda가 하던 일          Docker에서 담당
────────────────────────────────────────
환경 격리            →  컨테이너 자체
Python 버전 관리     →  FROM python:3.11
CUDA/cuDNN 설치     →  FROM nvidia/cuda:12.1
패키지 설치          →  pip (여전히 사용)
```

npm은 JS 패키지 도구이므로 Docker가 대체할 수 없다. Docker 안에서도 그대로 쓴다.

```dockerfile
# ML 서비스: conda 없이 Docker만으로
FROM nvidia/cuda:12.1-cudnn8-runtime-ubuntu22.04
RUN pip install -r requirements.txt   # pip은 유지

# Web 서비스: npm은 Docker 안에서 그대로
FROM node:20
RUN npm install                        # npm은 유지
```

## 세 도구의 역할 비교 (Docker 없는 환경 기준)

| 도구         | 관리 범위                                      | 설치 위치             | 적합한 상황             |
| ---------- | ------------------------------------------ | ----------------- | ------------------ |
| **venv**   | Python 패키지만                                | 프로젝트 내            | 단순한 Python 프로젝트    |
| **conda**  | Python 버전 + non-Python 의존성(CUDA, cuDNN 포함) | ~/miniconda3 (표준) | CUDA 버전 관리가 필요한 ML |
| **Docker** | OS 포함 전체 환경                                | 컨테이너              | 팀 공유, 배포           |

## conda는 /home 아래 설치가 표준

Miniconda 공식 설치 기본 경로는 `~/miniconda3`이다. `/opt/conda` 같은 전역 경로는 서버에서 여러 사용자가 공유할 때 쓴다. 개인 개발 머신에서는 `/home` 아래 설치가 정석이며 시스템 충돌 없다.

```bash
# Miniconda 설치 시 기본 제안 경로
/home/username/miniconda3   ← 그대로 사용하면 됨
```

## conda가 venv보다 나은 상황

pip으로는 CUDA, cuDNN 같은 non-Python 의존성을 제대로 관리하기 어렵다. conda는 이를 통합 관리한다.

```bash
conda create -n ml python=3.11
conda activate ml
conda install pytorch torchvision pytorch-cuda=12.1 -c pytorch -c nvidia
```

CUDA 버전이 여러 개 필요하거나, 프로젝트마다 다른 Python 버전을 사용해야 할 때 conda가 venv보다 훨씬 편하다.

## 전형적인 ML 워크플로우

```
1. 로컬 개발 (conda/venv)
   → 빠른 실험, 파라미터 튜닝, 디버깅
   → 이미지 재빌드 없이 즉시 실행

2. 환경 안정화
   → requirements.txt / environment.yml 정리
   → Dockerfile 작성

3. Docker로 전환
   → 팀원과 환경 공유
   → CI/CD 파이프라인 연결
   → 배포
```

## 언제 각 도구를 도입하는가

```
Docker 없이 혼자 개발     → venv(단순) or conda(CUDA 필요 시)
Docker 도입 시            → venv/conda 불필요, pip/npm만 유지
처음부터 Docker로 개발    → Linux 네이티브 환경에서 권장
```

**Linux 네이티브에서는 처음부터 Docker로 통일하는 게 합리적.** GPU 패스스루가 WSL2보다 훨씬 단순하고, dev=prod 환경 일치가 보장된다.

```bash
# Ubuntu에서 GPU 패스스루 설정 (한 번만)
sudo apt install nvidia-container-toolkit

# docker-compose.yml에서
deploy:
  resources:
    reservations:
      devices:
        - capabilities: [gpu]
```

볼륨 마운트로 코드 변경 시 재빌드 없이 즉시 반영되므로 개발 속도 손실도 없다.

## succeeding
[[Volume mount makes docker image reuse without rebuild]]
[[Edge AI 배포 전략 - Docker vs 모델 파일]]
