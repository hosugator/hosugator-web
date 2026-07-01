'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import ViewToggle, { ViewMode } from '@/components/ui/ViewToggle';
import KnowledgeBlogView from '@/components/sections/KnowledgeBlogView';
import KnowledgeCommitLog from '@/components/sections/KnowledgeCommitLog';

export default function Knowledges({ initialData }: { initialData: any }) {
  const { t } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('blog');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedNode ? 'hidden' : 'auto';
  }, [selectedNode]);

  const renderModal = () => {
    if (!selectedNode || !mounted) return null;
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return createPortal(
      /* 전용 풀너비 문서 뷰 — 손글씨 폰트 + 문서(종이) 느낌 */
      <div className="fixed inset-0 z-[10000] bg-[#faf9f4] overflow-y-auto animate-in fade-in duration-200">
        {/* 좌상단 돌아가기 */}
        <button
          onClick={() => setSelectedNode(null)}
          className="fixed top-5 left-5 md:top-8 md:left-8 z-10 flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={18} /> 돌아가기
        </button>

        {/* 문서 컬럼 (손글씨) */}
        <article
          className="max-w-2xl mx-auto px-6 pt-24 md:pt-28 pb-32 text-neutral-800"
          style={{ fontFamily: 'var(--font-pen), cursive' }}
        >
          <div className="text-xs font-sans font-bold tracking-[0.25em] uppercase text-accent mb-4">
            {selectedNode.parentId?.split('/').pop() || 'Note'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-10 leading-tight text-neutral-900">
            {selectedNode.label}
          </h1>
          <div className="text-lg md:text-xl leading-loose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ ...props }) => <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mt-10 mb-3" {...props} />,
                strong: ({ ...props }) => <strong className="font-bold text-neutral-900" {...props} />,
                code: ({ ...props }) => <code className="font-sans bg-neutral-900/5 px-1.5 py-0.5 rounded text-accent text-[13px] md:text-[15px]" {...props} />,
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
    <section id="knowledges" className="py-10 md:py-16 relative text-neutral-900">
      <div className="w-full">
        <header className="px-6 md:px-12 mb-6 md:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-[11px] font-semibold tracking-[0.3em] uppercase text-neutral-900 mb-2">
              {t.knowledge.topLabel}
            </h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter whitespace-pre-line leading-[0.95]">
              {t.knowledge.title}
            </h3>
          </div>

          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </header>

        {viewMode === 'graph' ? (
          <KnowledgeCommitLog data={initialData} onPostClick={setSelectedNode} />
        ) : (
          <div className="px-6 md:px-12 max-w-6xl mx-auto">
            <KnowledgeBlogView data={initialData} onPostClick={setSelectedNode} />
          </div>
        )}

        {renderModal()}
      </div>
    </section>
  );
}
