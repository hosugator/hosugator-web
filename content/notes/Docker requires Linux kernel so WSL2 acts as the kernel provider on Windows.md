---
created: 2026-06-23
updated: 2026-06-23
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - docker
  - wsl2
  - windows
  - linux
publish: true
---
## Context
WSL2 + Docker GPU 학습 구조를 검토하다 "WSL2가 꼭 필요한가, Python + PyTorch만으로 충분하지 않은가"라는 질문이 나왔다. Docker를 쓰는 경우에만 WSL2가 필요한 이유를 이해했다.

## Insight
### Docker는 Linux 커널 기능(cgroups, namespaces)에 의존한다

컨테이너는 별도 OS가 아니라 Linux 커널이 제공하는 프로세스 격리 기능을 사용한다:

- `cgroups`: CPU·메모리 등 자원 제한
- `namespaces`: 프로세스·네트워크·파일시스템 격리

### Windows에서 Docker는 WSL2를 Linux 커널 공급자로 사용한다

```
Windows
  └── WSL2 (Linux 커널 제공)
        └── Docker Engine (Linux 커널 필요)
              └── 컨테이너
```

Docker Desktop on Windows는 WSL2 백엔드를 통해 Linux 커널을 빌린다. WSL2 없이는 Windows에서 Docker Engine이 뜨지 않는다.

### WSL2가 없어도 되는 경우: Python 네이티브 실행

Docker 컨테이너를 사용하지 않고 Windows에 직접 Python + PyTorch(CUDA 빌드)를 설치하면 WSL2 없이도 GPU 학습이 가능하다. WSL2 의존성은 컨테이너화 결정에서 파생된다.

## Related
- [[WSL2 Docker GPU training makes Windows a viable gateway PC when k3s is not required]] — WSL2 + Docker GPU 학습 구조의 실용적 맥락
- [[Linux 네이티브 전환 결정 - WSL2 한계와 듀얼부팅 플랜]] — WSL2 한계 사례