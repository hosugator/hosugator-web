---
created: 2026-07-27
updated: 2026-07-27
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[AOI]]"
tags:
  - xor
  - compression
  - png
publish: true
---
## Context
PNG가 XOR 기반 압축 방식인지 질문하다가, XOR과 뺄셈이 "차이"라는 같은 말을 쓰지만 서로 다른 성질을 포착하는 연산이라는 걸 확인했다.

## Insight
### XOR은 "비트 패턴이 같은가"만 보고, 값이 수치적으로 얼마나 가까운지는 못 본다

127(`01111111`)과 128(`10000000`)은 값으로는 1 차이인데, XOR하면 `11111111` — 전체 비트가 다 다르게 나온다. 이진수 표현은 값의 크기를 자리올림으로 인코딩하기 때문에, 값이 인접해도 비트 패턴은 완전히 갈릴 수 있다.

### 뺄셈은 수치적 근접성을 그대로 보존한다

`128 - 127 = 1`처럼, 값이 가까우면 결과도 작다. 인접 픽셀처럼 "값이 비슷할 가능성이 높은 데이터"에 뺄셈을 적용하면 그 근접성이 작은 결과값으로 그대로 드러난다.

### 판단 기준은 "이 데이터에 크기·순서가 의미 있는가"다

- 의미 없음 (저장소 블록, 암호 키, 범주형 선택) → 같음/다름만 중요 → XOR
- 의미 있음 (픽셀 밝기, 센서 수치) → 근접성이 중요 → 뺄셈

## Related
- [[XOR's invertibility comes from flipping any single input always flipping the output]] — XOR이 확보하는 성질(가역성)과 이 노트가 다루는 성질(크기 반영 불가)의 트레이드오프
- [[PNG's subtraction filter only skews the value distribution; actual size reduction comes from entropy coding]] — 이 뺄셈 원리가 실제 이미지 압축에 적용되는 방식
