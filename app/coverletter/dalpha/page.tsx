// app/coverletter/dalpha/page.tsx — 달파 제출용 자기소개서 (Server Component)
//
// 이력서(app/resume/dalpha)와 같은 규칙을 따른다: sitemap 에 올리지 않고 noindex.
// 특정 회사에 낸 문서가 검색에 잡히면 다른 회사가 지원 이력을 읽을 수 있다.
//
// WHY /resume/dalpha 아래가 아니라 /coverletter/dalpha 인가
//   URL 이 문서 종류를 말해야 로그에서 구분된다. /resume/dalpha/coverletter 로 두면
//   경로만 봐서는 이력서의 하위 절인지 별도 문서인지 알 수 없다.
//
// PDF 재생성: npm run dev 후
//   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
//     --no-sandbox --disable-gpu --no-pdf-header-footer \
//     --run-all-compositor-stages-before-draw --virtual-time-budget=6000 \
//     --print-to-pdf=resumes/coverletter-dalpha.pdf http://localhost:3000/coverletter/dalpha/
// 출력이 resumes/ 인 이유는 이력서와 같다 — public/ 에 두면 사이트에 공개된다.

import type { Metadata } from "next";
import CoverLetterTemplate from "@/components/sections/CoverLetterTemplate";
import { COVER_LETTER_DALPHA } from "@/data/coverLetterDalpha";

export const metadata: Metadata = {
  title: "Cover Letter — 달파 AI Engineer",
  robots: { index: false, follow: false },
};

export default function CoverLetterDalphaPage() {
  return (
    <CoverLetterTemplate
      data={COVER_LETTER_DALPHA}
      webUrl="https://hosugator.com/r/dalpha/"
    />
  );
}
