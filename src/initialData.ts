/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Document } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-foreign',
    name: 'Ngoại Ngữ & Chứng Chỉ',
    parent_id: null,
    community_link: 'https://facebook.com/groups/congdonghocngoaingu-demo',
  },
  {
    id: 'cat-code',
    name: 'Công Nghệ & Lập Trình (IT)',
    parent_id: null,
    community_link: 'https://zalo.me/g/congdonglaptrinh-demo',
  },
  {
    id: 'cat-school',
    name: 'Giáo Dục Phổ Thông (Cấp 2 & Cấp 3)',
    parent_id: null,
    community_link: 'https://zalo.me/g/congdonghocsinhvietnam-demo',
  },
  {
    id: 'cat-eng',
    name: 'Tiếng Anh Giao Tiếp & IELTS Quốc Tế',
    parent_id: 'cat-foreign',
    community_link: null,
  },
  {
    id: 'cat-asian',
    name: 'Tiếng Trung - Tiếng Nhật - Tiếng Hàn',
    parent_id: 'cat-foreign',
    community_link: null,
  },
  {
    id: 'cat-web',
    name: 'Lập Trình Web (HTML, CSS, JS, React)',
    parent_id: 'cat-code',
    community_link: null,
  },
  {
    id: 'cat-ai',
    name: 'Trí Tuệ Nhân Tạo (AI) & Machine Learning',
    parent_id: 'cat-code',
    community_link: null,
  },
  {
    id: 'cat-toan',
    name: 'Môn Toán Học & Toán Tư Duy',
    parent_id: 'cat-school',
    community_link: null,
  },
  {
    id: 'cat-van',
    name: 'Môn Ngữ Văn & Khoa Học Xã Hội',
    parent_id: 'cat-school',
    community_link: null,
  },
  {
    id: 'cat-khoahoc',
    name: 'Môn Vật Lý & Khoa Học Tự Nhiên',
    parent_id: 'cat-school',
    community_link: null,
  },
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    title: 'Bí kíp Tự Học Lập Trình Web Fullstack 2026',
    description: 'Lộ trình chi tiết từng bước từ cơ bản HTML/CSS đến nâng cao với React, Node.js, Next.js và cách deploy ứng dụng Web thực tế lên máy chủ đám mây.',
    image_url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    file_url: 'https://drive.google.com/file/d/1_demo_fullstack_web_it/view',
    category_id: 'cat-web',
    created_at: '2026-06-18T08:00:00Z',
  },
  {
    id: 'doc-2',
    title: 'Cẩm Nang Chinh Phục IELTS Speaking & Writing 7.5+',
    description: 'Bộ từ vựng cực hiếm theo chủ đề, các cấu trúc câu phức nâng điểm ngữ pháp và bộ bài mẫu tham khảo đạt Band 8.0 được biên soạn bởi cựu giám khảo IELTS.',
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    file_url: 'https://drive.google.com/file/d/2_demo_ielts_speaking_writing/view',
    category_id: 'cat-eng',
    created_at: '2026-06-20T10:30:00Z',
  },
  {
    id: 'doc-3',
    title: 'Giáo Trình Học Tiếng Trung Giao Tiếp Cấp Tốc HSK 1-3',
    description: 'Bao gồm 500 từ vựng phiên âm chi tiết, các tình huống giao tiếp sinh hoạt thực tế, bài tập luyện nghe và rèn viết chữ Hán có hệ thống.',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    file_url: 'https://drive.google.com/file/d/3_demo_chinese_hsk_study/view',
    category_id: 'cat-asian',
    created_at: '2026-06-21T15:45:00Z',
  },
  {
    id: 'doc-4',
    title: 'Giản Yếu Trí Tuệ Nhân Tạo (AI) & Học Máy Cơ Bản',
    description: 'Khái niệm căn bản về mạng nơ-ron nhân tạo, thuật toán học có giám sát và không giám sát kèm mã nguồn Python thực hành chi tiết.',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    file_url: 'https://drive.google.com/file/d/4_demo_ai_machine_learning/view',
    category_id: 'cat-ai',
    created_at: '2026-06-19T09:15:00Z',
  },
  {
    id: 'doc-5',
    title: 'Tổng ôn Chuyên đề Giải tích và Hình học Không gian',
    description: 'Tóm tắt toàn bộ định lý, công thức tính nhanh thể tích, khoảng cách và tóm lược sơ đồ tư duy phương trình chuyển động ôn tập tốt nghiệp THPT.',
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    file_url: 'https://drive.google.com/file/d/5_demo_highschool_math/view',
    category_id: 'cat-toan',
    created_at: '2026-06-22T08:20:00Z',
  },
];
