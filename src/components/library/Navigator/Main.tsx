"use client";

import NavigatorBtnCard from "./NavigatorBtnCard";

type Item = {
  title: string;
  description: string;
  path: string;
  type: string;
  target?: string;
};

export default function Main({
  items,
  special,
}: {
  items: Item[];
  special?: boolean;
}) {
  let groupedItems: Record<string, Item[]>;
  const orderedTypes = ["notes", "pyqs"];

  if (special) {
    groupedItems = items.reduce(
      (acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = [];
        }
        acc[item.type].push(item);
        return acc;
      },
      {} as Record<string, Item[]>,
    );
  }

  return special ? (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-6 sm:px-6 sm:py-8">
      {orderedTypes.map((type) => {
        const sectionItems = groupedItems[type];

        if (!sectionItems?.length) return null;

        return (
          <section key={type}>
            <h2 className="mb-4 text-xl font-semibold capitalize tracking-[-0.02em] text-foreground">
              {type === "pyq" ? "PYQ" : type}
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sectionItems.map((item) => (
                <NavigatorBtnCard
                  key={item.path}
                  item={{
                    title:
                      item
                        .target!.replace(/-/g, " ")
                        .slice(0, 1)
                        .toUpperCase() +
                      item.target!.replace(/-/g, " ").slice(1),
                    description: item.title,
                    path: item.path,
                  }}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  ) : (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-4 py-6 sm:grid-cols-2 sm:px-6 sm:py-8 lg:grid-cols-3">
      {items.map((i, idx) => (
        <NavigatorBtnCard key={idx} item={i} />
      ))}
    </div>
  );
}
