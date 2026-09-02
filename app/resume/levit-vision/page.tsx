// app/resume/levit-vision/page.tsx — 레브잇 Vision 트랙 제출용 이력서 (Server Component)
//
// WHY 슬러그가 'levit' 이 아니라 'levit-vision' 인가
//   같은 회사에 두 번째 지원이다. 08-26 [쇼포트] AI Engineer(3년 이하) 건은 기본 이력서로
//   나가 09-02 서류 불합격했고 추적 슬러그도 없었다. 이번 건은 트랙이 다르므로 로그에서
//   구분돼야 한다 — 회사명만으로 슬러그를 잡으면 나중에 어느 지원의 열람인지 못 가른다.
//
// WHY sitemap 에 안 올리나 — 특정 회사에 낸 문서가 검색에 잡히면, 다른 회사가 "이 사람이
// 어디에 어떤 문장으로 냈는지"를 볼 수 있게 된다. ResumeTemplate.tsx 상단 주석의 규칙이다.
//
// PDF 재생성: npm run dev 를 띄운 상태에서
//   npm run resume:pdf -- levit-vision

import type { Metadata } from "next";
import ResumeTemplate from "@/components/sections/ResumeTemplate";
import { RESUME_LEVIT_VISION } from "@/data/resumeLevitVision";

export const metadata: Metadata = {
  title: "Resume — 레브잇 AI Engineer (Vision)",
  robots: { index: false, follow: false },
};

export default function ResumeLevitVisionPage() {
  return (
    <ResumeTemplate
      data={RESUME_LEVIT_VISION}
      webUrl="https://hosugator.com/r/levit-vision/"
    />
  );
}
