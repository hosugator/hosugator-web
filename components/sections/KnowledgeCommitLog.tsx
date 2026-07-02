'use client';

import React from 'react';

// 최상위 카테고리 = 브랜치. 색은 dataviz 검증 통과(블루/오렌지/그린/마젠타 + Study 중립 그레이)
const CATEGORY: Record<string, { label: string; color: string }> = {
  'engineering': { label: 'Engineering', color: '#2E6CA8' },
  'ai-systems': { label: 'Ai Systems', color: '#B0417E' },
  'knowledge-ops': { label: 'Knowledge Ops', color: '#3E8C57' },
  'projects': { label: 'Projects', color: '#C0632E' },
  'study': { label: 'Study', color: '#737373' },
};
const FALLBACK = { label: 'Note', color: '#737373' };

// 노트 id로부터 결정적 7자리 해시 (git 커밋 해시 느낌)
function hashOf(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(7, '0').slice(0, 7);
}

function fmt(t: number): string {
  if (!t) return '—';
  const d = new Date(t);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

const RECENT_LIMIT = 60;

export default function KnowledgeCommitLog({
  data,
  onPostClick,
}: {
  data: { nodes: any[] };
  onPostClick: (node: any) => void;
}) {
  const commits = (data.nodes || [])
    .filter((n) => n.level === 2)
    .map((n) => {
      const cat = (n.parentId || '').split('/')[0];
      return { node: n, meta: CATEGORY[cat] || FALLBACK, t: n.date ? new Date(n.date).getTime() : 0 };
    })
    .sort((a, b) => b.t - a.t);

  const total = commits.length;
  const recent = commits.slice(0, RECENT_LIMIT);
  const earliest = commits.reduce((m, c) => (c.t && c.t < m ? c.t : m), Infinity);
  const branches = Object.values(CATEGORY);

  return (
    <div className="px-6 md:px-12 max-w-4xl mx-auto">
      {/* 스탯 라인 (git log 헤더 느낌) */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 font-mono text-sm">
        <span className="font-bold text-neutral-900">{total} commits</span>
        <span className="text-neutral-400">{branches.length} branches</span>
        {earliest !== Infinity && <span className="text-neutral-400">since {fmt(earliest)}</span>}
      </div>

      {/* 브랜치 범례 */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-10 pb-6 border-b border-neutral-200">
        {branches.map((b) => (
          <span key={b.label} className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
            {b.label}
          </span>
        ))}
      </div>

      {/* 커밋 리스트 (단일 메인 스파인 + 카테고리 색 커밋 도트) */}
      <div className="relative">
        <div className="absolute left-[6px] top-3 bottom-3 w-px bg-neutral-200" aria-hidden />
        {recent.map(({ node, meta, t }) => (
          <button
            key={node.id}
            onClick={() => onPostClick(node)}
            className="group w-full flex items-start gap-4 text-left"
          >
            <span
              className="relative z-10 mt-[14px] w-3.5 h-3.5 rounded-full ring-4 ring-white shrink-0"
              style={{ background: meta.color }}
            />
            <span className="flex-1 min-w-0 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-neutral-100 py-3">
              <code className="text-xs font-mono text-neutral-400 shrink-0">{hashOf(node.id)}</code>
              <span className="font-bold text-neutral-900 group-hover:text-accent transition-colors truncate max-w-full">
                {node.label}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                style={{ color: meta.color, background: `${meta.color}14` }}
              >
                {meta.label}
              </span>
              <span className="ml-auto text-xs font-mono text-neutral-400 shrink-0">{fmt(t)}</span>
            </span>
          </button>
        ))}
      </div>

      {total > recent.length && (
        <p className="mt-8 text-sm text-neutral-400">
          + {total - recent.length} earlier commits — browse all in the <span className="font-semibold text-accent">Blog</span> view.
        </p>
      )}
    </div>
  );
}
