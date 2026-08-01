import { useState, type Dispatch, type SetStateAction } from "react";
import { ChevronDown, Crown } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

type Props = {
  model: string;
  setModel: Dispatch<SetStateAction<string>>;
};

export const MODELS = [
  { label: "Auto", value: "auto" },
  { label: "Gemini 3.6 Flash", value: "gemini-3.6-flash", premium: true },
  { label: "Gemini 3.5 Flash", value: "gemini-3.5-flash", premium: true },
  { label: "Gemini 2.5 Flash", value: "gemini-2.5-flash", premium: true },
  { label: "Gemini 3.5 Flash Lite", value: "gemini-3.5-flash-lite" },
  { label: "Gemini 3.1 Flash Lite", value: "gemini-3.1-flash-lite" },
];

export function ModelSelector({ model, setModel }: Props) {
  const [open, setOpen] = useState(false);

  const { user } = useAuth();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-slate-700 hover:bg-slate-100"
      >
          <span className="hidden sm:inline">{model}</span>
          <span className="sm:hidden">Model</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-48 rounded-md border bg-white shadow-lg">
          {MODELS.map((m) => (
            <button
              key={m.value}
              onClick={() => {
                if (m.premium && (!user || (user && user.role !== "admin"))) {
                  toast.warning("You don't have access of this model");
                  return;
                }
                setModel(m.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                model === m.value
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>{m.label}</span>
                {m.premium && (!user || (user && user.role !== "admin")) && (
                  <Crown
                    className="h-3.5 w-3.5 text-amber-500"
                    aria-label="Pro model"
                  />
                )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}