import { Wrench } from "lucide-react";
import type { CircuitIssue, Severity } from "@/lib/analysis/types";

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`severity-badge severity-${severity.toLowerCase()}`}>
      {severity}
    </span>
  );
}

export function IssueCard({
  issue,
  number,
  selected,
  onSelect,
}: {
  issue: CircuitIssue;
  number: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article className={`issue-card ${selected ? "is-selected" : ""}`}>
      <button
        type="button"
        className="issue-select"
        aria-pressed={selected}
        onClick={onSelect}
      >
        Issue {number} · Show on image
      </button>
      <SeverityBadge severity={issue.severity} />
      <h3>{issue.title}</h3>
      <p>{issue.explanation}</p>
      <div className="issue-fix">
        <Wrench size={14} aria-hidden="true" />
        <div>
          <strong>Suggested fix</strong>
          <p>{issue.fix}</p>
        </div>
      </div>
    </article>
  );
}
