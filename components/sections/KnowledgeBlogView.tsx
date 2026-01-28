// components/sections/KnowledgeBlogView.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { Search, Clock, Tag, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  readTime: number;
  tags: string[];
}

interface KnowledgeBlogViewProps {
  data: any;
  onPostClick: (post: any) => void;
}

export default function KnowledgeBlogView({ data, onPostClick }: KnowledgeBlogViewProps) {
  const { locale } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 데이터 변환: 그래프 데이터를 블로그 포스트 형태로 변환
  const blogPosts = useMemo(() => {
    const posts: BlogPost[] = [];
    
    data.nodes.forEach((node: any) => {
      if (node.level === 2 && node.content) {
        const category = node.parentId?.split('/').pop() || 'general';
        const wordCount = node.content.split(' ').length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200)); // 분당 200단어 기준
        
        posts.push({
          id: node.id,
          title: node.label,
          content: node.content,
          category: category,
          readTime,
          tags: extractTags(node.content)
        });
      }
    });
    
    return posts.sort((a, b) => a.title.localeCompare(b.title));
  }, [data]);

  // 카테고리 목록 생성
  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogPosts.map(post => post.category)));
    return ['all', ...cats.sort()];
  }, [blogPosts]);

  // 필터링된 포스트
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchTerm, selectedCategory]);

  // 카테고리별 그룹핑
  const groupedPosts = useMemo(() => {
    const groups: { [key: string]: BlogPost[] } = {};
    filteredPosts.forEach(post => {
      if (!groups[post.category]) {
        groups[post.category] = [];
      }
      groups[post.category].push(post);
    });
    return groups;
  }, [filteredPosts]);

  return (
    <div className="w-full max-w-6xl space-y-8">
      {/* 검색 및 필터 */}
      <div className="flex flex-col gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={locale === 'en' ? 'Search knowledge...' : '지식 검색...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#13ecda] focus:border-transparent outline-none transition-all"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-[#13ecda] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category === 'all' ? (locale === 'en' ? 'All' : '전체') : formatCategoryName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* 통계 */}
      <div className="flex items-center gap-6 text-sm text-slate-500">
        <span>{filteredPosts.length} {locale === 'en' ? 'articles' : '개 글'}</span>
        <span>{categories.length - 1} {locale === 'en' ? 'categories' : '개 카테고리'}</span>
      </div>

      {/* 블로그 포스트 리스트 */}
      <div className="space-y-8">
        {Object.entries(groupedPosts).map(([category, posts]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
              {formatCategoryName(category)} ({posts.length})
            </h3>
            
            <div className="grid gap-4">
              {posts.map(post => (
                <article
                  key={post.id}
                  onClick={() => onPostClick(data.nodes.find((n: any) => n.id === post.id))}
                  className="group p-6 bg-white border border-slate-200 rounded-lg hover:border-[#13ecda] hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <h4 className="text-lg font-semibold text-slate-900 group-hover:text-[#13ecda] transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {getContentPreview(post.content)}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{post.readTime} {locale === 'en' ? 'min read' : '분 읽기'}</span>
                        </div>
                        
                        {post.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag size={14} />
                            <span>{post.tags.slice(0, 3).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <ChevronRight size={20} className="text-slate-400 group-hover:text-[#13ecda] transition-colors flex-shrink-0" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Search size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">
            {locale === 'en' ? 'No articles found' : '검색 결과가 없습니다'}
          </p>
          <p className="text-sm mt-2">
            {locale === 'en' ? 'Try different keywords or categories' : '다른 키워드나 카테고리를 시도해보세요'}
          </p>
        </div>
      )}
    </div>
  );
}

// 유틸리티 함수들
function extractTags(content: string): string[] {
  // 마크다운에서 태그 추출 (예: #tag 형태)
  const tagRegex = /#(\w+)/g;
  const matches = content.match(tagRegex);
  return matches ? matches.map(tag => tag.slice(1)).slice(0, 5) : [];
}

function formatCategoryName(category: string): string {
  // 한국어 카테고리 이름 매핑
  const koreanNames: { [key: string]: string } = {
    'aws-saa': 'AWS Solutions Architect',
    'kdlc': 'K-Digital Learning Challenge',
    'projects': 'Projects',
    '정보처리기사': 'Information Processing Engineer'
  };
  
  return koreanNames[category] || category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getContentPreview(content: string): string {
  // 마크다운 문법 제거하고 첫 200자 추출
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // 헤더 제거
    .replace(/\*\*(.*?)\*\*/g, '$1') // 볼드 제거
    .replace(/\*(.*?)\*/g, '$1') // 이탤릭 제거
    .replace(/`(.*?)`/g, '$1') // 인라인 코드 제거
    .replace(/\n+/g, ' ') // 줄바꿈을 공백으로
    .trim();
  
  return plainText.length > 200 ? plainText.slice(0, 200) + '...' : plainText;
}