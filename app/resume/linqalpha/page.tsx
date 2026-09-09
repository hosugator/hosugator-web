// app/resume/linqalpha/page.tsx — 링크알파 Applied AI Engineer (Search & Integration) 제출용 (Server Component)
//
// WHY 슬러그가 'linqalpha' 인가
//   회사에 트랙이 하나뿐이라 회사명만으로 충분하다. 레브잇처럼 같은 회사에 트랙이 갈리는
//   경우에만 'levit-vision' 식으로 직무를 붙인다.
//
// WHY sitemap 에 안 올리나 — 특정 회사에 낸 문서가 검색에 잡히면, 다른 회사가 "이 사람이
// 어디에 어떤 문장으로 냈는지"를 볼 수 있게 된다. ResumeTemplate.tsx 상단 주석의 규칙이다.
//
// PDF 재생성: npm run dev 를 띄운 상태에서
//   npm run resume:pdf -- linqalpha

import type { Metadata } from "next";
import ResumeTemplate from "@/components/sections/ResumeTemplate";
import { RESUME_LINQALPHA } from "@/data/resumeLinqalpha";

export const metadata: Metadata = {
  title: "Resume — 링크알파 Applied AI Engineer (Search & Integration)",
  robots: { index: false, follow: false },
};

export default function ResumeLinqalphaPage() {
  return (
    <ResumeTemplate
      data={RESUME_LINQALPHA}
      webUrl="https://hosugator.com/r/linqalpha/"
    />
  );
}
