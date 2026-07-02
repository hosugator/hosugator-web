---
created: 2026-06-25
updated: 2026-06-25
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Align AI]]"
tags:
  - python
  - packaging
  - pypi
  - pip
  - devtools
publish: true
---
## Context
Next.js 학습 중 `package.json`과 `pyproject.toml`을 비교하다가 PyPI 배포 개념이 처음으로 명확해졌다. align-ai는 서비스이므로 `pyproject.toml`이 필요하지 않다는 판단까지 이어졌다.

## Insight
### PyPI는 Python 패키지의 공개 저장소다

```
pip install numpy  →  PyPI에서 numpy 다운로드 → 설치
```

npmjs.com : npm = PyPI : pip 관계다.

### requirements.txt와 pyproject.toml은 같은 계층이지만 용도가 다르다

```
Dockerfile              →   OS + 런타임 + 패키지 설치 방법
  └── requirements.txt  →   패키지 목록만
  └── pyproject.toml    →   패키지 목록 + 빌드 설정 + 메타데이터
```

| 항목 | requirements.txt | pyproject.toml |
|---|---|---|
| 의존성 목록 | O | O |
| 빌드 설정 | X | O |
| 메타데이터 (이름·버전·설명) | X | O |
| PyPI 배포 | 불가 | 가능 |

### pyproject.toml은 pip install로 설치 가능한 패키지를 만들 때 필요하다

`pip install align-ai`가 가능하려면 PyPI 등록 + pyproject.toml의 메타데이터·빌드 설정이 필요하다. 이는 git clone을 대체하는 배포 방식이다:

```
개발자용   →   git clone + pip install -r requirements.txt
사용자용   →   pip install align-ai  (소스코드 불필요)
```

### 라이브러리와 서비스는 배포 방식이 다르다

| 종류 | 예시 | 배포 방식 |
|---|---|---|
| 라이브러리 | numpy, FastAPI | pip install (PyPI) |
| 서비스/앱 | align-ai 추론 서버 | docker pull 또는 git clone |

서비스는 소스코드 전체와 실행 환경이 필요하므로 Docker image가 배포 표준이다. pyproject.toml이 필요한 순간은 없다.

## Related
- [[PyTorch wheel bundles CUDA runtime making python slim base sufficient for GPU training containers]] — wheel 패키지 구조
