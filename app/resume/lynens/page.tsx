// app/resume/lynens/page.tsx — 라이넨스 제출용 이력서 (Server Component)
//
// WHY sitemap 에 안 올리나 — 특정 회사에 낸 문서가 검색에 잡히면, 다른 회사가
// "이 사람이 어디에 어떤 문장으로 냈는지"를 볼 수 있게 된다. ResumeTemplate.tsx
// 상단 주석이 정한 규칙이기도 하다(sitemap 제외 + robots index:false).
//
// WHY showWebCta 를 끄지 않나 — 달파판과 같은 이유다. 하단 CTA 의 목적지를 라이넨스
// 전용 추적 경로로 바꾸는 것이 목적이라 켜 둔다. 라벨은 hosugator.com 그대로고
// 목적지만 /r/lynens/ 가 된다 — 같은 도메인 안의 경로 차이라 표시와 어긋나지 않는다.
//
// PDF 재생성: npm run dev 를 띄운 상태에서
//   npm run resume:pdf -- lynens
// (스크립트가 슬러그를 받아 /resume/{slug}/ 를 찍어 resumes/resume-{slug}.pdf 로 낸다.
//  인자를 빼면 공개용 /resume/ → public/resume.pdf 로 동작해 기존 용법이 유지된다.)

import type { Metadata } from "next";
import ResumeTemplate from "@/components/sections/ResumeTemplate";
import { RESUME_LYNENS } from "@/data/resumeLynens";

export const metadata: Metadata = {
  title: "Resume — 라이넨스 AX Engineer",
  robots: { index: false, follow: false },
};

export default function ResumeLynensPage() {
  return (
    <ResumeTemplate
      data={RESUME_LYNENS}
      webUrl="https://hosugator.com/r/lynens/"
    />
  );
}
