type ResourceThemeColors = {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  accent: string;
  link: string;
  linkHover: string;
  blockquote: string;
  code: string;
  hr: string;
};

type ResourceTheme = {
  light: ResourceThemeColors;
  dark: ResourceThemeColors;
};

type ResolvedTheme = "light" | "dark";

function getThemeIndex(uuid: string) {
  let hash = 0;

  for (let i = 0; i < uuid.length; i++) {
    hash = (hash * 31 + uuid.charCodeAt(i)) >>> 0;
  }

  return hash % 20;
}

const resourceThemes: ResourceTheme[] = [
  // 1. Ocean Blue
  {
    light: {
      h1: "#1D4ED8",
      h2: "#2563EB",
      h3: "#3B82F6",
      h4: "#60A5FA",
      h5: "#93C5FD",
      h6: "#BFDBFE",
      accent: "#2563EB",
      link: "#2563EB",
      linkHover: "#1D4ED8",
      blockquote: "#3B82F6",
      code: "#1D4ED8",
      hr: "#DBEAFE",
    },
    dark: {
      h1: "#93C5FD",
      h2: "#60A5FA",
      h3: "#3B82F6",
      h4: "#2563EB",
      h5: "#60A5FA",
      h6: "#BFDBFE",
      accent: "#60A5FA",
      link: "#60A5FA",
      linkHover: "#93C5FD",
      blockquote: "#3B82F6",
      code: "#93C5FD",
      hr: "#1E3A5F",
    },
  },

  // 2. Emerald
  {
    light: {
      h1: "#047857",
      h2: "#059669",
      h3: "#10B981",
      h4: "#34D399",
      h5: "#6EE7B7",
      h6: "#A7F3D0",
      accent: "#059669",
      link: "#059669",
      linkHover: "#047857",
      blockquote: "#10B981",
      code: "#047857",
      hr: "#D1FAE5",
    },
    dark: {
      h1: "#6EE7B7",
      h2: "#34D399",
      h3: "#10B981",
      h4: "#059669",
      h5: "#34D399",
      h6: "#A7F3D0",
      accent: "#34D399",
      link: "#34D399",
      linkHover: "#6EE7B7",
      blockquote: "#10B981",
      code: "#6EE7B7",
      hr: "#064E3B",
    },
  },

  // 3. Ruby Red
  {
    light: {
      h1: "#B91C1C",
      h2: "#DC2626",
      h3: "#EF4444",
      h4: "#F87171",
      h5: "#FCA5A5",
      h6: "#FECACA",
      accent: "#DC2626",
      link: "#DC2626",
      linkHover: "#B91C1C",
      blockquote: "#EF4444",
      code: "#B91C1C",
      hr: "#FEE2E2",
    },
    dark: {
      h1: "#FCA5A5",
      h2: "#F87171",
      h3: "#EF4444",
      h4: "#DC2626",
      h5: "#F87171",
      h6: "#FECACA",
      accent: "#F87171",
      link: "#F87171",
      linkHover: "#FCA5A5",
      blockquote: "#EF4444",
      code: "#FCA5A5",
      hr: "#5F1D1D",
    },
  },

  // 4. Amber
  {
    light: {
      h1: "#B45309",
      h2: "#D97706",
      h3: "#F59E0B",
      h4: "#FBBF24",
      h5: "#FCD34D",
      h6: "#FDE68A",
      accent: "#D97706",
      link: "#D97706",
      linkHover: "#B45309",
      blockquote: "#F59E0B",
      code: "#B45309",
      hr: "#FEF3C7",
    },
    dark: {
      h1: "#FCD34D",
      h2: "#FBBF24",
      h3: "#F59E0B",
      h4: "#D97706",
      h5: "#FBBF24",
      h6: "#FDE68A",
      accent: "#FBBF24",
      link: "#FBBF24",
      linkHover: "#FCD34D",
      blockquote: "#F59E0B",
      code: "#FCD34D",
      hr: "#5C3A05",
    },
  },

  // 5. Violet
  {
    light: {
      h1: "#6D28D9",
      h2: "#7C3AED",
      h3: "#8B5CF6",
      h4: "#A78BFA",
      h5: "#C4B5FD",
      h6: "#DDD6FE",
      accent: "#7C3AED",
      link: "#7C3AED",
      linkHover: "#6D28D9",
      blockquote: "#8B5CF6",
      code: "#6D28D9",
      hr: "#EDE9FE",
    },
    dark: {
      h1: "#C4B5FD",
      h2: "#A78BFA",
      h3: "#8B5CF6",
      h4: "#7C3AED",
      h5: "#A78BFA",
      h6: "#DDD6FE",
      accent: "#A78BFA",
      link: "#A78BFA",
      linkHover: "#C4B5FD",
      blockquote: "#8B5CF6",
      code: "#C4B5FD",
      hr: "#3B2468",
    },
  },

  // 6. Rose
  {
    light: {
      h1: "#BE185D",
      h2: "#DB2777",
      h3: "#EC4899",
      h4: "#F472B6",
      h5: "#F9A8D4",
      h6: "#FBCFE8",
      accent: "#DB2777",
      link: "#DB2777",
      linkHover: "#BE185D",
      blockquote: "#EC4899",
      code: "#BE185D",
      hr: "#FCE7F3",
    },
    dark: {
      h1: "#F9A8D4",
      h2: "#F472B6",
      h3: "#EC4899",
      h4: "#DB2777",
      h5: "#F472B6",
      h6: "#FBCFE8",
      accent: "#F472B6",
      link: "#F472B6",
      linkHover: "#F9A8D4",
      blockquote: "#EC4899",
      code: "#F9A8D4",
      hr: "#5B183B",
    },
  },

  // 7. Cyan
  {
    light: {
      h1: "#0E7490",
      h2: "#0891B2",
      h3: "#06B6D4",
      h4: "#22D3EE",
      h5: "#67E8F9",
      h6: "#A5F3FC",
      accent: "#0891B2",
      link: "#0891B2",
      linkHover: "#0E7490",
      blockquote: "#06B6D4",
      code: "#0E7490",
      hr: "#CFFAFE",
    },
    dark: {
      h1: "#67E8F9",
      h2: "#22D3EE",
      h3: "#06B6D4",
      h4: "#0891B2",
      h5: "#22D3EE",
      h6: "#A5F3FC",
      accent: "#22D3EE",
      link: "#22D3EE",
      linkHover: "#67E8F9",
      blockquote: "#06B6D4",
      code: "#67E8F9",
      hr: "#164E63",
    },
  },

  // 8. Indigo
  {
    light: {
      h1: "#3730A3",
      h2: "#4338CA",
      h3: "#4F46E5",
      h4: "#6366F1",
      h5: "#818CF8",
      h6: "#A5B4FC",
      accent: "#4338CA",
      link: "#4338CA",
      linkHover: "#3730A3",
      blockquote: "#4F46E5",
      code: "#3730A3",
      hr: "#E0E7FF",
    },
    dark: {
      h1: "#A5B4FC",
      h2: "#818CF8",
      h3: "#6366F1",
      h4: "#4F46E5",
      h5: "#818CF8",
      h6: "#C7D2FE",
      accent: "#818CF8",
      link: "#818CF8",
      linkHover: "#A5B4FC",
      blockquote: "#6366F1",
      code: "#A5B4FC",
      hr: "#252A63",
    },
  },

  // 9. Lime
  {
    light: {
      h1: "#4D7C0F",
      h2: "#65A30D",
      h3: "#84CC16",
      h4: "#A3E635",
      h5: "#BEF264",
      h6: "#D9F99D",
      accent: "#65A30D",
      link: "#65A30D",
      linkHover: "#4D7C0F",
      blockquote: "#84CC16",
      code: "#4D7C0F",
      hr: "#ECFCCB",
    },
    dark: {
      h1: "#BEF264",
      h2: "#A3E635",
      h3: "#84CC16",
      h4: "#65A30D",
      h5: "#A3E635",
      h6: "#D9F99D",
      accent: "#A3E635",
      link: "#A3E635",
      linkHover: "#BEF264",
      blockquote: "#84CC16",
      code: "#BEF264",
      hr: "#365314",
    },
  },

  // 10. Orange
  {
    light: {
      h1: "#C2410C",
      h2: "#EA580C",
      h3: "#F97316",
      h4: "#FB923C",
      h5: "#FDBA74",
      h6: "#FED7AA",
      accent: "#EA580C",
      link: "#EA580C",
      linkHover: "#C2410C",
      blockquote: "#F97316",
      code: "#C2410C",
      hr: "#FFEDD5",
    },
    dark: {
      h1: "#FDBA74",
      h2: "#FB923C",
      h3: "#F97316",
      h4: "#EA580C",
      h5: "#FB923C",
      h6: "#FED7AA",
      accent: "#FB923C",
      link: "#FB923C",
      linkHover: "#FDBA74",
      blockquote: "#F97316",
      code: "#FDBA74",
      hr: "#5C2A0A",
    },
  },

  // 11. Teal
  {
    light: {
      h1: "#115E59",
      h2: "#0F766E",
      h3: "#14B8A6",
      h4: "#2DD4BF",
      h5: "#5EEAD4",
      h6: "#99F6E4",
      accent: "#0F766E",
      link: "#0F766E",
      linkHover: "#115E59",
      blockquote: "#14B8A6",
      code: "#115E59",
      hr: "#CCFBF1",
    },
    dark: {
      h1: "#5EEAD4",
      h2: "#2DD4BF",
      h3: "#14B8A6",
      h4: "#0F766E",
      h5: "#2DD4BF",
      h6: "#99F6E4",
      accent: "#2DD4BF",
      link: "#2DD4BF",
      linkHover: "#5EEAD4",
      blockquote: "#14B8A6",
      code: "#5EEAD4",
      hr: "#134E4A",
    },
  },

  // 12. Sky
  {
    light: {
      h1: "#075985",
      h2: "#0284C7",
      h3: "#0EA5E9",
      h4: "#38BDF8",
      h5: "#7DD3FC",
      h6: "#BAE6FD",
      accent: "#0284C7",
      link: "#0284C7",
      linkHover: "#075985",
      blockquote: "#0EA5E9",
      code: "#075985",
      hr: "#E0F2FE",
    },
    dark: {
      h1: "#7DD3FC",
      h2: "#38BDF8",
      h3: "#0EA5E9",
      h4: "#0284C7",
      h5: "#38BDF8",
      h6: "#BAE6FD",
      accent: "#38BDF8",
      link: "#38BDF8",
      linkHover: "#7DD3FC",
      blockquote: "#0EA5E9",
      code: "#7DD3FC",
      hr: "#164E63",
    },
  },

  // 13. Fuchsia
  {
    light: {
      h1: "#A21CAF",
      h2: "#C026D3",
      h3: "#D946EF",
      h4: "#E879F9",
      h5: "#F0ABFC",
      h6: "#F5D0FE",
      accent: "#C026D3",
      link: "#C026D3",
      linkHover: "#A21CAF",
      blockquote: "#D946EF",
      code: "#A21CAF",
      hr: "#FAE8FF",
    },
    dark: {
      h1: "#F0ABFC",
      h2: "#E879F9",
      h3: "#D946EF",
      h4: "#C026D3",
      h5: "#E879F9",
      h6: "#F5D0FE",
      accent: "#E879F9",
      link: "#E879F9",
      linkHover: "#F0ABFC",
      blockquote: "#D946EF",
      code: "#F0ABFC",
      hr: "#4A1458",
    },
  },

  // 14. Slate
  {
    light: {
      h1: "#334155",
      h2: "#475569",
      h3: "#64748B",
      h4: "#94A3B8",
      h5: "#CBD5E1",
      h6: "#E2E8F0",
      accent: "#475569",
      link: "#475569",
      linkHover: "#334155",
      blockquote: "#64748B",
      code: "#334155",
      hr: "#F1F5F9",
    },
    dark: {
      h1: "#E2E8F0",
      h2: "#CBD5E1",
      h3: "#94A3B8",
      h4: "#64748B",
      h5: "#94A3B8",
      h6: "#E2E8F0",
      accent: "#94A3B8",
      link: "#CBD5E1",
      linkHover: "#F1F5F9",
      blockquote: "#94A3B8",
      code: "#E2E8F0",
      hr: "#334155",
    },
  },

  // 15. Brown
  {
    light: {
      h1: "#78350F",
      h2: "#92400E",
      h3: "#B45309",
      h4: "#D97706",
      h5: "#FBBF24",
      h6: "#FDE68A",
      accent: "#92400E",
      link: "#92400E",
      linkHover: "#78350F",
      blockquote: "#B45309",
      code: "#78350F",
      hr: "#FEF3C7",
    },
    dark: {
      h1: "#FBBF24",
      h2: "#D97706",
      h3: "#B45309",
      h4: "#92400E",
      h5: "#FBBF24",
      h6: "#FDE68A",
      accent: "#FBBF24",
      link: "#FBBF24",
      linkHover: "#FDE68A",
      blockquote: "#D97706",
      code: "#FBBF24",
      hr: "#4A2C0A",
    },
  },

  // 16. Mint
  {
    light: {
      h1: "#065F46",
      h2: "#047857",
      h3: "#059669",
      h4: "#10B981",
      h5: "#6EE7B7",
      h6: "#D1FAE5",
      accent: "#047857",
      link: "#047857",
      linkHover: "#065F46",
      blockquote: "#059669",
      code: "#065F46",
      hr: "#ECFDF5",
    },
    dark: {
      h1: "#6EE7B7",
      h2: "#34D399",
      h3: "#10B981",
      h4: "#059669",
      h5: "#34D399",
      h6: "#D1FAE5",
      accent: "#34D399",
      link: "#34D399",
      linkHover: "#6EE7B7",
      blockquote: "#10B981",
      code: "#6EE7B7",
      hr: "#064E3B",
    },
  },

  // 17. Coral
  {
    light: {
      h1: "#C2410C",
      h2: "#EA580C",
      h3: "#FB7185",
      h4: "#FDA4AF",
      h5: "#FECDD3",
      h6: "#FFE4E6",
      accent: "#EA580C",
      link: "#EA580C",
      linkHover: "#C2410C",
      blockquote: "#FB7185",
      code: "#C2410C",
      hr: "#FFF1F2",
    },
    dark: {
      h1: "#FDA4AF",
      h2: "#FB7185",
      h3: "#F43F5E",
      h4: "#E11D48",
      h5: "#FB7185",
      h6: "#FFE4E6",
      accent: "#FB7185",
      link: "#FB7185",
      linkHover: "#FDA4AF",
      blockquote: "#F43F5E",
      code: "#FDA4AF",
      hr: "#5F1726",
    },
  },

  // 18. Plum
  {
    light: {
      h1: "#581C87",
      h2: "#6B21A8",
      h3: "#7E22CE",
      h4: "#A855F7",
      h5: "#D8B4FE",
      h6: "#F3E8FF",
      accent: "#6B21A8",
      link: "#6B21A8",
      linkHover: "#581C87",
      blockquote: "#7E22CE",
      code: "#581C87",
      hr: "#FAF5FF",
    },
    dark: {
      h1: "#D8B4FE",
      h2: "#C084FC",
      h3: "#A855F7",
      h4: "#9333EA",
      h5: "#C084FC",
      h6: "#F3E8FF",
      accent: "#C084FC",
      link: "#C084FC",
      linkHover: "#D8B4FE",
      blockquote: "#A855F7",
      code: "#D8B4FE",
      hr: "#3B1760",
    },
  },

  // 19. Forest
  {
    light: {
      h1: "#14532D",
      h2: "#166534",
      h3: "#15803D",
      h4: "#16A34A",
      h5: "#4ADE80",
      h6: "#BBF7D0",
      accent: "#166534",
      link: "#166534",
      linkHover: "#14532D",
      blockquote: "#15803D",
      code: "#14532D",
      hr: "#DCFCE7",
    },
    dark: {
      h1: "#86EFAC",
      h2: "#4ADE80",
      h3: "#22C55E",
      h4: "#16A34A",
      h5: "#4ADE80",
      h6: "#BBF7D0",
      accent: "#4ADE80",
      link: "#4ADE80",
      linkHover: "#86EFAC",
      blockquote: "#22C55E",
      code: "#86EFAC",
      hr: "#14532D",
    },
  },

  // 20. Sunset
  {
    light: {
      h1: "#9A3412",
      h2: "#C2410C",
      h3: "#EA580C",
      h4: "#F97316",
      h5: "#FDBA74",
      h6: "#FED7AA",
      accent: "#C2410C",
      link: "#C2410C",
      linkHover: "#9A3412",
      blockquote: "#EA580C",
      code: "#9A3412",
      hr: "#FFEDD5",
    },
    dark: {
      h1: "#FDBA74",
      h2: "#FB923C",
      h3: "#F97316",
      h4: "#EA580C",
      h5: "#FB923C",
      h6: "#FED7AA",
      accent: "#FB923C",
      link: "#FB923C",
      linkHover: "#FDBA74",
      blockquote: "#F97316",
      code: "#FDBA74",
      hr: "#5C2A0A",
    },
  },
];

const resourceBackgroundThemes = {
  light: {
    text: "#212529",
    muted: "#6C757D",
    surface: "#F1F3F5",
    surfaceAlt: "#F8F9FA",
    border: "#DEE2E6",
    codeBackground: "#F8F9FA",
    markBackground: "#FFF3CD",
    markText: "#664D03",
    tipBackground: "#FFF3CD",
    tipBorder: "#FFC107",
  },

  dark: {
    text: "#E5E7EB",
    muted: "#9CA3AF",
    surface: "#1F2937",
    surfaceAlt: "#18212F",
    border: "#374151",
    codeBackground: "#111827",
    markBackground: "#4A3B12",
    markText: "#FDE68A",
    tipBackground: "#3F3210",
    tipBorder: "#F59E0B",
  },
};

export const getResourceTheme = (
  uuid: string,
  mode: ResolvedTheme = "light",
) => {
  const themeIndex = getThemeIndex(uuid);

  const foregroundTheme = resourceThemes[themeIndex][mode];
  const backgroundTheme = resourceBackgroundThemes[mode];

  const theme = { ...foregroundTheme, ...backgroundTheme };

  return theme;
};
