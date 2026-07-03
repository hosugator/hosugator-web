// components/ui/FlowDiagram.tsx — 모노 톤 파이프라인 다이어그램
import { ArrowRight } from 'lucide-react';
import type { Flow } from '@/lib/projects';

export default function FlowDiagram({ flow }: { flow: Flow }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">
        {flow.label}
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {flow.stages.map((stage, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] md:text-sm font-bold text-neutral-800">
              {stage}
            </div>
            {i < flow.stages.length - 1 && (
              <ArrowRight size={16} className="text-accent shrink-0" aria-hidden />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
