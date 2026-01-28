// data/projectsData.en.ts
export const projectsDataEn = {
    topLabel: "Featured Projects",
    title: "Technical \nImplementations.",
    items: [
        {
            title: "Hosugator: Cloud-Native Portfolio Architecture",
            tags: ["#Next.js", "#AWS", "#GitHub-Actions"],
            desc: "Built a Next.js-based personal portfolio site in a serverless environment using AWS S3 and CloudFront. Implemented zero-downtime deployment system with GitHub Actions CI/CD pipeline, optimizing security and accessibility through Route 53 and ACM.",
            pdfLink: "/projects/project_hosugator.pdf",
            demoLink: "#",
            video: "/projects/hosugator_arch.mp4",
            image: "/projects/hosugator_thumb.png"
        },
        {
            title: "Cureat: AI Culinary Recommendation System",
            tags: ["#AI", "#FastAPI", "#VectorDB"],
            desc: "Personalized recommendation system that analyzes user intent through Okt/ko-BERT natural language processing, achieving 60% response latency reduction via Vector DB-based cosine similarity search and FastAPI asynchronous pipelines.",
            pdfLink: "/projects/cureat_en.pdf",
            demoLink: "#",
            video: "/projects/cureat_demo.mov",
            image: "/projects/cureat_thumb.png"
        },
        {
            title: "Dorosee: CV/LLM Integrated Multimodal UGV Platform",
            tags: ["#AI", "#FastAPI", "#VectorDB"],
            desc: "UGV (Unmanned Ground Vehicle) platform equipped with context-aware multimodal conversational AI interface. Integrates computer vision models and large language models to support real-time environmental recognition and natural language interaction.",
            pdfLink: "/projects/dorosee_en.pdf",
            demoLink: "#",
            video: "/projects/dorosee_demo.mp4",
            image: "/projects/dorosee_thumb.png"
        },
        {
            title: "Pictag: Lightweight CCTV AI SaaS for Small Businesses",
            tags: ["#AI", "#FastAPI", "#VectorDB"],
            desc: "Ensured system scalability and reusability by separating object detection, embedding generation, and re-identification logic through modular AI pipeline design. Implemented real-time video analysis and notification delivery using FastAPI-based asynchronous processing.",
            pdfLink: "/projects/pictag_en.pdf",
            demoLink: "#",
            video: "/projects/pictag_demo.mp4",
            image: "/projects/pictag_thumb.png"
        },
        {
            title: "Sodamdiary: Voice-Based Photo Description Diary App for Visually Impaired",
            tags: ["#AI", "#FastAPI", "#VectorDB"],
            desc: "Achieved 40% response time reduction by separating multi-model inference processes into parallel threads. Applied OpenVINO for inference optimization to minimize latency and improve performance.",
            pdfLink: "/projects/sodamdiary_en.pdf",
            demoLink: "#",
            video: "/projects/sodamdiary_demo.mp4",
            image: "/projects/sodamdiary_thumb.png"
        },
        {
            title: "Dotodo: AI-Powered Personalized Task Recommendation App with Voice Input",
            tags: ["#AI", "#FastAPI", "#VectorDB"],
            desc: "Implemented and optimized Langchain-based LLM RAG system to provide personalized task recommendations. Built VectorDB and NLP pipeline for high-performance recommendations.",
            pdfLink: "/projects/dotodo_en.pdf",
            demoLink: "#",
            video: "/projects/dotodo_demo.mov",
            image: "/projects/dotodo_thumb.png"
        },
    ]
};