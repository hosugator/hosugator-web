"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Mermaid from "@/components/ui/Mermaid";

// 브랜치(카테고리) 색상 — 모노 에디토리얼과 어울리는 muted 팔레트, 정렬 인덱스로 안정 매핑
const BRANCH_COLORS = [
  "#35618E",
  "#3F6B52",
  "#9B5B3B",
  "#6B5B95",
  "#9B4B4B",
  "#4A7A8A",
  "#8A7A3B",
  "#7A5B8A",
];
const INITIAL_VISIBLE = 40;

function formatCategoryName(category: string): string {
  const names: { [key: string]: string } = {
    "aws-saa": "AWS SAA",
    kdlc: "KDLC",
    eip: "EIP",
    "ai-systems": "AI Systems",
  };
  return (
    names[category] ||
    category
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

// 프로젝트명 정규화 매칭 ("Align AI" ≈ "AlignAI")
const normProject = (s: unknown) =>
  s
    ? String(s)
        .replace(/[^a-z0-9]/gi, "")
        .toLowerCase()
    : "";

// 날짜 → YYYY.MM.DD (YAML date가 Date.toString()으로 길게 나오는 것 방지)
const fmtDate = (d?: string): string => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return String(d).slice(0, 10);
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`;
};

function shortHash(id: string): string {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(7, "0").slice(0, 7);
}

export default function Knowledges({ initialData }: { initialData: any }) {
  const { locale } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [branch, setBranch] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [view, setView] = useState<"log" | "map">("map");
  const [wikiMissing, setWikiMissing] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const proj = new URLSearchParams(window.location.search).get("project");
    if (proj) {
      setProjectFilter(proj);
      setView("log");
    }
  }, []);

  // 상단 바 Blog 클릭(이미 블로그 페이지) → 노트 닫고 블로그 루트(Map, 최상단)로
  useEffect(() => {
    const goHome = () => {
      setSelectedNode(null);
      setView("map");
      setBranch("all");
      setProjectFilter(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hg:blog-home", goHome);
    return () => window.removeEventListener("hg:blog-home", goHome);
  }, []);
  useEffect(() => {
    document.body.style.overflow = selectedNode ? "hidden" : "auto";
    // 노트 열림 상태를 TopNav에 알려 포커스 리딩 모드에서 플로팅 바를 숨긴다
    window.dispatchEvent(
      new CustomEvent("hg:note", { detail: { open: !!selectedNode } }),
    );
  }, [selectedNode]);
  useEffect(() => {
    setVisible(INITIAL_VISIBLE);
  }, [branch, search, projectFilter]);

  const posts = useMemo(() => {
    const arr: any[] = [];
    initialData.nodes.forEach((n: any) => {
      if (n.level === 2 && n.content) {
        const category = n.category || n.parentId?.split("/")[0] || "general";
        const words = n.content.split(/\s+/).length;
        arr.push({
          id: n.id,
          node: n,
          title: n.label,
          content: n.content,
          category,
          date: n.date,
          readTime: Math.max(1, Math.ceil(words / 200)),
        });
      }
    });
    return arr.sort((a, b) =>
      a.date && b.date
        ? b.date.localeCompare(a.date)
        : a.date
          ? -1
          : b.date
            ? 1
            : a.title.localeCompare(b.title),
    );
  }, [initialData]);

  const branches = useMemo(() => {
    const counts: { [k: string]: number } = {};
    posts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a])
      .map((key) => ({ key, count: counts[key] }));
  }, [posts]);

  const colorOf = useMemo(() => {
    const map: { [k: string]: string } = {};
    [...branches]
      .map((b) => b.key)
      .sort()
      .forEach((c, i) => {
        map[c] = BRANCH_COLORS[i % BRANCH_COLORS.length];
      });
    return map;
  }, [branches]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return posts.filter((p) => {
      const okProject =
        !projectFilter ||
        (p.node.project &&
          normProject(p.node.project) === normProject(projectFilter));
      const okBranch = branch === "all" || p.category === branch;
      const okSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q);
      return okProject && okBranch && okSearch;
    });
  }, [posts, branch, search, projectFilter]);

  // 개요(Map) 트리: subject → project 카운트
  const tree = useMemo(() => {
    const t: Record<string, Record<string, number>> = {};
    posts.forEach((p) => {
      const proj = p.node.project ? String(p.node.project) : "";
      if (!proj) return;
      if (!t[p.category]) t[p.category] = {};
      t[p.category][proj] = (t[p.category][proj] || 0) + 1;
    });
    return t;
  }, [posts]);

  const shown = filtered.slice(0, visible);
  const headLabel = projectFilter
    ? projectFilter
    : branch === "all"
      ? "main"
      : formatCategoryName(branch);
  const ctxLabel = (() => {
    const b = branch === "all" ? "" : formatCategoryName(branch);
    if (projectFilter && b) return `${b} · ${projectFilter}`;
    if (projectFilter) return projectFilter;
    return b || (locale === "en" ? "All commits" : "전체 커밋");
  })();

  const selectBranch = (key: string) => {
    setBranch(key);
    setProjectFilter(null);
  };

  // 위키링크([[...]]) 해석 — 공개 노트면 열고, 없으면(비공개/미존재) 팝업
  const normWiki = (s: string) =>
    s
      .toLowerCase()
      .replace(/\.md$/, "")
      .replace(/[\s_\-]+/g, " ")
      .trim();
  const resolveWiki = (target: string) => {
    const base = normWiki(target.split("#")[0].split("/").pop() || target);
    return (
      posts.find(
        (p) =>
          normWiki(String(p.id).split("/").pop() || "") === base ||
          normWiki(p.title) === base,
      ) || null
    );
  };
  const openWiki = (target: string) => {
    const hit = resolveWiki(target);
    if (hit) {
      setWikiMissing(null);
      setSelectedNode(hit.node);
    } else {
      setWikiMissing(target);
    }
  };
  // 본문 [[Target]] / [[Target|Alias]] → wiki: 링크로 변환 (a 렌더러에서 처리)
  const linkifyWiki = (md: string) =>
    md.replace(/\[\[([^\]]+)\]\]/g, (_m, inner) => {
      const [tgt, alias] = String(inner).split("|");
      const label = (alias || tgt).trim();
      // '#wiki:' 프래그먼트 스킴 — react-markdown 기본 URL sanitizer를 통과
      return `[${label}](#wiki:${encodeURIComponent(tgt.trim())})`;
    });

  // 노트 문서 뷰 (필기체) — 화면 중앙 정렬 · 백링크 클릭 이동
  const renderNote = () => {
    if (!selectedNode || !mounted) return null;
    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return null;
    const noteCat =
      selectedNode.category ||
      selectedNode.parentId?.split("/")[0] ||
      "general";
    const sameCat = posts.filter((p) => p.category === noteCat);
    const idx = sameCat.findIndex((p) => p.id === selectedNode.id);
    const prev = idx > 0 ? sameCat[idx - 1] : null;
    const next =
      idx >= 0 && idx < sameCat.length - 1 ? sameCat[idx + 1] : null;

    const arrowBtn =
      "hidden md:grid place-items-center fixed top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full text-neutral-300 hover:text-neutral-800 hover:bg-neutral-900/5 transition-colors";

    return createPortal(
      <div className="fixed inset-0 z-[100] bg-[#faf9f4] overflow-y-auto animate-in fade-in duration-200">
        <button
          onClick={() => setSelectedNode(null)}
          className="fixed top-5 left-5 z-20 flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={18} /> {locale === "en" ? "Back" : "돌아가기"}
        </button>

        {/* 좌우 은은한 이전/다음 화살표 (데스크톱) */}
        {prev && (
          <button
            onClick={() => setSelectedNode(prev.node)}
            className={`${arrowBtn} left-3 lg:left-6`}
            aria-label={locale === "en" ? "Previous note" : "이전 노트"}
            title={prev.title}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        {next && (
          <button
            onClick={() => setSelectedNode(next.node)}
            className={`${arrowBtn} right-3 lg:right-6`}
            aria-label={locale === "en" ? "Next note" : "다음 노트"}
            title={next.title}
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* 본문: 화면 중앙 정렬 (사이드바 없이 포커스 리딩 모드) */}
        <article className="max-w-3xl mx-auto px-6 pt-24 md:pt-28 pb-32 text-neutral-800">
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-accent mb-4">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: colorOf[noteCat] || "#94a3b8" }}
            />
            {formatCategoryName(noteCat)}
          </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-10 leading-tight text-neutral-900">
              {selectedNode.label}
            </h1>
            <div className="text-base md:text-lg leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ ...props }) => (
                    <h2
                      className="text-2xl md:text-3xl font-bold text-neutral-900 mt-10 mb-3"
                      {...props}
                    />
                  ),
                  strong: ({ ...props }) => (
                    <strong className="font-bold text-neutral-900" {...props} />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  code: ({ className, children, ...props }: any) => {
                    const isBlock =
                      typeof className === "string" &&
                      className.startsWith("language-");
                    if (isBlock)
                      return (
                        <code className="font-mono" {...props}>
                          {children}
                        </code>
                      );
                    return (
                      <code
                        className="font-mono bg-neutral-900/5 px-1.5 py-0.5 rounded text-accent text-[13px] md:text-[15px]"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  pre: ({ children }: any) => {
                    const child = Array.isArray(children)
                      ? children[0]
                      : children;
                    const cls = child?.props?.className || "";
                    if (
                      typeof cls === "string" &&
                      cls.includes("language-mermaid")
                    ) {
                      return (
                        <Mermaid
                          code={String(child.props.children).replace(/\n$/, "")}
                        />
                      );
                    }
                    return (
                      <pre className="bg-neutral-900/5 rounded-lg p-4 overflow-x-auto text-[13px] my-5 font-mono">
                        {children}
                      </pre>
                    );
                  },
                  table: ({ ...props }) => (
                    <div className="my-6 overflow-x-auto">
                      <table
                        className="w-full text-sm border-collapse"
                        {...props}
                      />
                    </div>
                  ),
                  thead: ({ ...props }) => (
                    <thead
                      className="border-b-2 border-neutral-300"
                      {...props}
                    />
                  ),
                  th: ({ ...props }) => (
                    <th
                      className="px-3 py-2 font-bold text-neutral-900 text-left align-top"
                      {...props}
                    />
                  ),
                  td: ({ ...props }) => (
                    <td
                      className="px-3 py-2 border-t border-neutral-200 align-top"
                      {...props}
                    />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="list-disc ml-6 mb-5 space-y-2" {...props} />
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  a: ({ href, children, ...props }: any) => {
                    if (typeof href === "string" && href.startsWith("#wiki:")) {
                      const target = decodeURIComponent(href.slice(6));
                      return (
                        <button
                          type="button"
                          onClick={() => openWiki(target)}
                          className="text-accent font-medium underline decoration-dotted underline-offset-2 hover:decoration-solid"
                        >
                          {children}
                        </button>
                      );
                    }
                    return (
                      <a
                        href={href}
                        className="text-accent underline underline-offset-2"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  p: ({ ...props }) => <p className="mb-5" {...props} />,
                }}
              >
                {linkifyWiki(selectedNode.content)}
              </ReactMarkdown>
            </div>

            {/* 이전/다음 + 관련 노트 (하단, 중앙 정렬 유지) */}
            <nav className="mt-16 pt-8 border-t border-neutral-200/70">
              <div className="grid grid-cols-2 gap-4 mb-10">
                {prev ? (
                  <button
                    onClick={() => setSelectedNode(prev.node)}
                    className="group text-left"
                  >
                    <div className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                      {locale === "en" ? "Previous" : "이전"}
                    </div>
                    <div className="text-sm font-bold text-neutral-600 group-hover:text-accent transition-colors leading-snug">
                      {prev.title}
                    </div>
                  </button>
                ) : (
                  <span />
                )}
                {next ? (
                  <button
                    onClick={() => setSelectedNode(next.node)}
                    className="group text-right"
                  >
                    <div className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                      {locale === "en" ? "Next" : "다음"}
                    </div>
                    <div className="text-sm font-bold text-neutral-600 group-hover:text-accent transition-colors leading-snug">
                      {next.title}
                    </div>
                  </button>
                ) : (
                  <span />
                )}
              </div>
            </nav>
          </article>

          {/* 비공개/미존재 노트 클릭 시 안내 팝업 */}
          {wikiMissing && (
            <div
              className="fixed inset-0 z-[110] grid place-items-center bg-neutral-900/40 p-6"
              onClick={() => setWikiMissing(null)}
            >
              <div
                className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                  {locale === "en" ? "Private note" : "비공개 노트"}
                </div>
                <p className="text-sm leading-relaxed text-neutral-700 mb-1">
                  {locale === "en"
                    ? "This note isn’t published yet."
                    : "아직 공개되지 않은 노트입니다."}
                </p>
                <p className="mb-5 break-all font-mono text-[13px] text-neutral-400">
                  {wikiMissing}
                </p>
                <button
                  onClick={() => setWikiMissing(null)}
                  className="w-full rounded-full bg-neutral-900 py-2.5 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
                >
                  {locale === "en" ? "Close" : "닫기"}
                </button>
              </div>
            </div>
          )}
      </div>,
      modalRoot,
    );
  };

  return (
    <section id="knowledges" className="py-10 md:py-16 text-neutral-900">
      <div className="mb-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-900 mb-4">
          Knowledge Commit Log
        </h2>
        <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] whitespace-pre-line">
          {locale === "en" ? "Technical\nExpertise." : "기술 지식\n커밋 로그."}
        </h3>
      </div>

      {view === "map" ? (
        /* 개요 Map — subject(상위) → project 트리 */
        <div>
          <div className="flex items-center justify-between gap-3 mb-8">
            <p className="text-sm text-neutral-500">
              {locale === "en"
                ? "Knowledge structure by subject and project. Click to browse the log."
                : "subject·project 기준 지식 구조 개요. 클릭하면 로그로 이동합니다."}
            </p>
            <button
              onClick={() => {
                setBranch("all");
                setProjectFilter(null);
                setView("log");
              }}
              className="shrink-0 text-sm font-bold text-accent hover:underline"
            >
              {locale === "en" ? "View full log →" : "전체 로그 보기 →"}
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {branches.map((b) => {
              const projs = tree[b.key]
                ? Object.entries(tree[b.key]).sort((a, c) => c[1] - a[1])
                : [];
              return (
                <div key={b.key}>
                  {/* subject — 상위, 강조 */}
                  <button
                    onClick={() => {
                      selectBranch(b.key);
                      setView("log");
                    }}
                    className="group flex items-center gap-2.5 mb-1"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: colorOf[b.key] }}
                    />
                    <span className="text-lg font-black tracking-tight text-neutral-900 group-hover:text-accent transition-colors">
                      {formatCategoryName(b.key)}
                    </span>
                    <span className="font-mono text-xs text-neutral-400">
                      {b.count}
                    </span>
                  </button>
                  {projs.length > 0 && (
                    <div className="mt-1 ml-[5px] border-l border-neutral-200 pl-5 space-y-1">
                      {projs.map(([pn, cnt]) => (
                        <button
                          key={pn}
                          onClick={() => {
                            setBranch(b.key);
                            setProjectFilter(pn);
                            setView("log");
                          }}
                          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-accent transition-colors"
                        >
                          {pn}
                          <span className="font-mono text-[11px] text-neutral-300">
                            {cnt}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* 개요로 돌아가기 + 현재 컨텍스트 */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <button
              onClick={() => {
                setView("map");
                setBranch("all");
                setProjectFilter(null);
              }}
              className="flex items-center gap-1.5 text-sm font-bold text-neutral-500 hover:text-accent transition-colors"
            >
              <ArrowLeft size={16} /> {locale === "en" ? "Overview" : "개요"}
            </button>
            <span className="flex items-baseline gap-2">
              {branch !== "all" && !projectFilter && (
                <span
                  className="w-2 h-2 rounded-full self-center"
                  style={{ background: colorOf[branch] }}
                />
              )}
              <span className="font-bold text-neutral-900">{ctxLabel}</span>
              <span className="font-mono text-xs text-neutral-400">
                {filtered.length}
              </span>
            </span>
          </div>

          {/* 검색 */}
          <div className="relative mb-8">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={locale === "en" ? "Search this log…" : "로그 검색…"}
              className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-full text-sm outline-none transition-colors focus:border-accent"
            />
          </div>

          {/* 커밋 로그 — 단일 레일 */}
          <div className="relative pl-2">
            <div
              aria-hidden
              className="absolute left-2 top-6 bottom-3 w-px bg-neutral-200"
            />

            {/* HEAD 마커 */}
            <div className="relative pl-7 pb-6">
              <span className="absolute left-2 top-0.5 -translate-x-1/2 w-4 h-4 rounded-full bg-accent ring-4 ring-white shadow-[0_0_10px_rgba(53,97,142,0.6)]" />
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent">
                  HEAD
                </span>
                <span className="font-mono text-xs text-neutral-400">→</span>
                <span className="font-mono text-xs font-bold text-neutral-900">
                  {headLabel}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  latest
                </span>
              </div>
            </div>

            {shown.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedNode(p.node)}
                className="group relative w-full flex items-center gap-4 py-3.5 pl-7 border-b border-neutral-100 text-left"
              >
                <span
                  className="absolute left-2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ring-4 ring-white transition-transform group-hover:scale-125"
                  style={{ background: colorOf[p.category] || "#94a3b8" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-[11px] font-mono text-neutral-400 mb-1">
                    <span className="text-neutral-300">{shortHash(p.id)}</span>
                    <span
                      className="font-sans font-bold uppercase tracking-wider"
                      style={{ color: colorOf[p.category] }}
                    >
                      {formatCategoryName(p.category)}
                    </span>
                    {p.date && <span>{fmtDate(p.date)}</span>}
                    <span>· {p.readTime}m</span>
                  </div>
                  <div className="font-bold text-neutral-900 group-hover:text-accent transition-colors truncate">
                    {p.title}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-sm text-neutral-400 py-10 text-center">
              {locale === "en" ? "No commits found." : "검색 결과가 없습니다."}
            </p>
          )}

          {visible < filtered.length && (
            <button
              onClick={() => setVisible((v) => v + 60)}
              className="mt-8 w-full py-3 rounded-full border border-neutral-200 text-sm font-semibold text-neutral-500 hover:border-neutral-400 transition-colors"
            >
              {locale === "en"
                ? `Load more (${filtered.length - visible} left)`
                : `더 보기 (${filtered.length - visible}개 남음)`}
            </button>
          )}
        </>
      )}

      {renderNote()}
    </section>
  );
}
