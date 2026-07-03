'use client';

import { useEffect, useId, useState } from 'react';

// 사이트 모노+블루 톤으로 테마링된 Mermaid 렌더러 (클라이언트 전용)
// chart(프로젝트 상세) 또는 code(노트 마크다운 코드블록) 어느 쪽으로도 정의를 받는다.
export default function Mermaid({ chart, code }: { chart?: string; code?: string }) {
  const definition = chart ?? code ?? '';
  const [svg, setSvg] = useState('');
  const rawId = useId();
  const id = 'm' + rawId.replace(/[^a-zA-Z0-9]/g, '');

  useEffect(() => {
    let active = true;
    (async () => {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          fontFamily: 'var(--font-space-grotesk), var(--font-noto-sans-kr), sans-serif',
          fontSize: '13px',
          primaryColor: '#fafafa',
          primaryBorderColor: '#e5e5e5',
          primaryTextColor: '#171717',
          lineColor: '#35618E',
          clusterBkg: '#ffffff',
          clusterBorder: '#e5e5e5',
        },
        flowchart: { curve: 'basis', padding: 14, useMaxWidth: true },
      });
      try {
        const { svg } = await mermaid.render(id, definition);
        if (active) setSvg(svg);
      } catch (err) {
        console.error('Mermaid render failed:', err);
        if (active) setSvg('');
      }
    })();
    return () => {
      active = false;
    };
  }, [definition, id]);

  if (!svg) return <div className="h-20" aria-hidden />;

  return (
    <div
      className="mermaid-diagram overflow-x-auto rounded-xl border border-neutral-100 bg-neutral-50/40 p-5"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
