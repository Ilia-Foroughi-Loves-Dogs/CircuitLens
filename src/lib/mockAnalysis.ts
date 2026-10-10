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
};

export const mockAnalysis: AnalysisResult = {
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
