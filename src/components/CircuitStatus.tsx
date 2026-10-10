import { CircleCheck, CircleDashed, Radar } from "lucide-react";

export function CircuitStatus({
  hasImage,
  hasDescription,
  requested,
}: {
  hasImage: boolean;
  hasDescription: boolean;
  requested: boolean;
}) {
  return (
    <section className="panel status-panel" aria-live="polite">
      <div className="status-title">
        <Radar size={17} />
        <h2>Workspace status</h2>
        <span className="phase-tag">PHASE 01</span>
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
      <div className={`foundation-note ${requested ? "requested" : ""}`}>
        <span className="status-dot" />
        <div>
          <strong>
            {requested ? "Your circuit workspace is ready." : "Foundation mode"}
          </strong>
          <p>
            {requested
              ? "Circuit analysis is coming in a future phase. Your image and description are ready for the next step."
              : "Set up your circuit here. Visual analysis will be available in a future phase."}
          </p>
        </div>
      </div>
    </section>
  );
}
