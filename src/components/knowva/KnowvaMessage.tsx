import { Edit2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

import { useKnowva } from "@/context/KnowvaContext";
import type { Message, NewMessage } from "@/types/knowva";

type QuizQuestion = {
  question: string;
  options: string[];
};

type Quiz = {
  title: string;
  questions: QuizQuestion[];
};

function QuizMessage({ quiz }: { quiz: Quiz }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;

    setAnswers((current) => ({
      ...current,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold">{quiz.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Select one answer for each question.
        </p>
      </div>

      {quiz.questions.map((question, questionIndex) => (
        <div key={questionIndex} className="space-y-3">
          <p className="font-medium">
            {questionIndex + 1}. {question.question}
          </p>

          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                  answers[questionIndex] === optionIndex
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-background/50"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${questionIndex}`}
                  value={optionIndex}
                  checked={answers[questionIndex] === optionIndex}
                  onChange={() => handleSelect(questionIndex, optionIndex)}
                  disabled={submitted}
                  className="accent-primary"
                />

                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={
          submitted || Object.keys(answers).length !== quiz.questions.length
        }
        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitted ? "Submitted" : "Submit Quiz"}
      </button>
    </div>
  );
}

export default function KnowvaMessage({
  message,
}: {
  message: Message | NewMessage;
}) {
  const { onMessageClick } = useKnowva();

  if (!message.content && message.role === "assistant") {
    return (
      <div className="mr-auto flex w-fit items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    );
  }

  const isQuiz = message.role === "assistant" && message.mode === "quiz";

  return (
    <div
      className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
        message.role === "user"
          ? "ml-auto bg-primary text-primary-foreground"
          : "mr-auto border border-border bg-muted text-foreground"
      }`}
    >
      {isQuiz ? (
        <QuizMessage quiz={JSON.parse(message.content)} />
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      )}

      <div className="mt-2 flex items-center justify-end gap-2 text-[10px] opacity-70">
        {message.mode === "create-resource" &&
          message.role === "assistant" &&
          "id" in message && (
            <button
              type="button"
              onClick={() => onMessageClick?.(message)}
              className="rounded-md p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
              aria-label="Edit message"
              title="Edit"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          )}

        {"created_at" in message && (
          <span>{new Date(message.created_at).toLocaleTimeString()}</span>
        )}
      </div>
    </div>
  );
}
