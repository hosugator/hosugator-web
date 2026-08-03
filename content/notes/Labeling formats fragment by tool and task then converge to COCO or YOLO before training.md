---
created: 2026-07-22
updated: 2026-07-22
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[AOI]]"
tags:
  - labeling
  - annotation
  - labelme
  - coco
  - yolo
  - data-format
publish: true
---
## Context
DTK-SKKU AOI 라벨링 핸드오프 논의 중 "라벨링 결과 포맷이 표준적으로 어떤 식이냐"는 질문에서 시작했다.
align-ai 프로젝트에서 `labelme`로 line 라벨링을 해본 경험(`P1_LT_V_Fail_Big_1_..._.json`, `shape_type: "line"`)을 기준점으로 삼아, 이게 업계 표준인지 여러 형식 중 하나인지를 확인하는 과정에서 정리됐다.

## Insight
### 라벨링 결과 포맷에는 업계 전체를 관통하는 단일 표준이 없다

포맷은 크게 "어떤 도구로 라벨링했나"와 "어떤 태스크(분류/디텍션/세그멘테이션)인가" 두 축으로 갈라진다.

| 포맷 | 태스크 | 특징 |
|---|---|---|
| labelme JSON | 폴리곤/마스크 세그멘테이션, 라인/포인트 | labelme 전용, 이미지 1장당 JSON 1개 |
| COCO JSON | 디텍션·세그멘테이션(polygon/RLE) | 데이터셋 전체가 파일 하나에 통합, 학계·프레임워크에서 사실상 가장 널리 쓰임 |
| YOLO txt | 바운딩박스 디텍션 | 이미지 1장당 txt 1개, `class x_center y_center w h` 정규화 좌표 |
| Pascal VOC XML | 바운딩박스 디텍션 | 이미지 1장당 XML 1개, 구식이지만 여전히 쓰임 |
| CVAT XML/JSON | 다양 | CVAT 자체 포맷, COCO/YOLO로 export 가능 |
| PNG 마스크 페어 | 세그멘테이션 | 원본과 동일 크기의 흑백 PNG를 파일명으로 매칭 — 포맷이라 부르기도 민망할 만큼 단순 |

`labelme` JSON은 "labelme라는 특정 도구의 자체 포맷"일 뿐, 표준의 지위를 가진 게 아니다.

### 실무 흐름은 "도구별 자체 포맷 → 학습 직전 프레임워크 표준으로 변환"이다

라벨링 툴(labelme, CVAT, Roboflow 등)로는 각 도구의 자체 포맷으로 작업하고, 실제 모델 학습 파이프라인에 넣기 직전에 COCO나 YOLO로 변환(export)하는 게 일반적인 흐름이다.
즉 labelme JSON은 "라벨링 작업의 중간 산출물"에 가깝고, 최종적으로 학습에 쓰이는 포맷은 대부분 COCO/YOLO다.
labelme가 공식 변환 스크립트(`labelme2coco`)를 제공한다는 사실 자체가 이 위계를 보여준다.

### base64 마스크 인코딩은 "전체 이미지"가 아니라 "bbox로 자른 국소 비트맵"이다

labelme의 `mask` shape_type을 처음 보면 "이미지 전체 픽셀 값을 인코딩한다"고 오해하기 쉽지만, 실제로는:

- `points` 필드에 바운딩박스 좌상단/우하단 2점만 담고
- `mask` 필드에는 그 bbox 크기만큼만 잘라낸 국소 비트맵을 담는다 — 결함 영역 bbox 안쪽만, 이미지 전체가 아니다.

인코딩은 서로 다른 두 단계의 합성이다: 

- (1) 국소 비트맵을 PNG로 무손실 압축 — 마스크는 단색 영역이 많아 압축률이 매우 높고, 실질적 용량 절감은 이 단계에서 일어남 
- (2) PNG의 바이너리 바이트열을 JSON 문자열 필드에 넣기 위해 base64로 텍스트 변환. 

base64 자체는 압축이 아니라 "바이너리를 텍스트로 안전하게 표현하는 인코딩"이며, 3바이트(24비트)를 4개의 base64 문자(6비트씩)로 매핑하므로 오히려 원본보다 약 33% 커진다.
압축은 base64 이전 단계에서 이미 끝나 있다 — 두 단계를 하나로 뭉뚱그리면 "인코딩이 압축도 해준다"는 착각에 빠지기 쉽다.

## Decision
### 20260722
SKKU의 포맷 안내를 기다리는 대신, 먼저 이메일로 

(1) 정확한 라벨 스키마 
(2) SKKU 측 기존 라벨링 툴 존재 여부 — 있으면 동일 툴 사용해 변환 과정 자체를 없애고, 없으면 위 labelme 전략 유지 
(3) 학습/추론 최소 하드웨어 사양을 함께 요청하기로 결정.

이유: DTK 실제 데이터 송부가 8월 초로 예정되어 있어, 포맷/도구 안내가 7월 말을 넘기면 라벨링 착수 자체가 지연된다 — 데드라인을 명시해 선제 요청. 메일 기록: `docs/skku/logs/20260722_skku-aoi-labeling-format-request.md`(레포).

## Related
- [[SKKU AOI 1st technical meeting 20260710 raw transcript]] — 이 질문이 나온 원 회의
- [[VDG augmentation collapses per-image labeling into ten representative samples per category]] — 같은 회의에서 나온 라벨링 분업 결정, 이 노트의 포맷 논의가 그 실행 단계에 해당
- [[Annotation time benchmarks by supervision type]] — 같은 AOI 라벨링 논의에서 나온 유형별 소요 시간 벤치마크, 포맷 선택이 실제 공수와 어떻게 맞물리는지의 배경
- [[Segmentation position extraction separates mask post-processing from coordinate representation]] — align-ai에서 마스크 후처리·좌표 표현을 다룬 선행 학습, mask 데이터 구조에 대한 이해가 이어짐
