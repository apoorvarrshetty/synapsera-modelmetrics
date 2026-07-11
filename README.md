# ModelMetrics

**Interactive classification metrics dashboard for machine-learning education.**

ModelMetrics helps students and developers build intuition for binary classification evaluation. Load a demo scenario, edit samples, drag the decision threshold, and watch the confusion matrix and six standard metrics respond in real time.

![Status](https://img.shields.io/badge/data-local%20demo-5B5BF0) ![API](https://img.shields.io/badge/API-none%20required-4F86F7) ![Purpose](https://img.shields.io/badge/built%20for-ML%20learning-8B6DF0)

---

## Features

- **Five demo scenarios** — hand-authored datasets engineered so each one reliably demonstrates a named behavior: balanced classifier, high precision, high recall, an overfitting warning (extreme confidence, mediocre accuracy), and a weak baseline.
- **Editable prediction table** — change true labels and confidence scores, add or remove samples; sample IDs stay unique.
- **Live confusion matrix** — a 2×2 matrix where hue encodes meaning (blue-violet for correct cells, rose for errors) and intensity encodes count.
- **Decision threshold simulator** — a single slider drives every prediction in the app. Watch samples flip between quadrants and metrics trade precision for recall.
- **Six metric cards** — accuracy, precision, recall, F1, specificity, and false positive rate, each with a plain-language explanation and a Strong / Moderate / Weak interpretation badge (inverted for FPR, where lower is better).
- **Metric explainer panel** — beginner-friendly glossary covering all metrics plus false positives and false negatives.
- **Mini challenge** — a four-question quiz with instant feedback and explanations.

## Architecture

The core design decision: **predicted labels are never stored — they are always derived** from `confidence >= threshold`. The table, matrix, and metric cards therefore share one source of truth and can never disagree.

```
src/
├── App.tsx                  # Owns all state: scenario, samples, threshold
├── types.ts                 # Shared domain types
├── data/scenarios.ts        # Hand-authored demo datasets
├── lib/metrics.ts           # Pure, documented metric math (framework-free)
├── styles/
│   ├── tokens.css           # Design tokens: palette, type, shape, motion
│   └── global.css           # Component-prefixed styles
└── components/              # One focused component per feature
    ├── Hero.tsx
    ├── ScenarioSelector.tsx
    ├── SampleTable.tsx
    ├── ConfusionMatrix.tsx
    ├── MetricsGrid.tsx
    ├── ThresholdSlider.tsx
    ├── ExplainerPanel.tsx
    ├── Quiz.tsx
    └── Footer.tsx
```

- All derivation (`predictions → confusion counts → metrics`) lives in `lib/metrics.ts` as pure functions with divide-by-zero guards — trivially unit-testable and reusable outside React.
- Fully client-side: local state only, no APIs, no accounts, no stored user data.
- Design tokens under a `--mm-` namespace; Sora / Inter / JetBrains Mono type stack; blue-purple gradient accent.
- Accessibility: keyboard-focus rings, `aria-pressed` scenario chips, labeled inputs, `role="status"` quiz feedback, `prefers-reduced-motion` respected.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check + production build
npm run preview    # preview the production build
```

Requires Node 18+.

## Screenshots / demo suggestions

- **Hero + scenario chips** — capture with the "Overfitting warning example" selected to show the tagline.
- **Matrix in motion** — record a short GIF dragging the threshold slider on the "High recall classifier" scenario; samples visibly migrate between quadrants.
- **Metric cards** — screenshot the weak baseline scenario, where every badge reads Weak, next to the balanced scenario for contrast.

## Roadmap

- ROC and precision-recall curves plotted from the sample set
- Multi-class confusion matrix (N×N) support
- Import a CSV of predictions
- Shareable scenario state via URL parameters
- Light/dark theme toggle

## License

MIT — see [LICENSE](./LICENSE).

---

*ModelMetrics is for machine-learning education and demonstration only.*
