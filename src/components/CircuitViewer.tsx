import { AnnotationOverlay } from "./AnnotationOverlay";
import type { CircuitAnnotation } from "@/lib/annotations";
import { Maximize2, ScanLine } from "lucide-react";

type Props = {
  image: string | null;
  name: string | null;
  onReplace: () => void;
  annotations: CircuitAnnotation[];
  selectedIssueId: string | null;
  onSelectIssue: (id: string) => void;
};

export function CircuitViewer({
  image,
  name,
  onReplace,
  annotations,
  selectedIssueId,
  onSelectIssue,
}: Props) {
  if (!image)
    return (
      <div className="viewer-empty">
        <div className="board-ghost" aria-hidden="true">
          <div className="rail" />
          <div className="holes" />
          <div className="board-channel" />
          <div className="holes" />
          <div className="rail" />
        </div>
        <div className="viewer-empty-label">
          <ScanLine size={15} /> YOUR CIRCUIT, IN FOCUS
        </div>
      </div>
    );
  return (
    <div className="image-viewer">
      <div className="image-stage">
        <div className="annotated-image">
          <img
            src={image}
            alt={
              name === "LED starter circuit"
                ? "Illustrated demo breadboard with an LED, resistor, jumper wires, and power supply"
                : "Uploaded breadboard circuit"
            }
          />
          {annotations.length > 0 && (
            <AnnotationOverlay
              annotations={annotations}
              selectedIssueId={selectedIssueId}
              onSelectIssue={onSelectIssue}
            />
          )}
        </div>
      </div>
      {annotations.length > 0 && (
        <p className="annotation-legend">
          Mock locations · Red: suspected issue · Green: appears correct
        </p>
      )}
      <div className="image-caption">
        <span>
          <Maximize2 size={14} /> {name}
        </span>
        <button type="button" onClick={onReplace}>
          Replace image
        </button>
      </div>
    </div>
  );
}
