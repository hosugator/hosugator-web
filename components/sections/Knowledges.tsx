'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Knowledges({ initialData }: { initialData: any }) {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  return (
    <section id="knowledges" className="py-32 px-12 md:px-24 bg-white border-t border-slate-100 relative text-slate-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[11px] font-bold tracking-[0.5em] uppercase text-primary mb-4">Knowledge Base</h2>
        <h3 className="text-4xl font-black tracking-tighter mb-12">Total Knowledge <br /> Architecture.</h3>

        <div className="w-full h-[650px] border border-slate-100 rounded-3xl overflow-hidden bg-slate-50 relative cursor-pointer">
          <ForceGraph2D
            graphData={initialData}
            onNodeClick={(node: any) => {
              if (node.level === 2) setSelectedNode(node);
            }}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.label;
              const fontSize = node.level === 0 ? 16 / globalScale : 12 / globalScale;
              ctx.font = `${node.level === 0 ? '900' : node.level === 1 ? '700' : '400'} ${fontSize}px Sans-Serif`;
              
              const radius = node.level === 0 ? 12 : node.level === 1 ? 8 : 4;
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.level === 0 ? '#00f3ff' : node.level === 1 ? '#334155' : '#cbd5e1';
              ctx.fill();

              // 텍스트는 일정 줌 배율 이상에서만 표시하거나, 메인 노드만 표시
              if (globalScale > 0.8 || node.level <= 1) {
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = node.level === 1 ? '#1e293b' : '#64748b';
                ctx.fillText(label, node.x, node.y + (radius + 10 / globalScale));
              }
            }}
            // 연결선을 아주 연하게 처리하여 지저분함을 방지
            linkColor={() => 'rgba(203, 213, 225, 0.3)'}
            linkWidth={0.5}
            d3AlphaDecay={0.02}
            cooldownTicks={100}
          />
          
          <div className="absolute top-6 right-6 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-[10px] font-medium border border-slate-100 text-slate-400">
            SCROLL TO ZOOM • DRAG TO EXPLORE
          </div>
        </div>

        {selectedNode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-100">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary bg-white border border-primary/20 px-3 py-1.5 rounded-full shadow-sm">
                  {selectedNode.parentId.split('/').pop()}
                </span>
                <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">✕</button>
              </div>

              <div className="p-10 overflow-y-auto">
                <h4 className="text-4xl font-black tracking-tighter mb-10 text-slate-900 border-b pb-6">{selectedNode.label}</h4>
                <article className="max-w-none text-slate-700 leading-relaxed font-light whitespace-pre-wrap">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({node, ...props}) => <h2 className="text-2xl font-black tracking-tighter text-slate-900 mt-12 mb-4 border-l-4 border-primary pl-4" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-bold tracking-tight text-slate-800 mt-8 mb-2" {...props} />,
                      p: ({node, ...props}) => <p className="mb-6 leading-8" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-primary" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-6 space-y-2" {...props} />,
                      code: ({node, ...props}) => <code className="bg-slate-100 px-1 rounded text-primary font-mono text-sm" {...props} />
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