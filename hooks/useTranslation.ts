// hooks/useTranslation.ts
import { useLanguage } from '@/contexts/LanguageContext';
import { heroData } from '@/data/heroData';
import { heroDataEn } from '@/data/heroData.en';
import { aboutData } from '@/data/aboutData';
import { aboutDataEn } from '@/data/aboutData.en';
import { experienceData } from '@/data/experienceData';
import { experienceDataEn } from '@/data/experienceData.en';
import { projectsData } from '@/data/projectsData';
import { projectsDataEn } from '@/data/projectsData.en';
import { contactData } from '@/data/contactData';
import { contactDataEn } from '@/data/contactData.en';
import { knowledgeDataEn } from '@/data/knowledgeData.en';

export function useTranslation() {
  const { locale } = useLanguage();

  const t = {
    hero: locale === 'en' ? heroDataEn : heroData,
    about: locale === 'en' ? aboutDataEn : aboutData,
    experience: locale === 'en' ? experienceDataEn : experienceData,
    projects: locale === 'en' ? projectsDataEn : projectsData,
    contact: locale === 'en' ? contactDataEn : contactData,
    knowledge: locale === 'en' ? knowledgeDataEn : {
      topLabel: "Knowledge Graph",
      title: "Technical\nExpertise.",
      description: "AI, 클라우드 아키텍처, 프로젝트 관리 실무 경험으로 구축된 기술 지식 네트워크를 탐색해보세요."
    }
  };

  return { t, locale };
}