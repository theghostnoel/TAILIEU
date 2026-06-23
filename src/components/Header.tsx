/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, Shield, Search, Sparkles, ChevronDown, 
  Home, FileText, CheckCircle2, Phone, MessageSquare, 
  ExternalLink, LogOut, Key
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'explore' | 'admin';
  setCurrentTab: (tab: 'explore' | 'admin') => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sponsorText: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  isAdminLoggedIn,
  onLogout,
  searchQuery,
  setSearchQuery,
  sponsorText,
}) => {
  // Mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dropdown states
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Focus Search Bar helper
  const handleFocusSearch = () => {
    setCurrentTab('explore');
    setTimeout(() => {
      const searchInput = document.getElementById('search-input-desktop') || document.getElementById('search-input-mobile');
      if (searchInput) {
        searchInput.focus();
        (searchInput as HTMLInputElement).select();
      }
    }, 100);
  };

  // Scroll to active filters helper
  const handleScrollToFilters = () => {
    setCurrentTab('explore');
    setTimeout(() => {
      const filterSection = document.getElementById('explore-documents-section');
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSelectExamFilter = (subject: string) => {
    setSearchQuery(subject);
    setCurrentTab('explore');
    setIsExamDropdownOpen(false);
  };

  return (
    <header className="w-full transition-all duration-300 shadow-md">
      
      {/* 1. TOP BRAND BANNER - Exactly matches the blue banner with smile academic logo */}
      <div className="bg-[#2563eb] text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-blue-500/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div 
            onClick={() => {
              setCurrentTab('explore');
              setSearchQuery('');
            }} 
            className="flex items-center gap-3.5 cursor-pointer group text-center sm:text-left"
          >
            {/* White clean icon resembling custom logo */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 font-bold" />
            </div>
            
             <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 justify-center sm:justify-start">
                <span>TỔNG KHO TÀI LIỆU</span>
                <span className="text-[10px] sm:text-xs bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  STUDYSHARE
                </span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-yellow-300 uppercase tracking-wide mt-0.5">
                Kho tài liệu học tập toàn diện: Ngoại ngữ, Công nghệ, Lập trình &amp; Phổ thông
              </p>
            </div>
          </div>

          {/* Quick Stats or admin indicator */}
          <div className="flex items-center gap-3">
            {isAdminLoggedIn ? (
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Chế độ quản trị: Đang hoạt động</span>
              </span>
            ) : (
              <span className="bg-blue-700/50 text-blue-100 text-[10px] sm:text-xs font-medium px-3 py-1 border border-blue-500/20 rounded-full">
                Hệ thống trực tuyến 24/7
              </span>
            )}
          </div>

        </div>
      </div>

      {/* 2. BLACK MENU BAR MODULE - Authentically matches the custom design */}
      <div className="bg-slate-950 text-white border-b border-slate-900 sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14 gap-2">
            
            {/* Core Tabs list */}
            <div className="hidden md:flex items-center h-full gap-0.5">
              
              {/* Trang chủ */}
              <button
                onClick={() => {
                  setCurrentTab('explore');
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2 px-4 h-full text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                  currentTab === 'explore' && searchQuery === ''
                    ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>Trang Chủ</span>
              </button>

              {/* Tìm Kiếm Nhanh */}
              <button
                onClick={handleFocusSearch}
                className="flex items-center gap-2 px-4 h-full text-xs lg:text-sm font-bold/80 text-slate-300 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Tìm Kiếm Nhanh</span>
              </button>

              {/* Lọc Danh Sách Tài Liệu */}
              <button
                onClick={handleScrollToFilters}
                className="flex items-center gap-2 px-4 h-full text-xs lg:text-sm font-bold/80 text-slate-300 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
              >
                <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Lọc Danh Sách Tài Liệu</span>
              </button>

            </div>

            {/* Mobile burger/quick links toggler */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => {
                  setCurrentTab('explore');
                  setSearchQuery('');
                }}
                className={`p-2 rounded-lg text-xs font-bold leading-none flex items-center gap-1 ${
                  currentTab === 'explore' ? 'bg-blue-600 text-white' : 'text-slate-300'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Trang Chủ</span>
              </button>
            </div>

            {/* Right section: Search bar & Admin switcher */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Search form bar on the dark header directly */}
              <div className="relative">
                <input
                  id="search-input-desktop"
                  type="text"
                  placeholder="Nhập từ khóa tìm kiếm tài liệu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3.5 py-1.5 pl-8 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-36 sm:w-56 transition-all"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Admin Panel Switching button */}
              <button
                onClick={() => setCurrentTab(currentTab === 'admin' ? 'explore' : 'admin')}
                className={`p-2 rounded-lg transition-all cursor-pointer shrink-0 ${
                  currentTab === 'admin' 
                    ? 'bg-amber-500 text-slate-950 font-bold' 
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
                title="Bảng điều khiển Admin"
              >
                <Shield className="w-4 h-4 text-amber-400" />
              </button>

              {isAdminLoggedIn && (
                <button
                  onClick={onLogout}
                  className="bg-red-950/40 text-red-400 hover:text-red-300 p-2 border border-red-950/60 rounded-lg"
                  title="Thoát quyền hạn Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

            </div>

          </div>
        </div>
      </div>

      {/* 3. SCROLLING ANNOUNCEMENT TICKER - Authentically matches screenshot */}
      <div className="bg-amber-400 border-y border-amber-500 flex items-center py-1 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center">
          
          {/* Ticker badge overlay */}
          <div className="bg-[#1e40af] text-white font-extrabold text-[10px] sm:text-[11px] px-3 py-1 rounded-sm shadow-sm flex items-center gap-1.5 uppercase shrink-0 tracking-wider h-6 z-10">
            <Sparkles className="w-3 h-3 text-yellow-350 animate-bounce" />
            <span>TIN TÀI TRỢ</span>
          </div>

          {/* Infinite Marquee text box */}
          <div className="flex-1 overflow-hidden relative ml-3 w-full h-5 flex items-center">
            <span className="text-[11px] sm:text-xs font-bold text-slate-950 animate-marquee select-all cursor-help block pl-4">
              {sponsorText || "🔥 HỆ THỐNG PHÁT HÀNH: Tổng kho tài liệu học tập toàn diện - Ngoại ngữ IELTS/HSK giao tiếp và Lập trình nâng cao miễn phí!"}
            </span>
          </div>

        </div>
      </div>

      {/* 4. CHUYÊN ĐỀ PHÂN CHIA NHANH - General Educational Categories replaced */}
      <div className="bg-slate-50 border-b border-slate-200 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider shrink-0"> Kho chuyên đề:</span>
            
            <button 
              onClick={() => setSearchQuery('Lập trình')} 
              className={`shrink-0 text-xs px-3 py-1 rounded-full font-bold transition-all ${
                searchQuery.toLowerCase() === 'lập trình' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              💻 Lập trình &amp; IT
            </button>
            <button 
              onClick={() => setSearchQuery('Tiếng Anh')} 
              className={`shrink-0 text-xs px-3 py-1 rounded-full font-bold transition-all ${
                searchQuery.toLowerCase() === 'tiếng anh' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              🇬🇧 Tiếng Anh / IELTS
            </button>
            <button 
              onClick={() => setSearchQuery('Tiếng Trung')} 
              className={`shrink-0 text-xs px-3 py-1 rounded-full font-bold transition-all ${
                searchQuery.toLowerCase() === 'tiếng trung' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              🇨🇳 Tiếng Trung - Hàn - Nhật
            </button>
            <button 
              onClick={() => setSearchQuery('Toán')} 
              className={`shrink-0 text-xs px-3 py-1 rounded-full font-bold transition-all ${
                searchQuery.toLowerCase() === 'toán' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              📐 Toán học &amp; Tư Duy
            </button>
            <button 
              onClick={() => setSearchQuery('Văn')} 
              className={`shrink-0 text-xs px-3 py-1 rounded-full font-bold transition-all ${
                searchQuery.toLowerCase() === 'văn' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              ✍️ Ngữ Văn &amp; Xã Hội
            </button>
            <div className="h-4 w-px bg-slate-350 shrink-0 mx-1"></div>
            <button 
              onClick={() => setSearchQuery('')} 
              className="shrink-0 text-xs text-blue-600 font-bold hover:underline"
            >
              Tất cả tài liệu
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-450 font-bold text-slate-500">
            <span>Tổng tài nguyên lưu trữ:</span>
            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-black">99,999+ File</span>
          </div>
        </div>
      </div>

      {/* SUPPORT MODAL (Zalo, Help and Links) */}
      {isSupportOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[99] animate-in fade-in duration-200" id="support-modal">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-150 p-6 sm:p-8">
            <button 
              onClick={() => setIsSupportOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Liên Hệ &amp; Hỗ Trợ Khách Hàng</h3>
                <p className="text-xs text-slate-500 mt-0.5">Wikipedia phiên bản giáo dục Việt Nam</p>
              </div>
            </div>

            <div className="space-y-4 text-slate-800 text-xs sm:text-sm">
              <p className="text-xs text-slate-500 leading-relaxed bg-slate-55 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                Nếu bạn cần gửi yêu cầu tài liệu mới, phản ánh liên kết bị lỗi hoặc đóng góp tài liệu từ bản thân bạn, hãy liên hệ với chúng tôi qua các kênh dưới đây. Chúng tôi phản hồi trong vòng 2 giờ.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                
                <a 
                  href="https://zalo.me/g/congdonghocsinhvietnam-demo" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-3 p-3.5 bg-blue-50 hover:bg-blue-105 border border-blue-100 rounded-2xl hover:bg-blue-100 transition-all text-blue-700"
                >
                  <Phone className="w-5 h-5" />
                  <div className="flex flex-col text-left">
                    <span className="font-extrabold text-xs sm:text-sm">Cộng Đồng Zalo</span>
                    <span className="text-[10px] text-blue-500 font-medium">Hỗ trợ 24/7 trực tuyến</span>
                  </div>
                </a>

                <a 
                  href="https://facebook.com/groups/congdonghocsinhvietnam-demo" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-3 p-3.5 bg-indigo-50 hover:bg-indigo-105 border border-indigo-100 rounded-2xl hover:bg-indigo-100 transition-all text-indigo-700"
                >
                  <ExternalLink className="w-5 h-5" />
                  <div className="flex flex-col text-left">
                    <span className="font-extrabold text-xs sm:text-sm">Nhóm Facebook</span>
                    <span className="text-[10px] text-indigo-500 font-medium">Nơi chia sẻ đề thi vip</span>
                  </div>
                </a>

              </div>

              <div className="border-t border-slate-150 pt-4 mt-6 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs text-slate-650 font-bold text-slate-600">
                  <span>Trụ sở chính:</span>
                  <span className="font-semibold text-slate-900">Tổng kho tài liệu StudyShare VN</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-650 font-bold text-slate-600">
                  <span>Hotline khẩn cấp:</span>
                  <span className="font-semibold text-slate-900">0988.XXX.999</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-610 font-bold text-slate-600">
                  <span>Email thư từ:</span>
                  <span className="font-semibold text-slate-900">support@nganhangdethi.vn</span>
                </div>
              </div>

              <button
                onClick={() => setIsSupportOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs sm:text-sm mt-4 cursor-pointer"
              >
                Đã hiểu, đóng hộp thư
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
