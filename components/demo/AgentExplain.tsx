"use client";

/**
 * AgentExplain — AlignAI 데모 안에 얹히는 "AI 설명" 단계.
 *
 * U-Net이 낸 측정값(gap_mm 1.3894 같은 숫자) 아래에 붙어, LLM 에이전트가 그 숫자와
 * 이미지를 근거로 현장 언어의 설명을 만든다. 이 프로젝트가 에이전트를 만든 원래 이유가
 * "현장 작업자가 모델 출력을 못 읽는다"였으므로, 숫자 옆이 그 설명의 제자리다.
 *
 * WHY 트레이스를 보여주는가:
 *   최종 답변만 보이면 "GPT에 물어본 것"과 구별되지 않는다. 모델이 어떤 도구를 어떤
 *   순서로 스스로 골랐는지가 남아야 function calling·ReAct의 증거가 된다.
 *   특히 run_prediction은 **에이전트가 AlignAI U-Net을 도구로 호출하는** 장면이라,
 *   두 모델의 관계가 화면에 드러나는 지점이다.
 *
 * WHY SSE인가:
 *   요청 1회가 5~20초다(정상 이미지는 U-Net→멀티모달 2단계, 분포 밖 이미지는 1단계에서 종료).
 *   스피너만 띄우면 이탈하지만, 단계를 발생 즉시 흘리면 대기가 그대로 볼거리가 된다.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Sparkles, Search, ScanLine, Image as ImageIcon } from "lucide-react";

const API_URL = "https://api.hosugator.com/api/agent/explain";

type Event =
  | { type: "start" }
  | { type: "thinking"; at_ms: number }
  | { type: "tool_call"; name: string; args: Record<string, unknown>; at_ms: number }
  | { type: "tool_result"; name: string; content: string; at_ms: number }
  | { type: "answer"; content: string; llm_calls: number; latency_ms: number }
  | { type: "truncated"; llm_calls: number; latency_ms: number }
  | { type: "error"; message: string };

// 도구별 아이콘 — run_prediction이 U-Net 호출임을 시각적으로 구분한다.
const TOOL_ICON: Record<string, typeof Search> = {
  run_prediction: ScanLine,
  analyze_image: ImageIcon,
  search_reference: Search,
};

const TOOL_LABEL_KO: Record<string, string> = {
  run_prediction: "U-Net 정렬선 검출",
  analyze_image: "이미지 직접 판독",
  search_reference: "과거 사례 대조",
};

const TOOL_LABEL_EN: Record<string, string> = {
  run_prediction: "U-Net line detection",
  analyze_image: "Direct image reading",
  search_reference: "Reference case lookup",
};

export default function AgentExplain({
  file,
  locale,
}: {
  file: File | null;
  locale: "ko" | "en";
}) {
  const t =
    locale === "en"
      ? {
          cta: "Ask the agent to explain",
          running: "Agent is working",
          answer: "Explanation",
          stats: (c: number, ms: number) => `${c} LLM calls · ${(ms / 1000).toFixed(1)}s`,
          err: "Could not reach the agent. Please try again in a moment.",
          note: "An LLM agent picks its own tools — it calls the U-Net model, reads the image, and compares past cases.",
          labels: TOOL_LABEL_EN,
        }
      : {
          cta: "AI에게 설명 요청",
          running: "에이전트 실행 중",
          answer: "설명",
          stats: (c: number, ms: number) => `LLM ${c}회 · ${(ms / 1000).toFixed(1)}초`,
          err: "에이전트에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
          note: "LLM 에이전트가 도구를 스스로 고릅니다 — U-Net 모델을 호출하고, 이미지를 직접 읽고, 과거 사례와 대조합니다.",
          labels: TOOL_LABEL_KO,
        };

  const [events, setEvents] = useState<Event[]>([]);
  const [running, setRunning] = useState(false);
  const [failed, setFailed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // 이미지가 바뀌면 이전 설명은 무효다 — 다른 이미지의 설명이 남아 있으면 오해를 부른다.
  useEffect(() => {
    abortRef.current?.abort();
    setEvents([]);
    setFailed(false);
    setRunning(false);
  }, [file]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(async () => {
    if (!file) return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setEvents([]);
    setFailed(false);
    setRunning(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(API_URL, { method: "POST", body: form, signal: ac.signal });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      // SSE를 직접 파싱한다. EventSource를 쓰지 않는 이유: POST를 못 보내고,
      // 스트림이 끝나면 자동 재연결해 같은 요청을 다시 돌린다.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const frames = buf.split("\n\n");
        buf = frames.pop() ?? ""; // 마지막 조각은 미완성일 수 있어 남긴다
        for (const f of frames) {
          const line = f.split("\n").find((l) => l.startsWith("data: "));
          if (line) setEvents((prev) => [...prev, JSON.parse(line.slice(6)) as Event]);
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setFailed(true);
    } finally {
      setRunning(false);
    }
  }, [file]);

  const answer = events.find((e) => e.type === "answer") as
    | Extract<Event, { type: "answer" }>
    | undefined;
  const steps = events.filter(
    (e) => e.type === "tool_call" || e.type === "tool_result",
  );

  // 아직 안 눌렀으면 버튼만 보인다 — 결과(측정치)를 가리지 않는다.
  if (!running && events.length === 0) {
    return (
      <div className="border-t border-neutral-200 pt-4">
        <button
          type="button"
          onClick={run}
          disabled={!file}
          data-goatcounter-click="demo-agent/explain"
          className="mx-auto flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-bold text-neutral-700 transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
        >
          <Sparkles size={15} />
          {t.cta}
        </button>
        {failed && (
          <p className="mt-3 text-center text-xs text-neutral-500">{t.err}</p>
        )}
      </div>
    );
  }

  return (
    <div className="border-t border-neutral-200 pt-4">
      {/* 도구 호출 트레이스 */}
      <ol className="relative border-l border-neutral-200 pl-4">
        {steps.map((e, i) => {
          if (e.type === "tool_call") {
            const Icon = TOOL_ICON[e.name] ?? Sparkles;
            return (
              <li key={i} className="relative mb-1.5">
                <span className="absolute -left-[23px] top-0.5 grid h-3 w-3 place-items-center rounded-full bg-accent text-white">
                  <Icon size={8} />
                </span>
                <span className="font-mono text-[11px] text-accent">
                  {t.labels[e.name] ?? e.name}
                </span>
              </li>
            );
          }
          return (
            <li key={i} className="relative mb-3">
              <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-neutral-200" />
              <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-neutral-500">
                {e.content.length > 200 ? `${e.content.slice(0, 200)}…` : e.content}
              </pre>
            </li>
          );
        })}
        {running && (
          <li className="relative">
            <span className="absolute -left-[23px] top-0.5">
              <Loader2 className="animate-spin text-accent" size={12} />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              {t.running}
            </span>
          </li>
        )}
      </ol>

      {answer && (
        <div className="mt-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              {t.answer}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              {t.stats(answer.llm_calls, answer.latency_ms)}
            </span>
          </div>
          <p className="text-sm font-light leading-relaxed text-neutral-700">
            {answer.content}
          </p>
        </div>
      )}

      {failed && <p className="mt-3 text-xs text-neutral-500">{t.err}</p>}

      <p className="mt-4 text-xs font-light leading-relaxed text-neutral-400">
        {t.note}
      </p>
    </div>
  );
}
