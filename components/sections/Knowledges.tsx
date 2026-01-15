'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// SSR 방지를 위해 ForceGraph를 클라이언트 사이드에서만 로드
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-slate-50 animate-pulse rounded-3xl" />
});

interface GraphProps {
  initialData: {
    nodes: any[];
    links: any[];
  };
}

export default function Knowledges({ initialData }: GraphProps) {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const graphData = useMemo(() => initialData, [initialData]);

  return (
    <section id="knowledges" className="py-32 px-12 md:px-24 bg-white border-t border-slate-100 relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[11px] font-bold tracking-[0.5em] uppercase text-primary mb-4">Knowledge Base</h2>
        <h3 className="text-4xl font-black tracking-tighter text-slate-900 mb-12">
          Organic <br /> Thinking Nodes.
        </h3>

        <div className="w-full h-[600px] border border-slate-100 rounded-3xl overflow-hidden bg-slate-50 relative cursor-pointer">
          <ForceGraph2D
            graphData={graphData}
            onNodeClick={(node: any) => {
              // 최하위 노트(Level 2)를 클릭했을 때만 팝업 표시
              if (node.level === 2) setSelectedNode(node);
            }}
            nodeLabel="label"
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.label;
              const fontSize = 14 / globalScale;
              ctx.font = `${node.level === 0 ? 'bold' : 'normal'} ${fontSize}px Sans-Serif`;
              
              ctx.beginPath();
              // 레벨에 따라 노드 크기 차별화 (나: 10, 카테고리: 7, 노트: 5)
              const radius = node.level === 0 ? 10 : node.level === 1 ? 7 : 5;
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.color;
              ctx.fill();

              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#1e293b';
              ctx.fillText(label, node.x, node.y + (radius + 12 / globalScale + 2));
            }}
            linkColor={() => '#cbd5e1'}
            linkWidth={1}
            d3AlphaDecay={0.02}
            cooldownTicks={100}
          />
        </div>

        {/* 팝업 모달 */}
        {selectedNode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-100">
              {/* 헤더 */}
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary bg-white border border-primary/20 px-3 py-1.5 rounded-full shadow-sm">
                  {selectedNode.category || 'Knowledge'}
                </span>
                <button 
                  onClick={() => setSelectedNode(null)} 
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900"
                >
                  ✕
                </button>
              </div>

              {/* 콘텐츠 영역 */}
                {/* 마크다운 콘텐츠 영역 */}
                <div className="p-10 overflow-y-auto">
                <h4 className="text-4xl font-black tracking-tighter mb-10 text-slate-900 border-b pb-6">
                    {selectedNode.label}
                </h4>
                
                <article className="max-w-none text-slate-700 leading-relaxed font-light whitespace-pre-wrap">
                    <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        // ## 헤딩 디자인
                        h2: ({node, ...props}) => <h2 className="text-2xl font-black tracking-tighter text-slate-900 mt-12 mb-4 border-l-4 border-primary pl-4" {...props} />,
                        // ### 헤딩 디자인
                        h3: ({node, ...props}) => <h3 className="text-xl font-bold tracking-tight text-slate-800 mt-8 mb-2" {...props} />,
                        // 본문 문단
                        p: ({node, ...props}) => <p className="mb-6 leading-8" {...props} />,
                        // 강조(굵게)
                        strong: ({node, ...props}) => <strong className="font-bold text-primary" {...props} />,
                        // 리스트
                        ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-6 space-y-2" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        // 인용구 (옵시디언의 > 문법)
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-slate-200 pl-4 italic text-slate-500 my-6" {...props} />,
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