"use client";

/**
 * DemoModal — 데모 공용 셸(chrome).
 *
 * WHY 이 컴포넌트가 존재하나:
 *   cureat·align-ai 등 여러 데모가 "모달 프레임 / 헤더 / 닫기 / 스크롤 body / 입력 footer"를
 *   똑같이 반복한다. 이 반복(=셸)을 한 곳에 두고, 데모별로 다른 것(상태·결과·입력)만
 *   children/footer 슬롯으로 주입한다. → 데모 간 UX 통일 + 중복 제거.
 *
 * 통일하는 것(셸): 오버레이·카드·헤더·닫기·body 컨테이너·footer 슬롯·스타일 토큰.
 * 데모별로 다른 것(주입): title/subtitle, body(children), 입력영역(footer).
 *
 * 모노 에디토리얼 토큰: 흰 배경 / neutral-* / 단일 액센트 accent(#35618E) /
 *   Space Grotesk(font-display) 헤딩 / font-mono 메타 라벨 / 얇은 보더·절제된 라운드·그림자.
 */

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string; // 헤더 부제 (모노 대문자 메타 라인)
  children: ReactNode; // 데모별 body — idle/loading/error/result 상태 렌더
  footer?: ReactNode; // 데모별 입력 영역 (cureat=텍스트, align-ai=이미지 업로드). 없으면 미표시.
  /**
   * 넓은 2단 레이아웃이 필요한 데모용 (기본 max-w-2xl → max-w-5xl).
   *
   * WHY 옵션인가: align-ai는 왼쪽에 추론 결과, 오른쪽에 에이전트 트레이스를 나란히 둔다.
   *   기본 폭(2xl)에서는 둘을 세로로 쌓아야 하고, 그러면 에이전트가 스크롤 아래로 밀려
   *   존재를 모르고 지나치게 된다. cureat·aoi는 단일 컬럼이라 기본값을 유지한다.
   */
  wide?: boolean;
}

export default function DemoModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: DemoModalProps) {
  // createPortal은 브라우저에서만 동작 → SSR/정적 export 시 mounted 가드로 hydration 오류 방지.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 배경 스크롤 잠금: 모달이 열린 동안 뒤 페이지가 스크롤되면 몰입이 깨짐.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    }; // 닫히거나 언마운트 시 원복
  }, [isOpen]);

  // TODO(you): ESC 키로 닫기 — 학습용 빈칸.
  //   WHY: 모달 접근성/UX 기본기. 백드롭 클릭 외에 키보드로도 닫혀야 함.
  //   힌트: useEffect(() => { if (!isOpen) return; const onKey = (e: KeyboardEvent) => { ... };
  //         window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [isOpen, onClose]);
  //         e.key === 'Escape' 일 때 onClose() 호출. cleanup에서 리스너 반드시 제거(누수 방지).
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* 백드롭 — 클릭 시 닫기 */}
      <div
        className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 카드 — 모노 에디토리얼: 흰 배경 + 얇은 보더 + 절제된 라운드(과한 3xl/그림자 지양) */}
      <div
        className={`relative z-10 flex flex-col w-full max-h-[85vh] overflow-hidden rounded-lg border border-neutral-200 bg-white ${
          wide ? "max-w-5xl" : "max-w-2xl"
        }`}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-5">
          <div>
            <h3 className="font-display text-xl font-black tracking-tight text-neutral-900">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-neutral-400">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-neutral-400 transition-colors hover:text-neutral-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* body — 데모별 상태/결과 (children 주입) */}
        <div className="min-h-[300px] flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>

        {/* footer(선택) — 데모별 입력 영역 */}
        {footer && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
