"use client";
import { useEffect, useRef, useState } from 'react';

// mermaid는 무거우므로 동적 import (mermaid 노트를 볼 때만 로드)
let mermaidPromise: Promise<typeof import('mermaid')> | null = null;

export default function Mermaid({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await (mermaidPromise ||= import('mermaid'))).default;
        mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose' });
        const id = 'mmd-' + Math.random().toString(36).slice(2, 9);
        const { svg } = await mermaid.render(id, code);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => { cancelled = true; };
  }, [code]);

  if (error) {
    return (
      <pre className="bg-neutral-900/5 rounded-lg p-4 overflow-x-auto text-[13px] my-5 font-mono">{code}</pre>
    );
  }
  return <div ref={ref} className="my-6 flex justify-center overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto" />;
}
