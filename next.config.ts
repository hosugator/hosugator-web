// next.config.ts
const nextConfig = {
  output: 'export', // 서버 없이 실행 가능한 정적 파일들만 추출하도록 설정합니다.
  images: {
    unoptimized: true, // Next.js의 이미지 최적화 서버를 사용할 수 없는 환경(S3)을 위한 설정입니다.
  },
};

export default nextConfig;