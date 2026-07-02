---
created: 2026-06-19
updated: 2026-06-19
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Align AI]]"
tags:
  - python
  - csv
  - data-structure
publish: true
---
## Context
evaluate_line_position.py 쉐도잉 중 `csv_rows`에 이미지별 결과를 누적하는 패턴을 처음 만났다. "키 이름이 같은 딕셔너리를 여러 개 만들면 어떻게 구분하냐"는 질문에서 출발.

## Insight
### 리스트 안의 딕셔너리가 파이썬에서 표 형태 데이터의 표준 구조다

```
CSV:
image,    H_detect, V_detect
image_0,  O,        X          ← 딕셔너리 1개
image_1,  O,        O          ← 딕셔너리 1개

코드:
[
    {"image": "image_0", "H_detect": "O", "V_detect": "X"},
    {"image": "image_1", "H_detect": "O", "V_detect": "O"},
]
```

- **리스트** = 행들의 묶음 (인덱스로 구분)
- **딕셔너리** = 한 행
- **키** = 열 이름 (모든 행에서 동일해야 함)
- **값** = 셀 값 (행마다 다름)

### csv.DictWriter가 이 구조를 그대로 받는다

`fieldnames`로 열 순서를 지정하고, `writerow(dict)`로 한 행씩 쓴다. `DictWriter`가 이 구조를 전제로 설계된 이유가 여기 있다.

## Related
- [[Table-driven product config eliminates scattered conditionals in ML pipelines]]