export type ResourceType = "note" | "pyq" | "important_question" | "pdf";

export type Mode =
  | "normal"
  | "quiz"
  | "study"
  | "short"
  | "explain"
  | "create_resource";

export type Action = "create" | "update";

export interface Details {
  title: string;
  description: string;
  level?: string;
  subject?: string;
  paper?: string;
  target?: string;
  type?: string;
  slug?: string;
  path?: string;
}

export interface Resource {
  id?: string;
  title: string;
  description?: string;
  content: string;
  level?: string;
  subject?: string;
  paper?: string;
  target?: string;
  type?: string;
  path?: string;
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

export interface Bookmark {
  id: string;
  created_at: string;
  resource: {
    id: string;
    title: string;
    description: string;
    path: string;
    created_at: string;
  };
}
