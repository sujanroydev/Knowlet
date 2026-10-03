"use server";

import { ModelId } from "@/config/ai";
import {
  generateResource as _generateResource,
  generateQuestions as _generateQuestions,
} from "@/services/knowva/generation/resource";

interface Props {
  model?: ModelId;
  syllabus: string;
  stream?: boolean;
}

export async function generateResource(props: Props) {
  return _generateResource(props);
}

export async function generateQuestions(props: Props) {
  return _generateQuestions(props);
}
