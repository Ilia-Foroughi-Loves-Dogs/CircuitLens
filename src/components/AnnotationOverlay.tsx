import { useId } from "react";
import type { CircuitAnnotation } from "@/lib/annotations";

type Props = {
  annotations: CircuitAnnotation[];
  selectedIssueId: string | null;
  onSelectIssue: (id: string) => void;
};

export function AnnotationOverlay({
  annotations,
  selectedIssueId,
  onSelectIssue,
}: Props) {
  const arrowId = useId();
  return (
    <div className="annotation-overlay" aria-label="Circuit annotations">
      <svg
        className="annotation-arrows"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker
            id={arrowId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
          </marker>
        </defs>
        {annotations.map(
          (annotation) =>
            annotation.arrow && (
              <line
                key={annotation.id}
                className={`annotation-arrow annotation-${annotation.status} ${annotation.issueId === selectedIssueId ? "is-selected" : ""}`}
                x1={annotation.arrow.from.x * 1000}
                y1={annotation.arrow.from.y * 1000}
                x2={annotation.arrow.to.x * 1000}
                y2={annotation.arrow.to.y * 1000}
                markerEnd={`url(#${arrowId})`}
                vectorEffect="non-scaling-stroke"
              />
            ),
        )}
      </svg>
      {annotations.map((annotation) => {
        const selected =
          !!annotation.issueId && annotation.issueId === selectedIssueId;
        return (
          <div
            key={annotation.id}
            data-annotation-id={annotation.id}
            className={`annotation annotation-${annotation.status} ${selected ? "is-selected" : ""}`}
          >
            {annotation.box && (
              <div
                className="annotation-box"
                aria-hidden="true"
                style={{
                  left: `${annotation.box.x * 100}%`,
                  top: `${annotation.box.y * 100}%`,
                  width: `${annotation.box.width * 100}%`,
                  height: `${annotation.box.height * 100}%`,
                }}
              />
            )}
            {annotation.issueId ? (
              <button
                type="button"
                className="annotation-marker"
                aria-label={`Issue ${annotation.label}: ${annotation.description}`}
                aria-pressed={selected}
                onClick={() => onSelectIssue(annotation.issueId!)}
                style={{
                  left: `${annotation.position.x * 100}%`,
                  top: `${annotation.position.y * 100}%`,
                }}
              >
                {annotation.label}
              </button>
            ) : (
              <span
                className="annotation-marker"
                role="img"
                aria-label={annotation.description}
                title={annotation.description}
                style={{
                  left: `${annotation.position.x * 100}%`,
                  top: `${annotation.position.y * 100}%`,
                }}
              >
                {annotation.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
