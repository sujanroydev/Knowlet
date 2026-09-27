export interface Paper {
  id: string;
  title: string;
  description: string;
  path: string;
  slug: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface NewPaper {
  subject_id: string;
  level_id: string;
  title: string;
  code: string;
  slug: string;
  path: string;
}
