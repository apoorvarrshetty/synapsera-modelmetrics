/** Binary class labels used throughout the dashboard. */
export type Label = "Positive" | "Negative";

/**
 * A single evaluation sample.
 * The predicted label is intentionally NOT stored here — it is always
 * derived from `confidence` and the current decision threshold, so the
 * table, matrix, and metrics can never fall out of sync.
 */
export interface Sample {
  id: string;
  trueLabel: Label;
  /** Model confidence that the sample belongs to the Positive class, 0–1. */
  confidence: number;
}

/** Counts for the four cells of a binary confusion matrix. */
export interface ConfusionCounts {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
}

/** Qualitative interpretation shown as a badge on each metric card. */
export type Interpretation = "Strong" | "Moderate" | "Weak";

export interface MetricResult {
  key: string;
  name: string;
  /** Value in 0–1, or null when undefined (e.g. precision with no predicted positives). */
  value: number | null;
  explanation: string;
  interpretation: Interpretation | null;
}

/** A hand-authored demo dataset that illustrates one evaluation behavior. */
export interface Scenario {
  id: string;
  name: string;
  tagline: string;
  defaultThreshold: number;
  samples: Sample[];
}
