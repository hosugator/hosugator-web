'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RefreshCcw, X } from 'lucide-react'; 
import { knowledgeData } from '@/data/knowledgeData';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Knowledges({ initialData }: { initialData: any }) {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 중앙 정렬 및 줌 최적화 함수
  const fitToCenter = useCallback((duration = 800) => {
    if (fgRef.current && containerRef.current) {
      // 1. 모든 노드가 화면 안에 들어오도록 줌 조절 (패딩 200px로 넉넉하게 설정)
      fgRef.current.zoomToFit(duration, 200);
      
      // 2. hosugator 노드를 컨테이너의 시각적 중앙으로 이동
      // 좌표 (0,0)을 기준으로 엔진이 돌아가므로 centerAt(0,0)이 가장 정확합니다.
      fgRef.current.centerAt(150, 100, duration);
    }
  }, [initialData]);

  useEffect(() => {
    if (fgRef.current) {
      // 엔진 설정: hosugator 노드 위치 고정
      const rootNode = initialData.nodes.find((n: any) => n.id === 'hosugator' || n.id === 'me');
      if (rootNode) {
        rootNode.fx = 0;
        rootNode.fy = 0;
      }

      // 노드 간 반발력 최적화 (너무 퍼지지 않게)
      fgRef.current.d3Force('charge').strength(-300);
      fgRef.current.d3Force('link').distance(80);
      
      // 레이아웃 렌더링 후 0.5초 뒤에 중앙 정렬 실행
      const timer = setTimeout(() => {
        fitToCenter(0); // 처음엔 애니메이션 없이 즉시 정렬
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [initialData, fitToCenter]);

  return (
    <section id="knowledges" className="py-32 border-t border-slate-100 relative text-slate-900">
      <div className="w-full">
        <header className="mb-12">
          <h2 className="text-[14px] font-bold tracking-[0.5em] uppercase text-primary mb-4">
            {knowledgeData.topLabel}
          </h2>
          <h3 className="text-4xl font-black tracking-tighter whitespace-pre-line">
            {knowledgeData.title}
          </h3>
        </header>

        {/* containerRef 추가: 컨테이너 크기 추적용 */}
        <div 
          ref={containerRef}
          className="w-full h-[700px] border border-slate-100 rounded-3xl overflow-hidden bg-slate-50/30 relative"
        >
          <ForceGraph2D
            ref={fgRef}
            graphData={initialData}
            cooldownTime={3000}
            // 엔진이 완전히 멈췄을 때 최종 정렬
            onEngineStop={() => fitToCenter(600)}
            onNodeClick={(node: any) => {
              if (node.level === 2) setSelectedNode(node);
            }}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.label;
              const isRoot = node.id === 'hosugator' || node.id === 'me';
              const fontSize = isRoot ? 16 / globalScale : 12 / globalScale;
              
              ctx.font = `${isRoot ? '900' : node.level === 1 ? '700' : '400'} ${fontSize}px Sans-Serif`;
              const radius = isRoot ? 14 : node.level === 1 ? 8 : 4;
              
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = isRoot ? '#13ecda' : node.level === 1 ? '#334155' : '#cbd5e1';
              ctx.fill();

              if (globalScale > 0.8 || node.level <= 1) {
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = isRoot ? '#13ecda' : node.level === 1 ? '#1e293b' : '#64748b';
                ctx.fillText(label, node.x, node.y + (radius + 14 / globalScale));
              }
            }}
            linkColor={() => 'rgba(203, 213, 225, 0.4)'}
            linkWidth={0.5}
            d3AlphaDecay={0.02}
          />
          
          <div className="absolute top-8 right-8 flex items-center gap-3">
            <button 
              onClick={() => fitToCenter(800)}
              className="bg-white p-3 rounded-full border border-slate-100 text-primary hover:bg-primary hover:text-white transition-all shadow-xl group"
            >
              <RefreshCcw size={18} className="group-active:rotate-180 transition-transform duration-500" />
            </button>
            <div className="bg-white/80 backdrop-blur px-5 py-2.5 rounded-full text-[11px] font-bold border border-slate-100 text-slate-400 tracking-widest uppercase">
              Scroll to zoom • Drag to explore
            </div>
          </div>
        </div>

        {selectedNode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-100">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary bg-white border border-primary/20 px-3 py-1.5 rounded-full">
                  {selectedNode.parentId?.split('/').pop() || 'Category'}
                </span>
                <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto">
                <h4 className="text-4xl font-black tracking-tighter mb-10 text-slate-900 border-b pb-6">
                  {selectedNode.label}
                </h4>
                <article className="max-w-none text-slate-700 leading-relaxed font-light">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({...props}) => <h2 className="text-2xl font-black tracking-tighter text-slate-900 mt-12 mb-4 border-l-4 border-primary pl-4" {...props} />,
                      strong: ({...props}) => <strong className="font-bold text-primary underline underline-offset-4 decoration-primary/20" {...props} />,
                      code: ({...props}) => <code className="bg-slate-100 px-1.5 py-0.5 rounded text-primary font-mono text-sm" {...props} />,
                      ul: ({...props}) => <ul className="list-disc ml-6 mb-6 space-y-3" {...props} />,
                    }}
                  >
                    {selectedNode.content}
                  </ReactMarkdown>
                </article>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}