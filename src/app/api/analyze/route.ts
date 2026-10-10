import { AnalysisError, getAnalysisProvider } from "@/lib/analysis/provider";
import { parseAnalysis } from "@/lib/analysis/schema";
export const runtime = "nodejs";
export const maxDuration = 70;
const maxImageBytes = 10 * 1024 * 1024;
const maxBodyBytes = maxImageBytes + 64 * 1024;
const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin)
      throw new AnalysisError("Cross-origin requests are not allowed.", 403);
    if (!request.headers.get("content-type")?.startsWith("multipart/form-data"))
      throw new AnalysisError(
        "Send an image and description as multipart form data.",
        400,
      );
    if (Number(request.headers.get("content-length")) > maxBodyBytes)
      throw new AnalysisError("Image must be under 10 MB.", 413);
    // Bound streamed bodies too, including requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) throw new AnalysisError("Missing upload.", 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        throw new AnalysisError("Image must be under 10 MB.", 413);
      }
      chunks.push(value);
    }
    let form: FormData;
    try {
      form = await new Request(request.url, {
        method: "POST",
        headers: request.headers,
        body: Buffer.concat(chunks),
      }).formData();
    } catch {
      throw new AnalysisError("Invalid upload form.", 400);
    }
    const image = form.get("image");
    const description = form.get("description");
    if (!(image instanceof File) || image.size === 0)
      throw new AnalysisError("Upload a circuit image.", 400);
    if (image.size > maxImageBytes)
      throw new AnalysisError("Image must be under 10 MB.", 413);
    if (
      typeof description !== "string" ||
      !description.trim() ||
      description.length > 2000
    )
      throw new AnalysisError(
        "Describe the intended behavior in 1–2000 characters.",
        400,
      );
    const bytes = Buffer.from(await image.arrayBuffer());
    const mime = bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      ? "image/png"
      : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        ? "image/jpeg"
        : bytes.toString("ascii", 0, 4) === "RIFF" &&
            bytes.toString("ascii", 8, 12) === "WEBP"
          ? "image/webp"
          : null;
    if (!mime || mime !== image.type)
      throw new AnalysisError("Upload a valid JPG, PNG, or WebP image.", 415);
    const result = await getAnalysisProvider().analyze({
      image: bytes,
      mimeType: mime,
      description: description.trim(),
    });
    return Response.json(parseAnalysis(result), { headers });
  } catch (error) {
    const known = error instanceof AnalysisError;
    return Response.json(
      {
        error: known
          ? error.message
          : "Analysis could not be completed. Retry or use demo mode.",
      },
      { status: known ? error.status : 500, headers },
    );
  }
}
