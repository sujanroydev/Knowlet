interface User {
  id?: string;
  name: string;
  email: string;
  role?: string;
  username?: string;
  age?: string;
  picture?: string;
  stream?: string;
  standered?: string;
  fv_subject?: string;
  is_verified: boolean;
  is_active?: string;
  created_at?: string;
  updated_at?: string;
  verified_at: string;
}

type AuthOtpType =
  | "signup"
  | "signin"
  | "set_password"
  | "reset_password"
  | "change_password"
  | "verify_email";

interface Resource {
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

type ParsedPath = {
  currentPath: string;
  prevPath: string | null;
  nextPath: string | null;
  target: string;
  prevTarget: string | null;
  nextTarget: string | null;
};
