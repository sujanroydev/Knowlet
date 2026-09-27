import ResourceGenerator from "@/components/knowva/ResourceGenerator";
import { ResourceEditorProvider } from "@/context/ResourceEditorContext";

export default function ResourceGeneratorPage() {
  return (
    <ResourceEditorProvider _action="create">
      <ResourceGenerator />
    </ResourceEditorProvider>
  );
}
