// components/sections/KnowledgeBlogView.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { Search, Clock, Tag, ChevronRight, ChevronDown, ChevronUp, BookOpen, Layers } from 'lucide-react';
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
  const [isShowAll, setIsShowAll] = useState(false);

  // 데이터 변환 로직
  const blogPosts = useMemo(() => {
    const posts: BlogPost[] = [];
    data.nodes.forEach((node: any) => {
      if (node.level === 2 && node.content) {
        const category = node.parentId?.split('/').pop() || 'general';
        const wordCount = node.content.split(' ').length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));
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

  // 카테고리별 통계 데이터 생성
  const categoryStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    blogPosts.forEach(post => {
      stats[post.category] = (stats[post.category] || 0) + 1;
    });
    return stats;
  }, [blogPosts]);

  const categories = useMemo(() => {
    return Object.keys(categoryStats).sort();
  }, [categoryStats]);

  // 필터링 로직
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchTerm, selectedCategory]);

  const handleFilterChange = (type: 'category' | 'search', value: string) => {
    if (type === 'category') setSelectedCategory(value);
    if (type === 'search') setSearchTerm(value);
    setIsShowAll(false);
  };

  // 현재 리스트를 보여줄지 여부 결정
  const isFiltering = searchTerm !== '' || selectedCategory !== 'all';
  const displayPosts = isShowAll ? filteredPosts : filteredPosts.slice(0, 5);

  return (
    <div className="w-full max-w-6xl space-y-10">
      {/* 상단 검색 바 */}
      <div className="relative max-w-2xl mx-auto">
        <Search size={22} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={locale === 'en' ? 'Search through knowledge base...' : '전체 지식 베이스 검색...'}
          value={searchTerm}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#13ecda] focus:border-transparent outline-none transition-all shadow-sm"
        />
      </div>

      {/* 메인 콘텐츠 영역 */}
      {!isFiltering ? (
        /* 초기 ALL 상태: 카테고리 목록을 인덱스 형태로 나열 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilterChange('category', cat)}
              className="group p-6 bg-white border border-slate-100 rounded-2xl hover:border-[#13ecda] hover:shadow-xl transition-all text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-50 group-hover:bg-[#13ecda]/10 rounded-xl transition-colors">
                  <Layers size={24} className="text-slate-400 group-hover:text-[#13ecda]" />
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                  {categoryStats[cat]} Posts
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#13ecda] transition-colors mb-2">
                {formatCategoryName(cat)}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2">
                {locale === 'en' ? `Explore articles about ${cat}` : `${formatCategoryName(cat)} 관련 지식 탐색`}
              </p>
              <div className="mt-4 flex items-center text-sm font-bold text-[#13ecda] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                {locale === 'en' ? 'Browse Category' : '카테고리 보기'} <ChevronRight size={16} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* 필터링/검색 상태: 글 목록 5개 노출 */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => handleFilterChange('category', 'all')}
              className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ChevronRight size={16} className="rotate-180" />
              {locale === 'en' ? 'Back to All Categories' : '전체 카테고리로 돌아가기'}
            </button>
            <span className="text-sm font-medium text-[#13ecda] bg-[#13ecda]/10 px-3 py-1 rounded-full">
              {selectedCategory !== 'all' ? formatCategoryName(selectedCategory) : 'Search Results'}: {filteredPosts.length}
            </span>
          </div>

          <div className="grid gap-4">
            {displayPosts.map(post => (
              <article
                key={post.id}
                onClick={() => onPostClick(data.nodes.find((n: any) => n.id === post.id))}
                className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#13ecda] hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#13ecda]">
                        {post.category}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Clock size={12} />
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-[#13ecda] transition-colors">
                      {post.title}
                    </h4>
                    {/* 선택된 경우에만 혹은 검색 시에만 태그 노출 */}
                    {post.tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#13ecda] transition-all">
                    <ChevronRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length > 5 && (
            <button
              onClick={() => setIsShowAll(!isShowAll)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {isShowAll ? (
                <> {locale === 'en' ? 'Collapse List' : '목록 접기'} <ChevronUp size={20} /> </>
              ) : (
                <> {locale === 'en' ? `Show all ${filteredPosts.length} articles` : `전체 ${filteredPosts.length}개 글 모두 보기`} <ChevronDown size={20} /> </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// 유틸리티 함수 (태그 소문자화)
function extractTags(content: string): string[] {
  const tagRegex = /#(\w+)/g;
  const matches = content.match(tagRegex);
  return matches ? matches.map(tag => tag.slice(1).toLowerCase()).slice(0, 3) : [];
}

function formatCategoryName(category: string): string {
  const koreanNames: { [key: string]: string } = {
    'aws-saa': 'AWS Solutions Architect',
    'kdlc': 'K-Digital Learning Challenge',
    'projects': 'Projects',
    '정보처리기사': 'Information Processing Engineer'
  };
  return koreanNames[category] || category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}