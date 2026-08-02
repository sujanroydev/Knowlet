export type Mode = "normal" | "quiz" | "study" | "short" | "explain" | "create-resource"
export type Sender = "user" | "knowva" | "system";

export interface Message {
  sender: string;
  text: string;
  mode: Mode;
  time: string;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
}