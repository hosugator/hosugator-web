'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Search, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Mermaid from '@/components/ui/Mermaid';

// 브랜치(카테고리) 색상 — 모노 에디토리얼과 어울리는 muted 팔레트, 정렬 인덱스로 안정 매핑
const BRANCH_COLORS = ['#35618E', '#3F6B52', '#9B5B3B', '#6B5B95', '#9B4B4B', '#4A7A8A', '#8A7A3B', '#7A5B8A'];
const INITIAL_VISIBLE = 40;

function formatCategoryName(category: string): string {
  const names: { [key: string]: string } = {
    'aws-saa': 'AWS SAA', 'kdlc': 'KDLC', 'eip': 'EIP', 'ai-systems': 'AI Systems',
  };
  return names[category] || category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// 프로젝트명 정규화 매칭 ("Align AI" ≈ "AlignAI")
const normProject = (s: unknown) => s ? String(s).replace(/[^a-z0-9]/gi, '').toLowerCase() : '';

function shortHash(id: string): string {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(7, '0').slice(0, 7);
}

export default function Knowledges({ initialData }: { initialData: any }) {
  const { locale } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [branch, setBranch] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const proj = new URLSearchParams(window.location.search).get('project');
    if (proj) setProjectFilter(proj);
  }, []);
  useEffect(() => { document.body.style.overflow = selectedNode ? 'hidden' : 'auto'; }, [selectedNode]);
  useEffect(() => { setVisible(INITIAL_VISIBLE); }, [branch, search, projectFilter]);

  const posts = useMemo(() => {
    const arr: any[] = [];
    initialData.nodes.forEach((n: any) => {
      if (n.level === 2 && n.content) {
        const category = n.category || n.parentId?.split('/')[0] || 'general';
        const words = n.content.split(/\s+/).length;
        arr.push({ id: n.id, node: n, title: n.label, content: n.content, category, date: n.date, readTime: Math.max(1, Math.ceil(words / 200)) });
      }
    });
    return arr.sort((a, b) => (a.date && b.date) ? b.date.localeCompare(a.date) : a.date ? -1 : b.date ? 1 : a.title.localeCompare(b.title));
  }, [initialData]);

  const branches = useMemo(() => {
    const counts: { [k: string]: number } = {};
    posts.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]).map(key => ({ key, count: counts[key] }));
  }, [posts]);

  const colorOf = useMemo(() => {
    const map: { [k: string]: string } = {};
    [...branches].map(b => b.key).sort().forEach((c, i) => { map[c] = BRANCH_COLORS[i % BRANCH_COLORS.length]; });
    return map;
  }, [branches]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return posts.filter(p => {
      const okProject = !projectFilter || (p.node.project && normProject(p.node.project) === normProject(projectFilter));
      const okBranch = projectFilter ? true : (branch === 'all' || p.category === branch);
      const okSearch = !q || p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);
      return okProject && okBranch && okSearch;
    });
  }, [posts, branch, search, projectFilter]);

  const shown = filtered.slice(0, visible);
  const headLabel = projectFilter ? projectFilter : (branch === 'all' ? 'main' : formatCategoryName(branch));

  const chip = (active: boolean) =>
    `flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${active ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'}`;

  const selectBranch = (key: string) => { setBranch(key); setProjectFilter(null); };

  // 노트 문서 뷰 (필기체) — 좌측 관련노트 사이드바 + 페이지 폭 통일
  const renderNote = () => {
    if (!selectedNode || !mounted) return null;
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;
    const noteCat = selectedNode.category || selectedNode.parentId?.split('/')[0] || 'general';
    const related = posts.filter(p => p.category === noteCat).slice(0, 40);

    return createPortal(
      <div className="fixed inset-0 z-[100] bg-[#faf9f4] overflow-y-auto animate-in fade-in duration-200">
        <button
          onClick={() => setSelectedNode(null)}
          className="fixed top-5 left-5 z-20 flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={18} /> {locale === 'en' ? 'Back' : '돌아가기'}
        </button>

        {/* 사이드바: 화면 왼쪽에 고정 */}
        <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 z-10 border-r border-neutral-200/70 bg-[#f4f2ec] pt-32 pb-10 px-6 overflow-y-auto scrollbar-hide">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: colorOf[noteCat] || '#94a3b8' }} />
            {formatCategoryName(noteCat)}
          </div>
          <div className="space-y-0.5">
            {related.map(r => {
              const active = r.id === selectedNode.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedNode(r.node)}
                  className={`block w-full text-left text-[13px] leading-snug py-1.5 transition-colors ${active ? 'text-accent font-bold' : 'text-neutral-500 hover:text-neutral-900'}`}
                >
                  {r.title}
                </button>
              );
            })}
          </div>
        </aside>

        {/* 본문: 화면(뷰포트) 전체 기준 중앙 정렬, 메인보다 넓게 */}
        <article className="max-w-5xl mx-auto px-6 pt-32 md:pt-36 pb-32 text-neutral-800">
            <div className="text-xs font-bold tracking-[0.25em] uppercase text-accent mb-4">
              {selectedNode.parentId?.split('/').pop() || 'Note'}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-10 leading-tight text-neutral-900">{selectedNode.label}</h1>
            <div className="text-base md:text-lg leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ ...props }) => <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mt-10 mb-3" {...props} />,
                  strong: ({ ...props }) => <strong className="font-bold text-neutral-900" {...props} />,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  code: ({ className, children, ...props }: any) => {
                    const isBlock = typeof className === 'string' && className.startsWith('language-');
                    if (isBlock) return <code className="font-mono" {...props}>{children}</code>;
                    return <code className="font-mono bg-neutral-900/5 px-1.5 py-0.5 rounded text-accent text-[13px] md:text-[15px]" {...props}>{children}</code>;
                  },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  pre: ({ children }: any) => {
                    const child = Array.isArray(children) ? children[0] : children;
                    const cls = child?.props?.className || '';
                    if (typeof cls === 'string' && cls.includes('language-mermaid')) {
                      return <Mermaid code={String(child.props.children).replace(/\n$/, '')} />;
                    }
                    return <pre className="bg-neutral-900/5 rounded-lg p-4 overflow-x-auto text-[13px] my-5 font-mono">{children}</pre>;
                  },
                  table: ({ ...props }) => <div className="my-6 overflow-x-auto"><table className="w-full text-sm border-collapse" {...props} /></div>,
                  thead: ({ ...props }) => <thead className="border-b-2 border-neutral-300" {...props} />,
                  th: ({ ...props }) => <th className="px-3 py-2 font-bold text-neutral-900 text-left align-top" {...props} />,
                  td: ({ ...props }) => <td className="px-3 py-2 border-t border-neutral-200 align-top" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc ml-6 mb-5 space-y-2" {...props} />,
                  a: ({ ...props }) => <a className="text-accent underline underline-offset-2" {...props} />,
                  p: ({ ...props }) => <p className="mb-5" {...props} />,
                }}
              >
                {selectedNode.content}
              </ReactMarkdown>
            </div>
        </article>
      </div>,
      modalRoot
    );
  };

  return (
    <section id="knowledges" className="py-10 md:py-16 text-neutral-900">
      <div className="mb-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-900 mb-4">
          Knowledge Commit Log
        </h2>
        <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] whitespace-pre-line">
          {locale === 'en' ? 'Technical\nExpertise.' : '기술 지식\n커밋 로그.'}
        </h3>
      </div>

      {/* 검색 */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={locale === 'en' ? 'Search the log…' : '로그 검색…'}
          className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-full text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      {/* 프로젝트 필터 배너 */}
      {projectFilter && (
        <div className="flex items-center justify-between gap-3 mb-6 px-4 py-3 rounded-xl bg-accent/5 border border-accent/20">
          <span className="text-sm font-semibold text-accent">
            {locale === 'en' ? 'Notes for project' : '프로젝트 관련 노트'}: {projectFilter} ({filtered.length})
          </span>
          <button onClick={() => setProjectFilter(null)} className="text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors">
            ✕ {locale === 'en' ? 'clear' : '해제'}
          </button>
        </div>
      )}

      {/* 브랜치 필터 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => selectBranch('all')} className={chip(!projectFilter && branch === 'all')}>
          {locale === 'en' ? 'All' : '전체'}
          <span className="font-mono opacity-60">{posts.length}</span>
        </button>
        {branches.map(b => (
          <button key={b.key} onClick={() => selectBranch(b.key)} className={chip(!projectFilter && branch === b.key)}>
            <span className="w-2 h-2 rounded-full" style={{ background: colorOf[b.key] }} />
            {formatCategoryName(b.key)}
            <span className="font-mono opacity-60">{b.count}</span>
          </button>
        ))}
      </div>

      {/* 커밋 로그 */}
      <div className="relative pl-2">
        <div aria-hidden className="absolute left-2 top-6 bottom-3 w-px bg-neutral-200" />

        {/* HEAD 마커 — 로그 최상단, 강조 */}
        <div className="relative pl-7 pb-6">
          <span className="absolute left-2 top-0.5 -translate-x-1/2 w-4 h-4 rounded-full bg-accent ring-4 ring-white shadow-[0_0_10px_rgba(53,97,142,0.6)]" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-accent">HEAD</span>
            <span className="font-mono text-xs text-neutral-400">→</span>
            <span className="font-mono text-xs font-bold text-neutral-900">{headLabel}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-full">latest</span>
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
              style={{ background: colorOf[p.category] || '#94a3b8' }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-[11px] font-mono text-neutral-400 mb-1">
                <span className="text-neutral-300">{shortHash(p.id)}</span>
                <span className="font-sans font-bold uppercase tracking-wider" style={{ color: colorOf[p.category] }}>
                  {formatCategoryName(p.category)}
                </span>
                {p.date && <span>{p.date}</span>}
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
          {locale === 'en' ? 'No commits found.' : '검색 결과가 없습니다.'}
        </p>
      )}

      {visible < filtered.length && (
        <button
          onClick={() => setVisible((v) => v + 60)}
          className="mt-8 w-full py-3 rounded-full border border-neutral-200 text-sm font-semibold text-neutral-500 hover:border-neutral-400 transition-colors"
        >
          {locale === 'en' ? `Load more (${filtered.length - visible} left)` : `더 보기 (${filtered.length - visible}개 남음)`}
        </button>
      )}

      {renderNote()}
    </section>
  );
}
