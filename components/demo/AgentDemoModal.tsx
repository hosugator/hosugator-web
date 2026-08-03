"use client";

/**
 * AgentDemoModal — 현장 이상 설명 LLM 에이전트 데모 (AlignAI).
 *
 * WHY 트레이스를 보여주는가 (이 데모의 존재 이유):
 *   최종 답변만 보이면 "GPT에 물어본 것"과 구별되지 않는다. 모델이 **어떤 도구를 어떤
 *   순서로 스스로 골랐는지**가 화면에 남아야 function calling·ReAct를 구현했다는 증거가 된다.
 *   그래서 답변보다 트레이스가 화면의 주인공이다.
 *
 * WHY SSE 스트리밍인가:
 *   시나리오 하나가 13~19초 걸린다(LLM 3~4회 호출, 비전 도구는 중첩 호출). 스피너만
 *   19초 띄우면 이탈한다. 단계를 발생 즉시 흘려보내면 첫 이벤트가 3.6초에 도착하고,
 *   대기 시간이 그대로 볼거리가 된다.
 *
 * WHY 자유 입력이 없는가:
 *   공개 엔드포인트에서 LLM을 자유 호출로 열면 비용이 상한 없이 늘고 남용에 노출된다.
 *   시나리오를 고정해도 "에이전트가 도구를 고른다"는 논지는 그대로 보인다.
 *   (V1-AOI 데모에서 PatchCore 입력을 고정한 것과 같은 판단)
 */

import { useLanguage } from "@/contexts/LanguageContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search, Image as ImageIcon, Sparkles, RotateCcw } from "lucide-react";
import DemoModal from "./DemoModal";

const API_BASE = "https://api.hosugator.com/api/agent";

interface Scenario {
  id: string;
  label: string;
}

// 서버(agent_server.py)의 SCENARIOS와 id가 일치해야 한다.
const SCENARIOS: Scenario[] = [
  { id: "case-fail", label: "탐지 실패 사례" },
  { id: "case-pass", label: "정상 통과 사례" },
];

// SSE 이벤트 — 서버 agent_events()가 내보내는 타입과 대응한다.
type Event =
  | { type: "start"; question: string }
  | { type: "thinking"; at_ms: number }
  | { type: "tool_call"; name: string; args: Record<string, unknown>; at_ms: number }
  | { type: "tool_result"; name: string; content: string; at_ms: number }
  | { type: "answer"; content: string; llm_calls: number; latency_ms: number }
  | { type: "truncated"; llm_calls: number; latency_ms: number }
  | { type: "error"; message: string };

const TOOL_ICON: Record<string, typeof Search> = {
  search_logs: Search,
  analyze_image: ImageIcon,
};

export default function AgentDemoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { locale } = useLanguage();
  const t = {
    ko: {
      title: "현장 이상 설명 에이전트",
      subtitle: "LLM이 도구를 스스로 골라 검사 결과를 해석합니다",
      pick: "시나리오",
      question: "질문",
      thinking: "다음 행동을 판단하는 중",
      answer: "최종 답변",
      toolCall: "도구 호출",
      toolResult: "도구 결과",
      run: "실행",
      rerun: "다시 실행",
      errTitle: "실행 실패",
      errBody: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
      stats: (c: number, ms: number) =>
        `LLM ${c}회 호출 · ${(ms / 1000).toFixed(1)}초`,
      why:
        "자유 입력을 받지 않습니다. 공개 엔드포인트에서 LLM을 자유 호출로 열면 비용과 남용을 통제할 수 없기 때문입니다. " +
        "고정 시나리오라도 에이전트가 도구를 스스로 고르고 순서를 정하는 과정은 그대로 드러납니다.",
    },
    en: {
      title: "Field Anomaly Explanation Agent",
      subtitle: "The LLM picks its own tools to interpret inspection results",
      pick: "Scenario",
      question: "Question",
      thinking: "Deciding the next action",
      answer: "Final answer",
      toolCall: "Tool call",
      toolResult: "Tool result",
      run: "Run",
      rerun: "Run again",
      errTitle: "Run failed",
      errBody: "Could not reach the server. Please try again in a moment.",
      stats: (c: number, ms: number) =>
        `${c} LLM calls · ${(ms / 1000).toFixed(1)}s`,
      why:
        "No free-form input. Opening an LLM to arbitrary public calls makes cost and abuse uncontrollable. " +
        "Even with fixed scenarios, the agent still chooses its own tools and their order — which is the point.",
    },
  }[locale];

  const [selected, setSelected] = useState<Scenario>(SCENARIOS[0]);
  const [events, setEvents] = useState<Event[]>([]);
  const [running, setRunning] = useState(false);
  const [failed, setFailed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const run = useCallback(async (sc: Scenario) => {
    abortRef.current?.abort(); // 이전 실행이 남아 이벤트를 섞지 않도록 끊는다
    const ac = new AbortController();
    abortRef.current = ac;

    setEvents([]);
    setFailed(false);
    setRunning(true);
    try {
      const res = await fetch(`${API_BASE}/stream/${sc.id}`, { signal: ac.signal });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      // SSE를 직접 파싱한다. EventSource를 쓰지 않는 이유: 이 스트림은 한 번 끝나면
      // 닫히는 일회성인데 EventSource는 자동 재연결을 해서 같은 시나리오를 다시 돌린다.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const frames = buf.split("\n\n");
        buf = frames.pop() ?? ""; // 마지막 조각은 미완성일 수 있어 버퍼에 남긴다
        for (const f of frames) {
          const line = f.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          setEvents((prev) => [...prev, JSON.parse(line.slice(6)) as Event]);
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setFailed(true);
    } finally {
      setRunning(false);
    }
  }, []);

  // 모달을 열면 첫 시나리오를 자동 실행한다 — 빈 화면을 보여줄 이유가 없다.
  useEffect(() => {
    if (!isOpen) return;
    run(selected);
    return () => abortRef.current?.abort();
  }, [isOpen, selected, run]);

  // 새 이벤트가 붙을 때마다 아래로 따라간다 — 진행 중인 단계가 보여야 한다.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [events]);

  const answer = events.find((e) => e.type === "answer") as
    | Extract<Event, { type: "answer" }>
    | undefined;
  const start = events.find((e) => e.type === "start") as
    | Extract<Event, { type: "start" }>
    | undefined;

  const footer = (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-3">
        {t.pick}
      </p>
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelected(s)}
            disabled={running}
            aria-pressed={selected.id === s.id}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors disabled:opacity-40 ${
              selected.id === s.id
                ? "border-accent bg-accent/10 text-accent"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => run(selected)}
          disabled={running}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-500 hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
        >
          <RotateCcw size={13} />
          {t.rerun}
        </button>
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
      {start && (
        <div className="mb-4 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
            {t.question}
          </span>
          <p className="mt-1 text-sm text-neutral-700">{start.question}</p>
        </div>
      )}

      {/* 트레이스 — 이 데모의 주인공 */}
      <div ref={scrollRef} className="max-h-[280px] overflow-y-auto pr-1">
        <ol className="relative border-l border-neutral-200 pl-4">
          {events.map((e, i) => {
            if (e.type === "start" || e.type === "answer") return null;

            if (e.type === "thinking") {
              return (
                <li key={i} className="relative mb-3">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-neutral-300" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                    {t.thinking} · {(e.at_ms / 1000).toFixed(1)}s
                  </span>
                </li>
              );
            }

            if (e.type === "tool_call") {
              const Icon = TOOL_ICON[e.name] ?? Sparkles;
              return (
                <li key={i} className="relative mb-2">
                  <span className="absolute -left-[23px] top-0.5 grid h-3 w-3 place-items-center rounded-full bg-accent text-white">
                    <Icon size={8} />
                  </span>
                  <div className="font-mono text-[11px] text-accent">
                    {e.name}(
                    {Object.entries(e.args).map(([k, v], j) => (
                      <span key={k}>
                        {j > 0 && ", "}
                        <span className="text-neutral-400">{k}=</span>
                        {String(v).length > 40 ? `${String(v).slice(0, 40)}…` : String(v)}
                      </span>
                    ))}
                    )
                  </div>
                </li>
              );
            }

            if (e.type === "tool_result") {
              return (
                <li key={i} className="relative mb-3">
                  <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-neutral-200" />
                  <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-neutral-500">
                    {e.content.length > 260 ? `${e.content.slice(0, 260)}…` : e.content}
                  </pre>
                </li>
              );
            }

            if (e.type === "error") {
              return (
                <li key={i} className="relative mb-3 text-xs text-neutral-600">
                  {e.message}
                </li>
              );
            }
            return null;
          })}

          {running && (
            <li className="relative">
              <span className="absolute -left-[23px] top-0.5">
                <Loader2 className="animate-spin text-accent" size={12} />
              </span>
            </li>
          )}
        </ol>
      </div>

      {/* 최종 답변 */}
      {answer && (
        <div className="mt-4 border-t border-neutral-200 pt-4">
          <div className="mb-2 flex items-center gap-2">
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

      {failed && (
        <div className="mt-4 border-t border-neutral-200 pt-4">
          <p className="text-sm font-bold text-neutral-900">{t.errTitle}</p>
          <p className="mt-1 text-xs font-light text-neutral-500">{t.errBody}</p>
        </div>
      )}

      <p className="mt-4 border-t border-neutral-200 pt-4 text-xs font-light leading-relaxed text-neutral-500">
        {t.why}
      </p>
    </DemoModal>
  );
}
