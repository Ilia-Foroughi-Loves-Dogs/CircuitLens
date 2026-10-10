import { Wrench } from "lucide-react";
import type { CircuitIssue, Severity } from "@/lib/mockAnalysis";

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`severity-badge severity-${severity.toLowerCase()}`}>
      {severity}
    </span>
  );
}

export function IssueCard({ issue }: { issue: CircuitIssue }) {
  return (
    <article className="issue-card">
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
