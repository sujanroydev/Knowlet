import { getResourceStyles } from "@/config/resourceThemes";
import { useTheme } from "@/context/ThemeContext";

export default function ResourcePreview({ content }: { content: string }) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="box-border h-[650px] overflow-y-auto bg-muted p-6">
      {content ? (
        <article
          className="resource-content"
          style={getResourceStyles({ theme: resolvedTheme })}
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      ) : (
        <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-border bg-muted p-8 shadow-sm">
          <div className="flex h-[500px] flex-col items-center justify-center text-center">
            <h3 className="text-xl font-semibold text-muted-foreground/500">
              Preview will appear here
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Paste HTML to render preview.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
