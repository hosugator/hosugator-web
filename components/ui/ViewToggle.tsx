// components/ui/ViewToggle.tsx
"use client";
import React from 'react';
import { Network, List } from 'lucide-react';

export type ViewMode = 'graph' | 'blog';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-slate-100 rounded-lg p-1">
      <button
        onClick={() => onViewChange('graph')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          currentView === 'graph'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Network size={16} />
        <span className="hidden sm:inline">Graph</span>
      </button>
      <button
        onClick={() => onViewChange('blog')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          currentView === 'blog'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <List size={16} />
        <span className="hidden sm:inline">Blog</span>
      </button>
    </div>
  );
}