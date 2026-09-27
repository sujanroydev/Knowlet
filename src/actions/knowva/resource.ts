"use server";

import { ModelId } from "@/config/ai";
import { generateResource as _generateResource } from "@/services/knowva/generation/resource";

export async function generateResource(props: {
  model?: ModelId;
  syllabus: string;
  stream?: boolean;
}) {
  return _generateResource(props);
}
