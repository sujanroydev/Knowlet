export interface Level {
  id: string;
  title: string;
  description: string;
  path: string;
  slug: string;
  number: string;
  created_at: string;
  updated_at: string;
}

export interface NewLevel {
  title: string;
  number: number;
  slug: string;
  path: string;
}
