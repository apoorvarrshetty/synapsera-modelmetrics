import type { Sample, Scenario } from "../types";

/**
 * Demo datasets are hand-authored (not randomly generated) so that each
 * scenario reliably demonstrates the behavior in its name at the default
 * threshold of 0.5. Confidence = model confidence that the sample is
 * Positive.
 */

let counter = 0;
function s(trueLabel: Sample["trueLabel"], confidence: number): Sample {
  counter += 1;
  return { id: `S-${String(counter).padStart(3, "0")}`, trueLabel, confidence };
}

/** Reset the ID counter so each scenario numbers its samples from S-001. */
function build(samples: () => Sample[]): Sample[] {
  counter = 0;
  return samples();
}

export const scenarios: Scenario[] = [
  {
    id: "balanced",
    name: "Balanced classifier",
    tagline:
      "Errors are spread evenly between classes — precision and recall land close together.",
    defaultThreshold: 0.5,
    samples: build(() => [
      s("Positive", 0.92),
      s("Positive", 0.85),
      s("Positive", 0.78),
      s("Positive", 0.66),
      s("Positive", 0.58),
      s("Positive", 0.41), // missed → false negative
      s("Negative", 0.09),
      s("Negative", 0.17),
      s("Negative", 0.26),
      s("Negative", 0.33),
      s("Negative", 0.44),
      s("Negative", 0.61), // flagged → false positive
    ]),
  },
  {
    id: "high-precision",
    name: "High precision classifier",
    tagline:
      "The model only predicts Positive when it is very sure — no false positives, but real Positives slip through.",
    defaultThreshold: 0.5,
    samples: build(() => [
      s("Positive", 0.97),
      s("Positive", 0.93),
      s("Positive", 0.88),
      s("Positive", 0.82),
      s("Positive", 0.42), // missed
      s("Positive", 0.36), // missed
      s("Positive", 0.28), // missed
      s("Negative", 0.05),
      s("Negative", 0.11),
      s("Negative", 0.19),
      s("Negative", 0.27),
      s("Negative", 0.38),
    ]),
  },
  {
    id: "high-recall",
    name: "High recall classifier",
    tagline:
      "The model casts a wide net — it catches every real Positive but flags Negatives along the way.",
    defaultThreshold: 0.5,
    samples: build(() => [
      s("Positive", 0.95),
      s("Positive", 0.88),
      s("Positive", 0.79),
      s("Positive", 0.71),
      s("Positive", 0.64),
      s("Positive", 0.57),
      s("Negative", 0.68), // flagged
      s("Negative", 0.61), // flagged
      s("Negative", 0.54), // flagged
      s("Negative", 0.31),
      s("Negative", 0.22),
      s("Negative", 0.12),
    ]),
  },
  {
    id: "overfitting",
    name: "Overfitting warning example",
    tagline:
      "Every confidence is extreme, yet a third of the predictions are wrong — confidence is not the same as correctness.",
    defaultThreshold: 0.5,
    samples: build(() => [
      s("Positive", 0.99),
      s("Positive", 0.98),
      s("Positive", 0.97),
      s("Positive", 0.96),
      s("Positive", 0.03), // confidently wrong
      s("Positive", 0.02), // confidently wrong
      s("Negative", 0.01),
      s("Negative", 0.02),
      s("Negative", 0.04),
      s("Negative", 0.05),
      s("Negative", 0.98), // confidently wrong
      s("Negative", 0.99), // confidently wrong
    ]),
  },
  {
    id: "weak-baseline",
    name: "Weak baseline model",
    tagline:
      "Confidence scores hover near 0.5 and predictions are barely better than a coin flip.",
    defaultThreshold: 0.5,
    samples: build(() => [
      s("Positive", 0.56),
      s("Positive", 0.52),
      s("Positive", 0.49), // missed
      s("Positive", 0.47), // missed
      s("Positive", 0.53),
      s("Positive", 0.45), // missed
      s("Negative", 0.51), // flagged
      s("Negative", 0.48),
      s("Negative", 0.54), // flagged
      s("Negative", 0.46),
      s("Negative", 0.52), // flagged
      s("Negative", 0.44),
    ]),
  },
];
