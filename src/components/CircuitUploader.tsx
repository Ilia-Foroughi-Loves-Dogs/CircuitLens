"use client";
import type { CircuitAnnotation } from "@/lib/annotations";

import { useRef, useState } from "react";
import { ArrowUpRight, ImagePlus, Upload } from "lucide-react";
import { CircuitViewer } from "./CircuitViewer";

type Props = {
  image: string | null;
  name: string | null;
  onUpload: (file: File) => void;
  error: string | null;
  annotations: CircuitAnnotation[];
  selectedIssueId: string | null;
  onSelectIssue: (id: string) => void;
};

export function CircuitUploader({
  image,
  name,
  onUpload,
  error,
  annotations,
  selectedIssueId,
  onSelectIssue,
}: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const select = () => input.current?.click();
  return (
    <section className="panel upload-panel">
      <div className="panel-heading">
        <div>
          <span className="step-number">01</span>
          <h2>Circuit workspace</h2>
        </div>
        <span className="mono subdued">IMAGE INPUT</span>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Upload breadboard photo"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = "";
        }}
      />
      <div
        className={`upload-zone ${dragging ? "dragging" : ""} ${image ? "has-image" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) onUpload(file);
        }}
      >
        <CircuitViewer
          image={image}
          name={name}
          onReplace={select}
          annotations={annotations}
          selectedIssueId={selectedIssueId}
          onSelectIssue={onSelectIssue}
        />
        {!image && (
          <div className="upload-content">
            <div className="upload-icon">
              <ImagePlus size={27} strokeWidth={1.5} />
            </div>
            <h3>Bring your circuit into view.</h3>
            <p>
              Drop a breadboard photo here, or choose a file
              <br className="desktop-break" /> to get started.
            </p>
            <button className="button upload-button" onClick={select}>
              <Upload size={16} /> Upload circuit photo{" "}
              <ArrowUpRight size={15} />
            </button>
            <span className="file-hint mono">JPG, PNG, WEBP · UP TO 10 MB</span>
          </div>
        )}
        <span className="corner top-left" />
        <span className="corner top-right" />
        <span className="corner bottom-left" />
        <span className="corner bottom-right" />
      </div>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <div className="photo-tip">
        <span className="tip-dot" />
        <p>
          <strong>A clearer photo, a better starting point.</strong> Shoot from
          above with all wires and components visible.
        </p>
      </div>
    </section>
  );
}
