"use client";

/**
 * ProjectThumb — 리스트 행에서 클릭 전에 "이게 뭘 하는 프로젝트인지" 보여주는 시각 요소.
 *
 * WHY hover-to-play (autoplay-on-load가 아니라):
 *   한 화면에 프로젝트가 10개 넘게 나열되는데, 전부 autoplay하면 초기 로딩이 무거워져서
 *   그 자체가 새로운 이탈 요인이 된다. 데스크톱 스크리닝(리크루터) 시나리오를 가정하면
 *   hover 시에만 재생하는 게 "클릭 전 기능 확인"과 "가벼운 초기 로드"를 동시에 만족한다.
 *   (모바일엔 hover가 없어 poster 정지 이미지만 보이고, 탭하면 상세 페이지로 이동 —
 *    거기(ProjectDetail)엔 이미 "클릭해서 재생" 인터랙션이 구현돼 있다.)
 */

import { useRef } from "react";
import Image from "next/image";
import { posterOf } from "@/lib/projects";

interface ProjectThumbProps {
  video?: string;
  image?: string;
  alt: string;
}

export default function ProjectThumb({ video, image, alt }: ProjectThumbProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const poster = video ? posterOf(video) : image;

  // TODO(you): hover 시 재생, 벗어나면 정지 + 처음(0초)으로 되감기.
  //   WHY 직접 제어가 필요한가: <video autoPlay>는 마운트되는 즉시 재생이라 hover와 무관하게
  //   전부 재생돼 버린다. 우리가 원하는 건 "이 행에 마우스가 올라와 있는 동안만" 재생이므로,
  //   ref로 DOM <video> element를 직접 play()/pause()해야 한다.
  //   힌트:
  //     const handleEnter = () => videoRef.current?.play();
  //     const handleLeave = () => {
  //       const v = videoRef.current;
  //       if (!v) return;
  //       v.pause();
  //       v.currentTime = 0; // 다음 hover 때 항상 처음부터 재생되도록
  //     };
  //   아래 래퍼 div의 onMouseEnter={handleEnter} onMouseLeave={handleLeave}로 연결한다.

  // 실사 미디어가 없는 프로젝트(예: 헤드리스 스크립트·노트북 작업)를 빈 회색 박스로 두면
  // 실사 썸네일이 있는 행들 옆에서 "깨진 것"처럼 보인다. 이니셜 모노그램으로 통일해
  // "없음"이 아니라 "의도된 변형"으로 읽히게 한다 (GitHub 조직 아바타의 이니셜 폴백과 동일 패턴).
  if (!video && !image) {
    const initial = alt.trim().charAt(0).toUpperCase();
    return (
      <div
        className="grid w-20 h-14 sm:w-24 sm:h-16 shrink-0 place-items-center rounded-md bg-neutral-100"
        aria-hidden
      >
        <span className="font-display text-xl sm:text-2xl font-black text-neutral-300">
          {initial}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-md overflow-hidden bg-neutral-100 shrink-0">
      {video ? (
        <video
          ref={videoRef}
          src={video}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <Image src={image as string} alt={alt} fill className="object-cover" />
      )}
    </div>
  );
}
