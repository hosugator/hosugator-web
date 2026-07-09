"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Send, Loader2, PlayCircle } from "lucide-react"; // X 제거(닫기는 셸이 가짐)
import DemoModal from "./DemoModal";

interface CureatDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CureatDemoModal({
  isOpen,
  onClose,
}: CureatDemoModalProps) {
  const { locale } = useLanguage();

  const t = {
    ko: {
      title: "Cureat AI 데모",
      placeholder: "현재 데모는 한국 지역 정보를 기반으로 작동합니다.",
      loading: "AI가 실시간 데이터를 분석 중입니다...",
      example: "강남역 근처 맛집 추천해줘",
      sub: "광고 없는 진짜 맛집 정보를 AI가 분석합니다.",
      inputLabel: "추천받고 싶은 장소나 테마를 입력하세요",
    },
    en: {
      title: "Cureat AI Demo",
      placeholder:
        "Currently, the demo operates based on Korean regional information.",
      loading: "AI is analyzing real-time data...",
      example: "Recommend good restaurants near Gangnam Station.",
      sub: "AI analyzes authentic restaurant info without ads.",
      inputLabel: "Enter a place or theme you'd like recommendations for",
    },
  }[locale];

  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  // (mounted state / overflow-lock useEffect 삭제 — 셸이 처리)

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "https://api.hosugator.com/api/cureat/recommendations/v2",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userInput, language: locale }),
        },
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Demo Error:", error);
      setResult({
        answer: "연결 오류가 발생했습니다. 서버 상태를 확인해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── footer 슬롯: 입력 폼 ──────────────────────────────────────────────
  //   셸의 footer div가 padding·border·배경을 이미 주므로, 여기선 폼 알맹이만.
  //   (기존 form의 p-6/bg-slate-50/border-t 제거 — 셸과 중복이라)
  //   ⚠️ 스타일은 아직 slate — 다음 단계(모노 재스타일)는 당신 몫.
  const footer = (
    <form onSubmit={handleDemoSubmit}>
      <div className="relative">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={t.inputLabel}
          className="w-full pl-5 pr-14 py-3.5 rounded-md border border-neutral-200 bg-white focus:ring-2 focus:ring-neutral-900 outline-none text-neutral-900 placeholder:text-neutral-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 bg-neutral-900 text-white rounded-md hover:bg-accent transition-colors disabled:opacity-30 flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );

  // ── body 슬롯: idle / loading / result 3-state ───────────────────────
  //   셸 body div가 px-6 py-6 padding을 주므로 바깥 p-8은 제거. space-y-6만 유지.
  return (
    <DemoModal
      isOpen={isOpen}
      onClose={onClose}
      title={t.title}
      subtitle={t.placeholder}
      footer={footer}
    >
      <div className="space-y-6">
        {!result && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent/10 rounded-md flex items-center justify-center mx-auto mb-4 text-accent">
              <PlayCircle size={32} />
            </div>
            <p className="text-neutral-900 font-bold italic">{t.example}</p>
            <p className="text-neutral-400 text-sm mt-2 font-light">{t.sub}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="animate-spin text-accent" size={40} />
            <p className="text-neutral-500 text-sm font-medium">{t.loading}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            {/* AI 답변 요약 */}
            <div className="bg-neutral-50 p-5 rounded-md border border-neutral-200">
              <p className="text-neutral-800 font-medium leading-relaxed">
                {result.answer}
              </p>
            </div>

            {/* 추천 장소 리스트 */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest px-1">
                Recommended Places
              </h4>
              {result.restaurants?.map((place: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white border border-neutral-200 rounded-md p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-accent uppercase tracking-tight mb-1 block">
                        Restaurant {idx + 1}
                      </span>
                      <h5 className="text-lg font-black text-neutral-900 leading-none">
                        {place.name}
                      </h5>
                    </div>
                    {place.is_ad_filtered && (
                      <span className="text-[9px] font-black px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded border border-neutral-200 uppercase tracking-tighter">
                        Ad Filtered ({place.filtered_ad_count})
                      </span>
                    )}
                  </div>

                  <p className="text-neutral-400 text-xs mb-3 font-light leading-snug">
                    {place.address}
                  </p>

                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                    {place.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {place.summary_pros?.map((pro: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-neutral-50 text-neutral-500 px-2 py-1 rounded-md border border-neutral-200"
                      >
                        + {pro}
                      </span>
                    ))}
                    {place.summary_cons?.map((con: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-neutral-50 text-neutral-400 px-2 py-1 rounded-md border border-neutral-200"
                      >
                        - {con}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DemoModal>
  );
}
