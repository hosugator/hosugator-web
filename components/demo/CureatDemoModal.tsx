'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Loader2, PlayCircle } from 'lucide-react';

interface CureatDemoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CureatDemoModal({ isOpen, onClose }: CureatDemoModalProps) {
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
            placeholder: "Currently, the demo operates based on Korean regional information.",
            loading: "AI is analyzing real-time data...",
            example: "Recommend good restaurants near Gangnam Station in Korean.",
            sub: "AI analyzes authentic restaurant info without ads.",
            inputLabel: "Enter a place or theme you'd like recommendations for",
        }
    }[locale];

    const [mounted, setMounted] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const handleDemoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch("https://api.hosugator.com/recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userInput, language: locale }),
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Demo Error:", error);
            setResult({ answer: "연결 오류가 발생했습니다. 서버 상태를 확인해주세요." });
        } finally {
            setIsLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* 배경 흐림 처리 */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            {/* 모달 본체 */}
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300">
                {/* 헤더 */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white text-slate-900">
                    <div className="text-left">
                        <h3 className="text-2xl font-black tracking-tighter">{t.title}</h3>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">{t.placeholder}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                {/* 대화/결과 영역 */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 min-h-[300px]">
                    {!result && !isLoading && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-[#13ecda]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#13ecda]">
                                <PlayCircle size={32} />
                            </div>
                            <p className="text-slate-900 font-bold italic">{t.example}</p>
                            <p className="text-slate-400 text-sm mt-2 font-light">{t.sub}</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="animate-spin text-[#13ecda]" size={40} />
                            <p className="text-slate-500 text-sm font-medium">{t.loading}</p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                            {/* AI 답변 요약 */}
                            <div className="bg-[#13ecda]/5 p-5 rounded-2xl border border-[#13ecda]/20 shadow-sm">
                                <p className="text-slate-800 font-medium leading-relaxed">
                                    {result.answer}
                                </p>
                            </div>

                            {/* 추천 장소 리스트 (백엔드 상세 데이터 포함) */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Recommended Places</h4>
                                {result.restaurants?.map((place: any, idx: number) => (
                                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className="text-[10px] font-bold text-[#13ecda] uppercase tracking-tight mb-1 block">Restaurant {idx + 1}</span>
                                                <h5 className="text-lg font-black text-slate-900 leading-none">{place.name}</h5>
                                            </div>
                                            {place.is_ad_filtered && (
                                                <span className="text-[9px] font-black px-2 py-0.5 bg-rose-50 text-rose-500 rounded border border-rose-100 uppercase tracking-tighter">
                                                    Ad Filtered ({place.filtered_ad_count})
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-slate-400 text-xs mb-3 font-light leading-snug">{place.address}</p>

                                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                            {place.summary}
                                        </p>

                                        {/* 장점(Pros) 및 단점(Cons) 태그 */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {place.summary_pros?.map((pro: string, i: number) => (
                                                <span key={i} className="text-[10px] font-medium bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100">
                                                    + {pro}
                                                </span>
                                            ))}
                                            {place.summary_cons?.map((con: string, i: number) => (
                                                <span key={i} className="text-[10px] font-medium bg-rose-50/30 text-rose-400 px-2 py-1 rounded-md border border-rose-50">
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

                {/* 입력 영역 */}
                <form onSubmit={handleDemoSubmit} className="p-6 bg-slate-50 border-t border-slate-100">
                    <div className="relative">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={t.inputLabel}
                            className="w-full pl-6 pr-14 py-4 rounded-2xl border-none bg-white shadow-inner focus:ring-2 focus:ring-[#13ecda] outline-none text-slate-900 placeholder:text-slate-300"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !userInput.trim()}
                            className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white rounded-xl hover:bg-[#13ecda] transition-colors disabled:opacity-30 flex items-center justify-center"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}