import { useState } from "react";

interface Question {
  prompt: string;
  options: string[];
  answerIndex: number;
  feedback: string;
}

const questions: Question[] = [
  {
    prompt: "Which metric is most affected by false positives?",
    options: ["Precision", "Recall", "F1 score", "Accuracy"],
    answerIndex: 0,
    feedback:
      "Precision = TP / (TP + FP), so every false positive sits directly in its denominator and drags it down.",
  },
  {
    prompt: "Which metric is most affected by false negatives?",
    options: ["Specificity", "Precision", "Recall", "False positive rate"],
    answerIndex: 2,
    feedback:
      "Recall = TP / (TP + FN). Each missed Positive adds to FN and lowers recall, even if precision stays perfect.",
  },
  {
    prompt: "Which metric balances precision and recall?",
    options: ["Accuracy", "F1 score", "Specificity", "False positive rate"],
    answerIndex: 1,
    feedback:
      "F1 is the harmonic mean of precision and recall — it only stays high when both are high.",
  },
  {
    prompt: "What happens when the decision threshold is increased?",
    options: [
      "More samples are predicted Positive",
      "Recall usually rises",
      "Fewer samples are predicted Positive",
      "The confusion matrix stays the same",
    ],
    answerIndex: 2,
    feedback:
      "A higher threshold makes the model more selective: fewer Positive predictions, so false positives drop but misses (false negatives) tend to rise.",
  },
];

/** Four-question knowledge check with per-answer feedback. */
export function Quiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const q = questions[index];
  const answered = selected !== null;
  const isCorrect = selected === q.answerIndex;

  const next = () => {
    setIndex((i) => (i + 1) % questions.length);
    setSelected(null);
  };

  const optionClass = (i: number) => {
    if (!answered) return "quiz-option";
    if (i === q.answerIndex) return "quiz-option quiz-option--correct";
    if (i === selected) return "quiz-option quiz-option--incorrect";
    return "quiz-option";
  };

  return (
    <section className="app-section" aria-labelledby="quiz-title">
      <h2 className="app-section-title" id="quiz-title">
        Mini challenge
      </h2>
      <p className="app-section-sub">
        Test your read of the dashboard — answers include a short explanation.
      </p>
      <div className="card">
        <p className="quiz-progress">
          Question {index + 1} / {questions.length}
        </p>
        <p className="quiz-question">{q.prompt}</p>
        <div className="quiz-options">
          {q.options.map((opt, i) => (
            <button
              key={opt}
              className={optionClass(i)}
              disabled={answered}
              onClick={() => setSelected(i)}
            >
              {opt}
            </button>
          ))}
        </div>
        {answered && (
          <>
            <p className="quiz-feedback" role="status">
              {isCorrect ? "Correct. " : "Not quite. "}
              {q.feedback}
            </p>
            <button className="quiz-next" onClick={next}>
              Next question
            </button>
          </>
        )}
      </div>
    </section>
  );
}
