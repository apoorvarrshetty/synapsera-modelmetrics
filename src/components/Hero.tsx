/** Landing header: title, subtitle, description, and status badges. */
export function Hero() {
  return (
    <header className="hero">
      <h1 className="hero-title">ModelMetrics</h1>
      <p className="hero-subtitle">Interactive classification metrics dashboard.</p>
      <p className="hero-description">
        Explore confusion matrices, prediction outcomes, and model evaluation
        metrics through a clean interactive learning dashboard.
      </p>
      <div className="hero-badges">
        <span className="hero-badge">Local demo data</span>
        <span className="hero-badge">No API required</span>
        <span className="hero-badge">Built for ML learning</span>
      </div>
    </header>
  );
}
