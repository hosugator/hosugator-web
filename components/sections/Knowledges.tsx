'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RefreshCcw, X, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Knowledges({ initialData }: { initialData: any }) {
  const { t } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fitToCenter = useCallback((duration = 800) => {
    if (fgRef.current && containerRef.current) {
      const isMobile = window.innerWidth < 768;
      const padding = isMobile ? 40 : 250;
      fgRef.current.zoomToFit(duration, padding);
      // 초기 위치 좌표 (제목과 정렬 시 필요에 따라 조절)
      const targetX = isMobile ? 0 : 550;
      const targetY = isMobile ? 0 : 250;
      fgRef.current.centerAt(targetX, targetY, duration);
    }
  }, [initialData]);

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
        className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setSelectedNode(null)}
      >
        <div
          className="bg-white rounded-t-2xl md:rounded-3xl shadow-2xl w-full max-w-3xl h-[85vh] md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-5 py-3 md:px-8 md:py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <span className="text-[8px] md:text-[10px] font-black tracking-[0.2em] uppercase text-primary bg-white border border-primary/20 px-2 py-1 rounded-full">
              {selectedNode.parentId?.split('/').pop() || 'Category'}
            </span>
            <button onClick={() => setSelectedNode(null)} className="p-2 text-slate-400">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 md:p-10 overflow-y-auto">
            <h4 className="text-xl md:text-4xl font-black tracking-tighter mb-6 text-slate-900 border-b pb-4">
              {selectedNode.label}
            </h4>
            <article className="max-w-none text-[12px] md:text-base text-slate-700 leading-relaxed font-light">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ ...props }) => <h2 className="text-lg md:text-2xl font-black tracking-tighter text-slate-900 mt-6 mb-3 border-l-4 border-primary pl-3" {...props} />,
                  strong: ({ ...props }) => <strong className="font-bold text-primary" {...props} />,
                  code: ({ ...props }) => <code className="bg-slate-100 px-1 py-0.5 rounded text-primary font-mono text-[10px] md:text-sm" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc ml-5 mb-4 space-y-1.5" {...props} />,
                }}
              >
                {selectedNode.content}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </div>,
      modalRoot
    );
  };

  return (
    <section id="knowledges" className="py-12 md:py-32 border-t border-slate-100 relative text-slate-900">
      <div className="container mx-auto px-6">
        <header className="mb-6 md:mb-12">
          <h2 className="text-[9px] md:text-[14px] font-bold tracking-[0.4em] uppercase text-primary mb-2">
            {t.knowledge.topLabel}
          </h2>
          <h3 className="text-lg md:text-6xl font-black tracking-tighter whitespace-pre-line leading-tight">
            {t.knowledge.title}
          </h3>
        </header>

        {/* 수정 포인트: mx-auto 제거로 좌측 정렬, max-w 및 h 값으로 크기 조정 가능 */}
        <div
          ref={containerRef}
          className="w-full max-w-5xl h-[400px] md:h-[550px] border border-slate-100 rounded-xl md:rounded-3xl overflow-hidden bg-slate-50/30 relative shadow-sm"
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
              ctx.fillStyle = isRoot ? '#13ecda' : isFolder ? '#94a3b8' : '#cbd5e1';
              ctx.fill();

              const textThreshold = 1.2;

              if (isRoot || isFolder || globalScale > textThreshold) {
                const fontSize = isRoot ? 17 / globalScale : (isFolder ? 13 : 11) / globalScale;
                ctx.font = `${(isRoot || isFolder) ? '900' : '400'} ${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = isRoot ? '#13ecda' : isFolder ? '#475569' : '#64748b';
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
        {renderModal()}
      </div>
    </section>
  );
}