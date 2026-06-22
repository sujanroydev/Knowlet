const parsePart = (part: string) => {
  const match = part.match(/^([a-zA-Z-]+)-(\d+)$/);
  if (!match) return { text: part, num: null };
  return {
    text: match[1],
    num: Number(match[2]),
  };
};

function sortByPath<T extends { path: string }>(resources: T[]) {
  const sortedResources = [...resources].sort((a, b) => {
    const aParts = a.path.split("/");
    const bParts = b.path.split("/");

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aP = parsePart(aParts[i] ?? "");
      const bP = parsePart(bParts[i] ?? "");

      const textDiff = aP.text.localeCompare(bP.text);
      if (textDiff !== 0) return textDiff;

      if (aP.num !== null && bP.num !== null) {
        const numDiff = aP.num - bP.num;
        if (numDiff !== 0) return numDiff;
      }

      const fallback = aParts[i].localeCompare(bParts[i]);
      if (fallback !== 0) return fallback;
    }

    return 0;
  });

  return sortedResources;
}

export default sortByPath;
