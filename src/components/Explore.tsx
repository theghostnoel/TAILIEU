/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Document, Category } from '../types';
import { Search, Filter, BookOpen, ChevronRight, ChevronLeft, Eye, RefreshCw, Layers, Compass } from 'lucide-react';

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 15;

  // Track image load errors to render clean dynamic fallbacks
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedSubject(null);
  }, [selectedCategoryId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubject, searchQuery]);

  // Filtered documents list
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // 1. Filter by Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(query);
        const matchesDesc = doc.description.toLowerCase().includes(query);
        const matchesSubject = doc.subject?.toLowerCase().includes(query) ?? false;
        if (!matchesTitle && !matchesDesc && !matchesSubject) return false;
      }

      // 2. Filter by Category ID
      if (selectedCategoryId && doc.category_id !== selectedCategoryId) {
        return false;
      }

      // 3. Filter by Subject Tag
      if (selectedSubject) {
        if (!doc.subject) return false;
        const docSub = doc.subject.toLowerCase();
        const targetSub = selectedSubject.toLowerCase();
        if (!docSub.includes(targetSub) && !targetSub.includes(docSub)) {
          return false;
        }
      }

      return true;
    });
  }, [documents, searchQuery, selectedCategoryId, selectedSubject]);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);

  // Paginated chunk of documents
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDocuments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDocuments, currentPage]);

  const handleClearFilters = () => {
    setSelectedCategoryId(null);
    setSelectedSubject(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Dynamically compile active subjects from the document pool to ensure 100% synchronization
  const uniqueSubjects = useMemo(() => {
    const subs = documents
      .map(d => d.subject?.trim())
      .filter((sub): sub is string => !!sub);
    const set = Array.from(new Set(subs));
    
    // Default fallback study tags if no documents have subjects loaded yet
    if (set.length === 0) {
      return ['Toán học', 'Ngữ Văn', 'Tiếng Anh/IELTS', 'Tiếng Trung', 'Sinh học', 'Lịch sử', 'Địa lý', 'Lập trình'];
    }
    return set;
  }, [documents]);

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
          
          {/* Categories selectors */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-1 flex items-center gap-1.5 leading-none">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Danh Mục Tài Liệu</span>
            </h3>

            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  selectedCategoryId === null
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Tất cả danh mục</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  selectedCategoryId === null ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {documents.length}
                </span>
              </button>

              {categories.map((cat) => {
                const docCount = documents.filter(d => d.category_id === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      selectedCategoryId === cat.id
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate text-left flex-1 min-w-0" title={cat.name}>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                      selectedCategoryId === cat.id ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {docCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subjects (Môn học) selectors */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5 leading-none">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Môn Học / Chuyên Đề</span>
            </h3>

            <div className="flex flex-wrap gap-1.5 max-h-[250px] overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedSubject(null)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedSubject === null
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-105 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                Tất cả môn
              </button>

              {uniqueSubjects.map((sub) => {
                const isSelected = selectedSubject === sub;
                // Count documents with this subject in the pool (optionally respecting current selected category)
                const count = documents.filter(d => {
                  if (selectedCategoryId && d.category_id !== selectedCategoryId) return false;
                  return d.subject?.toLowerCase() === sub.toLowerCase();
                }).length;

                return (
                  <button
                    key={sub}
                    disabled={count === 0 && !isSelected}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:hover:bg-slate-50 disabled:cursor-not-allowed flex items-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    <span>{sub}</span>
                    <span className={`text-[9px] font-bold leading-none px-1 py-0.5 rounded-full ${
                      isSelected ? 'bg-indigo-700 text-indigo-50' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

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
                {selectedCategoryId 
                  ? categories.find(c => c.id === selectedCategoryId)?.name 
                  : 'Tất cả tài liệu'}
              </h2>
            </div>

            {(selectedCategoryId || searchQuery) && (
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
            <>
              {/* Cards Grid List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedDocuments.map((doc, idx) => {
                  const category = categories.find((c) => c.id === doc.category_id);
                  const fileFormat = doc.file_url.includes('drive') ? 'PDF' : 'DOCX';
                  const pagesCount = 12 + (idx * 6) % 35;
                  const filePageAndProgress = `4.5 MB • ${pagesCount} trang`;

                  return (
                    <div
                      key={doc.id}
                      onClick={() => onSelectDocument(doc)}
                      className="group bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      {/* Upper Thumbnail Section */}
                      <div className="relative h-40 w-full bg-slate-100 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                        {doc.image_url && !imageErrors[doc.id] ? (
                          <img
                            src={doc.image_url}
                            alt=""
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
                          className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm shadow-sm text-slate-800 text-[9px] font-extrabold px-2 py-1 rounded uppercase tracking-wider border border-slate-150 max-w-[70%] inline-block truncate"
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
                      <div className="flex flex-col justify-between flex-1 text-left">
                        <div className="space-y-1.5 mb-3.5">
                          {doc.subject && (
                            <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100/60 text-indigo-700 text-[9.5px] font-bold px-2 py-0.5 rounded-lg mb-1 select-none">
                              📚 {doc.subject}
                            </span>
                          )}
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:hover:text-slate-600 disabled:hover:bg-slate-50 rounded-xl transition-all border border-slate-200/50 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Trang trước</span>
                  </button>
                  
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[32px] h-8 text-xs font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:hover:text-slate-600 disabled:hover:bg-slate-50 rounded-xl transition-all border border-slate-200/50 cursor-pointer"
                  >
                    <span>Trang sau</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

        </main>

      </div>
    </div>
  );
};
