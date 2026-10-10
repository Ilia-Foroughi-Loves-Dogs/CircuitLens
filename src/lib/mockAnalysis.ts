import type { AnalysisResult } from "./analysis/types";
export type { AnalysisResult, CircuitIssue, Severity } from "./analysis/types";

export const mockAnalysis: AnalysisResult = {
  circuitStatus: "issues_detected",
  annotations: [
    {
      id: "led-highlight",
      issueId: "led-polarity",
      label: "1",
      description: "LED polarity may be reversed",
      status: "problem",
      position: { x: 0.46, y: 0.27 },
      box: { x: 0.455, y: 0.265, width: 0.08, height: 0.17 },
    },
    {
      id: "ground-highlight",
      issueId: "jumper-row",
      label: "2",
      description: "Possible incorrect ground jumper connection",
      status: "problem",
      position: { x: 0.56, y: 0.46 },
      box: { x: 0.495, y: 0.39, width: 0.045, height: 0.1 },
      arrow: { from: { x: 0.56, y: 0.46 }, to: { x: 0.52, y: 0.425 } },
    },
    {
      id: "power-connection",
      label: "✓",
      description: "Mock: power rail connection appears correct",
      status: "correct",
      position: { x: 146 / 720, y: 112 / 450 },
    },
  ],
  components: [
    { name: "Breadboard", quantity: 1 },
    { name: "5V DC power supply", quantity: 1 },
    { name: "Red LED", quantity: 1 },
    { name: "Resistor", quantity: 1, detail: "Approximately 220 ohms" },
    { name: "Jumper wires", quantity: 4 },
  ],
  issues: [
    {
      id: "led-polarity",
      severity: "HIGH",
      title: "LED polarity may be reversed",
      explanation:
        "The LED cathode appears to be connected toward the positive rail.",
      fix: "Rotate the LED 180 degrees or reverse its two connections.",
    },
    {
      id: "jumper-row",
      severity: "MEDIUM",
      title: "Possible incorrect jumper row",
      explanation:
        "The ground jumper appears to terminate in a neighboring breadboard strip, leaving the LED return path open.",
      fix: "Move the ground jumper into the same connected strip as the LED cathode.",
    },
  ],
};

export const verifiedAnalysis: AnalysisResult = {
  circuitStatus: "no_obvious_issues",
  components: mockAnalysis.components,
  issues: [],
  annotations: mockAnalysis.annotations.map((annotation) => ({
    ...annotation,
    id: `${annotation.id}-verified`,
    issueId: undefined,
    label: "✓",
    status: "correct",
    description:
      annotation.id === "led-highlight"
        ? "Mock: LED polarity appears correct"
        : annotation.id === "ground-highlight"
          ? "Mock: ground jumper connection appears correct"
          : annotation.description,
  })),
};
