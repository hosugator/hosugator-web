// data/resumeLevitVision.ts — 레브잇 [쇼포트] AI Engineer (Vision) 제출용 이력서 데이터
//
// WHY 같은 회사에 두 번째로 내면서 판을 새로 짜나
//   08-26 에 같은 PMF팀의 [쇼포트] AI Engineer(3년 이하)에 「기본 이력서」로 냈고 09-02 서류
//   불합격했다. 사유는 오지 않지만, 상한형 게이트(3년 이하)라 연차로 걸릴 자리가 아니었고
//   매칭 축(비용 최적화 RAG)도 있었다. 남는 혐의가 패키징이다 — 근거가 뒤쪽 프로젝트 줄에
//   흩어져 있어 스크리너가 찾아내야 하는 구조였다. 같은 방식으로 두 번 낼 이유가 없다.
//
// WHY 앵커가 Pic-Tag 가 아니라 V1-AOI 인가  ← 이 파일에서 가장 중요한 결정 (2026-09-02 정정)
//   초안은 Pic-Tag 의 임베딩 A/B 실험(YOLO 백본 분해, Linear/Pooling/Attention 비교)을 앵커로
//   세웠다. 공고 첫 줄과 문장 단위로 겹쳐서였다. 그런데 **그 프로젝트의 ML 엔지니어는 본인이
//   아니었다.** 남의 작업을 앵커로 세운 이력서는 서류를 통과해도 면접 첫 질문에서 무너지고,
//   그 전에 낼 수 없는 문서다. 전면 교체했다.
//
//   대체 앵커는 V1-AOI 다. 이유가 세 겹이다.
//   1) 본인이 한 일이다 (DTK 재직 중 수행)
//   2) **PatchCore 는 구조 자체가 임베딩 + 최근접 검색이다** — 사전학습 백본의 중간 특징을
//      패치 임베딩으로 뽑아 memory bank 를 만들고, 질의 패치와의 최근접 거리로 점수를 낸다.
//      coreset sampling 으로 bank 를 10% 로 줄인 것은 인덱스 크기와 정확도의 트레이드오프를
//      실제로 다뤄 본 것이다. 공고의 「Image Embedding Model」·「Retrieval 파이프라인」에
//      Pic-Tag 못지않게, 오히려 더 정확히 대응한다
//   3) **세 접근을 병렬 비교해 채택 근거를 만든 것**이 「실험하고 고도화」·「탐색 및 실험」에
//      대응한다 — PatchCore / SAM / 합성 데이터를 같은 문제에 올려 재고, 기술적으로 더 정밀한
//      SAM 이 다현장·다품종에서 재라벨링 병목을 만든다는 이유로 탈락시켰다
//
// WHY 결론이 아니라 방법을 앞세우나
//   공고가 「실험하고 고도화」·「탐색 및 실험」으로 실험을 두 번 말한다. 어떤 모델이 이겼나가
//   아니라 무엇을 재서 갈랐나가 이 팀이 사는 지점이다.
//
// 이 파일이 겨냥한 것 — 공고의 주요업무 다섯 줄이다.
//   1) Image Embedding Model 실험·고도화   → V1-AOI PatchCore memory bank + 3방식 병렬 비교
//   2) 검색 결과·사용자 행동 데이터 분석    → 지표가 태스크와 어긋난 것을 잡은 이력 (인접, 명시)
//   3) CV·Representation Learning 탐색     → 사전학습 백본 중간 특징 재사용 · U-Net · CLIP 필터
//   4) Vision·Retrieval 파이프라인 설계     → circle-crop 전처리 · ONNX CPU 추론 · 3제품 레지스트리
//   5) Problem Solver 와의 협업 검증        → AOI 산학협력 네 직군 조율 · 평가 인터페이스
//
// WHY 「대규모 인덱스」를 주장하지 않았나
//   공고의 「수천만 개 상품 이미지」가 유일한 실질 갭이다. coreset 으로 memory bank 를 줄여
//   본 것은 인덱스 축소의 사고를 다뤄 본 것이지, ANN(FAISS·HNSW) 을 수천만 규모로 운영해 본
//   것이 아니다. 붙여 쓰지 않는다.

import type { ResumeData } from "@/components/sections/ResumeTemplate";

export const RESUME_LEVIT_VISION: ResumeData = {
  back: "홈으로",
  pdf: "PDF로 저장",
  name: "홍승완",
  headline: "AI Engineer (Vision) · 접근을 고르기 전에 같은 조건에 올려 재봅니다",
  summaryLabel: "소개",
  summary:
    "표면 결함 검사를 맡았을 때 PatchCore·SAM·합성 데이터 세 접근을 같은 문제에 올려 비교했고, 기술적으로 더 정밀한 SAM이 현장에서는 재라벨링 병목을 만든다는 이유로 탈락시켰습니다. 채택한 PatchCore는 사전학습 백본의 중간 특징을 패치 임베딩으로 뽑아 memory bank를 만들고 최근접 거리로 판정하는 구조여서, 임베딩 품질과 인덱스 크기의 트레이드오프를 직접 다뤘습니다. 지표가 태스크의 진짜 질문과 어긋나는 것을 발견해 평가 기준 자체를 다시 세운 일도 여러 번 있었습니다.",
  expLabel: "경력",
  experience: [
    {
      company: "DTK",
      role: "AI Engineer",
      period: "2026.03 ~ 현재",
      items: [
        "V1-AOI (렌즈 표면 결함 탐지) — 「불량을 학습해 찾는다」를 「정상이 아닌 것을 찾는다」로 뒤집어 라벨링 병목을 제거했습니다. PatchCore로 WideResNet50 layer2·layer3 중간 특징을 패치 임베딩으로 뽑고, 정상 267장만으로 memory bank를 구성한 뒤 coreset sampling으로 10%까지 줄여 인덱스 크기와 정확도를 맞췄습니다. Image AUROC 0.9906 · F1 0.9879.",
        "채택 근거는 비교에서 나왔습니다 — PatchCore / SAM(픽셀 세그멘테이션) / 합성 데이터 세 방식을 같은 문제에 병렬로 올렸고, SAM이 기술적으로 정밀해도 다현장·다품종 환경에서 오퍼레이터 재라벨링 병목이 배포 효율을 깎는다는 것을 확인해 탈락시켰습니다.",
        "전처리가 성능을 가른 지점이었습니다 — circle-crop(1120×1120→236×236)으로 배경과 라벨 스티커의 오반응을 걷어내 결함에만 좁게 반응하도록 만들었고, ONNX 변환으로 PyTorch 런타임 없는 CPU 추론 경로를 확보했습니다(254.9ms/frame).",
        "AlignAI — 규칙 기반 OpenCV의 환경 민감도를 U-Net(EfficientNet-B0) 세그멘테이션으로 대체했습니다. 배경 99% 대 정렬선 1%의 클래스 불균형은 Dice Loss로, 데이터 부족은 Albumentations 증강으로 다뤘고 탐지율 100% · CPU 추론 ~330ms를 얻었습니다. 제품이 셋으로 늘며 생긴 코드 분기는 ProductConfig 레지스트리로 접어 새 제품 추가가 config 한 줄이 되게 했습니다.",
        "지표가 태스크와 어긋나는 것을 두 번 잡았습니다 — 이상 발생률이 1% 미만이라 accuracy 99%가 아무것도 뜻하지 않음을 확인하고 AUROC로 재정의했고, 라인 검출에서는 IoU 0.44인데 실제 PASS율 100%인 상황을 만나 4024px의 3px 선이 축소로 sub-pixel이 되는 구조적 문제임을 규명했습니다. 픽셀 단위 지표 계열 전체가 같은 결함을 공유한다는 것까지 정리했습니다.",
        "산학협력 외관 검사 과제에서 경영·설비 설계·외부 연구팀·현장 작업자 네 직군을 조율했습니다. 접근이 갈린 후보 모델들을 비교하려고 아키텍처에 묶이지 않는 평가 인터페이스(score_image 필수 / score_map 선택)를 설계해 같은 저울에 올렸습니다.",
      ],
    },
    {
      company: "go2fit",
      role: "3인 팀 · Backend & Infra 담당",
      period: "2025.10 ~ 현재",
      items: [
        "User·Exercise·Community 3축 PostgreSQL 스키마와 JWT 4중 보안을 단독 설계했습니다. MediaPipe 포즈 추정 기반 운동별 독립 분석기와 비동기 영상 분석 잡 큐(FSM)를 구현했고, Google Play 비공개 테스트로 실사용자 12명 대상 운영 중입니다.",
      ],
    },
  ],
  projLabel: "그 외 프로젝트",
  projects: [
    "Sodam Diary (VLM 기반 사진 해설) — GPT-4V 단독 호출을 BLIP→CLIP→LLM 3단으로 분리하고, 가운데에서 CLIP을 의미 유사도 필터로 써 코사인 유사도 Top-3를 골랐습니다. 이미지-텍스트 임베딩으로 후보를 좁히는 구조이며 운영비 30%↓ · 응답 30초→20초를 얻었습니다.",
    "Dotodo (음성 RAG 추천 에이전트) — ChromaDB 768D 벡터 검색 기반. LLM-as-a-Judge 평가 루프를 최하위 점수 항목에만 선택 호출하도록 게이팅해 API 비용 60%를 절감했습니다.",
  ],
  principlesLabel: "일하는 방식",
  principles: [
    "접근은 논쟁이 아니라 같은 조건의 비교로 고른다.",
    "지표가 태스크의 진짜 질문과 맞는지를 먼저 의심한다.",
    "해본 것과 안 해본 것의 경계를 흐리지 않는다.",
  ],
  eduLabel: "학력 · 자격",
  education: [
    "경희대학교 환경공학 학사 · Intel AI for Future Workforce (KDT, 2025.04~10) · 정보처리기사(필기) · 대기환경기사 · OPIc IH",
  ],
  footer: "프로젝트별 아키텍처·실험 기록과 엔지니어링 노트 전문",
};
