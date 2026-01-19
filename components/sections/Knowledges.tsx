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

  // 컨테이너 크기 변화에 대응하여 중앙 재정렬
  useEffect(() => {
    if (fgRef.current) {
      const rootNode = initialData.nodes.find((n: any) => n.id === 'hosugator');
      if (rootNode) {
        rootNode.fx = 0;
        rootNode.fy = 0;
      }
      
      // 레이아웃 엔진 설정: 중앙 집중력 강화
      fgRef.current.d3Force('charge').strength(-250);
      fgRef.current.d3Force('link').distance(60);
      
      // 초기 뷰포트 설정
      setTimeout(() => {
        fgRef.current.zoomToFit(1000, 500);
        fgRef.current.centerAt(0, 0, 0);
      }, 100);
    }
  }, [initialData]);

  const handleResetView = useCallback(() => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(800, 100);
      fgRef.current.centerAt(0, 0, 800);
    }
  }, []);

  return (
    <section id="knowledges" className="py-32 border-t border-slate-100 relative text-slate-900">
      {/* 치우침 해결: mx-auto와 max-w-4xl을 제거하여 layout.tsx의 main 여백을 그대로 따릅니다.
         대신 내부 콘텐츠 너비만 필요시 조절합니다.
      */}
      <div className="w-full pr-12"> 
        <h2 className="text-[14px] font-bold tracking-[0.5em] uppercase text-primary mb-4">
          {knowledgeData.topLabel}
        </h2>
        <h3 className="text-4xl font-black tracking-tighter mb-12 whitespace-pre-line">
          {knowledgeData.title}
        </h3>

        <div className="w-full h-[700px] border border-slate-100 rounded-3xl overflow-hidden bg-slate-50/50 relative">
          <ForceGraph2D
            ref={fgRef}
            graphData={initialData}
            cooldownTime={3000}
            onEngineStop={() => {
              if (fgRef.current) {
                fgRef.current.zoomToFit(800, 100);
                fgRef.current.centerAt(0, 0, 0);
              }
            }}
            onNodeClick={(node: any) => {
              if (node.level === 2) setSelectedNode(node);
            }}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.label;
              const isRoot = node.id === 'hosugator';
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
                ctx.fillText(label, node.x, node.y + (radius + 12 / globalScale));
              }
            }}
            linkColor={() => 'rgba(203, 213, 225, 0.4)'}
            linkWidth={0.5}
            d3AlphaDecay={0.02}
          />
          
          <div className="absolute top-6 right-6 flex items-center gap-3">
            <button 
              onClick={handleResetView}
              className="bg-white p-3 rounded-full border border-slate-100 text-primary hover:bg-primary hover:text-white transition-all shadow-xl shadow-slate-200/50 group"
            >
              <RefreshCcw size={18} className="group-active:rotate-180 transition-transform duration-500" />
            </button>
            <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold border border-slate-100 text-slate-400 tracking-widest">
              SCROLL TO ZOOM • DRAG TO EXPLORE
            </div>
          </div>
        </div>

        {/* 상세 모달: 마스터 이력서 스타일 반영 */}
        {selectedNode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-100">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary bg-white border border-primary/20 px-3 py-1.5 rounded-full">
                  {selectedNode.parentId ? selectedNode.parentId.split('/').pop() : 'Knowledge'}
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
                      li: ({...props}) => <li className="marker:text-primary" {...props} />
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