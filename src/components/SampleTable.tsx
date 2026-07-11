import type { Label, Sample } from "../types";
import { predictLabel } from "../lib/metrics";

interface Props {
  samples: Sample[];
  threshold: number;
  onChange: (samples: Sample[]) => void;
}

/**
 * Editable prediction table. True label and confidence are user-editable;
 * the predicted label is always derived from confidence vs. threshold so
 * the table can never disagree with the confusion matrix.
 */
export function SampleTable({ samples, threshold, onChange }: Props) {
  const updateSample = (id: string, patch: Partial<Sample>) => {
    onChange(samples.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeSample = (id: string) => {
    onChange(samples.filter((s) => s.id !== id));
  };

  const addSample = () => {
    // Find the lowest unused numeric suffix so IDs stay unique after removals.
    const used = new Set(samples.map((s) => s.id));
    let n = samples.length + 1;
    while (used.has(`S-${String(n).padStart(3, "0")}`)) n += 1;
    onChange([
      ...samples,
      { id: `S-${String(n).padStart(3, "0")}`, trueLabel: "Positive", confidence: 0.5 },
    ]);
  };

  return (
    <div className="card">
      <div className="samples-scroll">
        <table className="samples-table">
          <thead>
            <tr>
              <th scope="col">Sample ID</th>
              <th scope="col">True label</th>
              <th scope="col">Confidence</th>
              <th scope="col">Predicted</th>
              <th scope="col" aria-label="Remove column"></th>
            </tr>
          </thead>
          <tbody>
            {samples.map((s) => {
              const predicted = predictLabel(s.confidence, threshold);
              return (
                <tr key={s.id}>
                  <td className="samples-id">{s.id}</td>
                  <td>
                    <select
                      className="samples-select"
                      value={s.trueLabel}
                      aria-label={`True label for ${s.id}`}
                      onChange={(e) =>
                        updateSample(s.id, { trueLabel: e.target.value as Label })
                      }
                    >
                      <option value="Positive">Positive</option>
                      <option value="Negative">Negative</option>
                    </select>
                  </td>
                  <td>
                    <input
                      className="samples-number"
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      value={s.confidence}
                      aria-label={`Confidence score for ${s.id}`}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (!Number.isNaN(v)) {
                          updateSample(s.id, {
                            confidence: Math.min(1, Math.max(0, v)),
                          });
                        }
                      }}
                    />
                  </td>
                  <td>
                    <span
                      className={`samples-pred samples-pred--${predicted.toLowerCase()}`}
                    >
                      {predicted}
                    </span>
                  </td>
                  <td>
                    <button
                      className="samples-remove"
                      aria-label={`Remove ${s.id}`}
                      onClick={() => removeSample(s.id)}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button className="samples-add" onClick={addSample}>
        + Add sample
      </button>
    </div>
  );
}
