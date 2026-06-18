export interface Resource {
  id?: string;
  title: string;
  description?: string;
  content: string;
  path: string;
  target?: string;
  type?: string;
  slug?: string;
  file_url?: string;
  thumbnail_url?: string;
  is_published?: boolean;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ParsedPath {
  currentPath: string;
  prevPath: string | null;
  nextPath: string | null;
  target: string;
  prevTarget: string | null;
  nextTarget: string | null;
}

export type ResourceType = "note" | "pyq" | "important_question" | "pdf";
