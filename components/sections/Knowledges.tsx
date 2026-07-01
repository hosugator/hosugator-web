'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RefreshCcw, X, Info, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import ViewToggle, { ViewMode } from '@/components/ui/ViewToggle';
import KnowledgeBlogView from '@/components/sections/KnowledgeBlogView';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Knowledges({ initialData }: { initialData: any }) {
  const { t } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('blog');
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fitToCenter = useCallback((duration = 800) => {
    if (fgRef.current && containerRef.current) {
      const isMobile = window.innerWidth < 768;
      const padding = isMobile ? 30 : 80;
      // zoomToFit이 전체 노드 바운딩 박스를 뷰포트 중앙에 맞춤 (별도 centerAt 불필요)
      fgRef.current.zoomToFit(duration, padding);
    }
  }, [initialData]);

  // 그래프 뷰로 전환 시 캔버스 크기 확정 후 재-fit (마운트 직후 오프셋 방지)
  useEffect(() => {
    if (viewMode !== 'graph') return;
    const id = setTimeout(() => fitToCenter(600), 500);
    return () => clearTimeout(id);
  }, [viewMode, fitToCenter]);

  useEffect(() => {
    if (fgRef.current) {
      const rootNode = initialData.nodes.find((n: any) => n.id === 'hosugator' || n.id === 'me');
      if (rootNode) { rootNode.fx = 0; rootNode.fy = 0; }
      fgRef.current.d3Force('charge').strength(-450);
      fgRef.current.d3Force('link').distance(90);
    }
  }, [initialData]);

  useEffect(() => {
    if (selectedNode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
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
        <article className="font-hand max-w-2xl mx-auto px-6 pt-24 md:pt-28 pb-32 text-neutral-800">
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
          /* 전용 풀너비 그래프 — edge-to-edge */
          <div
            ref={containerRef}
            className="w-full h-[78vh] md:h-[85vh] border-y border-neutral-100 overflow-hidden bg-neutral-50/40 relative"
          >
            <div className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur rounded-full border border-slate-100 shadow-sm pointer-events-none">
              <Info size={12} className="text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Wheel to zoom • Drag to move • Click node for details
              </p>
            </div>
                      
            <ForceGraph2D
              ref={fgRef}
              graphData={initialData}
              cooldownTime={3000}
              onEngineStop={() => {
                if (isFirstRender.current) {
                  fitToCenter(1000);
                  isFirstRender.current = false;
                }
              }}
              onNodeClick={(node: any) => {
                if (node.level === 2) setSelectedNode(node);
              }}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.label as string;
                const isRoot = node.id === 'hosugator' || node.id === 'me';
                const isFolder = node.level === 1;

                const radius = isRoot ? 14 : isFolder ? 6 : 4;
                ctx.beginPath();
                ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
                // '#35618E' = --color-primary(globals.css) 캔버스는 CSS 유틸 불가라 리터럴 동기화
                ctx.fillStyle = isRoot ? '#35618E' : isFolder ? '#94a3b8' : '#cbd5e1';
                ctx.fill();

                const textThreshold = 1.2;

                if (isRoot || isFolder || globalScale > textThreshold) {
                  const fontSize = isRoot ? 17 / globalScale : (isFolder ? 13 : 11) / globalScale;
                  ctx.font = `${(isRoot || isFolder) ? '900' : '400'} ${fontSize}px Sans-Serif`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = isRoot ? '#35618E' : isFolder ? '#475569' : '#64748b';
                  ctx.fillText(label, node.x!, node.y! + (radius + 14 / globalScale));
                }
              }}
              linkColor={() => 'rgba(203, 213, 225, 0.4)'}
              linkWidth={0.5}
              enablePointerInteraction={true}
            />

            <div className="absolute top-4 right-4 z-50 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fitToCenter(800);
                }}
                className="bg-white/90 backdrop-blur p-2.5 rounded-full border border-slate-100 text-primary shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>
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