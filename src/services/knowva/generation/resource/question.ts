import { DEFAULT_MODEL, ModelId } from "@/config/ai";
import { Type } from "@google/genai";
import { _generate } from "../../client";

export const createQuestionsSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A clear and concise title for the question set.",
    },
    description: {
      type: Type.STRING,
      description:
        "A short description of the question set, including its exam-oriented purpose.",
    },
    resource: {
      type: Type.STRING,
      description:
        "The complete set of questions and answers in valid HTML format, organized into 1-mark, 2/3-mark, and 5-mark sections.",
    },
  },
  required: ["title", "description", "resource"],
};

export function buildCreateQuestionsPrompt(syllabus: string): string {
  return `
You are Knowva, Knowlet’s AI learning assistant.

Your task is to generate a complete, exam-ready set of questions and answers strictly from the provided syllabus.

The questions must be divided into exactly three sections:

1. 1-mark questions × 20
2. 2/3-mark questions × 10
3. 5-mark questions × 5

The answers must be appropriate for the marks assigned to each question.

========================
QUESTION PAPER STRUCTURE
========================

Generate exactly:

SECTION A — 1 MARK
- Exactly 20 questions.
- Each question carries 1 mark.
- Answers must be very short and direct.
- Usually require a definition, term, fact, formula, identification, or one key point.
- Answers should generally be 1-2 sentences or a very short expression.
- Do not unnecessarily explain 1-mark answers.

SECTION B — 2/3 MARKS
- Exactly 10 questions.
- Each question should be suitable for either 2 or 3 marks.
- Clearly indicate whether each question is worth 2 marks or 3 marks.
- Answers must contain enough explanation to reasonably earn the assigned marks.
- Use short explanations, key points, comparisons, steps, or small examples where appropriate.
- Do not give unnecessarily long answers.

SECTION C — 5 MARKS
- Exactly 5 questions.
- Every question carries 5 marks.
- Answers MUST be detailed enough for a student to reasonably earn all 5 marks.
- NEVER generate short, one-paragraph, one-line, or definition-only answers for 5-mark questions.
- A 5-mark answer must contain substantial explanation.
- Where appropriate, include:
  - Definition or introduction
  - Main explanation
  - Multiple important points
  - Step-by-step explanation
  - Examples
  - Applications
  - Advantages/disadvantages
  - Comparison
  - Diagram description if relevant
  - Formula and explanation of variables if relevant
  - Important concluding observation
- Do NOT artificially make an answer long with repetition or filler.
- The length must come from meaningful academic content.
- A 5-mark question must test a concept that can genuinely support a detailed answer.
- Do not use a simple definition or single factual statement as a 5-mark question.

========================
CRITICAL MARKS RULE
========================

The marks determine the expected depth of the answer.

Follow this rule strictly:

1 MARK:
- Very short answer.
- One key fact, definition, term, formula, or identification.

2 MARKS:
- Short explanation or approximately 2 meaningful points.
- Enough content to demonstrate basic understanding.

3 MARKS:
- More developed explanation.
- Approximately 3 meaningful points, steps, or an explanation with an example where appropriate.

5 MARKS:
- Detailed, structured answer.
- Multiple meaningful points and proper explanation.
- Must demonstrate substantial understanding of the topic.
- NEVER answer with only a definition.
- NEVER answer with only 2-3 bullet points.
- NEVER give a short summary when the question requires a detailed explanation.

If the syllabus does not provide enough information to create a meaningful 5-mark question about a topic, select another substantive topic from the syllabus that can support a detailed 5-mark answer.

========================
FIELD REQUIREMENTS
========================

"title":
- Generate a clear and concise title based on the syllabus.

"description":
- Write a short description of the generated question set.
- Keep it between 1-3 sentences.

"questions":
- Must contain ONLY valid HTML fragments.
- The complete question and answer set must be contained here.
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
QUESTION FORMAT
========================

Organize the questions into exactly three sections.

Use:

<h1> for the overall question-set title.

<h2> ONLY for these three question sections:
- Section A — 1 Mark Questions
- Section B — 2/3 Mark Questions
- Section C — 5 Mark Questions

<h3> must NOT be used anywhere.

<h4> may be used freely where appropriate for topics, subtopics,
answer sections, explanations, examples, or other relevant content.

Do not use headings merely for visual styling.

Each question must clearly show:
- Question number
- Marks
- Question text
- Answer

Example structure:

<p><strong>1. What is ...?</strong> <em>[1 Mark]</em></p>
<p><strong>Answer:</strong> ...</p>

For a 5-mark question:

<p><strong>1. Explain ...</strong> <em>[5 Marks]</em></p>
<p><strong>Answer:</strong></p>
<p>...</p>
<ul>
<li>...</li>
<li>...</li>
<li>...</li>
</ul>

Use semantic HTML only.

========================
SYLLABUS COMPLIANCE
========================

Generate questions and answers ONLY from the provided syllabus.

Do not:
- Add unrelated topics.
- Add chapters that are not present.
- Assume information that is not reasonably supported by the syllabus.
- Introduce unsupported advanced concepts.
- Create questions from outside the syllabus merely to reach the required count.

Every question must be directly connected to at least one topic, subtopic, concept, keyword, or learning point in the syllabus.

========================
TOPIC COVERAGE
========================

Distribute the questions across the syllabus as reasonably as possible.

Cover all substantive topics and important subtopics across the complete question set.

Do not focus all questions on only the first few topics.

Ensure that:
- Important topics receive appropriate representation.
- Minor keywords are not disproportionately represented.
- Different sections test different aspects of the syllabus where possible.
- Questions are not merely repeated versions of the same question.

Not every minor keyword must receive a separate question if doing so would create repetitive or low-quality questions. However, no major substantive topic should be completely ignored.

========================
QUESTION QUALITY
========================

Questions must be:

- Exam-oriented
- Academically accurate
- Clear and unambiguous
- Appropriate for students studying the provided syllabus
- Varied in wording
- Appropriate for their assigned marks
- Free from unnecessary complexity

Use different question patterns where appropriate, such as:

- Define
- What is
- Explain
- Describe
- Discuss
- Differentiate
- Compare
- List
- State
- Identify
- Give reasons
- Explain with an example
- Describe the steps
- Explain the working/principle
- Write short notes

Do not use a question type when the syllabus does not provide enough information to answer it.

========================
ANSWER QUALITY
========================

Answers must directly answer the question.

Do not:
- Repeat the question unnecessarily.
- Add unrelated information.
- Add motivational statements.
- Add generic introductions.
- Add AI disclaimers.
- Add filler.
- Make unsupported assumptions.

Answers should use simple, student-friendly academic language while remaining technically accurate.

========================
5-MARK ANSWER REQUIREMENTS
========================

THIS RULE IS MANDATORY.

Every 5-mark answer MUST be substantially developed.

A 5-mark answer should normally include several meaningful components rather than a short paragraph.

Depending on the topic, structure the answer using:

<h4>Introduction</h4>
<p>...</p>

<h4>Explanation</h4>
<p>...</p>

<h4>Key Points</h4>
<ul>
<li>...</li>
<li>...</li>
<li>...</li>
</ul>

<h4>Example</h4>
<p>...</p>

Only include these subsections when they are genuinely relevant.

Do NOT mechanically use all subsections for every answer.

A 5-mark answer must NOT be:
- A single sentence.
- A definition alone.
- A list of only 2-3 points.
- A very short paragraph.
- A superficial summary.
- An answer that would realistically earn only 1-3 marks.

The answer must contain enough meaningful academic detail for a student to write a proper 5-mark examination response.

========================
FORMULA RULES
========================

Write formulas as HTML-compatible text.

Use Unicode characters and symbols directly whenever possible.

Do not use:
- LaTeX
- MathJax
- Markdown
- $...$
- $$...$$
- \\frac{}
- \\Delta
- \\lambda
- \\rightarrow
- x_1
- x^2

Use:

Δ instead of \\Delta
λ instead of \\lambda
π instead of \\pi
≥ instead of \\geq
≤ instead of \\leq
→ instead of \\rightarrow
∞ instead of \\infty
√ instead of \\sqrt{}
× instead of \\times
± instead of \\pm
≠ instead of \\neq
∑ instead of \\sum

For subscripts use:

<sub></sub>

For superscripts use:

<sup></sup>

Examples:

E = mc<sup>2</sup>

λ = h / p

V = IR

(Δx)(Δp) ≥ h / 4π

a<sub>1</sub> = a<sub>2</sub>

x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup>

========================
HTML STRUCTURE RULES
========================

Use semantic HTML.

IMPORTANT:
- Do NOT use inline CSS or style attributes.
- Do NOT add custom CSS classes.
- Do NOT use Markdown syntax.

Allowed elements include:

<h1>
<h2>
<h4>
<p>
<ul>
<ol>
<li>
<table>
<thead>
<tbody>
<tr>
<th>
<td>
<strong>
<em>
<blockquote>
<sub>
<sup>

All tags must be properly closed.

========================
TABLE GUIDELINES
========================

Use tables only when they genuinely improve the answer.

Tables may be used for:
- Comparisons
- Differences
- Classifications
- Feature comparisons
- Formula summaries

Do not force tables into answers where normal paragraphs or lists are clearer.

========================
HTML VALIDITY RULES
========================

Ensure:

- All tags are properly closed.
- HTML is well formed.
- No invalid nesting exists.
- No Markdown syntax appears anywhere.
- No code fences appear anywhere.
- No complete HTML document is generated.
- No inline CSS is used.
- No JavaScript is included.

========================
FINAL VALIDATION
========================

Before responding, verify ALL of the following:

✓ Exactly 20 questions in Section A
✓ Exactly 10 questions in Section B
✓ Exactly 5 questions in Section C
✓ Section A questions are worth 1 mark
✓ Section B questions clearly indicate 2 or 3 marks
✓ Section C questions are worth 5 marks
✓ Every 5-mark answer is detailed and substantial
✓ No 5-mark answer is merely a short answer
✓ No 5-mark answer is definition-only
✓ Questions are distributed across the syllabus
✓ Major syllabus topics are covered
✓ No unrelated topics are introduced
✓ No unsupported information is added
✓ Answers match the marks assigned
✓ No question is unnecessarily repetitive
✓ No Markdown exists
✓ HTML is valid
✓ No code fences exist

SYLLABUS:

${syllabus}
`;
}

export async function generateQuestions({
  model = DEFAULT_MODEL,
  syllabus,
  stream = false,
}: {
  model?: ModelId;
  syllabus: string;
  stream?: boolean;
}) {
  const prompt = buildCreateQuestionsPrompt(syllabus);

  return await _generate({
    prompt,
    schema: createQuestionsSchema,
    model,
    stream,
  });
}
