"use client";

/**
 * AoiDemoModal — V1-AOI(PatchCore) 렌즈 표면 이물 탐지 데모. 세 번째 데모.
 *
 * WHY 앞의 두 데모와 구조가 다른가:
 *   cureat·align-ai는 api.hosugator.com에 요청을 보내는 "라이브 추론" 데모다.
 *   이 데모는 **사전 계산(pre-computed)** 이다 — 학습 시 이미 뽑아둔 anomaly map / contour
 *   PNG를 정적 에셋으로 서빙하고, 프론트는 그중 무엇을 보여줄지만 고른다.
 *
 *   그래서 없는 것: fetch / isLoading / error / 업로드.
 *   대신 있는 것: 샘플 선택 + 뷰 전환(히트맵 ↔ 컨투어).
 *
 *   이유는 추론 예산이다. PatchCore는 WideResNet50 백본 + coreset memory bank가 상주해야 해서
 *   align-ai(EfficientNet-B0)보다 무겁다. Oracle Always Free 2 OCPU ARM 노드를 이미
 *   align-ai(2Gi) + cureat이 나눠 쓰고 있으므로, 라이브 추론은 ONNX 경량화(ml/aoi/export.py)를
 *   거친 뒤 2단계로 미룬다. 정적 데모만으로도 "무엇을 하는 모델인가"는 100% 전달된다.
 *
 * 셸(DemoModal)은 그대로 재사용 — 데모 간 UX 통일. body/footer만 이 파일에서 정의한다.
 */

import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import DemoModal from "./DemoModal";

// ── 샘플 세트 ────────────────────────────────────────────────────────────
// WHY 6장인가: align-ai 데모와 동일한 개수 → 그리드 레이아웃(grid-cols-6)을 그대로 재사용.
//
// WHY 이 6장인가: circle-crop 데이터셋(236×236)에서만 골랐다. 원본 전체 프레임(1120×1120)
//   모델의 anomaly map은 라벨 스티커·배경까지 전부 붉게 반응해 국소화가 안 된다
//   (eval_report.md의 Pixel AUROC 0.0000이 같은 사실을 가리킨다). 반면 circle-crop 세트는
//   배경이 균일한 파란 필드로 나오고 이물만 좁게 붉어져 데모로 읽힌다.
//
// WHY 파일명을 ng-01 / ok-01로 바꿨나: 원본 파일명이
//   `Pc1_Tray162_Scan1_Tap12_Index17_Code3_1` 형태로 트레이·스캔·탭 인덱스와 불량 코드까지
//   담고 있었다. 공개 사이트 에셋 경로에 고객사 생산 메타데이터를 노출하지 않기 위해
//   중립 슬러그로 재명명했다. (circle 세트는 `dustcircle_OK_101` 형태로 덜 민감하지만 동일 적용)
//
// NOTE 원본의 `_OK_`는 라벨이 아니라 원본 파일명의 일부다. 실제 정답은 소스 폴더로 갈린다:
//   abnormal/(=2_dust_circle, 이물 243장) → NG,  normal_test/(=1_test_circle, 68장) → OK
type Verdict = "NG" | "OK";

interface Sample {
  id: string; // 에셋 파일 prefix — `${id}-input|heatmap|contour.webp`
  verdict: Verdict; // 데이터셋 소스 폴더 기준 정답(ground truth)
}

const SAMPLES: Sample[] = [
  { id: "ng-01", verdict: "NG" },
  { id: "ng-02", verdict: "NG" },
  { id: "ng-03", verdict: "NG" },
  { id: "ng-04", verdict: "NG" },
  { id: "ok-01", verdict: "OK" },
  { id: "ok-02", verdict: "OK" },
];

const ASSET_BASE = "/projects/aoi-samples";

// 오버레이 뷰 종류.
//   heatmap = anomaly score를 색으로 (모델이 "어디를 이상하게 보는가")
//   contour = 임계값 넘은 영역의 외곽선을 원본 위에 (실제 공정에서 쓰는 판정 출력)
type ViewMode = "heatmap" | "contour";

export default function AoiDemoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { locale } = useLanguage();
  const t = {
    ko: {
      title: "AOI 이물 탐지 데모",
      subtitle: "PatchCore가 렌즈 표면 이물의 위치를 라벨 없이 국소화합니다",
      samplesLabel: "샘플 선택",
      inputLabel: "입력 (원본)",
      heatmap: "히트맵",
      contour: "컨투어",
      heatmapHint: "이상 점수를 색으로 — 붉을수록 정상 패치와 거리가 멀다",
      contourHint: "임계값을 넘은 영역의 외곽선 — 공정에서 쓰는 판정 출력",
      verdictNG: "이물 검출",
      verdictOK: "정상",
      groundTruth: "데이터셋 정답",
      precomputed:
        "사전 계산된 추론 결과입니다. 학습에 정상 샘플만 사용하는 비지도 방식이라, 불량 이미지를 한 장도 학습하지 않고 이물 위치를 찾습니다.",
    },
    en: {
      title: "AOI Contamination Detection Demo",
      subtitle: "PatchCore localizes surface contamination without labels",
      samplesLabel: "Pick a sample",
      inputLabel: "Input (original)",
      heatmap: "Heatmap",
      contour: "Contour",
      heatmapHint:
        "Anomaly score as color — redder means further from any normal patch",
      contourHint:
        "Outline of regions past the threshold — the verdict output used on the line",
      verdictNG: "Contamination found",
      verdictOK: "Normal",
      groundTruth: "Dataset ground truth",
      precomputed:
        "These are pre-computed inference results. Training uses normal samples only — the model localizes contamination without having seen a single defective image.",
    },
  }[locale];

  // 첫 진입에 이미 결과가 보이도록 NG 샘플 하나를 기본 선택.
  // WHY: 이 데모는 업로드가 없으므로 빈 idle 상태를 보여줄 이유가 없다.
  //      모달을 열자마자 "이물이 붉게 잡힌 그림"이 보이는 게 전달력이 가장 높다.
  const [selected, setSelected] = useState<Sample>(SAMPLES[0]);

  // WHY 뷰를 상태로 두나: 236px 이미지 3장을 가로로 늘어놓으면 전부 눌려서 아무것도 안 보인다.
  //   → 원본은 왼쪽에 고정하고 오른쪽 한 칸만 토글한다.
  // WHY 샘플 변경 시 뷰를 리셋하지 않나: 같은 뷰로 여러 샘플을 훑는 게 비교에 유리하다
  //   (히트맵만 연달아 보면 NG/OK 차이가 바로 드러난다).
  const [view, setView] = useState<ViewMode>("heatmap");

  // WHY 파생 값을 state로 안 두나: 경로는 (선택 샘플, 뷰 모드)로 100% 결정된다.
  //   별도 state로 들면 setSelected와 setView 사이 동기화 버그가 생긴다
  //   (샘플만 바꾸고 경로 갱신을 잊으면 이전 샘플 이미지가 남는다).
  //   "state는 최소, 나머지는 유도" — 렌더마다 계산하는 게 정답.
  const inputSrc = `${ASSET_BASE}/${selected.id}-input.webp`;
  const overlaySrc = `${ASSET_BASE}/${selected.id}-${view}.webp`;

  const isNG = selected.verdict === "NG";

  // 두 <img>가 같은 클래스를 써야 비교 축이 흔들리지 않는다.
  // (236×236 정사각인데 한쪽만 스타일이 다르면 "같은 이미지의 다른 표현"으로 안 읽힌다)
  const imgClass =
    "block w-full rounded-md border border-neutral-200 bg-neutral-900";

  const VIEWS: { mode: ViewMode; label: string }[] = [
    { mode: "heatmap", label: t.heatmap },
    { mode: "contour", label: t.contour },
  ];

  // footer — 샘플 갤러리. align-ai는 업로드 폼이 footer였지만 여기는 업로드가 없으므로
  // 샘플 선택을 footer로 내렸다(셸의 "입력 영역" 슬롯 의미를 그대로 유지).
  const footer = (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-3">
        {t.samplesLabel}
      </p>
      <div className="grid grid-cols-6 gap-2">
        {SAMPLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelected(s)}
            aria-pressed={selected.id === s.id}
            className={`relative rounded-md overflow-hidden border-2 transition-colors ${
              selected.id === s.id
                ? "border-accent"
                : "border-neutral-200 hover:border-neutral-400"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${ASSET_BASE}/${s.id}-input.webp`}
              alt={s.verdict}
              className="block w-full h-14 object-cover"
            />
            <span className="absolute bottom-0 inset-x-0 bg-neutral-900/70 text-white text-[9px] font-mono py-0.5 text-center">
              {s.verdict}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title={t.title}
      subtitle={t.subtitle}
      footer={footer}
    >
      {/* 판정 배지 — 데이터셋 ground truth 라벨.
          WHY 모델의 anomaly score를 안 쓰나: circle 모델의 검증 리포트가 레포에 남아있지 않아
          인용할 수 있는 실제 수치가 없다. 없는 숫자를 만들어 넣는 대신 정답 라벨만 표기하고,
          라벨의 출처를 옆에 명시해 "모델 출력"으로 오해되지 않게 했다. */}
      <div className="flex items-center gap-2.5 mb-5">
        <span
          className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${
            isNG
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-neutral-200 bg-neutral-50 text-neutral-500"
          }`}
        >
          {isNG ? t.verdictNG : t.verdictOK}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
          {t.groundTruth}
        </span>
      </div>

      {/* 비교 뷰 — 왼쪽 원본 고정 / 오른쪽 오버레이 토글 */}
      <div className="grid grid-cols-2 gap-3">
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={inputSrc} alt={t.inputLabel} className={imgClass} />
          <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
            {t.inputLabel}
          </figcaption>
        </figure>

        <figure>
          {/* key를 붙여 뷰 전환 시 <img>를 교체 — 이전 이미지가 남아있다가
              새 이미지로 튀는 깜빡임을 방지한다. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={overlaySrc}
            src={overlaySrc}
            alt={view === "heatmap" ? t.heatmap : t.contour}
            className={imgClass}
          />
          <figcaption className="mt-2 flex gap-3">
            {/* WHY 드롭다운이 아니라 토글 버튼인가: 선택지가 2개뿐이고 즉시 왕복 비교가 목적이다.
                클릭 1회로 오갈 수 있게 항상 노출해 둔다. */}
            {VIEWS.map((v) => (
              <button
                key={v.mode}
                type="button"
                onClick={() => setView(v.mode)}
                aria-pressed={view === v.mode}
                className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  view === v.mode
                    ? "text-accent"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                {v.label}
              </button>
            ))}
          </figcaption>
        </figure>
      </div>

      {/* 현재 뷰가 무엇을 보여주는지 한 줄 설명 — 히트맵과 컨투어의 의미가 다르다. */}
      <p className="mt-3 text-xs font-light leading-relaxed text-neutral-500">
        {view === "heatmap" ? t.heatmapHint : t.contourHint}
      </p>

      {/* 방식 설명 — 데모의 핵심 주장(비지도)을 문장으로 못박는다.
          WHY 필요한가: 히트맵만 보면 "불량 이미지로 학습한 분류기"로 오해할 수 있다.
               PatchCore가 정상 샘플만으로 memory bank를 만든다는 점이 이 모델 선택의 이유다. */}
      <p className="mt-4 border-t border-neutral-200 pt-4 text-xs font-light leading-relaxed text-neutral-500">
        {t.precomputed}
      </p>
    </DemoModal>
  );
}
