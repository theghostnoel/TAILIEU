/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Category {
  id: string;
  name: string;
  parent_id: string | null; // null means it is a parent category (e.g. "Khối 2k9"), otherwise refers to parent ID
  community_link: string | null; // e.g. Facebook group / Zalo group link
}

export interface Document {
  id: string;
  title: string;
  description: string;
  image_url: string;
  file_url: string; // Drive/Mega link
  category_id: string;
  created_at: string;
}

export interface SQLTemplate {
  title: string;
  description: string;
  code: string;
}
