"use client";

/**
 * AoiDemoModal — V1-AOI(PatchCore) 렌즈 표면 이물 탐지 데모. 세 번째 데모.
 *
 * WHY 업로드가 없는가 (이 데모의 핵심 설계):
 *   PatchCore의 memory bank는 이 렌즈 정상 267장의 패치 임베딩으로 만들어졌다. 추론은
 *   "입력 패치가 가장 가까운 정상 패치와 얼마나 먼가"를 재는 것이므로, 무관한 이미지를
 *   넣으면 모든 패치가 정상 분포에서 멀어 전체가 붉게 나오는 무의미한 출력이 된다.
 *   일반화하는 분류기가 아니다. → 입력은 고정 샘플 6장으로 한정한다.
 *
 *   대신 **추론은 요청마다 실제로 돈다.** api.hosugator.com/api/aoi/infer/{id}가
 *   arm64 노드에서 onnxruntime을 돌려 heatmap·contour·score를 만들어 돌려준다.
 *   사전 계산된 PNG를 서빙하는 것과 구별되는 지점이고, 응답의 latency_ms를 UI에 그대로
 *   노출해 "진짜 모델이 진짜로 돈다"는 것을 숨기지 않고 드러낸다.
 *
 * WHY 정적 에셋 폴백을 두는가:
 *   추론이 1.8초 걸리고 단일 replica라, 파드 재시작·콜드스타트 시점에 요청이 실패할 수 있다.
 *   포트폴리오에서 데모가 에러 화면을 보이는 것이 가장 나쁘므로, 실패 시 커밋된 정적
 *   결과(public/projects/aoi-samples)로 조용히 대체하고 배지로만 상태를 알린다.
 *
 * 셸(DemoModal)은 그대로 재사용 — 데모 간 UX 통일. body/footer만 이 파일에서 정의한다.
 */

import { useLanguage } from "@/contexts/LanguageContext";
import { useCallback, useEffect, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import DemoModal from "./DemoModal";

// ── 샘플 세트 ────────────────────────────────────────────────────────────
// 서버(app.py)의 SAMPLES 딕셔너리와 id·verdict가 일치해야 한다.
//
// WHY 이 6장인가: circle-crop 데이터셋(236×236)에서만 골랐다. 원본 전체 프레임(1120×1120)
//   모델의 anomaly map은 라벨 스티커·배경까지 전부 붉게 반응해 국소화가 안 된다.
//   반면 circle-crop 세트는 배경이 균일한 파란 필드로 나오고 이물만 좁게 붉어진다.
//
// NOTE verdict는 데이터셋 소스 폴더 기준 정답이다(모델 출력이 아니다).
//   abnormal/(2_dust_circle, 이물 243장) → NG,  normal_test/(1_test_circle, 68장) → OK
type Verdict = "NG" | "OK";

interface Sample {
  id: string;
  verdict: Verdict;
}

const SAMPLES: Sample[] = [
  { id: "ng-01", verdict: "NG" },
  { id: "ng-02", verdict: "NG" },
  { id: "ng-03", verdict: "NG" },
  { id: "ng-04", verdict: "NG" },
  { id: "ok-01", verdict: "OK" },
  { id: "ok-02", verdict: "OK" },
];

const API_BASE = "https://api.hosugator.com/api/aoi";

// 폴백용 정적 결과. 썸네일(입력 이미지)에도 이걸 쓴다 — 6장을 API로 받을 이유가 없다.
const ASSET_BASE = "/projects/aoi-samples";

type ViewMode = "heatmap" | "contour";

// GET /infer/{id} 응답 형태 (서버 app.py 참고)
interface InferResult {
  id: string;
  verdict: Verdict;
  score: number; // 이미지 레벨 이상 점수 (0~1, threshold 기준 정규화됨)
  label: boolean; // true = 이물 검출
  latency_ms: number; // 실제 추론 시간
  input_png: string; // base64 PNG
  heatmap_png: string;
  contour_png: string;
}

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
      loading: "추론 중입니다",
      loadingHint: "WideResNet50 백본 · arm64 2 vCPU에서 약 1.8초 소요됩니다",
      retry: "다시 시도",
      fallback: "정적 결과 표시 중 (서버 응답 없음)",
      score: "이상 점수",
      latency: "추론 시간",
      why:
        "업로드를 받지 않습니다. PatchCore는 정상 이미지의 패치 임베딩으로 memory bank를 만들고 " +
        "추론 시 가장 가까운 정상 패치와의 거리를 이상 점수로 쓰므로, 이 렌즈 공정과 무관한 " +
        "이미지를 넣으면 전체가 이상으로 반응해 의미가 없습니다. 대신 고정 샘플에 대해 " +
        "요청마다 실제로 추론이 실행됩니다.",
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
      loading: "Running inference",
      loadingHint:
        "WideResNet50 backbone · about 1.8s on an arm64 2 vCPU node",
      retry: "Try again",
      fallback: "Showing static result (server unreachable)",
      score: "Anomaly score",
      latency: "Inference time",
      why:
        "No uploads. PatchCore builds a memory bank from patch embeddings of normal images and " +
        "scores anomalies by distance to the nearest normal patch — so an image unrelated to this " +
        "lens process would light up entirely and mean nothing. Instead, inference actually runs " +
        "on each request against the fixed samples.",
    },
  }[locale];

  const [selected, setSelected] = useState<Sample>(SAMPLES[0]);
  const [view, setView] = useState<ViewMode>("heatmap");
  const [result, setResult] = useState<InferResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // 폴백 모드 — API 실패 시 정적 에셋으로 대체했음을 표시한다(에러 화면을 띄우지 않는다).
  const [fellBack, setFellBack] = useState(false);

  const runInference = useCallback(async (sample: Sample) => {
    setIsLoading(true);
    setFellBack(false);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/infer/${sample.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResult((await res.json()) as InferResult);
    } catch {
      // 조용히 정적 결과로 대체. 사용자에게 스택트레이스를 보여줄 이유가 없다.
      setFellBack(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 모달이 열릴 때, 그리고 샘플이 바뀔 때마다 추론한다.
  // WHY 캐시하지 않나: 같은 샘플을 다시 눌러도 다시 도는 게 "실제로 추론한다"는 주장에 맞다.
  //   결과를 캐싱하면 두 번째부터는 사전 계산과 구별되지 않는다.
  useEffect(() => {
    if (!isOpen) return;
    runInference(selected);
  }, [isOpen, selected, runInference]);

  const isNG = selected.verdict === "NG";

  const imgClass =
    "block w-full rounded-md border border-neutral-200 bg-neutral-900";

  // 표시할 이미지 소스 — API 결과가 있으면 base64, 없으면 정적 에셋.
  // WHY 파생 계산인가: (result, selected, view)로 100% 결정된다. state로 들면 동기화 버그가 생긴다.
  const png = (b64: string) => `data:image/png;base64,${b64}`;
  const inputSrc = result
    ? png(result.input_png)
    : `${ASSET_BASE}/${selected.id}-input.webp`;
  const overlaySrc = result
    ? png(view === "heatmap" ? result.heatmap_png : result.contour_png)
    : `${ASSET_BASE}/${selected.id}-${view}.webp`;

  const VIEWS: { mode: ViewMode; label: string }[] = [
    { mode: "heatmap", label: t.heatmap },
    { mode: "contour", label: t.contour },
  ];

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
            disabled={isLoading}
            aria-pressed={selected.id === s.id}
            className={`relative rounded-md overflow-hidden border-2 transition-colors disabled:opacity-40 ${
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
      {/* 상단 메타 행 — 정답 배지 + 모델 출력(점수·지연) */}
      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
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

        {/* 모델이 실제로 돌았을 때만 노출 — 폴백 상태에서 가짜 수치를 보이지 않는다. */}
        {result && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            {t.score} {result.score} · {t.latency} {Math.round(result.latency_ms)}ms
          </span>
        )}
        {fellBack && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
            {t.fallback}
            <button
              type="button"
              onClick={() => runInference(selected)}
              className="inline-flex items-center gap-1 text-neutral-500 hover:text-accent transition-colors"
            >
              <RotateCcw size={11} />
              {t.retry}
            </button>
          </span>
        )}
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
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={overlaySrc.slice(0, 64)}
              src={overlaySrc}
              alt={view === "heatmap" ? t.heatmap : t.contour}
              className={`${imgClass} ${isLoading ? "opacity-30" : ""}`}
            />
            {/* 로딩을 이미지 위에 겹친다 — 레이아웃이 흔들리지 않고, 이전 결과가 흐리게
                남아 "무엇이 갱신되는 중인지"가 보인다. */}
            {isLoading && (
              <div className="absolute inset-0 grid place-items-center">
                <Loader2 className="animate-spin text-accent" size={28} />
              </div>
            )}
          </div>
          <figcaption className="mt-2 flex gap-3">
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

      <p className="mt-3 text-xs font-light leading-relaxed text-neutral-500">
        {isLoading ? t.loadingHint : view === "heatmap" ? t.heatmapHint : t.contourHint}
      </p>

      {/* 업로드가 없는 이유 — 이 데모의 논지. 없으면 "왜 내 이미지를 못 넣지"로 읽힌다. */}
      <p className="mt-4 border-t border-neutral-200 pt-4 text-xs font-light leading-relaxed text-neutral-500">
        {t.why}
      </p>
    </DemoModal>
  );
}
