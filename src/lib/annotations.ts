/** Coordinates are fractions of the original image, measured from its top-left.
 * Convert future CV pixel coordinates using x / imageWidth and y / imageHeight.
 */
export type ImagePoint = { x: number; y: number };
export type CircuitAnnotation = {
  id: string;
  issueId?: string;
  label: string;
  description: string;
  status: "problem" | "correct";
  position: ImagePoint;
  box?: ImagePoint & { width: number; height: number };
  arrow?: { from: ImagePoint; to: ImagePoint };
};
