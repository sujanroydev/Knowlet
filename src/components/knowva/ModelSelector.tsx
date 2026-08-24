import { useEffect, useRef, useState } from "react";
import { ChevronDown, Crown } from "lucide-react";
import { toast } from "sonner";

import { MODELS } from "@/config/ai";
import { useAuth } from "@/context/AuthContext";
import { useKnowva } from "@/context/KnowvaContext";

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { model, setModel } = useKnowva();

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-slate-700 hover:bg-slate-100"
      >
        <span>Model</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          ref={selectorRef}
          className="absolute left-0 mt-1 w-48 rounded-md border bg-white shadow-lg"
        >
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
  );
}
