import { z } from "zod";

const text = z.string().trim().min(1).max(4000);
export const analysisSchema = z.strictObject({
  detectedComponents: z
    .array(
      z.strictObject({
        name: text,
        quantity: z.number().int().min(1).max(1000),
        detail: z.string().max(4000),
      }),
    )
    .max(100),
  circuitStatus: z.enum(["issues_detected", "no_obvious_issues", "uncertain"]),
  issues: z
    .array(
      z.strictObject({
        id: z.string().min(1).max(100),
        severity: z.enum(["HIGH", "MEDIUM", "LOW"]),
        title: text,
        explanation: text,
        suggestedFix: text,
        coordinates: z.strictObject({
          x: z.number().min(0).max(1),
          y: z.number().min(0).max(1),
        }),
      }),
    )
    .max(30),
});
export type CircuitAnalysis = z.infer<typeof analysisSchema>;
export const analysisJsonSchema = z.toJSONSchema(analysisSchema);

export function parseAnalysis(value: unknown): CircuitAnalysis {
  const result = analysisSchema.parse(value);
  if (
    new Set(result.issues.map((issue) => issue.id)).size !==
    result.issues.length
  )
    throw new Error("Duplicate issue IDs");
  if (
    (result.circuitStatus === "issues_detected" && !result.issues.length) ||
    (result.circuitStatus === "no_obvious_issues" && result.issues.length)
  )
    throw new Error("Inconsistent circuit status");
  return result;
}
