'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Node {
  id: string;
  label: string;
  group: 'core' | 'tech' | 'biz' | 'ai';
  x: number;
  y: number;
}

export default function Knowledges() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes: Node[] = [
    { id: 'me', label: 'HOSUGATOR', group: 'core', x: 50, y: 50 },
    { id: 'aws', label: 'AWS SAA', group: 'tech', x: 20, y: 30 },
    { id: 'ai', label: 'RAG / LLM', group: 'ai', x: 80, y: 35 },
    { id: 'pm', label: 'EPC PM', group: 'biz', x: 30, y: 75 },
    { id: 'next', label: 'Next.js', group: 'tech', x: 70, y: 70 },
  ];

  const connections = [
    { from: 'me', to: 'aws' },
    { from: 'me', to: 'ai' },
    { from: 'me', to: 'pm' },
    { from: 'me', to: 'next' },
    { from: 'ai', to: 'next' }, // 지식 간의 유기적 연결
  ];

  return (
    <section id="knowledges" className="py-32 px-12 md:px-24 bg-slate-50 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[11px] font-bold tracking-[0.5em] uppercase text-primary mb-4">Knowledge Graph</h2>
        <h3 className="text-4xl font-black tracking-tighter text-slate-900 mb-16">
          Organic <br /> Knowledge Base.
        </h3>

        <div className="relative w-full h-[500px] bg-white rounded-3xl border border-slate-100 shadow-inner flex items-center justify-center">
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn, i) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;

              return (
                <motion.line
                  key={i}
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={isHighlighted ? '#00f3ff' : '#e2e8f0'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              );
            })}
          </svg>

          {/* Knowledge Nodes */}
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              className={`absolute cursor-pointer p-4 rounded-full border-2 flex items-center justify-center text-[10px] font-black tracking-tighter
                ${node.group === 'core' ? 'bg-primary text-white border-primary w-24 h-24' : 'bg-white text-slate-600 border-slate-100 w-20 h-20 shadow-sm'}
                hover:border-primary hover:text-primary z-10 transition-colors
              `}
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              whileHover={{ scale: 1.1 }}
            >
              {node.label}
            </motion.div>
          ))}
        </div>
        
        <p className="mt-8 text-slate-400 text-xs text-center font-light tracking-widest">
          * 클릭 시 옵시디언 기반 원자적 노트를 확인할 수 있습니다 (Coming Soon)
        </p>
      </div>
    </section>
  );
}