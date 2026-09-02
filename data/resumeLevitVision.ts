// data/resumeLevitVision.ts — 레브잇 [쇼포트] AI Engineer (Vision) 제출용 이력서 데이터
//
// WHY 같은 회사에 두 번째로 내면서 판을 새로 짜나
//   08-26 에 같은 PMF팀의 [쇼포트] AI Engineer(3년 이하)에 「기본 이력서」로 냈고 09-02 서류
//   불합격했다. 사유는 오지 않지만, 상한형 게이트(3년 이하)라 연차로 걸릴 자리가 아니었고
//   매칭 축(비용 최적화 RAG)도 있었다. 남는 혐의가 패키징이다 — 근거가 뒤쪽 프로젝트 줄에
//   흩어져 있어 스크리너가 찾아내야 하는 구조였다. 같은 방식으로 두 번 낼 이유가 없다.
//
// WHY 앵커(Pic-Tag)를 experience 가 아니라 summary 와 projects 에 두나  ← 중요
//   주요업무 첫 줄이 「Image Embedding Model 을 실험하고 고도화」이고 Pic-Tag 가 정확히 그
//   작업이라, 첫 화면에서 보여야 한다. 그렇다고 experience 에 넣을 수는 없다 — 재직 경력이
//   아니고, 템플릿의 period 칸이 기간 표기라 프로젝트를 넣으면 표시가 어긋난다. 무엇보다
//   경력 절에 놓이면 재직처럼 읽힌다. 그래서 summary 첫 문장이 A/B 실험을 직접 말하고,
//   projLabel 을 「Vision 프로젝트」로 세워 근거를 모은다. 경력 절은 사실 그대로 둔다.
//
// WHY 「Attention 을 골랐다」가 아니라 「재서 갈랐다」로 쓰나
//   공고가 「실험하고 고도화」·「탐색 및 실험」으로 실험을 두 번 말한다. 결론(어떤 방식이
//   이겼나)이 아니라 방법(가설 없이 같은 조건으로 쟀다)이 이 팀이 사는 지점이다.
//
// 이 파일이 겨냥한 것 — 공고의 주요업무 다섯 줄이다.
//   1) Image Embedding Model 실험·고도화   → Pic-Tag 임베딩 A/B (앵커: summary + projects 첫 줄)
//   2) 검색 결과·사용자 행동 데이터 분석    → 평가 설계를 지표부터 다시 세운 이력 (인접, 명시)
//   3) CV·Representation Learning 탐색     → PatchCore 중간 특징 · CLIP 의미 유사도 · U-Net
//   4) Vision·Retrieval 파이프라인 설계     → 4-Thread 독립 큐 · circle-crop · ONNX/OpenVINO
//   5) Problem Solver 와의 협업 검증        → AOI 산학협력 네 직군 조율
//
// WHY 「대규모 인덱스」를 주장하지 않았나
//   공고의 「수천만 개 상품 이미지」가 유일한 실질 갭이다. 볼트에 있는 벡터 검색은 Dotodo 의
//   ChromaDB 768D 뿐이고 ANN 인덱스(FAISS·HNSW) 운영 근거가 없다. Pic-Tag 의 Re-ID 도 매장
//   단위라 완전 탐색으로 충분한 규모였다. 「임베딩을 실험해 봤다」는 참이고 「대규모 인덱스를
//   운영해 봤다」는 거짓이라 붙여 쓰지 않는다.

import type { ResumeData } from "@/components/sections/ResumeTemplate";

export const RESUME_LEVIT_VISION: ResumeData = {
  back: "홈으로",
  pdf: "PDF로 저장",
  name: "홍승완",
  headline: "AI Engineer (Vision) · 임베딩을 가설이 아니라 실험으로 고릅니다",
  summaryLabel: "소개",
  summary:
    "YOLO 백본을 분해해 Linear·Pooling·Attention 세 가지 임베딩 추출 방식을 동일 데이터·동일 조건에 올려 A/B로 갈랐고, 이긴 방식으로 코사인 유사도 Re-ID 파이프라인을 만들어 GPU 없는 엣지에서 돌렸습니다. 이미지에서 무엇을 특징으로 뽑을지는 논쟁이 아니라 실험으로 정해진다고 봅니다. 지표가 태스크의 진짜 질문과 어긋나는 것을 발견해 평가 기준 자체를 다시 세운 일도 여러 번 있었습니다.",
  expLabel: "경력",
  experience: [
    {
      company: "DTK",
      role: "AI Engineer",
      period: "2026.03 ~ 현재",
      items: [
        "지표가 태스크와 어긋나는 것을 두 번 잡았습니다 — 이상 발생률이 1% 미만이라 accuracy 99%가 아무것도 뜻하지 않음을 확인하고 AUROC로 재정의했고, 라인 검출에서는 IoU 0.44인데 실제 PASS율 100%인 상황을 만나 4024px의 3px 선이 축소로 sub-pixel이 되는 구조적 문제임을 규명했습니다. 픽셀 단위 지표 계열 전체가 같은 결함을 공유한다는 것까지 정리했습니다.",
        "체크포인트 선정 기준을 잘못 매겨 PASS율을 50%까지 떨어뜨린 적이 있습니다. 탐지율 가중치를 1000배로 준 탓이었고, 0.1로 고쳐 PASS율 91%·탐지 100%를 회복했습니다. 커브 위 한 점을 고르는 책임을 져본 경험으로 남겨 두었습니다.",
        "U-Net(EfficientNet-B0) 세그멘테이션으로 규칙 기반 OpenCV를 대체했고(탐지율 100%·CPU 추론 ~330ms), 학습→ONNX→GHCR→Argo CD 롤링 배포 파이프라인과 k3s 엣지 인프라를 단독 구축했습니다.",
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
  projLabel: "Vision 프로젝트",
  projects: [
    "Pic-Tag (소상공인용 경량 CCTV AI SaaS) — 임베딩 방식을 실험으로 갈랐습니다. YOLO 백본을 분해해 Linear / Pooling / Attention Head 세 가지 특징 추출 방식을 동일 데이터·동일 학습 조건에 올려 A/B 비교했고, Attention이 Re-ID 정확도와 수렴 속도 모두에서 우위인 것을 확인해 채택했습니다. Capture / Detection / Embedding / Re-ID를 4개 독립 스레드·큐로 분리해 단계별 속도 차이를 버퍼링하고 코사인 유사도로 재식별했으며, OpenVINO INT8 양자화로 GPU 없는 엣지에서 실시간을 확보했습니다(FP32 대비 크기 1/4·추론 2~3배).",
    "V1-AOI (렌즈 표면 결함 탐지) — 「불량을 학습해 찾는다」를 「정상이 아닌 것을 찾는다」로 뒤집어 라벨링 병목을 제거했습니다(PatchCore, WideResNet50 중간 특징 + coreset 10%, 정상 267장만 학습). circle-crop 전처리로 배경·라벨 스티커의 오반응을 걷어내 결함에만 좁게 반응하도록 만든 것이 성능을 가른 지점이었습니다. Image AUROC 0.9906 · ONNX CPU 추론 254.9ms/frame.",
    "Sodam Diary (VLM 기반 사진 해설) — GPT-4V 단독 호출을 BLIP→CLIP→LLM 3단으로 분리하고, 가운데에서 CLIP을 의미 유사도 필터로 써 코사인 유사도 Top-3를 골랐습니다. 이미지-텍스트 임베딩으로 후보를 좁히는 구조이며 운영비 30%↓ · 응답 30초→20초를 얻었습니다.",
  ],
  principlesLabel: "일하는 방식",
  principles: [
    "임베딩 방식은 논쟁이 아니라 같은 조건의 실험으로 고른다.",
    "지표가 태스크의 진짜 질문과 맞는지를 먼저 의심한다.",
    "해본 것과 안 해본 것의 경계를 흐리지 않는다.",
  ],
  eduLabel: "학력 · 자격",
  education: [
    "경희대학교 환경공학 학사 · Intel AI for Future Workforce (KDT, 2025.04~10) · 정보처리기사(필기) · 대기환경기사 · OPIc IH",
  ],
  footer: "프로젝트별 아키텍처·실험 기록과 엔지니어링 노트 전문",
};
