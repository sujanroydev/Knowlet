export type HeadingTheme = {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  link: string;
  blockquote: string;
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
    link: "#2563EB",
    blockquote: "#60A5FA",
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
    link: "#059669",
    blockquote: "#34D399",
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
    link: "#DC2626",
    blockquote: "#F87171",
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
    link: "#D97706",
    blockquote: "#FBBF24",
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
    link: "#7C3AED",
    blockquote: "#A78BFA",
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
    link: "#DB2777",
    blockquote: "#F472B6",
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
    link: "#0891B2",
    blockquote: "#22D3EE",
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
    link: "#4338CA",
    blockquote: "#6366F1",
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
    link: "#65A30D",
    blockquote: "#A3E635",
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
    link: "#EA580C",
    blockquote: "#FB923C",
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
    link: "#0F766E",
    blockquote: "#2DD4BF",
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
    link: "#0284C7",
    blockquote: "#38BDF8",
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
    link: "#C026D3",
    blockquote: "#E879F9",
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
    link: "#475569",
    blockquote: "#94A3B8",
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
    link: "#92400E",
    blockquote: "#D97706",
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
    link: "#047857",
    blockquote: "#10B981",
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
    link: "#EA580C",
    blockquote: "#FB7185",
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
    link: "#6B21A8",
    blockquote: "#A855F7",
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
    link: "#166534",
    blockquote: "#16A34A",
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
    link: "#C2410C",
    blockquote: "#F97316",
    hr: "#FFEDD5",
  },
];
