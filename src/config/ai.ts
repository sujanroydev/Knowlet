export const DEFAULT_MODEL = "gemini-3.1-flash-lite" as const;

export const AI_MODELS = {
  GEMINI_3_6_FLASH: "gemini-3.6-flash",
  GEMINI_3_5_FLASH: "gemini-3.5-flash",
  GEMINI_2_5_FLASH: "gemini-2.5-flash",
  GEMINI_3_5_FLASH_LITE: "gemini-3.5-flash-lite",
  GEMINI_3_1_FLASH_LITE: "gemini-3.1-flash-lite",
} as const;

export type ModelId = (typeof AI_MODELS)[keyof typeof AI_MODELS];

export type ModelOption = ModelId;

export const MODELS = [
  {
    label: "Gemini 3.6 Flash",
    value: AI_MODELS.GEMINI_3_6_FLASH,
    premium: true,
  },
  {
    label: "Gemini 3.5 Flash",
    value: AI_MODELS.GEMINI_3_5_FLASH,
    premium: true,
  },
  {
    label: "Gemini 2.5 Flash",
    value: AI_MODELS.GEMINI_2_5_FLASH,
    premium: true,
  },
  {
    label: "Gemini 3.5 Flash Lite",
    value: AI_MODELS.GEMINI_3_5_FLASH_LITE,
    premium: false,
  },
  {
    label: "Gemini 3.1 Flash Lite",
    value: AI_MODELS.GEMINI_3_1_FLASH_LITE,
    premium: false,
  },
] as const;
