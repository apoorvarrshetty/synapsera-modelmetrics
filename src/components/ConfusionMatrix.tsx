import type { ConfusionCounts } from "../types";

interface Props {
  counts: ConfusionCounts;
}

/**
 * 2×2 confusion matrix. Each cell's background intensity scales with its
 * count relative to the largest cell. Correct cells (TP, TN) blend toward
 * the blue–purple accent; error cells (FP, FN) blend toward rose, so color
 * hue encodes meaning and color intensity encodes magnitude.
 */
export function ConfusionMatrix({ counts }: Props) {
  const max = Math.max(counts.tp, counts.fp, counts.fn, counts.tn, 1);

  // Interpolate a cell background between the surface tint and full accent.
  const cellStyle = (count: number, kind: "correct" | "error") => {
    const t = count / max; // 0–1 intensity
    const alpha = 0.08 + t * 0.85;
    const base = kind === "correct" ? "91, 91, 240" : "212, 85, 122";
    return {
      background: `rgba(${base}, ${alpha.toFixed(2)})`,
      color: t > 0.45 ? "#ffffff" : "var(--mm-ink)",
      borderColor: `rgba(${base}, ${Math.min(1, alpha + 0.1).toFixed(2)})`,
    };
  };

  const cells = [
    { key: "tp", label: "True Positive", sub: "Predicted Positive · was Positive", count: counts.tp, kind: "correct" as const },
    { key: "fn", label: "False Negative", sub: "Predicted Negative · was Positive", count: counts.fn, kind: "error" as const },
    { key: "fp", label: "False Positive", sub: "Predicted Positive · was Negative", count: counts.fp, kind: "error" as const },
    { key: "tn", label: "True Negative", sub: "Predicted Negative · was Negative", count: counts.tn, kind: "correct" as const },
  ];

  return (
    <div className="card">
      <div className="matrix-wrap">
        <span aria-hidden="true" />
        <span className="matrix-axis">Predicted → Positive · Negative</span>
        <span className="matrix-axis matrix-axis--y">
          Actual ↓ Positive · Negative
        </span>
        <div className="matrix-grid" role="table" aria-label="Confusion matrix">
          {cells.map((c) => (
            <div
              key={c.key}
              className="matrix-cell"
              style={cellStyle(c.count, c.kind)}
              role="cell"
            >
              <span className="matrix-cell-label">{c.label}</span>
              <span className="matrix-cell-count">{c.count}</span>
              <span className="matrix-cell-sub">{c.sub}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="matrix-legend">
        <span>
          <span
            className="matrix-legend-swatch"
            style={{ background: "var(--mm-correct)" }}
          />
          Correct predictions
        </span>
        <span>
          <span
            className="matrix-legend-swatch"
            style={{ background: "var(--mm-error)" }}
          />
          Errors
        </span>
      </div>
    </div>
  );
}
