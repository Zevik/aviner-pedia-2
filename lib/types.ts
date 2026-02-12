/**
 * TypeScript type definitions for Avinerpedia content items
 * Based on the Supabase database schema
 */

export type MainCategory = 'סרטונים' | 'מאמרים' | 'שו"ת הלכה' | 'סדרות';

export interface ContentItem {
  id: number;
  original_id: number | null;
  title: string;
  main_category: MainCategory;
  sub_category: string | null;
  video_id: string | null;
  publish_date: string | null;
  summary: string | null;
  original_tags: string | null;
  content_md: string | null;
  created_at: string;
}

export interface VideoItem extends ContentItem {
  main_category: 'סרטונים';
  video_id: string;
}

export interface ArticleItem extends ContentItem {
  main_category: 'מאמרים';
}

export interface QAItem extends ContentItem {
  main_category: 'שו"ת הלכה';
}

export interface SeriesItem extends ContentItem {
  main_category: 'סדרות';
}

// Utility type for filtering
export interface ContentFilters {
  main_category?: MainCategory;
  sub_category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

// Type for series grouping (by sub_category)
export interface SeriesGroup {
  sub_category: string;
  title: string;
  count: number;
  items: ContentItem[];
}
