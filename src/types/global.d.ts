interface User {
  id?: string;
  name: string;
  email: string;
  role?: string;
  username: string;
  age?: string;
  picture?: string;
  stream?: string;
  standard?: string;
  fav_subject?: string;
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
