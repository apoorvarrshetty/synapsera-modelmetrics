import type { Scenario } from "../types";

interface Props {
  scenarios: Scenario[];
  activeId: string;
  onSelect: (scenario: Scenario) => void;
}

/** Chip row for switching between hand-authored demo datasets. */
export function ScenarioSelector({ scenarios, activeId, onSelect }: Props) {
  const active = scenarios.find((sc) => sc.id === activeId);

  return (
    <section className="app-section" aria-labelledby="scenario-title">
      <h2 className="app-section-title" id="scenario-title">
        Demo scenarios
      </h2>
      <p className="app-section-sub">
        Load a dataset engineered to show one evaluation behavior, then edit it
        or move the threshold to see how the numbers respond.
      </p>
      <div className="scenario-row" role="group" aria-label="Demo scenarios">
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            className="scenario-chip"
            aria-pressed={sc.id === activeId}
            onClick={() => onSelect(sc)}
          >
            <span className="scenario-chip-name">{sc.name}</span>
          </button>
        ))}
      </div>
      {active && <p className="scenario-tagline">{active.tagline}</p>}
    </section>
  );
}
