import { useMemo, useState } from "react";
import { scenarios } from "./data/scenarios";
import { computeConfusion, computeMetrics } from "./lib/metrics";
import type { Sample, Scenario } from "./types";
import { Hero } from "./components/Hero";
import { ScenarioSelector } from "./components/ScenarioSelector";
import { SampleTable } from "./components/SampleTable";
import { ConfusionMatrix } from "./components/ConfusionMatrix";
import { MetricsGrid } from "./components/MetricsGrid";
import { ThresholdSlider } from "./components/ThresholdSlider";
import { ExplainerPanel } from "./components/ExplainerPanel";
import { Quiz } from "./components/Quiz";
import { Footer } from "./components/Footer";

/**
 * App owns the full evaluation state: the active scenario id, the editable
 * sample set, and the decision threshold. Everything else — predicted
 * labels, confusion counts, metrics — is derived with useMemo, so the
 * table, matrix, and cards always agree.
 */
export default function App() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [samples, setSamples] = useState<Sample[]>(scenarios[0].samples);
  const [threshold, setThreshold] = useState(scenarios[0].defaultThreshold);

  const loadScenario = (sc: Scenario) => {
    setScenarioId(sc.id);
    // Copy so in-place table edits never mutate the scenario definition.
    setSamples(sc.samples.map((s) => ({ ...s })));
    setThreshold(sc.defaultThreshold);
  };

  const confusion = useMemo(
    () => computeConfusion(samples, threshold),
    [samples, threshold]
  );
  const metrics = useMemo(() => computeMetrics(confusion), [confusion]);

  return (
    <div className="app-shell">
      <Hero />

      <ScenarioSelector
        scenarios={scenarios}
        activeId={scenarioId}
        onSelect={loadScenario}
      />

      <section className="app-section" aria-labelledby="data-title">
        <h2 className="app-section-title" id="data-title">
          Predictions &amp; confusion matrix
        </h2>
        <p className="app-section-sub">
          Edit true labels and confidence scores on the left; the predicted
          label, matrix, and metrics update instantly.
        </p>
        <div className="app-grid-two">
          <SampleTable
            samples={samples}
            threshold={threshold}
            onChange={setSamples}
          />
          <ConfusionMatrix counts={confusion} />
        </div>
      </section>

      <section className="app-section">
        <ThresholdSlider threshold={threshold} onChange={setThreshold} />
      </section>

      <section className="app-section" aria-labelledby="metrics-title">
        <h2 className="app-section-title" id="metrics-title">
          Evaluation metrics
        </h2>
        <p className="app-section-sub">
          Six standard classification metrics, each with a plain-language
          reading of the current numbers.
        </p>
        <MetricsGrid metrics={metrics} />
      </section>

      <ExplainerPanel />
      <Quiz />
      <Footer />
    </div>
  );
}
