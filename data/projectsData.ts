// data/projectsData.ts
export const projectsData = {
    topLabel: "Featured Projects",
    title: "Technical \nImplementations.",
    items: [
        {
            title: "Hosugator: Cloud-Native Portfolio Architecture",
            tags: ["#Next.js", "#AWS", "#GitHub-Actions"],
            desc: "Next.js 기반의 개인 포트폴리오 사이트를 AWS S3와 CloudFront를 통해 서버리스 환경으로 구축하였습니다. GitHub Actions를 활용한 CI/CD 파이프라인으로 무중단 배포 시스템을 구현하고, Route 53 및 ACM을 통해 보안성과 접근성을 최적화한 아키텍처입니다.",
            pdfLink: "/projects/project_hosugator.pdf",
            demoLink: "#",
            video: "", // 아키텍처 다이어그램 애니메이션 등
            image: "/projects/hosugator_thumb_latest.png" // 아키텍처 다이어그램 정지 이미지
        },
        {
            title: "Cureat: AI 미식 추천 시스템",
            tags: ["#AI", "#FastAPI", "#VectorDB"],
            desc: "Okt/ko-BERT를 활용한 자연어 분석으로 사용자 의도를 파악하고, Vector DB 기반 코사인 유사도 검색 및 FastAPI 비동기 파이프라인을 통해 응답 지연을 60% 단축한 개인화 추천 시스템입니다.",
            pdfLink: "/projects/project_cureat.pdf",
            demoLink: "#",
            video: "/projects/cureat_demo.mov",
            image: "/projects/cureat_thumb.png"
        },
        {
            title: "Dorosee: CV/LLM 통합 멀티모달 인터랙션 지원 UGV 플랫폼",
            tags: ["#AI", "#FastAPI", "#VectorDB"],
            desc: "상황 인지 기반 멀티모달 대화형 AI 인터페이스를 탑재한 UGV(무인 지상 차량) 플랫폼입니다. 컴퓨터 비전 모델과 대형 언어 모델을 통합하여 실시간 환경 인식 및 자연어 상호작용을 지원합니다.",
            pdfLink: "/projects/project_dorosee.pdf",
            demoLink: "#",
            video: "/projects/dorosee_demo.mp4",
            image: "/projects/dorosee_thumb.png"
        },
        {
            title: "Pictag: 소상공인 맞춤형 경량화 CCT V AI SaaS 개발",
            tags: ["#AI", "#FastAPI", "#VectorDB"],
            desc: "모듈형 AI 파이프라인 설계를 통해 객체 탐지, 임베딩 생성, 재인식 로직을 분리하여 시스템의 확장성 및 재사용성 확보. FastAPI 기반 비동기 처리로 실시간 영상 분석 및 알림 전송 구현.",
            pdfLink: "/projects/project_pictag.pdf",
            demoLink: "#",
            video: "/projects/pictag_demo.mp4",
            image: "/projects/pictag_thumb.png"
        },
        {
            title: "Sodamdiary: 시각 장애인을 위한 사용자 음성 기반 사진 해설 다이어리 앱",
            tags: ["#AI", "#FastAPI", "#VectorDB"],
            desc: "다중 모델 추론 과정을 병렬 스레드로 분리 처리하여 응답 시간 40% 단축하였으며 지연 최소화 및 성능 향승 위해, OpenVINO 적용하여 추론 최적화",
            pdfLink: "/projects/project_sodamdiary.pdf",
            demoLink: "#",
            video: "/projects/sodamdiary_demo.mp4",
            image: "/projects/sodamdiary_thumb.png"
        },
        {
            title: "Dotodo: 음성 입력 기반 인공지능 개인화 할 일 추천 앱 서비스",
            tags: ["#AI", "#FastAPI", "#VectorDB"],
            desc: "Langchain 기반 LLM RAG 시스템 구현 및 최적화를 통해 개인화된 할 일 추천 제공하며 고성능 추천 을 위한 VectorDB 및 NLP 파이프라인 구축",
            pdfLink: "/projects/project_dotodo.pdf",
            demoLink: "#",
            video: "/projects/dotodo_demo.mov",
            image: "/projects/dotodo_thumb.png"
        },
    ]
};