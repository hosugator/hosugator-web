---
created: 2026-05-29
updated: 2026-05-29
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Align AI]]"
tags:
  - numpy
  - opencv
  - coordinate
  - image-processing
publish: true
---

## Context

predict.py 쉐도잉 중 `pts[:, 1]`이 왜 x(열)이고 `pts[:, 0]`이 왜 y(행)인지 헷갈렸다. "열은 세로 줄인데 왜 x냐"는 의문에서 출발해 표 구조로 이해하고 나서 처음 명확해졌다.

## Insight

### 좌표계를 표로 생각하면 x=열, y=행이 직관적으로 이해된다

```
     열0  열1  열2  열3   ← 열 번호가 좌우(가로)로 증가
행0 [  ,    ,    ,    ]
행1 [  ,    ,    ,    ]
행2 [  ,    ,    ,    ]
↑
행 번호가 위아래(세로)로 증가
```

- x가 증가한다 = 오른쪽으로 이동 = 열 번호가 증가 → **x = 열(column)**
- y가 증가한다 = 아래로 이동 = 행 번호가 증가 → **y = 행(row)**

"열"이라는 단어는 세로 줄을 가리키지만, 열 번호는 가로 방향으로 증가한다. 단어와 증가 방향이 직교해서 직관과 어긋나는 게 혼란의 원인이다.

### numpy와 OpenCV는 인덱스 순서가 반대라서 버그가 생긴다

numpy는 배열을 `[행, 열]` = `[y, x]` 순으로 인덱싱하고, OpenCV는 화면 좌표계 `(x, y)` = `(열, 행)` 순을 따른다.

```python
image[y, x]              # numpy: 행 먼저
cv2.line(img, (x, y), …) # OpenCV: x 먼저
```

둘을 섞어 쓸 때 순서를 바꾸지 않으면 가로/세로가 뒤집히는 버그가 발생한다. 컴퓨터 비전 코드에서 흔한 실수다.

## Related

- [[Two-argument iter with sentinel reads large files without loading them into memory]] — 같은 predict.py 쉐도잉 세션
