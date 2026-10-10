import type { CircuitAnnotation } from "./annotations";

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
};

export const mockAnalysis: AnalysisResult = {
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
    { name: "Arduino Uno", quantity: 1 },
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
        "The ground jumper appears to terminate one row above the LED cathode.",
      fix: "Move the jumper from row 14 to row 15.",
    },
  ],
};

export const verifiedAnalysis: AnalysisResult = {
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
