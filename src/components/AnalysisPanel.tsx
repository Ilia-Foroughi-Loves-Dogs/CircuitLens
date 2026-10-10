import { LoaderCircle, ScanLine } from "lucide-react";
import type { AnalysisResult } from "@/lib/mockAnalysis";
import { ComponentList } from "./ComponentList";
import { IssueCard } from "./IssueCard";

export type AnalysisState = "idle" | "analyzing" | "complete";

export function AnalysisPanel({
  state,
  result,
  selectedIssueId,
  onSelectIssue,
}: {
  state: AnalysisState;
  result: AnalysisResult | null;
  selectedIssueId: string | null;
  onSelectIssue: (id: string) => void;
}) {
  if (state === "idle") return null;
  return (
    <section
      className="panel analysis-panel"
      aria-label="Circuit analysis"
      aria-busy={state === "analyzing"}
    >
      <div className="panel-heading">
        <div>
          <ScanLine size={17} className="mint" />
          <h2>Mock circuit analysis</h2>
        </div>
        <span className="phase-tag">MOCK</span>
      </div>
      <div role="status" aria-live="polite">
        {state === "analyzing" ? (
          <p className="analysis-loading">
            <LoaderCircle size={16} className="spinner" />
            Analyzing your breadboard…
          </p>
        ) : (
          result && (
            <p className="analysis-summary">
              {result.issues.length} issues detected
            </p>
          )
        )}
      </div>
      {state === "complete" && result && (
        <>
          <p className="analysis-note">
            Simulated results for demonstration. These findings are not based on
            your photo.
          </p>
          <ComponentList components={result.components} />
          <div className="issue-list">
            {result.issues.map((issue, index) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                number={index + 1}
                selected={selectedIssueId === issue.id}
                onSelect={() => onSelectIssue(issue.id)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
