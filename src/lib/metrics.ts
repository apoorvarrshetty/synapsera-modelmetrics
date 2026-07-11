import type {
  ConfusionCounts,
  Interpretation,
  Label,
  MetricResult,
  Sample,
} from "../types";

/**
 * Derive the predicted label for a sample from its confidence score.
 *
 * The model outputs a confidence that the sample is Positive. The decision
 * threshold converts that continuous score into a discrete label:
 *   confidence >= threshold  →  "Positive"
 *   confidence <  threshold  →  "Negative"
 *
 * Raising the threshold makes the model more conservative about predicting
 * Positive (fewer false positives, more false negatives) and vice versa.
 */
export function predictLabel(confidence: number, threshold: number): Label {
  return confidence >= threshold ? "Positive" : "Negative";
}

/**
 * Tally the four confusion-matrix cells for a set of samples at a given
 * threshold.
 *
 *   True Positive  (TP): true = Positive, predicted = Positive
 *   False Positive (FP): true = Negative, predicted = Positive
 *   False Negative (FN): true = Positive, predicted = Negative
 *   True Negative  (TN): true = Negative, predicted = Negative
 */
export function computeConfusion(
  samples: Sample[],
  threshold: number
): ConfusionCounts {
  const counts: ConfusionCounts = { tp: 0, fp: 0, fn: 0, tn: 0 };

  for (const s of samples) {
    const predicted = predictLabel(s.confidence, threshold);
    if (s.trueLabel === "Positive") {
      predicted === "Positive" ? counts.tp++ : counts.fn++;
    } else {
      predicted === "Positive" ? counts.fp++ : counts.tn++;
    }
  }

  return counts;
}

/** Safe division: returns null when the denominator is zero (metric undefined). */
function ratio(numerator: number, denominator: number): number | null {
  return denominator === 0 ? null : numerator / denominator;
}

/**
 * Map a metric value to a qualitative badge. For most metrics higher is
 * better; for false positive rate we pass `lowerIsBetter` so a low value
 * earns the "Strong" badge.
 */
function interpret(
  value: number | null,
  lowerIsBetter = false
): Interpretation | null {
  if (value === null) return null;
  const score = lowerIsBetter ? 1 - value : value;
  if (score >= 0.85) return "Strong";
  if (score >= 0.65) return "Moderate";
  return "Weak";
}

/**
 * Compute the six dashboard metrics from confusion-matrix counts.
 *
 *   Accuracy    = (TP + TN) / total          — overall fraction correct
 *   Precision   = TP / (TP + FP)             — how trustworthy Positive predictions are
 *   Recall      = TP / (TP + FN)             — how many real Positives were found
 *   F1 score    = 2·P·R / (P + R)            — harmonic mean of precision and recall
 *   Specificity = TN / (TN + FP)             — how many real Negatives were kept Negative
 *   FPR         = FP / (FP + TN)             — fraction of real Negatives flagged Positive
 */
export function computeMetrics(c: ConfusionCounts): MetricResult[] {
  const total = c.tp + c.fp + c.fn + c.tn;

  const accuracy = ratio(c.tp + c.tn, total);
  const precision = ratio(c.tp, c.tp + c.fp);
  const recall = ratio(c.tp, c.tp + c.fn);
  const specificity = ratio(c.tn, c.tn + c.fp);
  const fpr = ratio(c.fp, c.fp + c.tn);

  // F1 is undefined when either component is undefined or both are zero.
  const f1 =
    precision === null || recall === null || precision + recall === 0
      ? null
      : (2 * precision * recall) / (precision + recall);

  return [
    {
      key: "accuracy",
      name: "Accuracy",
      value: accuracy,
      explanation: "Fraction of all predictions that were correct.",
      interpretation: interpret(accuracy),
    },
    {
      key: "precision",
      name: "Precision",
      value: precision,
      explanation: "Of everything predicted Positive, how much really was.",
      interpretation: interpret(precision),
    },
    {
      key: "recall",
      name: "Recall",
      value: recall,
      explanation: "Of all real Positives, how many the model found.",
      interpretation: interpret(recall),
    },
    {
      key: "f1",
      name: "F1 score",
      value: f1,
      explanation: "Harmonic mean balancing precision and recall.",
      interpretation: interpret(f1),
    },
    {
      key: "specificity",
      name: "Specificity",
      value: specificity,
      explanation: "Of all real Negatives, how many stayed Negative.",
      interpretation: interpret(specificity),
    },
    {
      key: "fpr",
      name: "False positive rate",
      value: fpr,
      explanation: "Fraction of real Negatives incorrectly flagged Positive.",
      interpretation: interpret(fpr, true),
    },
  ];
}

/** Format a 0–1 metric value for display, or an em-dash when undefined. */
export function formatMetric(value: number | null): string {
  return value === null ? "—" : value.toFixed(2);
}
