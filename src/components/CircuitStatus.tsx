import type { AnalysisState } from "./AnalysisPanel";
import { CircleCheck, CircleDashed, Radar } from "lucide-react";

export function CircuitStatus({
  hasImage,
  hasDescription,
  analysisState,
}: {
  hasImage: boolean;
  hasDescription: boolean;
  analysisState: AnalysisState;
}) {
  return (
    <section className="panel status-panel" aria-live="polite">
      <div className="status-title">
        <Radar size={17} />
        <h2>Workspace status</h2>
        <span className="phase-tag">PHASE 02</span>
      </div>
      <div className="status-row">
        {hasImage ? (
          <CircleCheck className="mint" size={16} />
        ) : (
          <CircleDashed size={16} />
        )}
        <span>Circuit image</span>
        <span className={hasImage ? "mint" : "subdued"}>
          {hasImage ? "Loaded" : "Waiting"}
        </span>
      </div>
      <div className="status-row">
        {hasDescription ? (
          <CircleCheck className="mint" size={16} />
        ) : (
          <CircleDashed size={16} />
        )}
        <span>Expected behavior</span>
        <span className={hasDescription ? "mint" : "subdued"}>
          {hasDescription ? "Added" : "Waiting"}
        </span>
      </div>
      <div
        className={`foundation-note ${analysisState === "complete" ? "requested" : ""}`}
      >
        <span className="status-dot" />
        <div>
          <strong>
            {analysisState === "complete"
              ? "Mock analysis complete"
              : analysisState === "analyzing"
                ? "Analyzing your breadboard…"
                : "Mock analysis mode"}
          </strong>
          <p>
            {analysisState === "complete"
              ? "Review the simulated components and suggested fixes below."
              : "Add an image and expected behavior to try simulated circuit analysis."}
          </p>
        </div>
      </div>
    </section>
  );
}
