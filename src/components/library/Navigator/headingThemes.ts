export type HeadingTheme = {
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

export const headingThemes: HeadingTheme[] = [
  // 1. Ocean Blue
  {
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

  // 2. Emerald
  {
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

  // 3. Ruby Red
  {
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

  // 4. Amber
  {
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

  // 5. Violet
  {
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

  // 6. Rose
  {
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

  // 7. Cyan
  {
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

  // 8. Indigo
  {
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

  // 9. Lime
  {
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

  // 10. Orange
  {
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

  // 11. Teal
  {
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

  // 12. Sky
  {
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

  // 13. Fuchsia
  {
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

  // 14. Slate
  {
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

  // 15. Brown
  {
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

  // 16. Mint
  {
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

  // 17. Coral
  {
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

  // 18. Plum
  {
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

  // 19. Forest
  {
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

  // 20. Sunset
  {
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
];
