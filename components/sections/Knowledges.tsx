'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RefreshCcw, X, Info } from 'lucide-react';
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
      <div
        className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center bg-neutral-900/50 backdrop-blur-sm md:p-6"
        onClick={() => setSelectedNode(null)}
      >
        <div
          className="relative bg-[#faf9f4] rounded-t-2xl md:rounded-2xl shadow-2xl ring-1 ring-black/5 w-full max-w-2xl h-[88vh] md:h-auto md:max-h-[86vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단: 카테고리 + 닫기 */}
          <div className="flex items-center justify-between px-6 md:px-10 pt-5 pb-3 shrink-0">
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-accent">
              {selectedNode.parentId?.split('/').pop() || 'Note'}
            </span>
            <button onClick={() => setSelectedNode(null)} className="p-2 -mr-2 text-neutral-400 hover:text-neutral-900 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* 노트 본문: 좌측 마진 룰 + 크림 페이퍼 + 넉넉한 행간 */}
          <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-12">
            <div className="md:pl-8 md:border-l border-accent/25">
              <h4 className="text-2xl md:text-4xl font-black tracking-tighter mb-8 text-neutral-900 leading-[1.1]">
                {selectedNode.label}
              </h4>
              <article className="max-w-none text-[13px] md:text-[15px] text-neutral-700 leading-[1.9] font-light">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ ...props }) => <h2 className="text-lg md:text-2xl font-black tracking-tight text-neutral-900 mt-8 mb-3" {...props} />,
                    strong: ({ ...props }) => <strong className="font-bold text-neutral-900" {...props} />,
                    code: ({ ...props }) => <code className="bg-neutral-900/5 px-1.5 py-0.5 rounded text-accent font-mono text-[12px] md:text-sm" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc ml-5 mb-4 space-y-1.5" {...props} />,
                    a: ({ ...props }) => <a className="text-accent underline underline-offset-2" {...props} />,
                    p: ({ ...props }) => <p className="mb-4" {...props} />,
                  }}
                >
                  {selectedNode.content}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        </div>
      </div>,
      modalRoot
    );
  };

  return (
    <section id="knowledges" className="py-12 md:py-32 border-t border-slate-100 relative text-slate-900">
      <div className="container mx-auto px-6">
        <header className="mb-6 md:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-[9px] md:text-[14px] font-bold tracking-[0.4em] uppercase text-primary mb-2">
              {t.knowledge.topLabel}
            </h2>
            <h3 className="text-lg md:text-6xl font-black tracking-tighter whitespace-pre-line leading-tight">
              {t.knowledge.title}
            </h3>
          </div>
          
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </header>

        {viewMode === 'graph' ? (
          /* 수정 포인트: mx-auto 제거로 좌측 정렬, max-w 및 h 값으로 크기 조정 가능 */
          <div
            ref={containerRef}
            className="w-full h-[72vh] md:h-[80vh] border border-neutral-100 rounded-2xl overflow-hidden bg-neutral-50/40 relative shadow-sm"
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
          <KnowledgeBlogView data={initialData} onPostClick={setSelectedNode} />
        )}
        
        {renderModal()}
      </div>
    </section>
  );
}