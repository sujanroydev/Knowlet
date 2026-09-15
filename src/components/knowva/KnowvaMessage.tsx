import { Edit2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

import { useKnowva } from "@/context/KnowvaContext";
import type { Message, NewMessage } from "@/types/knowva";

type Quiz = {
  question: string;
  options: string[];
  answer: number;
};

function QuizMessage({ quizzes }: { quizzes: Quiz[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;

    setAnswers((current) => ({
      ...current,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== quizzes.length) {
      return;
    }

    const correctAnswers = quizzes.reduce(
      (total, quiz, questionIndex) =>
        answers[questionIndex] === quiz.answer ? total + 1 : total,
      0,
    );

    setScore(correctAnswers);
    setSubmitted(true);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-muted-foreground">
          Select one answer for each question.
        </p>
      </div>

      {quizzes.map((quiz, questionIndex) => (
        <div key={questionIndex} className="space-y-3">
          <p className="font-medium">
            {questionIndex + 1}. {quiz.question}
          </p>

          <div className="space-y-2">
            {quiz.options.map((option, optionIndex) => {
              const isSelected = answers[questionIndex] === optionIndex;
              const isCorrect = quiz.answer === optionIndex;
              const isWrong = submitted && isSelected && !isCorrect;

              return (
                <label
                  key={optionIndex}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    submitted && isCorrect
                      ? "border-green-500 bg-green-500/10"
                      : isWrong
                        ? "border-red-500 bg-red-500/10"
                        : isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-background/50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    value={optionIndex}
                    checked={isSelected}
                    onChange={() => handleSelect(questionIndex, optionIndex)}
                    disabled={submitted}
                    className="accent-primary"
                  />

                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {submitted && score !== null && (
        <div className="rounded-lg border border-border bg-background/50 p-3 text-center">
          <p className="font-semibold">
            Score: {score}/{quizzes.length}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {score === quizzes.length ? "Perfect score!" : "Quiz completed."}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitted || Object.keys(answers).length !== quizzes.length}
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
  let quizzes: Quiz[] | null;
  try {
    quizzes = JSON.parse(message.content);
  } catch {
    quizzes = null;
  }
  console.log(message.mode, message.role);

  return (
    <div
      className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
        message.role === "user"
          ? "ml-auto bg-primary text-primary-foreground"
          : "mr-auto border border-border bg-muted text-foreground"
      }`}
    >
      {isQuiz && quizzes ? (
        <QuizMessage quizzes={quizzes} />
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
