// data/projectDetails.ts
// 프로젝트 상세(웹) 콘텐츠 — Portfolio 슬라이드 덱에서 이관. 슬러그 기준.
// 이 데이터가 있으면 상세 페이지가 리치하게, 없으면 개요만 표시된다.

export interface DetailCard {
  title: string;
  body: string;
}

export interface ProjectDetailContent {
  context?: string;      // 맥락 / 문제
  decision?: string;     // 핵심 의사결정 / 접근
  implementation?: DetailCard[]; // 구현 핵심
  results?: string;      // 성과 & 회고
  stack?: string[];      // 기술 스택
}

export const projectDetails: Record<string, ProjectDetailContent> = {
  'edge-ai-lmr': {
    context:
      'DTK 렌즈 열성형 공정에서 PLC가 10ms 주기로 온도·압력·전력 센서 데이터를 생성하지만, 이를 실시간으로 분석·처방하는 지능형 시스템이 전혀 없었습니다. 이상 발생 시 숙련 작업자 경험에만 의존해 대응이 지연됐고, 다축 센서 데이터는 타임스탬프만으로 시공간 연결이 불가능해 이상탐지·품질예측·처방제어 세 가지가 모두 구조적으로 차단돼 있었습니다.',
    decision:
      '단순 이상탐지를 넘어 처방적 제어 루프(M1→M2→M3)까지 완성하는 것을 목표로 설정했습니다. Field/Control/Edge/Cloud 4계층을 독립 배포 단위로 분리하고, Cycle_ID를 Golden Key로 삼아 전 계층 시공간 데이터를 단일 키로 조인. 통신은 데이터 온도별 3티어(MQTT Binary HOT · gRPC Streaming WARM · Parquet COLD)로 분리해 처리량·지연·비용을 동시에 최적화했습니다.',
    implementation: [
      // 정정: 원래 이 항목이 "1D-CNN Autoencoder ... (Anomalib PatchCore)"로 두 모델을 한 문장에
      // 섞어 서술했다. M1은 시계열 센서 이상탐지(1D-CNN AE)이고, PatchCore는 별개 워크스트림인
      // 비전 AOI(V1-AOI, 아래 'v1-aoi' 항목)다. 둘을 분리했다.
      { title: 'M1 — 이상탐지', body: '1D-CNN Autoencoder 재구성 오차 기반 Anomaly Score로 AUROC 99.99%. Score를 M2 입력 피처로 전달해 체인을 연결.' },
      { title: 'M2 — 품질예측', body: 'LSTM(시계열 장기 패턴)+XGBoost(비선형 피처) 앙상블. M1 Score를 공동 입력해 예측 정확도를 높이고 예측값을 M3 State로 전달.' },
      { title: 'M3 — 처방제어', body: 'Deep Q-Network으로 최적 온도·압력 Set-point를 Action으로 계산해 PLC에 피드백하는 폐루프 제어. 현재 시뮬레이션 검증 단계.' },
      { title: '데이터 통신 3-Tier', body: 'HOT: MQTT QoS0 Binary(10ms 무손실 버퍼) · WARM: gRPC 양방향 스트리밍(Protobuf) · COLD: Parquet 배치 오프로드로 드리프트 재학습.' },
    ],
    results:
      '이상탐지 AUROC 99.99% 달성. React18+TS HMI 대시보드(Process·Quality·Anomaly·Energy 4뷰)를 Zod 공유 스키마로 FE↔BE API 계약을 컴파일 타임에 강제해 타입 불일치를 제거했습니다. 다음 단계: M3 DQN 실 PLC 투입 전 Fail-safe·SIL 안전 검증, VLM 기반 자연어 이상 해설 레이어 추가.',
    stack: ['MQTT', 'gRPC', 'Node.js', 'React18 + TS', 'Zod', 'PyTorch'],
  },

  'v1-aoi': {
    // 아래 문장들은 PJT-EDGE-AI-LMR 레포에서 확인된 사실만 담았다.
    // TODO(you) 표시가 있는 곳은 내가 검증할 수 없는 부분 — 직접 채울 것.
    context:
      'Edge AI LMR(렌즈 열성형 Factory OS)의 비전 검사 워크스트림입니다. 공정 지능화(M1~M3)가 PLC 시계열을 다루는 반면, 이쪽은 이미지 기반 표면 검사를 다루며 ADR-020에서 단독 납품 패키지로 범위가 분리돼 있습니다. ' +
      '렌즈 표면 이물(dust) 검사는 육안 검사에 의존해 검사자 피로도에 따라 판정이 흔들렸습니다. 지도학습으로 풀려면 불량 유형별로 라벨링된 이미지가 필요하지만, 실제 공정에서 불량은 드물게 발생하고 유형도 미리 다 알 수 없어 라벨 확보 자체가 병목이었습니다.',
    decision:
      '"불량을 학습해서 찾는다"를 포기하고 "정상이 아닌 것을 찾는다"로 문제를 재정의했습니다. PatchCore는 정상 이미지의 패치 임베딩만으로 memory bank를 만들고, 추론 시 가장 가까운 정상 패치와의 거리를 이상 점수로 씁니다. 불량 이미지가 학습에 한 장도 필요 없으므로 라벨링 병목이 사라지고, 미지의 불량 유형에도 반응합니다.',
    implementation: [
      { title: 'PatchCore 구성', body: 'WideResNet50 백본의 layer2·layer3 중간 특징을 사용하고 coreset sampling 10%로 memory bank를 압축. 얕은 층은 텍스처, 깊은 층은 구조를 담으므로 두 층을 함께 써야 미세 이물과 형태 이상을 모두 잡는다.' },
      { title: '데이터 구성', body: '학습에 정상 267장만 투입. 테스트는 정상 68장 + 이물 243장으로 분리해, 학습에 쓰이지 않은 정상셋으로 오검출(false positive)을 따로 측정할 수 있게 구성.' },
      { title: 'circle-crop 전처리', body: '전체 프레임(1120×1120)으로 학습한 모델은 라벨 스티커·배경 텍스처까지 이상으로 반응해 국소화가 무의미해졌다. 렌즈 원형 영역만 236×236으로 잘라내 배경 변인을 제거하자 이물만 좁게 반응하도록 개선됐다.' },
      { title: 'ONNX 추론 경로', body: 'export.py로 체크포인트를 ONNX로 변환. 엣지 PC에 PyTorch 런타임을 설치하지 않고 onnxruntime만으로 추론 가능 — 납품 환경의 의존성과 이미지 크기를 줄이기 위한 선택.' },
    ],
    results:
      '이물 판정 Image AUROC 0.9906 · F1 0.9879. CPU 단독 추론은 254.9ms/frame(P95 279.7ms)으로, 엣지 목표치인 100ms에는 아직 못 미칩니다 — 실시간 인라인 검사에 투입하려면 ONNX 양자화나 백본 경량화가 남은 과제입니다. 픽셀 단위 AUROC는 미측정 상태인데, Folder 데이터셋에 픽셀 마스크(mask_dir) 정답이 없어 국소화 정확도를 수치로 검증할 수 없기 때문입니다. 지금은 히트맵을 눈으로 확인하는 정성 평가에 의존하고 있어, 마스크 라벨 일부 확보가 다음 우선순위입니다. 가장 큰 교훈은 모델보다 입력 정의가 결과를 갈랐다는 점입니다 — 전체 프레임으로는 배경·라벨 스티커까지 이상으로 반응해 국소화가 무의미했지만, 렌즈 원형 영역만 잘라내자 같은 모델이 이물만 좁게 잡아냈습니다.',
    stack: ['PatchCore', 'anomalib v2', 'PyTorch', 'WideResNet50', 'ONNX Runtime', 'OpenCV'],
  },

  'alignai': {
    context:
      'DTK 렌즈 정렬 공정의 기존 OpenCV 필터링(Canny Edge + 수동 임계값)은 조명·배경 변화에 취약했습니다. 임계값을 수동으로 재조정해야 하는 구조적 한계로 공정 자동화가 원천적으로 불가능했고, 조명이 조금만 달라져도 정렬 실패로 이어져 숙련 작업자가 상시 대기해야 했습니다.',
    decision:
      '규칙 기반 접근의 한계를 인정하고 학습 기반(U-Net Segmentation)으로 패러다임을 전환했습니다. 임계값 없이 조명·배경 변화에 강건한 딥러닝으로 완전 대체하고, 나아가 GitHub SSOT GitOps로 추론(Deployment)·학습(Job) 이미지 라이프사이클을 분리한 ML CI/CD와 현장 LLM 에이전트까지 통합했습니다.',
    implementation: [
      { title: 'EfficientNet-B0 인코더', body: 'ImageNet 사전학습으로 수렴 속도 3배↑, Skip Connection으로 정렬선 위치·방향 등 공간 정보를 디코더에 직접 보존.' },
      { title: 'Dice Loss', body: 'BCE 대비 클래스 불균형(배경 99% vs 정렬선 1%)에 강건. 픽셀 수가 극히 적은 얇은 선 세그멘테이션에 최적.' },
      { title: '과적합 방지', body: 'Albumentations 증강(회전·밝기·가우시안 노이즈) + 검증 기준 Early Stopping으로 소규모 데이터셋의 일반화 성능 확보.' },
      { title: 'GitOps ML CI/CD', body: 'code push→ci.yml(pytest→빌드)→GHCR(SHA)→Argo CD 롤링. 학습은 workflow_dispatch→GPU k3s Job→핑거프린트 스킵→ONNX. GITHUB_TOKEN 트리거·Argo Job 재생성 등 트러블슈팅 3건 ADR.' },
    ],
    results:
      '현장 데이터에서 정렬선 탐지 성공률 100%, PASS율 91%, CPU 추론 ~330ms 달성. 수동 임계값 조정을 완전히 제거해 완전 자동 정렬을 실현하고 작업자 대기 시간을 0으로 만들었습니다. k3s self-heal로 OOM·프로세스 비정상 종료 복원력을 로컬 검증.',
    stack: ['PyTorch', 'U-Net', 'EfficientNet-B0', 'ONNX', 'Docker', 'k3s', 'Argo CD', 'GitHub Actions', 'React + TS'],
  },

  'erp-backup': {
    context: '입사 1주차, K-System Ace 레거시 웹 ERP의 공식 API 부재가 데이터 마이그레이션 최대 병목으로 식별됐습니다. 비표준 동적 팝업 구조로 기존 자동화 도구(Selenium, AutoHotkey) 적용이 불가능했고, 수만 건의 결재 문서를 수작업으로 추출해야 하는 반복 병목이 전사 리소스를 잠식하고 있었습니다. 팝업이 비동기로 열리고 닫히는 구조가 모든 기존 접근의 실패 원인이었습니다.',
    decision: 'Playwright를 선택했습니다. 비동기 이벤트 핸들링과 동적 팝업 처리에서 Selenium 대비 압도적 우위가 있었기 때문입니다. Promise.all 동시성으로 팝업 이벤트 타이밍 Race Condition을 구조적으로 제거하고, POM(Page Object Model) 패턴으로 UI 구조 변경에 강건한 유지보수 아키텍처를 확보했습니다. Security-first 설계(자격증명 분리)와 CSV 전수 추적 로그(감사 가능성)를 기획 단계부터 포함했습니다.',
    implementation: [
      { title: 'Promise.all 동시성 설계', body: '팝업 이벤트 수신과 클릭 액션을 Promise.all로 동시 처리해 순차 처리 시 발생하는 팝업 타이밍 Race Condition을 구조적으로 해결했습니다. 병렬화로 처리 속도도 향상됐고, 실패 시 개별 reject로 핸들링합니다.' },
      { title: 'POM 패턴으로 유지보수성', body: 'Page Object Model로 ERP UI를 LoginPage·DocumentListPage·PopupHandler 클래스로 추상화했습니다. UI 구조 변경 시 해당 POM 클래스만 수정하면 되고, 테스트 코드와 로직을 재사용할 수 있습니다.' },
      { title: 'Security-first & 감사 가능성', body: '.env + .gitignore로 자격증명을 완전 분리하고, 날짜/문서번호/PDF상태/첨부유무/비고를 담은 CSV 전수 추적 로그로 Auditability를 보장했습니다. 실패 건은 재처리 파이프라인으로 자동 재시도합니다.' },
      { title: '재처리 & 이식성 설계', body: 'CSV 체크포인트로 이미 처리된 문서를 건너뛰어 중단 후 이어하기를 지원하고, 동적 페이지네이션을 자동 처리합니다. POM 구조와 .env 주입으로 타 ERP 시스템에도 코드 수정 없이 재사용 가능합니다.' },
    ],
    results: '수주가 소요되던 수작업을 완전 무인 자동화로 전환하고 데이터 정합성 100%를 확보했습니다. 재처리 로직으로 부분 실패 시에도 누락 없이 전수 완료하여 전사 마이그레이션 병목을 해소했습니다. API 없는 레거시 자동화의 핵심이 타이밍 제어와 상태 추적임을, "병목 식별 → 자동화 설계 → 전사 적용"을 입사 1주차에 증명했습니다.',
    stack: ['Playwright', 'Node.js', 'Promise.all', 'POM Pattern', 'TypeScript', '.env Security', 'CSV Audit Log'],
  },
  'dotodo': {
    context: '사용자 음성(STT)으로 일상 데이터를 축적하고 벡터 유사도 검색으로 맥락에 맞는 할 일을 추천하는 RAG 서비스입니다. 세 가지 핵심 과제가 있었습니다. (1) Cold Start — 신규 사용자 벡터 데이터 부재 시 추천 불가. (2) LLM API 지연 — 동기 처리 시 사용자 응답 대기. (3) 추천 품질 검증 — 사람 없이 추천 결과의 관련성을 자동 검증하는 메커니즘 필요.',
    decision: 'Backend(사용자 관리·인증)와 Model Server(AI 추론·RAG)를 별도 AWS EC2 인스턴스로 분리하는 MSA로 설계해 모델 업그레이드 시 Backend 무중단을 확보했습니다. Mecab-ko 형태소 분석으로 한국어 벡터 검색 품질을 개선하고, LLM as a Judge로 추천 품질 자율 검증 루프를 구성했습니다. FastAPI asyncio로 LLM 호출 지연을 최소화했습니다.',
    implementation: [
      { title: 'Mecab-ko NLP 파이프라인', body: '한국어 형태소 분석과 불용어 제거 후 768D 임베딩 → ChromaDB 코사인 유사도 Top-K=3 검색을 수행합니다. Cold Start는 인기 태스크 기반 초기값 주입으로 최소 추천을 보장합니다.' },
      { title: 'LLM as a Judge 품질 루프', body: '추천 결과를 LLM이 스스로 관련성·유용성 평가하는 자율 품질 검증 루프입니다. 낮은 점수 추천은 재생성을 트리거해 사람 없이 품질 기준을 유지하며, 비용과 품질의 트레이드오프를 균형있게 조정합니다.' },
      { title: 'FastAPI asyncio 병렬 처리', body: 'LLM API 호출 지연을 asyncio 비동기로 최소화하고, Mecab-ko 정규화·벡터 검색·LLM 호출을 비동기 파이프라인으로 연결했습니다. Backend 무중단 상태에서 Model Server를 독립 재배포합니다.' },
      { title: 'LLM Judge 비용 최적화', body: 'Judge 호출을 추천 Top-K 결과 중 최하위 점수 항목에만 선택적으로 적용해 전체 호출 대비 Judge API 비용을 60% 감소시켰습니다. 품질 임계값 이하일 때만 재생성을 트리거합니다.' },
    ],
    results: 'Top-K=3 개인화 추천을 구현하고, MSA 분리로 모델 업그레이드 무중단을 달성했습니다. asyncio 비동기 파이프라인으로 LLM 응답 지연을 60% 단축하고, LLM as a Judge로 추천 품질을 자율 관리했습니다. Cold Start 초기값 주입은 임시방편으로, 유사 사용자 클러스터링(User-Based CF) 도입이 장기 해법이며 LLM Judge 호출 비용 최적화가 남은 과제입니다.',
    stack: ['FastAPI', 'LangChain', 'ChromaDB', 'Mecab-ko', 'PostgreSQL', 'AWS EC2 MSA', 'STT', 'Swift(iOS)'],
  },
  'sodamdiary': {
    context: '시각장애인이 찍은 사진을 음성으로 해설해주는 다이어리 앱입니다. GPT-4V 단독 사용 시 월 130만원 비용과 30초 응답 지연이 UX를 심각하게 저해했습니다. 이미지의 구체적 묘사(객체·텍스트)와 감성적 분위기(따뜻함·생동감)를 함께 전달해야 하는 멀티모달 과제로, 비용과 품질을 동시에 만족하는 대안 아키텍처가 필요했습니다.',
    decision: 'GPT-4V 단일 의존에서 BLIP/CLIP/LLM 3-Stage 역할 분담으로 전환했습니다. BLIP(구체 묘사 캡션) + CLIP(감성 분위기 Top-3 분류) + LLM(자연어 해설 생성)이 각각 전문 역할만 담당합니다. GPT-4V 의존을 제거해 비용 구조를 바꾸고, OpenVINO 4-bit 양자화로 BLIP/CLIP을 로컬 경량화하여 응답 속도를 개선했습니다.',
    implementation: [
      { title: 'OpenVINO 4-bit 양자화', body: 'BLIP·CLIP에 OpenVINO 4-bit 양자화와 asyncio 병렬 처리를 적용해 BLIP+CLIP을 동시 실행 후 결과를 합산합니다. 응답 30초→20초, 운영비 30%↓를 달성했으며 GPU 없이 CPU 추론이 가능합니다.' },
      { title: 'Django → FastAPI 전환', body: 'Django 동기 ORM이 병렬 처리 병목이 되어 FastAPI + asyncio로 완전 재구축했습니다. Docker + AWS EC2 배포로 운영 안정성을 확보하고 동시 요청 처리 성능을 개선했습니다.' },
      { title: 'asyncio 병렬화 & CLIP 감성 분류', body: 'BLIP(구체 묘사)과 CLIP(감성 분위기)을 asyncio.gather로 동시 실행해 총 소요시간을 max(BLIP, CLIP)로 단축합니다. CLIP은 사전 정의 감성 레이블 20개와 이미지 임베딩의 코사인 유사도로 Top-3 분위기를 수치화해 LLM 해설 품질을 높입니다.' },
      { title: '접근성 중심 UX 설계', body: 'STT → AI 해설 → TTS 완전 음성 루프로 화면·텍스트 없이 사진을 "듣는" 경험을 구현했습니다. 시각장애인 사용자 테스트 피드백을 반영하고 해설 길이·속도 조절 기능을 추가했습니다.' },
    ],
    results: '2025 한국장애인해커톤 본선에 진출했습니다. GPT-4V 대비 운영비 30% 절감, 응답 30초→20초를 달성하고 BLIP+CLIP 병렬로 Stage 1·2를 동시 처리했으며 시각장애인 테스트에서 긍정 피드백을 받았습니다. 양자화로 속도는 개선됐으나 BLIP의 복잡한 이미지 묘사 정확도가 하락하여, LLaVA 등 강력한 오픈소스 VLM 교체와 파인튜닝 데이터 확보가 품질 개선의 핵심 과제입니다.',
    stack: ['BLIP', 'CLIP', 'OpenVINO 4-bit', 'FastAPI', 'asyncio', 'Docker', 'AWS EC2', 'Kotlin'],
  },
  'pictag': {
    context: '소상공인 매장의 저사양 엣지 디바이스(GPU 없음)에서 CCTV 영상으로 방문객 Re-ID와 동선 히트맵을 실시간 제공하는 SaaS입니다. 두 가지 핵심 과제가 있었습니다. (1) 임베딩 품질 — YOLO 백본에서 어떤 방식으로 Re-ID 특징을 추출할 것인가(Linear vs Pooling vs Attention). (2) 엣지 실시간성 — GPU 없는 환경에서 RTSP 스트리밍 처리와 Re-ID 추론을 동시에 처리하는 구조 설계.',
    decision: '가설 없이 Linear / Pooling / Attention 3가지 임베딩 방식을 동일 데이터·동일 조건으로 A/B 테스트했습니다. Attention 방식이 Re-ID 정확도와 학습 효율 모두에서 50%↑ 우위를 보여 채택했습니다. 엣지 실시간성은 Capture/Detection/Embedding/Re-ID를 4-Thread 독립 큐로 분리하고 OpenVINO INT8 양자화로 추론 속도를 확보했습니다.',
    implementation: [
      { title: '임베딩 방식 A/B 실험', body: 'YOLO 백본을 분해한 뒤 Linear / Pooling / Attention Head 3가지 추출 방식을 동일 데이터·학습 조건에서 비교했습니다. Attention이 Re-ID 정확도와 수렴 속도 모두 50%↑ 우위를 보여 실험 기반으로 채택했습니다.' },
      { title: '4-Thread 독립 큐 설계', body: 'Capture/Detection/Embedding/Re-ID 스레드를 독립 Queue로 연결해 각 단계 처리 속도 차이를 큐가 버퍼링합니다. 카메라 스트림 지연 없이 Re-ID를 연속 처리하며, 스레드 실패 시 개별 재시작으로 전체 영향이 없습니다.' },
      { title: '엣지 최적화 & 대시보드', body: 'OpenVINO INT8 양자화로 GPU 없이 엣지 실시간 추론을 달성했습니다(FP32 대비 크기 4배 감소, 속도 2-3배 향상). Django + WebSocket으로 방문객 동선 히트맵을 실시간 렌더링해 소상공인에게 공간 운영 인사이트를 제공합니다.' },
    ],
    results: 'Attention 임베딩으로 Re-ID 학습 효율 50%↑를 달성하고, 4-Thread 파이프라인으로 GPU 없는 엣지 환경에서 실시간 Re-ID를 구현했습니다. Django+WebSocket 히트맵 대시보드로 소상공인 SaaS 비즈니스 모델을 실증했습니다. Re-ID 정확도가 조명·각도 변화에 민감해 다양한 카메라 환경 데이터 추가 학습이 과제이며, ONNX 변환으로 ARM 기반 엣지 디바이스까지 범용 배포를 확장할 계획입니다.',
    stack: ['YOLOv8', 'Attention Embedding', 'OpenVINO INT8', 'RTSP', 'Python Threading', 'Django', 'WebSocket'],
  },
  'hosugator': {
    context: '개인 포트폴리오(Next.js)를 AWS에 배포하며 두 가지 구조적 문제에 직면했습니다. (1) 비용 문제: ALB(월 ~$20) + ECS Fargate(요청당 과금) 조합이 트래픽 없는 개인 사이트에 과도한 비용. (2) 보안 문제: IAM User 액세스 키를 GitHub Secrets에 저장하는 장기 자격증명 방식은 키 노출 시 무제한 권한 탈취 위험이 있었습니다.',
    decision: 'Next.js Static Export로 서버 의존성을 제거해 S3 정적 배포로 전환하고, IAM User를 완전히 제거해 OIDC Federation으로 두 문제를 동시에 구조적으로 해결했습니다. GitHub Actions OIDC로 단기 토큰만 발급하고 최소 권한(S3+CloudFront만)을 부여했습니다.',
    implementation: [
      { title: '아키텍처 전환', body: 'ALB+ECS Fargate(월 $20↑)에서 S3 정적 배포(월 $1 미만)로 전환하고 Next.js Static Export로 서버 의존성을 완전히 제거해 TCO 80%↓를 달성했습니다.' },
      { title: 'OIDC Federation', body: 'GitHub Actions OIDC로 단기 토큰만 발급하고 IAM User 액세스 키를 완전히 제거했습니다. 최소 권한(S3+CloudFront만)으로 키 노출 위험을 구조적으로 제거하고 키 로테이션도 불필요해졌습니다.' },
      { title: '트러블슈팅: OIDC sub claim', body: 'GitHub OIDC 토큰 sub claim 형식을 오해해 IAM Role 신뢰 정책이 반복 실패했습니다. AWS 공식 문서와 실제 토큰 디코딩으로 올바른 조건식을 도출했습니다.' },
      { title: 'k3s 전환 실험 & 배포 전략', body: '서버리스에서 EC2/Nginx/k3s 자가 관리형으로 전환을 실험해 비용 vs 복잡도 트레이드오프를 직접 경험한 뒤 정적 배포로 최종 결정했습니다. GitHub Actions로 S3 업로드 후 CloudFront Invalidation을 자동 실행해 배포 중 다운타임 0초를 확보했습니다.' },
    ],
    results: 'TCO 80% 절감(월 $20+ → $1 미만)과 IAM User 완전 제거(보안 감사 시 IAM User 0개)를 달성했습니다. OIDC 단기 토큰으로 보안 수준을 대폭 향상하고 CloudFront CDN 글로벌 배포와 CI/CD 자동화를 완성했습니다. 인프라 최적화의 본질은 "필요한 것만"이며, 서버리스가 항상 답이 아님을 직접 비용 비교로, 보안도 복잡한 정책이 아닌 구조적 최소화가 핵심임을 확인했습니다.',
    stack: ['Next.js Static', 'AWS S3', 'CloudFront', 'Route53', 'IAM OIDC', 'k3s', 'GitHub Actions'],
  },
  'cureat': {
    context: '파편화된 미식 데이터(블로그·SNS·뉴스·RSS)에서 개인화 맛집 추천을 제공하는 서비스입니다. 세 가지 핵심 문제가 있었습니다. (1) 데이터 품질 — 광고성·홍보성 콘텐츠가 검색 결과를 오염. (2) 수집 효율 — 멀티소스 동기 수집의 병목으로 실시간성 불가. (3) 추천 정확도 — 단순 키워드 검색의 의미론적 한계로 개인 취향 반영 부족. 정제된 미식 데이터 거버넌스가 서비스 신뢰의 핵심이었습니다.',
    decision: 'Ko-BERT로 광고성 콘텐츠를 문맥 수준에서 탐지해 규칙 기반만으로 놓치는 자연스러운 광고 문장까지 벡터 유사도로 필터링했습니다. asyncio 병렬 수집으로 REST API + 웹 크롤링 + RSS 3소스를 동시 수집해 I/O 병목을 제거했습니다. 2-Stage 하이브리드 검색(ChromaDB 코사인 유사도 + 위치 거리 가중치)으로 개인화 추천 정확도를 개선했습니다.',
    implementation: [
      { title: '데이터 수집 파이프라인', body: 'REST·Crawl·RSS 3소스를 asyncio.gather로 병렬 수집하고 중복 URL은 SHA-256 해시로 필터링합니다. 실시간 갱신 스케줄러로 최신 미식 데이터를 유지하며 I/O 병목을 완전히 제거했습니다.' },
      { title: 'Ko-BERT 2단계 필터링', body: '1단계는 광고 키워드 사전 기반 규칙 필터, 2단계는 Ko-BERT 문맥 임베딩 코사인 유사도로 자연스러운 광고 문장을 탐지합니다. 규칙만으로 놓치는 콘텐츠를 벡터로 보완해 광고 20%↑를 제거했습니다.' },
      { title: '2-Stage 하이브리드 검색', body: 'Stage 1에서 ChromaDB 코사인 유사도로 의미론적 유사 맛집 Top-K를 추출하고, Stage 2에서 사용자 현재 위치 거리 가중치로 공간 맥락 Re-ranking을 수행합니다. 의미와 위치를 결합해 개인화 추천 정확도를 개선했습니다.' },
      { title: '팀 협업 & 코드 품질 관리', body: '2주 Jira 스프린트로 수집·필터링·검색·앱 4개 컴포넌트를 분리 개발하고, GitLab에서 Self-Approval 금지 정책과 비동기 로직 필수 검증을 도입했습니다. OpenAPI 자동 생성과 크롤링 대상 변경 이력 ADR 관리로 팀 코드 품질을 상향 평준화했습니다.' },
    ],
    results: '광고성 콘텐츠 20%↑ 제거로 데이터 품질을 개선하고, asyncio 병렬 수집으로 멀티소스 I/O 병목을 제거했습니다. 2-Stage 하이브리드 검색으로 키워드 대비 추천 정확도를 개선하고 React Native 모바일 앱 연동을 완성했습니다. Ko-BERT 필터 임계값 조정으로 정밀도-재현율 균형 최적화, 사용자 이력 기반 개인화(User-Based CF) 추가가 남은 과제입니다.',
    stack: ['Ko-BERT', 'ChromaDB', 'FastAPI', 'asyncio', 'React Native', 'PostgreSQL', 'Jira', 'GitLab'],
  },
  'dorosee': {
    context: '도심 응급상황에서 고령자·장애인이 스마트폰 조작 없이 AI 도움을 받을 수 있는 UGV(무인 이동체) 플랫폼입니다. 24시간 해커톤 제약으로 실제 UGV 하드웨어 없이 AI 모듈 개발·통합을 완료해야 했습니다. 또한 단일 트리거 방식(비전 또는 음성만)은 오작동 위험이 높아 소외 계층 UX에 치명적 신뢰도 문제를 유발할 수 있었습니다.',
    decision: 'Unity 3D HAL(Hardware Abstraction Layer)을 시뮬레이션으로 구현해 실제 UGV 없이 AI 모듈 통합 테스트를 완료했습니다. 3중 트리거 설계로 비전(YOLOv8) + 모션(MediaPipe 인사 제스처) + 음성(STT Wakeword)을 독립 트리거로 구성하고, 3개 중 2개 이상 동시 감지 + 10초 지속 조건으로 오작동을 구조적으로 최소화했습니다.',
    implementation: [
      { title: 'YOLOv8 파인튜닝', body: '3,000장 데이터셋으로 응급상황 탐지를 파인튜닝하고 10초 지속 감지 조건으로 순간 오탐을 구조적으로 최소화했습니다. Recall 92% / Precision 85%를 달성했으며 소외 계층 환경 데이터를 포함했습니다.' },
      { title: '3중 트리거 융합 판단', body: '비전+모션+음성 독립 트리거를 가중치 투표로 융합해 단일 트리거 대비 오작동을 대폭 감소시켰습니다. 디지털 소외 계층(고령자·장애인)의 다양한 표현 방식을 모두 커버합니다.' },
      { title: 'Unity 3D HAL 전략', body: 'Hardware Abstraction Layer를 Unity 3D 시뮬레이션으로 구현해 24시간 내 실제 UGV 없이 AI 전체 파이프라인 통합 테스트를 완료했습니다. 소프트웨어 완성 후 하드웨어 탑재 패러다임을 실증했습니다.' },
    ],
    results: '2025 UWC 해커톤 대상을 수상했습니다. YOLOv8 Recall 92% / Precision 85%를 확보하고, STT→LLM→TTS 완전 음성 루프로 소외 계층 UX를 실증했으며 AED 자동 신고 연동을 완성했습니다. Unity HAL로 "소프트웨어 먼저, 하드웨어 나중" 설계 철학을 실증했고, 실제 UGV 탑재 시 ROS 연동과 3중 트리거 가중치 최적화가 다음 과제입니다.',
    stack: ['YOLOv8', 'MediaPipe', 'STT/TTS', 'LLM API', 'Unity 3D HAL', 'FastAPI', 'PyTorch'],
  },
  'kdlc': {
    context: '물류센터 유통 데이터 기반 상품 수요 예측 경진대회입니다. 세 가지 핵심 도전이 있었습니다. (1) 시계열 복잡성 — 주기성(주간·월간·연간)·추세·노이즈가 혼합된 다층 패턴. (2) Data Leakage — 무작위 K-Fold 적용 시 미래 데이터가 학습에 포함되는 치명적 오류. (3) 단일 모델 한계 — 계절성·장기 의존성·비선형 피처 중요도를 동시에 포착하는 모델 부재. 모델 선택 이전에 피처 설계와 검증 구조가 승패를 결정했습니다.',
    decision: '피처 공학을 우선했습니다. Lag·Rolling·주기성 인코딩·도메인 지식 피처를 포함한 45개↑ 피처가 성능 향상의 핵심 동인이었습니다. TimeSeriesSplit으로 시간 순서 보존 교차검증을 적용해 Data Leakage를 구조적으로 차단하고, SARIMA(계절성) + LSTM(장기 의존성) + LightGBM(비선형 피처) 3-Model 앙상블로 각 모델의 강점을 상호 보완했습니다.',
    implementation: [
      { title: '45개+ 피처 공학 전략', body: 'Lag(1~7일), Rolling 통계(7·14·30일 평균·분산·최대), sin/cos 주기성 인코딩, 공휴일 바이너리, 프로모션 플래그를 설계했습니다. 도메인 지식 기반 피처가 성능 향상에 가장 크게 기여했으며, 피처 중요도 분석으로 불필요한 피처를 제거했습니다.' },
      { title: '3-Model 앙상블 설계', body: 'SARIMA는 주간·월간 계절성 ARIMA 분해, LSTM은 30일 시퀀스 장기 의존성 학습, LightGBM은 45개+ 피처의 비선형 중요도를 포착합니다. 각 모델 검증 RMSE 역수를 가중치로 앙상블해 단일 모델 대비 예측 분산을 감소시켰습니다.' },
      { title: 'TimeSeriesSplit 교차검증', body: '무작위 K-Fold를 금지하고 시간 순서 보존 분할(과거 Train → 미래 Val)로 미래 데이터가 학습에 포함되는 Data Leakage를 구조적으로 차단했습니다. 실제 운영 환경과 동일한 검증 조건을 확보해 과적합 탐지 신뢰도를 높였습니다.' },
      { title: 'sin/cos 주기성 & 가중 앙상블 최적화', body: '요일·월을 sin/cos 변환으로 연속 순환 표현해 12월→1월 경계에서 불연속 없이 주기성을 보존했습니다. 각 모델의 TimeSeriesSplit 검증 RMSE 역수를 정규화해 가중치를 산출, 단순 평균 앙상블 대비 최종 RMSE를 추가 개선했습니다.' },
    ],
    results: '피처 공학이 모델 선택보다 예측 성능에 더 큰 영향을 준다는 것을 확인했습니다. TimeSeriesSplit 적용 후 검증 지표와 실제 예측 오차 간 괴리가 대폭 감소했고, 앙상블로 단일 모델 대비 RMSE를 개선했습니다. SARIMA 파라미터 그리드 서치 자동화, LSTM 하이퍼파라미터 최적화(Optuna), 외부 데이터(날씨·경제지표) 추가가 개선 과제입니다.',
    stack: ['SARIMA', 'LSTM', 'LightGBM', 'TimeSeriesSplit', 'pandas', 'scikit-learn', 'PyTorch'],
  },
  'go2fit': {
    context: '운동 기록과 커뮤니티 소셜을 결합한 Android 우선 피트니스 앱으로, FastAPI 백엔드부터 AI 자세 분석 파이프라인, 클라우드 인프라, Flutter 앱까지 풀스택으로 구축했습니다. 체육관의 불안정한 네트워크 환경, 카카오 기반 인증 보안, GPU 없는 저비용 클라우드에서의 영상 AI 분석이라는 실제 운영 제약을 동시에 해결해야 했습니다.',
    decision: 'Kakao OAuth 기반 JWT 이중 토큰(Rotation) 인증, MediaPipe 33점 랜드마크 규칙 기반 자세 분석, 오프라인 싱크큐(Idempotency + Bulk)를 축으로 설계했습니다. 클라우드는 공급자 비용 비교 후 Oracle x86 Paid($27/월)를 선택하고, Docker 멀티스테이지 + GitLab CI/CD + k3s로 배포했습니다. 클라이언트는 Flutter Feature-based Clean Architecture로 구성했습니다.',
    implementation: [
      { title: '데이터 모델 & Kakao OAuth JWT', body: 'users→session→exercise→set→rep_analysis 계층의 운동 기록 5개 테이블, 인증 3개, 커뮤니티 3개 등 10개 테이블을 설계했습니다. 카카오 서버 검증 후 Access(15분)/Refresh(30일) JWT를 발급하고, raw 토큰은 클라이언트에만·DB에는 SHA-256 해시만 저장하며 Refresh 재사용 감지 시 해당 유저의 모든 토큰을 즉시 블랙리스트 등록합니다. Hypothesis property-based testing으로 토큰 위조·만료·재사용 경계값을 자동 검증합니다.' },
      { title: 'MediaPipe AI 자세 분석 파이프라인', body: '영상 업로드 시 202를 즉시 반환하고 비동기로 처리합니다. OpenCV 프레임 추출 → MediaPipe Pose 33 landmarks → ExerciseAnalyzer(도메인 계층, DB·HTTP 의존성 없음) → Rep 단위 score 0~100·feedback[] → DB 저장. BenchPress·Squat·Deadlift 3종목을 규칙 기반으로 독립 모듈화해 SUPPORTED_EXERCISES dict에 1줄 등록으로 신규 종목을 추가합니다.' },
      { title: '오프라인 싱크큐 + Bulk API', body: '체육관 불안정 네트워크에 대응해 X-Idempotency-Key 미들웨어로 중복 요청 시 재실행 없이 저장된 응답을 반환(Cache HIT)합니다. Bulk API는 최대 100개를 All-or-Nothing 원자성으로 처리해 하나만 실패해도 전체 롤백하며, SQLAlchemy bulk_insert_mappings로 DB 부하를 최소화합니다.' },
      { title: 'Oracle 클라우드 & Flutter PosePainter', body: 'Oracle x86 Paid $27/월(AWS $61·Azure $70~80 대비)을 선택하고 OCIR 5GB 무료·춘천 리전을 활용, Cloudflare에서 확보한 go2fits.com 도메인·DNS로 서비스합니다. Docker 멀티스테이지와 GitLab CI/CD(k3s ctr import → rollout restart → alembic upgrade → git tag 자동 채번)로 배포했습니다. Flutter는 서버가 반환한 랜드마크(Float32List 33점)를 CustomPainter(PosePainter)로 VideoPlayer 위에 렌더링하고, Paint 객체 캐싱·visibility 필터로 GC thrashing을 방지하며 JWT는 flutter_secure_storage(Android Keystore)에 저장합니다.' },
    ],
    results: 'FastAPI + SQLAlchemy + PostgreSQL 백엔드와 Flutter 앱(Android 우선)을 Google Play Store에 출시했습니다(백엔드 2025.11~, 앱 2026~). Cloudflare에서 확보한 go2fits.com 도메인·DNS로 HTTPS 서비스하며 Oracle x86 $27/월 인프라로 AWS·Azure 대비 절반 이하 비용을 달성했습니다. Kakao OAuth JWT Rotation 보안, MediaPipe(33 landmarks) 규칙 기반 3종목 자세 분석, 오프라인 싱크큐를 실제 운영 환경에서 검증했습니다.',
    stack: ['FastAPI', 'SQLAlchemy', 'PostgreSQL', 'Alembic', 'Pydantic v2', 'Kakao OAuth', 'JWT', 'Hypothesis', 'MediaPipe', 'OpenCV', 'Cloudflare', 'Docker multi-stage', 'k3s', 'Oracle Cloud', 'GitLab CI/CD', 'Flutter', 'Android', 'CustomPainter', 'flutter_secure_storage'],
  },
};
