/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Document, Category } from '../types';
import { X, ExternalLink, Download, ArrowRight, UserPlus, FileText, Calendar, Compass, HelpCircle } from 'lucide-react';

interface DocumentModalProps {
  document: Document | null;
  categories: Category[];
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  document,
  categories,
  onClose,
}) => {
  const [stepCompleted, setStepCompleted] = useState(false);

  if (!document) return null;

  // Find the category of this document
  const currentCategory = categories.find((c) => c.id === document.category_id);

  // Smart resolution of Category Community Link:
  // If the category doesn't have a community_link (null or empty),
  // trace back upwards to its parent category to fetch parent's link!
  const getResolvedCommunityLink = (): string | null => {
    if (!currentCategory) return null;
    
    // Check if current category has a link
    if (currentCategory.community_link && currentCategory.community_link.trim() !== '') {
      return currentCategory.community_link.trim();
    }

    // Direct parent search trace
    if (currentCategory.parent_id) {
      const parent = categories.find((c) => c.id === currentCategory.parent_id);
      if (parent && parent.community_link && parent.community_link.trim() !== '') {
        return parent.community_link.trim();
      }
    }

    // Completely blank if no link is configured in parent or child
    return null;
  };

  const communityLink = getResolvedCommunityLink();

  // Find category name
  const categoryName = currentCategory ? currentCategory.name : 'Chưa phân loại';
  
  // Find parent category name
  const parentCategory = currentCategory?.parent_id 
    ? categories.find(c => c.id === currentCategory.parent_id) 
    : null;

  const handleStep1Click = () => {
    if (!communityLink) return;
    // Open the resolved community link in a new tab
    window.open(communityLink, '_blank', 'noopener,noreferrer');
    // Instantly transition state to unlock Step 2
    setStepCompleted(true);
  };

  const handleStep2Click = () => {
    if (communityLink && !stepCompleted) return;
    // Open the real document download link
    window.open(document.file_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md transition-all duration-300">
      
      {/* Modal Card Backdrop click close helper */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Main container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in fade-in zoom-in-95 duration-200">
        
        {/* Decorative dynamic background glow */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
          id="close-modal-button"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal body */}
        <div className="flex flex-col md:flex-row h-full">
          
          {/* Cover and Thumbnail Image */}
          <div className="md:w-5/12 bg-slate-50 relative aspect-video md:aspect-auto min-h-[200px] flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-slate-100 shrink-0">
            {document.image_url ? (
              <img
                src={document.image_url}
                alt={document.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 p-6">
                <FileText className="w-12 h-12 text-slate-300 mb-2" />
                <span className="text-xs text-center">Tài liệu VIP</span>
              </div>
            )}
            
            {/* Category badge float */}
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
              {categoryName}
            </div>
          </div>

          {/* Details & Action Content */}
          <div className="md:w-7/12 p-6 flex flex-col justify-between min-w-0">
            <div>
              {/* Parent category trace badge */}
              {parentCategory && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-blue-600 font-semibold mb-1.5 break-words [word-break:break-word]">
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  <span className="break-words">{parentCategory.name}</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-500 break-words">{categoryName}</span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold text-slate-950 leading-tight break-words [word-break:break-word]">
                {document.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2.5 mb-4 font-medium">
                <div className="flex items-center gap-1 shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>22/06/2026</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Định dạng: Google Drive / PDF</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-605 leading-relaxed mb-6 line-clamp-4 break-words [word-break:break-word]">
                {document.description}
              </p>
            </div>

            {/* Smart "Link Trap" visual container box */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/90 border border-slate-200/50 p-4.5 rounded-2xl relative">
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  {communityLink ? 'Mở khóa tải tài liệu (2 bước)' : 'Tải tài liệu trực tiếp'}
                </h4>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5">
                  An toàn & Miễn phí
                </span>
              </div>

              <div className="space-y-3">
                {/* Step 1 Button */}
                {communityLink && (
                  !stepCompleted ? (
                    <button
                      id="link-trap-step-1"
                      onClick={handleStep1Click}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 group transition-all duration-300 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-blue-100 group-hover:scale-110 transition-transform" />
                      <span>BƯỚC 1: Tham gia nhóm để mở khóa</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-100 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <div className="bg-emerald-50 text-emerald-800 text-[11px] sm:text-xs font-bold p-3 rounded-xl border border-emerald-100 flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        ✓
                      </div>
                      <span>Đã tham gia nhóm liên kết! Đã mở khóa mã tải file.</span>
                    </div>
                  )
                )}

                {/* Step 2 Button - Disabled default until step 1, illuminated afterward */}
                <button
                  id="link-trap-step-2"
                  onClick={handleStep2Click}
                  disabled={communityLink ? !stepCompleted : false}
                  className={`w-full text-xs sm:text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                    (!communityLink || stepCompleted)
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] shadow-lg shadow-emerald-500/10 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 border border-slate-300 pointer-events-none opacity-45 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>{communityLink ? 'BƯỚC 2: Tải Tài Liệu Gốc' : 'Tải Bản Gốc Google Drive / Mega'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </button>
              </div>

              {/* Informative Note: Show where the link came from for testing transparent validation */}
              {communityLink && (
                <div className="mt-3.5 flex items-start gap-1.5 text-[10px] text-slate-400 select-none border-t border-slate-200/50 pt-2.5 leading-relaxed">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                  <span className="flex-1">
                    Nhóm mở khóa đang sử dụng của{' '}
                    <strong className="text-slate-605 italic">
                      {currentCategory?.community_link ? 'mục này' : `mục cha (${parentCategory?.name || 'mặc định'})`}
                    </strong>
                    :{' '}
                    <a
                      href={communityLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline hover:text-blue-700 font-medium break-all"
                      title={communityLink}
                    >
                      {communityLink}
                    </a>
                  </span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
