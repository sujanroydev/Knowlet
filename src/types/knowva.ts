export type Mode = "chat" | "quiz" | "study" | "short" | "explain" | "create-resource";
export type Role = "user" | "knowva" | "system";

export interface Message {
  id: string;
  chat_id: string;
  parent_id: string | null;
  role: string;
  content: string;
  mode: Mode;
  model: string;
  created_at: string;
}

export interface NewMessage {
  chat_id: string;
  parent_id: string | null;
  role: string;
  content: string;
  mode: Mode;
  model: string;
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  pinned: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  last_message_at: string;
}
