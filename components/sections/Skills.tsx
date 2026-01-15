export default function Skills() {
  const skills = [
    { name: "LLM Orchestration", level: "95%", desc: "LangChain, LlamaIndex, OpenAI SDK" },
    { name: "Vector Databases & RAG", level: "90%", desc: "Pinecone, Weaviate, Milvus" },
    { name: "Cloud Architecture", level: "85%", desc: "AWS, Docker, Kubernetes" },
  ];

  return (
    <section id="skills" className="py-24 px-12 md:px-24 border-t border-slate-100">
      <div className="max-w-4xl">
        <h2 className="text-[11px] font-bold tracking-[0.5em] uppercase text-primary mb-12">
          Skills & Expertise
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {skills.map((skill, index) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black tracking-tight uppercase text-slate-900">
                  {skill.name}
                </span>
                <span className="text-sm font-bold text-primary">{skill.level}</span>
              </div>
              
              {/* 게이지 바 배경 */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                {/* 실제 게이지 - 이제 bg-primary가 작동합니다 */}
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: skill.level }}
                ></div>
              </div>
              
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                {skill.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}