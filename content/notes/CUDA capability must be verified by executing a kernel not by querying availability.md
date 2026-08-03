---
created: 2026-07-27
updated: 2026-08-03
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - cuda
  - pytorch
  - gpu
  - error-handling
publish: true
---
## Context
MLA 검사기를 RTX 5070 Laptop(Blackwell, CC 12.0)이 달린 PC에서 돌렸다. `requirements.txt`는 `torch==2.12.1+cu126`으로 고정되어 있었다. 학습을 시작하면 죽는데, 사전 점검 코드는 GPU가 정상이라고 보고했다.

## Insight
### `torch.cuda.is_available()`은 드라이버 연결만 확인하고 커널 존재는 확인하지 않는다

```
torch.cuda.is_available()          → True
torch.cuda.get_arch_list()         → [sm_50 ... sm_90]     휠에 컴파일된 아키텍처
torch.cuda.get_device_capability() → (12, 0) = sm_120      이 GPU가 요구하는 아키텍처
x @ x on cuda                      → AcceleratorError: no kernel image is available
```

`is_available()`이 검사하는 것은 "CUDA 드라이버·런타임이 붙었나"다. 설치된 휠에 이 GPU용 커널 바이너리가 들어있는지는 검사 범위 밖이다. 그래서 `True`를 받고 학습을 시작한 뒤 첫 텐서 연산에서 죽는다.
torch는 첫 CUDA 초기화 시 stderr로 경고를 뱉지만 예외가 아니라 경고이고, GUI 앱에서는 stderr가 사용자에게 도달하지 않는다.

### 판정을 arch 문자열 비교에만 맡기면 안 되고, 실제 커널을 돌려야 한다

`sm_120 in arch_list` 비교는 로그 메시지를 만드는 데는 필요하지만 최종 판정 근거로는 부족하다. PTX JIT 같은 전방 호환 경로가 있어 문자열 비교와 실제 실행 가능성이 어긋날 수 있다. 그래서 2단계 구조가 맞다.

1. arch 비교 — 왜 못 쓰는지를 사람이 읽을 문장으로 만든다
2. 실제 연산 — 최종 판정

### CUDA 오류는 비동기라 동기화 지점까지 가야 예외가 잡힌다

```python
probe = torch.zeros(8, 8, device="cuda")
(probe @ probe).sum().item()    # ← .item() 이 동기화 지점. 이게 없으면 try가 못 잡는다
```

커널 실행은 비동기로 큐잉되므로, 실패가 그 줄에서 보고되지 않고 나중의 엉뚱한 API 호출에서 터진다. 결과를 CPU로 가져오는 호출(`.item()`, `.cpu()`) 또는 `torch.cuda.synchronize()`까지 해야 `try` 블록 안에서 예외가 발생한다. 스모크 테스트를 쓰면서 동기화를 빼면 테스트가 항상 통과한다.

### 이건 플랫폼 문제가 아니라 휠 빌드와 GPU 세대의 문제다

리눅스 이식 작업 중에 발견했지만 Windows에서도 동일하게 재현된다. 혼동하기 쉬운 지점이다 — 이식 중 발견한 버그를 이식 탓으로 귀속시키면 잘못된 결론에 도달한다.

## Related
- [[Defensive error handling converts porting bugs into silent feature loss]] — 같은 이식 작업에서 나온 무증상 실패 계보
- [[Deployment size is decided by what gets linked not by the implementation language]] — GPU 아키텍처별 커널이 배포 용량을 지배하는 이유
- [[GPU 추론 최적화 개념 지도 - 커널 퓨전·JIT·ONNX]] — 커널·JIT 개념 배경
