import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, mode, difficulty = "medium" } = body;

    if (!text) {
      return new Response(
        JSON.stringify({ success: false, error: "No text provided" }),
        { status: 400, headers: corsHeaders() },
      );
    }

    const lowerText = text.toLowerCase();

    if (
      lowerText.includes("who are you") ||
      lowerText.includes("what are you") ||
      lowerText.includes("who made you")
    ) {
      return new Response(
        JSON.stringify({
          success: true,
          type: "identity",
          data:
            "I am Knowlet, an AI-powered learning assistant that helps students generate quizzes, understand concepts, and study more effectively.",
        }),
        { status: 200, headers: corsHeaders() },
      );
    }

    const modelNames = [
      "gemini-3.6-flash",       // 5 RPM, 250K TPM, 20 RPD
      "gemini-3.5-flash",       // 5 RPM, 250K TPM, 20 RPD
      // "gemini-3-flash",         // 5 RPM, 250K TPM, 20 RPD
      "gemini-2.5-flash",       // 5 RPM, 250K TPM, 20 RPD

      "gemini-3.5-flash-lite",  // 15 RPM, 250K TPM, 500 RPD
      "gemini-3.1-flash-lite",  // 15 RPM, 250K TPM, 500 RPD
      // "gemini-2.5-flash-lite",  // 10 RPM, 250K TPM, 20 RPD
    ];

    const randomNumber = (n: number) => Math.floor(Math.random() * (n));
    const modelName = modelNames[mode === "create-resource" ? randomNumber(2) : 3 + randomNumber(2)];

    const model = genAI.getGenerativeModel({ model: modelName });

    let prompt = generatePrompt(mode, difficulty, text);
    let raw = "";

    for (let attempt = 0; attempt < 3; attempt++) {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      raw = response.text();

      if (mode === "quiz" || mode === "create-resource") {
        try {
          const cleaned = cleanJSON(raw);
          const parsed = JSON.parse(cleaned);
          raw = JSON.stringify(parsed);
          break;
        } catch (err) {
          if (attempt === 2) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Invalid AI response after retries",
                raw,
              }),
              { status: 500, headers: corsHeaders() },
            );
          }
        }
      } else break;
    }

    return new Response(
      JSON.stringify({ success: true, data: raw }),
      { status: 200, headers: corsHeaders() },
    );
  } catch (err) {
    const message = (err as any).message || "";

    if (
      message.includes("429") ||
      message.toLowerCase().includes("quota") ||
      message.toLowerCase().includes("too many requests")
    ) {
      const waitTime = extractRetryTime(message);
      return new Response(
        JSON.stringify({
          success: false,
          type: "rate_limit",
          data: `⏳ AI limit reached. Try again in ${waitTime} seconds.`,
          retryAfter: waitTime,
        }),
        { status: 429, headers: corsHeaders() },
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        errObj: err,
        error: "Something went wrong. Please try again.",
      }),
      { status: 500, headers: corsHeaders() },
    );
  }
}

function generatePrompt(mode: string, difficulty: string, text: string): string {
  let prompt = "";
  switch (mode) {
    case "quiz":
      prompt = `
You are a quiz generator for Knowlet.

Create 5 ${difficulty}-level multiple-choice questions (MCQs) from the given student notes.

STRICT RULES:
- Output MUST be valid JSON
- NO markdown
- NO explanations or extra text
- Start with [ and end with ]
- Exactly 4 options per question

FORMAT:
[
  {
    "question": "string",
    "options": [
      "option text",
      "option text",
      "option text",
      "option text"
    ],
    "answer": "option text"
  }
]

NOTES:
${text}
`;
      break;

    case "study":
      prompt = `
You are Knowlet, an AI learning assistant.

Summarize the following text clearly and concisely for study purposes:
- Keep it simple and easy to understand
- Highlight key points
- No unnecessary long explanations

TEXT:
${text}
`;
      break;

    case "short":
      prompt = `
You are Knowlet, an AI learning assistant.

Provide a very short and direct answer to the user's question. Max 1-2 sentences.

QUESTION:
${text}
`;
      break;

    case "explain":
      prompt = `
You are Knowlet, an AI learning assistant.

Explain the following topic in a detailed but simple manner:
- Use examples if possible
- Make it easy for a student to understand

TOPIC:
${text}
`;

      break;

case "create-resource":
  prompt = `
You are Knowlet, an AI learning assistant.

Your task is to convert the provided syllabus into a complete, exam-ready study resource for students.

========================
STRICT OUTPUT FORMAT
========================

- Output MUST be valid JSON only.
- Do NOT use Markdown.
- Do NOT include explanations, comments, or extra text outside JSON.
- Return exactly ONE JSON object.
- The output must start with { and end with }.

Required JSON structure:

{
  "title": "string",
  "description": "string",
  "resource": "HTML string"
}

IMPORTANT:
- The "resource" field MUST contain the complete HTML content as a string value.
- Never output HTML outside the "resource" field.
- The final response must contain only the JSON object.
- Escape characters correctly so the JSON remains valid.

========================
FIELD REQUIREMENTS
========================

"title":
- Generate a clear and concise title based on the syllabus.

"description":
- Write a short summary of what students will learn.
- Keep it between 1-3 sentences.

"resource":
- Must contain ONLY valid HTML fragments.
- This is the complete study material.
- Do not generate a complete HTML document.

Do NOT include:
- <!DOCTYPE html>
- <html>
- <head>
- <body>
- meta tags
- external CSS
- JavaScript
- scripts
- HTML comments
- Markdown
- code fences

========================
SYLLABUS COMPLIANCE
========================

Generate content ONLY from the provided syllabus.

Do NOT:
- Add unrelated topics.
- Add extra chapters.
- Assume missing syllabus information.
- Introduce unsupported advanced concepts.

If any syllabus point is unclear:
- Explain only the directly related fundamentals.
- Do not expand beyond the given syllabus.

========================
TOPIC COVERAGE
========================

Cover every:
- Topic
- Subtopic
- Bullet point
- Keyword
- Concept

mentioned in the syllabus.

Nothing should be skipped.

========================
EXPLANATION QUALITY
========================

For each topic, include where relevant:

- Clear conceptual explanation
- Simple beginner-friendly language
- Step-by-step explanation
- Practical examples
- Real-world applications
- Important definitions
- Exam-oriented notes
- Common mistakes
- Important observations

Avoid:
- Shallow summaries
- Repetition
- Generic introductions
- Motivational content
- AI disclaimers
- Filler text

The final notes must be:

- Exam-ready
- Beginner-friendly
- Detailed but readable
- Academically accurate
- Well structured
- Consistent in formatting

========================
FORMULA RULES
========================

Write formulas only as plain text.

Never use:
- LaTeX
- MathJax
- Markdown math syntax

Examples:

E = mc²

λ = h / p

V = IR

(Δx)(Δp) ≥ h / 4π

========================
HTML STRUCTURE RULES
========================

Use semantic HTML.

IMPORTANT:
- Do NOT use inline CSS or style attributes.
- Do NOT add custom CSS classes.

Required hierarchy:

<h1>
- Unit title

<h2>
- Main topics

<h3>
- Subtopics

<p>
- Explanations

<ul> / <ol>
- Lists

<table>
- Comparisons, classifications, differences, summaries

<strong>
- Important points

<em>
- Emphasis

<blockquote>
Use for:
- Definitions
- Laws
- Important statements
- Formulas

========================
TABLE OF CONTENTS
========================

At the beginning of the HTML content, include a clickable table of contents.

Rules:
- Every major topic must have a unique meaningful ID.
- TOC links must use anchor links.

Example:

<div class="toc">
<ul>
<li><a href="#topic-id">Topic Name</a></li>
</ul>
</div>

<h2 id="topic-id">
Topic Name
</h2>

========================
TABLE GUIDELINES
========================

Use tables for:

- Comparisons
- Advantages vs disadvantages
- Classifications
- Feature differences
- Formula summaries

Tables must be:

- Readable
- Logically structured
- Properly formatted

========================
HTML VALIDITY RULES
========================

Ensure:

- All tags are properly closed.
- IDs are unique.
- HTML is well formed.
- No invalid nesting exists.
- No Markdown syntax appears inside HTML.

========================
FINAL VALIDATION
========================

Before responding, verify:

✓ Output is valid JSON only  
✓ Contains exactly: title, description, resource  
✓ resource contains HTML string only  
✓ No HTML exists outside resource  
✓ No Markdown exists  
✓ All syllabus topics are covered  
✓ HTML is valid  
✓ No unsupported information is added  

SYLLABUS:

${text}
`;


      break;

    default:
      // normal chat
      prompt = `
You are Knowlet, an AI learning assistant.

Answer the user's question clearly and concisely.
- Keep it simple and easy to understand
- No unnecessary long explanations
- No JSON, only plain text

QUESTION:
${text}
`;
  }
  return prompt;
}

function cleanJSON(raw: string) {
  return raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function extractRetryTime(errorMessage: string) {
  const match = errorMessage.match(/retryDelay":"(\d+)s"/);
  return match ? parseInt(match[1]) : 20;
}
