// app/resume/genon/page.tsx — 제논(GenON) 제출용 이력서 (Server Component)
//
// WHY sitemap 에 안 올리나 — 특정 회사에 낸 문서가 검색에 잡히면, 다른 회사가
// "이 사람이 어디에 어떤 문장으로 냈는지"를 볼 수 있게 된다. ResumeTemplate.tsx
// 상단 주석이 정한 규칙이기도 하다(sitemap 제외 + robots index:false).
//
// WHY 이 건에서 CTA 가 특히 중요한가 — 제논은 산출물 포트폴리오 미제출 시 서류
// 불합격이고 1차 면접이 그 산출물 시연이다. 즉 이 문서를 읽은 사람은 반드시
// 사이트를 연다. 그래서 /r/genon/ 로그는 「열었나」가 아니라 「언제·몇 번 다시
// 봤나」를 말해 준다 — 다른 회사보다 신호가 진하다.
// 전제: CloudFront 「동작」의 /r/* 이 CachingDisabled 여야 재방문이 로그에 남는다.
//
// PDF 재생성: npm run dev 를 띄운 상태에서
//   npm run resume:pdf -- genon

import type { Metadata } from "next";
import ResumeTemplate from "@/components/sections/ResumeTemplate";
import { RESUME_GENON } from "@/data/resumeGenon";

export const metadata: Metadata = {
  title: "Resume — 제논 AI Product Engineer",
  robots: { index: false, follow: false },
};

export default function ResumeGenonPage() {
  return (
    <ResumeTemplate
      data={RESUME_GENON}
      webUrl="https://hosugator.com/r/genon/"
    />
  );
}
