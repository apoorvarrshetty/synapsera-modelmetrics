import type { MetricResult } from "../types";
import { formatMetric } from "../lib/metrics";

interface Props {
  metrics: MetricResult[];
}

/** One card per metric: mono value, plain-language explanation, badge. */
function MetricCard({ metric }: { metric: MetricResult }) {
  const badgeClass = metric.interpretation
    ? `metric-badge--${metric.interpretation.toLowerCase()}`
    : "metric-badge--none";

  return (
    <article className="metric-card">
      <div className="metric-card-top">
        <span className="metric-card-name">{metric.name}</span>
        <span className={`metric-badge ${badgeClass}`}>
          {metric.interpretation ?? "N/A"}
        </span>
      </div>
      <span className="metric-card-value">{formatMetric(metric.value)}</span>
      <p className="metric-card-explanation">{metric.explanation}</p>
    </article>
  );
}

export function MetricsGrid({ metrics }: Props) {
  return (
    <div className="metrics-grid">
      {metrics.map((m) => (
        <MetricCard key={m.key} metric={m} />
      ))}
    </div>
  );
}
