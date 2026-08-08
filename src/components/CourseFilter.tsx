import React from 'react';
import { Search, Filter, X, SlidersHorizontal, DollarSign, Layers, Sparkles, RotateCcw } from 'lucide-react';

export type PriceRangeOption = 'all' | 'under-100' | '100-200' | '200-plus';
export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating';

interface CourseFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priceRange: PriceRangeOption;
  onPriceRangeChange: (pr: PriceRangeOption) => void;
  selectedLevel: string;
  onLevelChange: (lvl: string) => void;
  sortBy: SortOption;
  onSortByChange: (sb: SortOption) => void;
  onResetFilters: () => void;
  totalResults: number;
  totalCoursesCount: number;
}

export const CourseFilter: React.FC<CourseFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedLevel,
  onLevelChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  totalResults,
  totalCoursesCount,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    priceRange !== 'all' ||
    selectedLevel !== 'all';

  const categoryLabels: Record<string, string> = {
    all: 'All Categories',
    'data-science': 'Data Science & Analytics',
    coding: 'Development & Coding',
    designing: 'Design & UI/UX',
    qa: 'QA & Software Testing',
  };

  const levelLabels: Record<string, string> = {
    all: 'All Levels',
    Beginner: 'Beginner',
    Intermediate: 'Intermediate',
    Advanced: 'Advanced',
  };

  const priceLabels: Record<PriceRangeOption, string> = {
    all: 'All Prices',
    'under-100': 'Under $100',
    '100-200': '$100 – $200',
    '200-plus': '$200+',
  };

  return (
    <div id="course-filter-panel" className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
      
      {/* Top Search and Main Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search courses by keyword, instructor, technology..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3.5 p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2 sm:w-auto">
          <label className="text-xs font-semibold text-slate-400 shrink-0 hidden sm:inline">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
          >
            <option value="featured">Featured & Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

      </div>

      {/* Filter Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
        
        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" /> Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="data-science">Data Science & Analytics</option>
            <option value="coding">Development & Coding</option>
            <option value="designing">Design & UI/UX Systems</option>
            <option value="qa">Quality Assurance & Testing</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Price Range
          </label>
          <select
            value={priceRange}
            onChange={(e) => onPriceRangeChange(e.target.value as PriceRangeOption)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
          >
            <option value="all">All Prices</option>
            <option value="under-100">Under $100</option>
            <option value="100-200">$100 – $200</option>
            <option value="200-plus">$200+</option>
          </select>
        </div>

        {/* Difficulty Level Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" /> Difficulty Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
          >
            <option value="all">All Difficulty Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

      </div>

      {/* Active Filter Badges & Results Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs">
        
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white font-mono">
            Showing {totalResults} of {totalCoursesCount} Courses
          </span>
          {hasActiveFilters && (
            <span className="text-slate-500 text-[11px] hidden sm:inline">• Active filters applied</span>
          )}
        </div>

        {/* Active Pill Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {searchQuery && (
            <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[11px] font-semibold flex items-center gap-1">
              "{searchQuery}"
              <button type="button" onClick={() => onSearchChange('')} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== 'all' && (
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1">
              Category: {categoryLabels[selectedCategory] || selectedCategory}
              <button type="button" onClick={() => onCategoryChange('all')} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {priceRange !== 'all' && (
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1">
              Price: {priceLabels[priceRange]}
              <button type="button" onClick={() => onPriceRangeChange('all')} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedLevel !== 'all' && (
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1">
              Level: {selectedLevel}
              <button type="button" onClick={() => onLevelChange('all')} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-amber-400 font-bold hover:underline text-[11px] flex items-center gap-1 ml-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
