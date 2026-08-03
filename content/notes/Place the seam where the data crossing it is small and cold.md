---
created: 2026-07-29
updated: 2026-07-29
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - architecture
  - decomposition
  - latency
publish: true
---
## Context
검사 프로그램을 분리하는 방안을 검토하면서 후보가 여러 개 나왔다 — UI/서버, 학습/추론, 추론/제어. 기능 이름으로 자르려니 어느 것이 맞는지 판단 기준이 없었다.

## Insight
### 경계는 기능 이름이 아니라 지나는 데이터의 양과 온도로 정한다

프로세스나 기계를 나누면 그 경계에 직렬화·전송·장애 가능성이 생긴다. **그 비용은 경계를 지나는 데이터가 결정한다.**

```
양   한 번에 얼마나 큰가        → 대역폭·지연
온도 얼마나 자주 지나는가       → 위 비용이 곱해지는 횟수
```

이 프로젝트의 데이터 흐름에 대입하면 답이 하나로 좁혀진다.

| 경계 후보 | 지나는 데이터 | 양 | 온도 | 판정 |
|---|---|---|---|---|
| 카메라 ↔ 추론 | 프레임 | 수 MB | 매 사이클 | **자르면 안 됨** |
| UI ↔ 엔진 | 프레임 + 화면 갱신 | 큼 | 뜨거움 | 자르면 안 됨 |
| **학습 ↔ 추론** | **모델 산출물(ONNX)** | 수십 MB | **며칠에 한 번** | **자르기 좋음** |

**작고 차가운 경계가 하나뿐이고 그게 ONNX다.** 그리고 이미 그렇게 설계돼 있었다 — 학습이 ONNX를 내보내고 추론이 그것을 읽는다.

### 기능 이름으로 자르면 비용이 안 보인다

"UI/서버 분리"는 웹 서비스에서 표준이라 자연스럽게 후보가 된다. 그런데 여기서는 프레임이 그 경계를 지난다.

```
UI/서버 분리   검사 경로에 네트워크가 끼어든다
               → 매 사이클 수 MB 전송
               → 링크 장애 = 라인 정지 (새 장애 모드)
               → 얻는 것: Qt UI 는 여전히 네이티브라 봉인도 안 된다
```

**같은 "분리"라는 단어가 전혀 다른 비용을 가린다.** 데이터로 보면 즉시 갈린다.

### 제약이 반대인 것끼리 자르면 각자 맞는 도구를 쓸 수 있다

경계를 잘 놓으면 양쪽이 서로 다른 요건을 가질 수 있게 된다. 이게 분리의 실질적 이득이다.

| | 검사(추론) | 학습 |
|---|---|---|
| 지연 | 사이클에 묶임 | 무관 |
| 가용성 | 끊기면 라인 정지 | 재시도하면 됨 |
| 하드웨어 결합 | 카메라·시리얼 | 없음 (파일 in, 파일 out) |
| 실행 주체 | 무인 상시 | 사람이 시작 |

**요건이 정반대라 같은 배포 전략을 강요할 이유가 없다.** 학습은 이미지로 봉인하고 추론은 네이티브로 두는 결정이 여기서 나온다([[Sealing moves uncertainty into lifecycle management so its net gain depends on change frequency]]).

반대로 카메라와 추론은 프레임을 공유하고 지연 예산도 공유하므로 **같은 프로세스에 두는 것이 옳다.** 기능이 달라도 제약이 같으면 붙여둔다.

### 무거운 의존성은 경계를 넘어 따라간다

분리의 부수 효과가 크다. 무거운 것들이 어느 쪽에 붙어 있는지 보면 된다.

```
학습 쪽    torch, CUDA, cuDNN          →  전체 배포물의 대부분
추론 쪽    onnxruntime, numpy           →  훨씬 작다
```

**경계를 옮기면 배포물 크기가 따라 움직인다** — 이 프로젝트에서 측정한 값은 7.1GB → 279MB였다([[Deployment size is decided by what gets linked not by the implementation language]]).

즉 경계 설계는 지연·가용성만의 문제가 아니라 **배포 표면의 크기를 정하는 결정**이기도 하다.

## Decision
**경계는 ONNX 하나로 두고, 추론과 제어를 다시 나누지 않는다.**

- 카메라 제어와 추론은 프레임을 공유하므로 한 덩어리로 유지한다
- 학습은 ONNX를 산출물로 넘기는 지점에서 분리한다
- UI/엔진 분리는 하지 않는다 — 프레임이 지나고, Qt UI 는 어차피 네이티브로 남아 얻는 것이 없다

**전환 조건**: 프레임을 압축하거나 관심 영역만 보내는 식으로 경계 통과 데이터를 줄일 수 있다면 추론 분리가 후보가 된다. 사이클 타임 예산을 측정하지 않았으므로 지금은 판단 근거가 없다.

## Related
- [[Sealing moves uncertainty into lifecycle management so its net gain depends on change frequency]] — 경계 양쪽에 다른 배포 전략을 쓸 수 있게 되는 이유
- [[Deployment size is decided by what gets linked not by the implementation language]] — 경계 위치가 배포물 크기를 정한다
- [[Orchestrator autonomy conflicts with equipment control so equipment PCs stay clients]] — 설비 쪽 제약이 왜 특별한가
- [[Data Tiering]] — 뜨거운/차가운 데이터로 배치를 정하는 같은 발상
- [[Event loops remove waiting threads not computing threads]] — 비용이 어디서 발생하는지 데이터로 보는 접근
