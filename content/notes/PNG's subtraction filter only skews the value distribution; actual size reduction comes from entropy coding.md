---
created: 2026-07-27
updated: 2026-08-03
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[AOI]]"
tags:
  - png
  - compression
  - deflate
publish: true
---
## Context
"PNG가 뺄셈으로 기준값과의 차이만 저장해 비트수를 줄인다"고 이해했다가, 필터링 단계와 실제 압축 단계가 분리되어 있다는 걸 확인하며 정정했다.

## Insight
### PNG는 예측(뺄셈)과 압축(허프만)을 분리된 두 단계로 처리한다

Sub/Up/Average/Paeth 필터는 각 픽셀을 이웃(왼쪽/위쪽)과의 차이로 바꿔치기해 값을 0 근처로 쏠리게 만든다. 
이 단계 자체는 바이트 수를 전혀 줄이지 않는다 — mod 256 연산이라 결과는 여전히 1바이트다. 
실제 크기 축소는 그다음 DEFLATE(허프만 코딩)이, 쏠린 분포를 이용해 자주 나오는 값(0 근처)에 짧은 코드를 배정하면서 일어난다.

### 필터는 줄(scanline) 단위로 하나만 선택되며, 여러 이웃 참조가 있어도 필터 자체는 하나다

Average/Paeth가 왼쪽과 위쪽을 동시에 참조하는 건 "필터 두 개를 합성"하는 게 아니라 하나의 공식 안에 참조가 두 개 들어가는 것뿐이다. 
인코더는 줄마다 5개 필터 후보를 다 계산해보고 압축에 가장 유리한 것 하나만 채택한다.

### 경계 조건: 존재하지 않는 이웃은 0으로 취급한다

(0행, 0열) 픽셀만 왼쪽·위쪽이 둘 다 없어 항상 원본값 그대로 저장된다. 
그 외 1열 픽셀들은 위쪽 이웃이 존재할 수 있어서(1행이 아닌 한), 그 줄이 어떤 필터를 쓰느냐에 따라 원본값일 수도 차이값일 수도 있다.

### 이 "전처리와 압축의 분리" 구조는 RAID의 XOR 패리티와 근본적으로 다른 목적을 갖는다

RAID의 XOR 패리티는 정정을 위한 순수 오버헤드라 애초에 압축이 아니다 — 원본 A, B, C는 그대로 저장되고 패리티가 용량 위에 추가된다.
반면 PNG의 뺄셈은 압축을 돕기 위한 전처리이고, 실제 압축은 뒤따르는 허프만 코딩이 담당한다.
둘 다 "차이를 저장한다"는 표면은 같지만, 하나는 복구용 여분 추가, 하나는 압축을 위한 분포 조정이라는 전혀 다른 목적을 갖는다.

## Related
- [[Bit-pattern equality ignores magnitude, so numeric proximity needs subtraction instead of XOR]] — 이 노트가 다루는 필터링이 애초에 뺄셈을 쓰는 이유
- [[Erasure coding overhead trades usable capacity for failure tolerance, and shrinks as the parity set grows]] — 압축이 아닌 순수 오버헤드 사례와의 대비
