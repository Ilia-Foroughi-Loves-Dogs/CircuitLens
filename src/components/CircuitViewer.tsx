import { Maximize2, ScanLine } from "lucide-react";

type Props = {
  image: string | null;
  name: string | null;
  onReplace: () => void;
};

export function CircuitViewer({ image, name, onReplace }: Props) {
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
      <img
        src={image}
        alt={
          name === "LED starter circuit"
            ? "Illustrated demo breadboard with an LED, resistor, jumper wires, and power supply"
            : "Uploaded breadboard circuit"
        }
      />
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
