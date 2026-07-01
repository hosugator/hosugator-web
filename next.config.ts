// next.config.ts
const nextConfig = {
  output: 'export', // 서버 없이 실행 가능한 정적 파일들만 추출하도록 설정합니다.
  images: {
    unoptimized: true, // Next.js의 이미지 최적화 서버를 사용할 수 없는 환경(S3)을 위한 설정입니다.
  },
  trailingSlash: true,
  // 상위 경로(예: 홈 디렉토리)의 떠돌이 lockfile로 Turbopack이 워크스페이스 루트를
  // 잘못 추론해 RSC manifest가 깨지는 문제 방지 — 루트를 이 설정 파일 위치(프로젝트 루트)로 고정
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;