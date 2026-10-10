import type { CircuitAnnotation } from "../annotations";
import type { CircuitAnalysis } from "./schema";
export type Severity = "HIGH" | "MEDIUM" | "LOW";
export type CircuitIssue = {
  id: string;
  severity: Severity;
  title: string;
  explanation: string;
  fix: string;
};
export type AnalysisResult = {
  components: { name: string; quantity: number; detail?: string }[];
  issues: CircuitIssue[];
  annotations: CircuitAnnotation[];
  circuitStatus: CircuitAnalysis["circuitStatus"];
};
export function toAnalysisResult(analysis: CircuitAnalysis): AnalysisResult {
  return {
    components: analysis.detectedComponents,
    circuitStatus: analysis.circuitStatus,
    issues: analysis.issues.map((issue) => ({
      ...issue,
      fix: issue.suggestedFix,
    })),
    annotations: analysis.issues.map((issue, index) => ({
      id: `issue-${issue.id}`,
      issueId: issue.id,
      label: String(index + 1),
      description: issue.title,
      status: "problem",
      position: issue.coordinates,
    })),
  };
}
