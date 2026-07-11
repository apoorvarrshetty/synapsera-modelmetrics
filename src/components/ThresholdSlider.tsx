interface Props {
  threshold: number;
  onChange: (value: number) => void;
}

/**
 * Decision threshold control. Predictions everywhere in the app are derived
 * from this single value, so moving the slider live-updates the table,
 * matrix, and metric cards together.
 */
export function ThresholdSlider({ threshold, onChange }: Props) {
  return (
    <div className="threshold-card">
      <div className="threshold-head">
        <div>
          <h2 className="app-section-title" style={{ marginBottom: 2 }}>
            Decision threshold
          </h2>
          <p className="app-section-sub" style={{ margin: 0 }}>
            Samples with confidence at or above the threshold are predicted
            Positive.
          </p>
        </div>
        <span className="threshold-value">{threshold.toFixed(2)}</span>
      </div>
      <input
        className="threshold-input"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={threshold}
        aria-label="Decision threshold"
        aria-valuetext={threshold.toFixed(2)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="threshold-scale">
        <span>0.00 · predict everything Positive</span>
        <span>1.00 · predict nothing Positive</span>
      </div>
      <p className="threshold-hint">
        Raising the threshold trades false positives for false negatives:
        precision tends to rise while recall falls.
      </p>
    </div>
  );
}
