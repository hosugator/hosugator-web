"use client";

/**
 * AlignAiDemoModal — cureat과 "같은 셸(DemoModal)"을 쓰되 body/footer만 다른 두 번째 데모.
 *   footer: 이미지 업로드 / body: 캔버스 오버레이(검출 라인) + mm 측정치.
 *   백엔드: POST https://api.hosugator.com/api/align-ai/predict (multipart) → 좌표 JSON.
 */

import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";
import { Loader2, Upload, ImageUp, RotateCcw } from "lucide-react";
import DemoModal from "./DemoModal";
import AgentExplain from "./AgentExplain";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// 데모용 샘플 (align-ai 레포 data/train/Q-display/images 발췌).
//
// 파일명·태그를 **모델 출력 기준**으로 다시 정했다 (2026-08-03).
// WHY: 이전 태그(V·OK, H·Fail …)는 원본 데이터셋 라벨이었고 방향 표기가 모델 판정과
//   어긋났다(전부 V로 나왔다 — direction=auto가 파일명을 보던 버그. align-ai 1f9e793에서 수정).
//   그리고 OK/NG/Fail이 무엇을 뜻하는지 맥락 없이는 알 수 없었다.
//   이제 실측 기준으로 분류한다:
//     FAIL — 두 번째 기준선을 조각으로만 검출(길이비 0.10~0.24). 측정값을 신뢰할 수 없다.
//     NG   — 검출은 정상이나 간격이 공차를 벗어남
//     OK   — 검출 정상 + 공차 내
const SAMPLES = [
  { file: "ok-1.jpg", tag: "OK" },
  { file: "ok-2.jpg", tag: "OK" },
  { file: "ng-1.jpg", tag: "NG" },
  { file: "fail-1.jpg", tag: "FAIL" },
  { file: "fail-2.jpg", tag: "FAIL" },
  { file: "fail-3.jpg", tag: "FAIL" },
];

// 공차는 프론트에 두지 않는다.
// WHY: 공차는 제품 사양이므로 서버(product_config.py)가 단일 출처다. UI 상수로 복제하면
//   소비자마다 값이 갈릴 수 있다. /predict가 verdict(PASS/NG)와 근거(공칭·공차)를 함께
//   반환하므로 프론트는 그것을 표시만 한다.

// /predict 응답 형태 (백엔드 server.py 참고)
interface PredictResult {
  status: string;
  direction: "V" | "H";
  line1_px: number;
  line2_px: number;
  gap_px: number;
  line1_mm: number;
  line2_mm: number;
  gap_mm: number;
  verdict: "PASS" | "NG" | null;   // 공차 미정의 제품이면 null
  gap_nominal_mm: number | null;
  gap_tolerance_mm: number | null;
  img_w: number;
  img_h: number;
}

// 캔버스 ctx는 Tailwind 클래스를 못 쓰므로 accent 색을 hex로 직접. (= --color-accent)
const ACCENT = "#35618E";

export default function AlignAiDemoModal({ isOpen, onClose }: Props) {
  const { locale } = useLanguage();
  const t = {
    ko: {
      title: "Align AI 데모",
      placeholder: "렌즈 검사 이미지의 기준선을 AI가 검출·측정합니다",
      uploadPrompt: "검사 이미지를 업로드하세요",
      uploadHint: "Q-display 렌즈 이미지 (JPG)",
      samplesLabel: "샘플 이미지로 체험하기",
      loading: "AI가 기준선을 검출 중입니다...",
      pick: "이미지 선택",
      analyze: "분석",
      err: "분석 중 오류가 발생했습니다. 서버 상태를 확인해주세요.",
      line1: "라인 1",
      line2: "라인 2",
      gap: "간격",
      reset: "다른 이미지 선택",
      pass: "합격",
      fail: "불합격",
      spec: (n: number, tol: number) =>
        `규격 공칭 ${n}mm ±${tol} (합격 ${(n - tol).toFixed(2)}~${(n + tol).toFixed(2)}mm)`,
    },
    en: {
      title: "Align AI Demo",
      placeholder:
        "AI detects & measures reference lines in lens inspection images",
      uploadPrompt: "Upload an inspection image",
      uploadHint: "Q-display lens image (JPG)",
      samplesLabel: "Try a sample image",
      loading: "AI is detecting reference lines...",
      pick: "Pick image",
      analyze: "Analyze",
      err: "An error occurred during analysis. Please check the server.",
      line1: "Line 1",
      line2: "Line 2",
      gap: "Gap",
      reset: "Pick another image",
      pass: "PASS",
      fail: "NG",
      spec: (n: number, tol: number) =>
        `Spec ${n}mm ±${tol} (pass ${(n - tol).toFixed(2)}–${(n + tol).toFixed(2)}mm)`,
    },
  }[locale];

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 파일 선택 → object URL로 미리보기. 이전 URL은 revoke(메모리 누수 방지).
  const handleFile = (f: File, sampleFile: string | null = null) => {
    setResult(null);
    setError(null);
    setFile(f);
    setSelectedSample(sampleFile);
    setImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  };

  // 샘플 썸네일 클릭 → public 정적 이미지를 fetch해 File로 감싸서 handleFile 재사용.
  // (백엔드는 multipart 업로드만 받으므로, 실제 업로드와 동일한 경로를 태워야 함)
  const handleSampleSelect = async (sampleFile: string) => {
    try {
      const res = await fetch(`/projects/alignai-samples/${sampleFile}`);
      const blob = await res.blob();
      const f = new File([blob], sampleFile, {
        type: blob.type || "image/jpeg",
      });
      handleFile(f, sampleFile);
    } catch (err) {
      console.error("Sample load error:", err);
    }
  };

  // 결과/에러 화면 → idle로 복귀 (다른 샘플을 다시 클릭할 수 있도록).
  const handleReset = () => {
    setResult(null);
    setError(null);
    setFile(null);
    setSelectedSample(null);
    setImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  // ── TODO(you) #1: 멀티파트 제출 ─────────────────────────────────────────
  //   cureat은 JSON이었지만, 이미지는 FormData(multipart)로 보낸다.
  //   힌트:
  //     const fd = new FormData(); fd.append("file", file);
  //     const res = await fetch(
  //       "https://api.hosugator.com/api/align-ai/predict?product=Q-display&direction=auto",
  //       { method: "POST", body: fd });   // ⚠️ Content-Type 수동 설정 금지 (브라우저가 boundary 자동 삽입)
  //     const data = await res.json(); setResult(data);
  //   상태 흐름은 cureat과 동일: setIsLoading(true) → try/catch(setError)/finally(setIsLoading(false)).

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      // ... 여기 구현 (FormData + fetch + setResult)
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(
        "https://api.hosugator.com/api/align-ai/predict?product=Q-display&direction=auto",
        { method: "POST", body: fd },
      );
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Align Demo Error:", err);
      setError(t.err);
    } finally {
      setIsLoading(false);
    }
  };

  // 검출된 기준선을 캔버스에 그린다. canvas 크기 = result.img_w/img_h(raw px 좌표계),
  // CSS(w-full)가 표시 크기로 축소 → 스케일 계산·이미지 로드 타이밍 불필요.
  useEffect(() => {
    if (!result) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 3;
    const drawLine = (pos: number) => {
      ctx.beginPath();
      if (result.direction === "V") {
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, canvas.height); // 세로선
      } else {
        ctx.moveTo(0, pos);
        ctx.lineTo(canvas.width, pos); // 가로선
      }
      ctx.stroke();
    };
    drawLine(result.line1_px);
    drawLine(result.line2_px);
  }, [result]);

  // ── footer 슬롯: 업로드 ─────────────────────────────────────────────────
  const footer = (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <label className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md border border-neutral-200 bg-white cursor-pointer hover:border-neutral-400 transition-colors">
        <ImageUp size={16} className="text-neutral-400 shrink-0" />
        <span className="text-sm text-neutral-500 truncate">
          {file ? file.name : t.pick}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          disabled={isLoading}
        />
      </label>
      <button
        type="submit"
        disabled={isLoading || !file}
        className="px-5 py-3 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-accent transition-colors disabled:opacity-30 flex items-center gap-2"
      >
        <Upload size={16} />
        {t.analyze}
      </button>
    </form>
  );

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title={t.title}
      subtitle={t.placeholder}
      footer={footer}
      wide
    >
      {/* idle */}
      {!result && !isLoading && !error && (
        // 초기 화면도 2단으로 둔다.
        // WHY: 결과가 나온 뒤에야 에이전트가 등장하면 "이 데모에 AI 설명이 있다"를 모르고
        //   샘플만 한 번 눌러보고 닫는다. 진입 순간부터 오른쪽에 보이면 무엇을 할 수 있는지
        //   먼저 읽힌다. 실행은 이미지가 있어야 가능하므로 버튼은 비활성 상태로 둔다.
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-accent/10 rounded-md flex items-center justify-center mx-auto mb-4 text-accent">
            <ImageUp size={32} />
          </div>
          <p className="text-neutral-900 font-bold">{t.uploadPrompt}</p>
          <p className="text-neutral-400 text-sm mt-2 font-light">
            {t.uploadHint}
          </p>

          {/* 샘플 갤러리 — 업로드 없이 바로 체험 가능하도록 */}
          <div className="mt-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-3">
              {t.samplesLabel}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.file}
                  type="button"
                  onClick={() => handleSampleSelect(s.file)}
                  className={`relative rounded-md overflow-hidden border-2 transition-colors ${
                    selectedSample === s.file
                      ? "border-accent"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/projects/alignai-samples/${s.file}`}
                    alt={s.tag}
                    className="block w-full h-16 object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-neutral-900/70 text-white text-[9px] font-mono py-0.5 text-center">
                    {s.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

          {/* 오른쪽: 에이전트 안내 — 아직 실행 불가하지만 존재를 먼저 알린다 */}
          <div className="lg:border-l lg:border-neutral-200 lg:pl-6">
            <AgentExplain file={null} locale={locale} />
          </div>
        </div>
      )}

      {/* loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="animate-spin text-accent" size={40} />
          <p className="text-neutral-500 text-sm font-medium">{t.loading}</p>
        </div>
      )}

      {/* error */}
      {error && !isLoading && (
        <div className="py-12 text-center">
          <p className="text-neutral-600 text-sm">{error}</p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-accent transition-colors"
          >
            <RotateCcw size={14} />
            {t.reset}
          </button>
        </div>
      )}

      {/* result: 캔버스 오버레이 + mm 측정치 */}
      {result && imageUrl && !isLoading && (
        // 2단 레이아웃 — 왼쪽 추론 결과, 오른쪽 에이전트.
        // WHY: 세로로 쌓으면 에이전트가 스크롤 아래로 밀려 존재를 모르고 지나친다.
        //   나란히 두면 진입 즉시 "설명을 받을 수 있다"가 보인다.
        //   모바일(< lg)에서는 화면 폭이 부족하므로 한 컬럼으로 떨어뜨린다.
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] animate-in fade-in duration-500">
          <div className="space-y-4">
          {/* 이미지 + 라인 오버레이 (둘 다 w-full → 동일 스케일로 겹침) */}
          {/* 검사 이미지가 3036×4024 세로형이라 폭에 맞추면 세로로 너무 길어져
              측정치·판정이 스크롤 아래로 밀린다. 높이를 기준으로 제한하고 폭을 따라오게 한다.
              래퍼가 이미지를 딱 감싸므로(w-fit) 캔버스의 inset-0가 렌더된 이미지와 정확히 겹친다. */}
          <div className="relative mx-auto w-fit max-h-[42vh] overflow-hidden rounded-md border border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="inspection"
              className="block max-h-[42vh] w-auto"
            />
            <canvas
              ref={canvasRef}
              width={result.img_w}
              height={result.img_h}
              className="absolute inset-0 h-full w-full"
            />
          </div>

          {/* 측정치 readout — 모노 라벨 + 값 */}
          <div className="grid grid-cols-3 overflow-hidden rounded-md border border-neutral-200 divide-x divide-neutral-200">
            {[
              { label: t.line1, value: result.line1_mm },
              { label: t.line2, value: result.line2_mm },
              { label: t.gap, value: result.gap_mm },
            ].map((m) => (
              <div key={m.label} className="px-4 py-3 text-center">
                <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                  {m.label}
                </div>
                <div className="mt-1 font-display text-lg font-black text-neutral-900">
                  {m.value}
                  <span className="text-xs font-medium text-neutral-400 ml-1">
                    mm
                  </span>
                </div>
              </div>
            ))}
          </div>

            {/* 판정 — 서버가 규격과 비교해 내린 결과를 그대로 표시한다.
                공차가 정의되지 않은 제품은 verdict가 null이므로 판정을 생략한다. */}
            {result.verdict && (
              <div className="text-center">
                <span
                  className={`inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${
                    result.verdict === "PASS"
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : "border-neutral-300 bg-neutral-50 text-neutral-500"
                  }`}
                >
                  {result.verdict === "PASS" ? t.pass : t.fail}
                </span>
                {result.gap_nominal_mm !== null &&
                  result.gap_tolerance_mm !== null && (
                    <p className="mt-2 text-[11px] font-light text-neutral-400">
                      {t.spec(result.gap_nominal_mm, result.gap_tolerance_mm)}
                    </p>
                  )}
              </div>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="mx-auto flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-accent transition-colors"
            >
              <RotateCcw size={14} />
              {t.reset}
            </button>
          </div>

          {/* ── 오른쪽: 에이전트 설명 ──────────────────────────────────────
              WHY 에이전트가 옆에 있는가: U-Net은 gap_mm 1.4062 같은 숫자만 준다. 방문자는
                이게 왜 정상인지, 실패했다면 왜인지 알 수 없다. 그 해석이 이 프로젝트가 LLM
                에이전트를 만든 원래 이유다.
              WHY 자동 실행이 아니라 버튼인가: 추론은 330ms지만 에이전트는 10~20초 걸리고
                LLM 호출에 비용이 붙는다. 업로드마다 자동이면 비용이 트래픽에 비례한다.
                버튼이면 결과는 즉시 보이고 설명은 원할 때만 기다린다. */}
          <div className="lg:border-l lg:border-neutral-200 lg:pl-6">
            <AgentExplain file={file} locale={locale} />
          </div>
        </div>
      )}
    </DemoModal>
  );
}
