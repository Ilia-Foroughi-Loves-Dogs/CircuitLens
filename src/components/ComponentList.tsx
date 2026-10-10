import type { AnalysisResult } from "@/lib/analysis/types";

export function ComponentList({
  components,
}: Pick<AnalysisResult, "components">) {
  return (
    <section className="component-list">
      <h3>Detected components</h3>
      <ul>
        {components.map((component) => (
          <li key={component.name}>
            <span>
              {component.name}
              {component.detail && <small>{component.detail}</small>}
            </span>
            <span
              className="component-quantity"
              aria-label={`Quantity: ${component.quantity}`}
            >
              ×{component.quantity}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
