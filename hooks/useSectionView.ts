"use client";
import { useEffect, useRef } from "react";

// GoatCounter 커스텀 이벤트 — count.js가 주입하는 전역, 타입 선언 없음
declare global {
  interface Window {
    goatcounter?: { count: (opts: Record<string, unknown>) => void };
  }
}

/**
 * useSectionView — 섹션이 뷰포트에 처음 들어오는 순간 GoatCounter 이벤트를 1회 전송한다.
 *
 * WHY 필요한가: GoatCounter는 기본적으로 라우트 단위 페이지뷰만 잡는다. 홈 안에서
 * Projects·Insights까지 스크롤로 도달했는지는 이 계측 없이는 알 수 없다 — 지금까지의
 * "히어로 데모를 누른 사람이 그 아래까지 더 잘 도달하는가"라는 가설 자체를 검증할 방법이
 * 없었다. IntersectionObserver로 섹션 진입을 감지해 이 공백을 메운다.
 *
 * 1회만 전송(sent ref)하는 이유: 스크롤을 왔다갔다 할 때마다 중복 집계되면 "도달 여부"가
 * 아니라 "왕복 횟수"를 재는 지표로 오염된다.
 */
export function useSectionView(name: string) {
  const ref = useRef<HTMLElement | null>(null);
  const sent = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !sent.current) {
          sent.current = true;
          window.goatcounter?.count({
            path: `section-view/${name}`,
            title: `Section view: ${name}`,
            event: true,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [name]);

  return ref;
}
