// app/resume/dalpha/page.tsx — 달파 제출용 이력서 (Server Component)
//
// WHY sitemap 에 안 올리나 — 특정 회사에 낸 문서가 검색에 잡히면, 다른 회사가
// "이 사람이 어디에 어떤 문장으로 냈는지"를 볼 수 있게 된다. ResumeTemplate.tsx
// 상단 주석이 정한 규칙이기도 하다(sitemap 제외 + robots index:false).
//
// WHY showWebCta 를 끄지 않나 — 그 주석은 CTA 를 끄라고 하지만, 여기서는 링크를
// 달파 전용 추적 경로로 바꾸는 것이 목적이라 켜 둔다. 라벨은 hosugator.com 그대로고
// 목적지만 /r/dalpha/ 가 된다 — 같은 도메인 안의 경로 차이라 표시와 어긋나지 않는다.
//
// WHY PDF 가 public/ 이 아니라 resumes/ 에 있나 — public/ 에 두면 빌드가 out/ 으로
// 복사하고 S3 로 올라가 hosugator.com/resume-dalpha.pdf 로 아무나 열 수 있다. 이 문서는
// 지원서 첨부로만 내므로 사이트에 있을 이유가 없다. resumes/ 는 빌드가 건드리지 않아
// 버전 관리만 되고 배포는 안 된다. (공개용 public/resume.pdf 는 의도적으로 공개다)
//
// PDF 재생성: npm run dev 후
//   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
//     --no-sandbox --disable-gpu --no-pdf-header-footer \
//     --run-all-compositor-stages-before-draw --virtual-time-budget=6000 \
//     --print-to-pdf=resumes/resume-dalpha.pdf http://localhost:3000/resume/dalpha/
// (package.json 의 resume:pdf 는 공개용 경로가 하드코딩돼 있어 그대로는 못 쓴다)

import type { Metadata } from "next";
import ResumeTemplate from "@/components/sections/ResumeTemplate";
import { RESUME_DALPHA } from "@/data/resumeDalpha";

export const metadata: Metadata = {
  title: "Resume — 달파 AI Engineer",
  robots: { index: false, follow: false },
};

export default function ResumeDalphaPage() {
  return (
    <ResumeTemplate
      data={RESUME_DALPHA}
      webUrl="https://hosugator.com/r/dalpha/"
    />
  );
}
