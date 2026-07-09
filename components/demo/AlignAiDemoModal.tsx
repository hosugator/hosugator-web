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

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// 데모용 샘플 이미지 (align-ai 레포 data/train/Q-display/images 발췌).
// 업로드 없이도 체험 가능하도록 방향(V/H)·판정(OK/Fail/NG)을 다양하게 섞어 6장 선정.
const SAMPLES = [
  { file: "sample-1.jpg", tag: "V · OK" },
  { file: "sample-2.jpg", tag: "H · OK" },
  { file: "sample-3.jpg", tag: "V · Fail" },
  { file: "sample-4.jpg", tag: "H · Fail" },
  { file: "sample-5.jpg", tag: "V · NG" },
  { file: "sample-6.jpg", tag: "H · OK" },
];

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
    >
      {/* idle */}
      {!result && !isLoading && !error && (
        <div className="text-center py-12">
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
        <div className="space-y-4 animate-in fade-in duration-500">
          {/* 이미지 + 라인 오버레이 (둘 다 w-full → 동일 스케일로 겹침) */}
          <div className="relative rounded-md overflow-hidden border border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="inspection"
              className="block w-full h-auto"
            />
            <canvas
              ref={canvasRef}
              width={result.img_w}
              height={result.img_h}
              className="absolute inset-0 w-full h-full"
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

          <button
            type="button"
            onClick={handleReset}
            className="mx-auto flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-accent transition-colors"
          >
            <RotateCcw size={14} />
            {t.reset}
          </button>
        </div>
      )}
    </DemoModal>
  );
}
