// app/resume/aha/page.tsx — 아하앤컴퍼니 AI engineer 제출용 이력서 (Server Component)
//
// WHY 슬러그가 'aha' 인가 — 회사는 「아하앤컴퍼니」지만 제품·브랜드는 「아하」다. 로그를
//   나중에 읽을 때 알아보는 것이 이 슬러그의 유일한 용도라 짧은 쪽을 쓴다. 트랙이 하나뿐이라
//   직무를 붙일 이유도 없다(레브잇처럼 갈릴 때만 'levit-vision' 식으로 붙인다).
//
// WHY sitemap 에 안 올리나 — 특정 회사에 낸 문서가 검색에 잡히면, 다른 회사가 "이 사람이
// 어디에 어떤 문장으로 냈는지"를 볼 수 있게 된다. ResumeTemplate.tsx 상단 주석의 규칙이다.
//
// PDF 재생성: npm run dev 를 띄운 상태에서
//   npm run resume:pdf -- aha

import type { Metadata } from "next";
import ResumeTemplate from "@/components/sections/ResumeTemplate";
import { RESUME_AHA } from "@/data/resumeAha";

export const metadata: Metadata = {
  title: "Resume — 아하앤컴퍼니 AI engineer",
  robots: { index: false, follow: false },
};

export default function ResumeAhaPage() {
  return (
    <ResumeTemplate data={RESUME_AHA} webUrl="https://hosugator.com/r/aha/" />
  );
}
