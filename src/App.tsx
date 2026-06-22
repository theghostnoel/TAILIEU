/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Category, Document } from './types';
import { INITIAL_CATEGORIES, INITIAL_DOCUMENTS } from './initialData';
import { Header } from './components/Header';
import { Explore } from './components/Explore';
import { DocumentModal } from './components/DocumentModal';
import { AdminPanel } from './components/AdminPanel';
import { 
  seedInitialDataIfEmpty, 
  subscribeCategories, 
  subscribeDocuments 
} from './firebase';
import { BookOpen, Sparkles, FolderDown, Zap, Users } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'explore' | 'admin'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State backing categories and documents, synchronized with Cloud Firestore in real-time
  const [categories, setCategories] = useState<Category[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    // 1. Seed default items into Cloud Firestore if the database is blank
    const initFirebaseData = async () => {
      await seedInitialDataIfEmpty();
    };
    initFirebaseData();

    // 2. Subscribe to real-time additions/modifications of Categories in Firestore
    const unsubscribeCats = subscribeCategories((updatedCats) => {
      setCategories(updatedCats);
    });

    // 3. Subscribe to real-time additions/modifications of Documents in Firestore
    const unsubscribeDocs = subscribeDocuments((updatedDocs) => {
      setDocuments(updatedDocs);
    });

    // Check if admin is currently signed in
    const storedAdmin = localStorage.getItem('docsharing_admin_session');
    if (storedAdmin === 'active-session') {
      setIsAdminLoggedIn(true);
    }

    return () => {
      unsubscribeCats();
      unsubscribeDocs();
    };
  }, []);

  // Sync admin state
  const handleAdminLoginStateChange = (loggedIn: boolean) => {
    setIsAdminLoggedIn(loggedIn);
    if (loggedIn) {
      localStorage.setItem('docsharing_admin_session', 'active-session');
    } else {
      localStorage.removeItem('docsharing_admin_session');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('docsharing_admin_session');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-500/20 selection:text-blue-900">
      
      {/* Absolute background accent decor */}
      <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-blue-50/60 via-indigo-50/30 to-transparent pointer-events-none select-none z-0" />

      {/* Header Navigation Module */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Space */}
      <div className="flex-grow z-10">
        
        {/* Explore view (Hero banner + documents grid combo) */}
        {currentTab === 'explore' && (
          <div>
            {/* Elegant Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-8 text-center px-4 max-w-7xl mx-auto">
              
              {/* Dynamic tag decoration */}
              <div className="inline-flex items-center gap-1 bg-white border border-slate-200/90 shadow-sm px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-slate-700 hover:scale-105 transition-all mb-4.5 cursor-help">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin duration-3000" />
                <span>Tổng kho tài nguyên, tài liệu học tập, ngoại ngữ &amp; công nghệ lập trình</span>
              </div>

              {/* Title display */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 max-w-4xl mx-auto leading-tight">
                Mở khóa kho tàng tài liệu tối ưu{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-650 to-indigo-650 bg-clip-text text-transparent">
                  Chỉ trong 2 bước cực kỳ nhanh
                </span>
              </h1>
              
              <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Tổng kho lưu trữ tài liệu giáo dục toàn diện: từ Ngoại ngữ (IELTS, HSK, TOEIC), Lập trình &amp; Công nghệ Code đến đầy đủ đề thi học thuật chất lượng cao hoàn toàn miễn phí.
              </p>

              {/* Fast stats cards bento box layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto text-slate-800">
                
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-2 justify-center text-blue-600 font-bold mb-1">
                    <FolderDown className="w-4 h-4" />
                    <span className="text-sm font-extrabold sm:text-base">12,400+</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Tải xuống file gốc</span>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-2 justify-center text-indigo-600 font-bold mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm font-extrabold sm:text-base">{documents.length}+ VIP</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Tài liệu chuẩn hóa</span>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-2 justify-center text-violet-655 text-violet-600 font-bold mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-extrabold sm:text-base">15,000+</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Thành viên cộng đồng</span>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-1.5 justify-center text-emerald-600 font-bold mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-extrabold sm:text-base">0 Giây</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Không chờ đợi</span>
                </div>

              </div>

            </section>

            {/* Interactive Explore area */}
            <Explore
              documents={documents}
              categories={categories}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectDocument={(doc) => setSelectedDocument(doc)}
            />
          </div>
        )}

        {/* Tab views: Admin Control Panel Dashboard */}
        {currentTab === 'admin' && (
          <AdminPanel
            categories={categories}
            setCategories={setCategories}
            documents={documents}
            setDocuments={setDocuments}
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={handleAdminLoginStateChange}
          />
        )}

      </div>

      {/* Interactive Modal showing Details with smart 2-step link unlocking */}
      {selectedDocument && (
        <DocumentModal
          document={selectedDocument}
          categories={categories}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      {/* Beautiful Footer component */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 relative overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  StudyShare v2 — Tổng Kho Tài Liệu Giáo Dục Toàn Diện Miễn Phí
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-700 border border-green-200">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Thi thiết lập tối ưu</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Xây dựng dự án mã nguồn mở phi thương mại hỗ trợ tự học hiệu quả toàn diện.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-xs font-semibold text-slate-600">
              <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setCurrentTab('explore')}>
                Kho tài liệu
              </span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setCurrentTab('admin')}>
                Bảng Điều Khiển
              </span>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10.5px] text-slate-400 font-mono">
            <span>© 2026 tongtailieu. Tổng kho tài liệu học tập chất lượng cao.</span>
            <div className="flex items-center justify-center sm:justify-end gap-2.5">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Hệ thống: Hoạt động bình thường</span>
              </span>
              <span className="text-slate-200">|</span>
              <span>Bản dựng Premium v2.2</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
