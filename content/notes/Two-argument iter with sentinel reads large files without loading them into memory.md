---
created: 2026-05-28
updated: 2026-05-28
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Align AI]]"
tags:
  - python
  - file-io
  - memory
  - pattern
publish: true
---

## Context

align-ai `predict.py` 코드 쉐도잉 중 `_md5()` 함수에서 처음 만난 패턴. 모델 파일(.pth)의 해시를 계산하기 위해 파일을 통째로 읽지 않고 청크 단위로 나눠 읽는 구조였다.

## Insight

### `iter(callable, sentinel)` 는 파일을 청크 단위로 읽는 표준 패턴이다

```python
for chunk in iter(lambda: f.read(65536), b""):
    h.update(chunk)
```

- `iter(callable, sentinel)` — callable을 반복 호출하다가 반환값이 sentinel과 같아지면 멈춘다.
- `lambda: f.read(65536)` — 호출할 때마다 파일에서 64KB씩 읽는다.
- `b""` — 파일 끝에 도달하면 `f.read()`가 빈 bytes를 반환하는데, 이것이 sentinel.

### 청크 단위 읽기는 메모리 사용량을 파일 크기와 무관하게 만든다

```python
f.read()          # 100MB 파일 → 100MB 전부 메모리에 올라옴
f.read(65536)     # 64KB만 메모리에 올라옴, 반복해서 교체
```

해시 객체(`h`)는 청크를 먹을 때마다 내부 상태값을 갱신하고 원본을 버린다. 전체를 한 번에 넣든 조각으로 나눠 넣든 최종 해시는 동일하기 때문에, 메모리를 64KB로 고정하면서 임의 크기의 파일을 처리할 수 있다.

### `"rb"` 모드는 바이너리 파일에 필수다

텍스트 모드(`"r"`)는 줄바꿈 문자를 OS에 맞게 변환하는데, 모델 파일(.pth)처럼 raw 바이트를 그대로 읽어야 하는 경우 내용이 달라져 해시가 틀려진다.

## Related

- [[GPU parallelism accelerates matrix computation within a single inference not across inferences]] — 같은 predict.py 쉐도잉 세션에서 나온 GPU 메모리 관련 개념
