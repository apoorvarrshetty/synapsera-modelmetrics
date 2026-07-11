interface Entry {
  term: string;
  copy: string;
}

const entries: Entry[] = [
  {
    term: "Accuracy",
    copy: "The share of all predictions the model got right. Simple, but misleading when one class dominates the dataset — a model that always predicts the majority class can still score high.",
  },
  {
    term: "Precision",
    copy: "When the model says Positive, how often is it right? High precision means Positive predictions can be trusted. It matters when acting on a false alarm is expensive, like flagging valid transactions as fraud.",
  },
  {
    term: "Recall",
    copy: "Of everything that is actually Positive, how much did the model catch? High recall means few misses. It matters when letting a real Positive slip through is the costly mistake.",
  },
  {
    term: "F1 score",
    copy: "The harmonic mean of precision and recall. It only stays high when both are high, making it a good single number for comparing models when you care about both kinds of error.",
  },
  {
    term: "Specificity",
    copy: "Of everything that is actually Negative, how much did the model correctly leave alone? It is the mirror image of recall, focused on the Negative class.",
  },
  {
    term: "False positives",
    copy: "Samples the model predicted Positive that were really Negative — false alarms. Every false positive lowers precision and raises the false positive rate.",
  },
  {
    term: "False negatives",
    copy: "Samples the model predicted Negative that were really Positive — misses. Every false negative lowers recall, no matter how confident the model was elsewhere.",
  },
];

/** Beginner-friendly glossary for the metrics on the dashboard. */
export function ExplainerPanel() {
  return (
    <section className="app-section" aria-labelledby="explainer-title">
      <h2 className="app-section-title" id="explainer-title">
        Metric explainer
      </h2>
      <p className="app-section-sub">
        Plain-language definitions for every number on the dashboard.
      </p>
      <div className="explainer-list">
        {entries.map((e) => (
          <div className="explainer-item" key={e.term}>
            <h3 className="explainer-term">{e.term}</h3>
            <p className="explainer-copy">{e.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
