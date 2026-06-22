/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const SUPABASE_SQL_CODE = `-- ==========================================
-- BƯỚC 1: TẠO CÁC BẢNG CƠ SỞ DỮ LIỆU CHUẨN
-- ==========================================

-- 1. Tạo bảng Danh Mục (categories)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    community_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Thêm mô tả cho các cột trong bảng categories
COMMENT ON COLUMN public.categories.parent_id IS 'Liên kết đệ quy ngược lại bảng categories để gom nhóm Danh mục Cha - Con';
COMMENT ON COLUMN public.categories.community_link IS 'Link nhóm Zalo hoặc Facebook dùng để kích hoạt tính năng bẫy mở khoá tài liệu';

-- 2. Tạo bảng Tài Liệu (documents)
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    file_url TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- BƯỚC 2: CẤU HÌNH ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Bật tính năng bảo mật dòng (RLS - Row Level Security) cho cả 2 bảng
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 2.1 Thiết lập chính sách bảo mật cho bảng categories
-- Chính sách 1: Cho phép MỌI NGƯỜI (bao gồm cả khách vãng lai) truy cập để Xem danh mục
CREATE POLICY "Cho phép tất cả đọc danh mục công khai" 
ON public.categories FOR SELECT 
USING (true);

-- Chính sách 2: Chỉ cho phép ADMIN (User đã xác thực) quyền Thêm, Sửa, Xoá danh mục
CREATE POLICY "Chỉ cho phép Admin quản lý danh mục" 
ON public.categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- 2.2 Thiết lập chính sách bảo mật cho bảng documents
-- Chính sách 1: Cho phép MỌI NGƯỜI (bao gồm cả khách vãng lai) truy cập để Xem tài liệu
CREATE POLICY "Cho phép tất cả đọc tài liệu công khai" 
ON public.documents FOR SELECT 
USING (true);

-- Chính sách 2: Chỉ cho phép ADMIN (User đã xác thực) quyền Thêm, Sửa, Xoá tài liệu
CREATE POLICY "Chỉ cho phép Admin quản lý tài liệu" 
ON public.documents FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- ==========================================
-- BƯỚC 3: KHỞI TẠO STORAGE BUCKET CHO ẢNH TÀI LIỆU
-- ==========================================

-- Chèn bản ghi cấu hình tạo public bucket mới tên là "document-images" vào hệ thống lưu trữ của Supabase
-- (Nếu bucket chưa tồn tại)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('document-images', 'document-images', true)
ON CONFLICT (id) DO NOTHING;

-- Thiết lập bảo mật cho Storage Buckets
-- Cho phép mọi khách vãng lai tải/đọc ảnh từ public bucket này công khai
CREATE POLICY "Cho phép đọc ảnh công khai" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'document-images');

-- Chỉ cho phép Admin (User đã đăng nhập thành công) quản lý file tải lên bao gồm Upload, Sửa, Xoá ảnh
CREATE POLICY "Chỉ Admin có quyền upload ảnh" 
ON storage.objects FOR ALL 
TO authenticated 
USING (bucket_id = 'document-images') 
WITH CHECK (bucket_id = 'document-images');
`;
