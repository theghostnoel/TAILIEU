/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Document, Category } from '../types';
import { Search, Filter, BookOpen, ChevronRight, Eye, RefreshCw, Layers, Compass } from 'lucide-react';

interface ExploreProps {
  documents: Document[];
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectDocument: (doc: Document) => void;
}

export const Explore: React.FC<ExploreProps> = ({
  documents,
  categories,
  searchQuery,
  setSearchQuery,
  onSelectDocument,
}) => {
  // Filter variables
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  // Track image load errors to render clean dynamic fallbacks
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Extract separate parent (e.g. parent_id === null) and child categories
  const parentCategories = useMemo(() => {
    return categories.filter((c) => c.parent_id === null);
  }, [categories]);

  // Children of the currently selected parent folder
  const childCategories = useMemo(() => {
    if (!selectedParentId) return [];
    return categories.filter((c) => c.parent_id === selectedParentId);
  }, [categories, selectedParentId]);

  // Handle select parent category
  const handleParentSelect = (id: string | null) => {
    setSelectedParentId(id);
    setSelectedChildId(null); // Reset child selection when parent shifts
  };

  // Filtered documents list
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // 1. Filter by Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(query);
        const matchesDesc = doc.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // 2. Filter by Parent Categories
      if (selectedParentId) {
        // Find if this doc's category is either the parent itself, or is a child of this parent
        const docCat = categories.find((c) => c.id === doc.category_id);
        if (!docCat) return false;

        if (selectedChildId) {
          // Both parent and child specified
          return doc.category_id === selectedChildId;
        } else {
          // Only parent specified
          const isDirectParent = doc.category_id === selectedParentId;
          const isChildOfSelected = docCat.parent_id === selectedParentId;
          return isDirectParent || isChildOfSelected;
        }
      }

      return true;
    });
  }, [documents, categories, searchQuery, selectedParentId, selectedChildId]);

  const handleClearFilters = () => {
    setSelectedParentId(null);
    setSelectedChildId(null);
    setSearchQuery('');
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="explore-documents-section">
      
      {/* Search Bar - Only visible on small devices inside content pool */}
      <div className="relative w-full mb-6 md:hidden">
        <input
          id="search-input-mobile"
          type="text"
          placeholder="Tìm tên môn, tên tài liệu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white text-slate-800 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 select-none" />
      </div>

      {/* Grid Layout Container: Sidebar on left + main folder grid on right */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Filter Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          
          {/* Parent categories selectors */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-1 flex items-center gap-1.5 leading-none">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Danh Mục Lớn</span>
            </h3>

            <div className="space-y-1">
              <button
                onClick={() => handleParentSelect(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedParentId === null
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100 shadow-sm'
                    : 'text-slate-605 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Tất cả danh mục</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedParentId === null ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {documents.length}
                </span>
              </button>

              {parentCategories.map((parent) => {
                const docCount = documents.filter(d => {
                  const cat = categories.find(c => c.id === d.category_id);
                  return d.category_id === parent.id || (cat && cat.parent_id === parent.id);
                }).length;

                return (
                  <button
                    key={parent.id}
                    onClick={() => handleParentSelect(parent.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      selectedParentId === parent.id
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-55 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate text-left flex-1 min-w-0" title={parent.name}>{parent.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                      selectedParentId === parent.id ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {docCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Child Subject Categories pills list - active if parent selected */}
          {selectedParentId && childCategories.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5 leading-none">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                <span>Chuyên đề chi tiết</span>
              </h3>

              <div className="flex flex-wrap lg:flex-col gap-1">
                <button
                  onClick={() => setSelectedChildId(null)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedChildId === null
                      ? 'bg-slate-100 text-slate-800 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Tất cả nhóm con
                </button>

                {childCategories.map((child) => {
                  const childCount = documents.filter(d => d.category_id === child.id).length;
                  return (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className={`text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between gap-2 w-full cursor-pointer ${
                        selectedChildId === child.id
                          ? 'bg-indigo-50 border border-indigo-150 text-indigo-700 font-semibold shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <span className="truncate text-left flex-1 min-w-0" title={child.name}>{child.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 font-medium">({childCount})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* High Density Community Quick Joint card */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-100">
            <h3 className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider mb-2">Nhóm Cộng đồng</h3>
            <p className="text-[11px] text-slate-600 mb-3.5 leading-relaxed">
              Nhận tài liệu độc quyền, đáp án giải chi tiết và bài kiểm tra thử mới nhất mỗi ngày hoàn toàn miễn phí!
            </p>
            <a 
              href="https://zalo.me/g/congdonghocsinhvietnam-demo" 
              target="_blank" 
              rel="noreferrer"
              className="block w-full text-center bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-600 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all duration-200 cursor-pointer"
            >
              Tham Gia Hỏa Tốc
            </a>
          </div>

        </aside>

        {/* Main Documents Grid Content */}
        <main className="flex-1">
          {/* Header actions info */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">
                Tìm thấy {filteredDocuments.length} tài liệu học tập
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedParentId 
                  ? parentCategories.find(p => p.id === selectedParentId)?.name 
                  : 'Tất cả tài liệu'}
                {selectedChildId && ` / ${categories.find(c => c.id === selectedChildId)?.name}`}
              </h2>
            </div>

            {(selectedParentId || searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50/50 hover:bg-blue-100/60 rounded-lg transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đặt lại lọc</span>
              </button>
            )}
          </div>

          {/* Empty Document State */}
          {filteredDocuments.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center max-w-xl mx-auto my-12 shadow-sm animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-350 mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm">Không tìm thấy tài liệu phù hợp</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                Thử xoá bớt bộ lọc, thay đổi từ khoá tìm kiếm hoặc kiểm tra lại các phân loại môn học hiện có.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 font-bold text-xs bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
              >
                Xem Toàn bộ Kho Tài liệu
              </button>
            </div>
          ) : (
            // Cards Grid List
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDocuments.map((doc, idx) => {
                const category = categories.find((c) => c.id === doc.category_id);
                // Simulated size & page metadata based on card index to fulfill high density telemetry specifications
                const fileFormat = doc.file_url.includes('drive') ? 'PDF' : 'DOCX';
                const filePageAndProgress = idx === 0 
                  ? '15.2 MB • 24 trang' 
                  : idx === 1 
                  ? '8.5 MB • 42 trang' 
                  : idx === 2 
                  ? '6.4 MB • 18 trang' 
                  : '3.1 MB • 12 trang';

                // Optional highlights for the primary selected look
                const isFeaturedStyle = idx === 1;

                return (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDocument(doc)}
                    className={`group bg-white rounded-2xl p-4 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isFeaturedStyle 
                        ? 'border-2 border-indigo-500 shadow-md relative translate-y-[-2px]' 
                        : 'border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500/30'
                    }`}
                  >
                    {isFeaturedStyle && (
                      <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                        Nổi bật
                      </div>
                    )}
                    
                    {/* Upper Thumbnail Section */}
                    <div className="relative h-40 w-full bg-slate-100 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                      {doc.image_url && !imageErrors[doc.id] ? (
                        <img
                          src={doc.image_url}
                          alt={doc.title}
                          referrerPolicy="no-referrer"
                          onError={() => setImageErrors(prev => ({ ...prev, [doc.id]: true }))}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-slate-100 via-indigo-50/40 to-blue-50/50 flex flex-col items-center justify-center text-slate-400 p-4 gap-2 border border-slate-100 rounded-xl">
                          <BookOpen className="w-10 h-10 text-indigo-400/80 animate-pulse duration-2000" />
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center line-clamp-1 max-w-[85%]">
                            {category ? category.name : 'Tài liệu học tập'}
                          </span>
                        </div>
                      )}
                      
                      {/* Floating Category Tag */}
                      <span 
                        className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm shadow-sm text-slate-800 text-[9px] font-extrabold px-2 py-1 rounded uppercase tracking-wider border border-slate-150 max-w-[65%] truncate"
                        title={category ? category.name : 'Miễn phí'}
                      >
                        {category ? category.name : 'Miễn phí'}
                      </span>

                      {/* Floating Format tag */}
                      <span className="absolute bottom-2 right-2 bg-slate-900/85 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                        {fileFormat}
                      </span>
                    </div>

                    {/* Lower Description Section */}
                    <div className="flex flex-col justify-between flex-1">
                      <div className="space-y-1.5 mb-3.5">
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-[13.5px] leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {doc.description}
                        </p>
                      </div>

                      {/* CTA action bottom */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {filePageAndProgress}
                        </span>
                        
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 group-hover:text-indigo-800">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                          <span>Free</span>
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
