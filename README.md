# CircuitLens

Phase 6: AI visual analysis for breadboard circuits, with an offline demo fallback. Built with Next.js and TypeScript.

## Run locally

```sh
npm install
cp .env.example .env.local
# Set OPENAI_API_KEY in .env.local to enable AI mode.
npm run dev
```

Open http://localhost:3000. `OPENAI_ANALYSIS_MODEL` defaults to `gpt-4.1-mini` and can be changed to an image-capable Responses API model supporting structured outputs. Keys are read only by server code; never use a `NEXT_PUBLIC_` key. Environment files are ignored by Git. Restart the server after changing configuration.

Upload a JPG, PNG, or WebP (up to 10 MB), describe the intended behavior, and choose **Analyze Circuit**. AI mode sends the image and description through the backend to OpenAI; requests use `store: false`. Results are visual assessments, not electrical verification. Coordinates are approximate fractions of the original image from its top-left. Unclear or non-circuit images can return an uncertain status.

**Load Demo Circuit** immediately loads the illustrated sample and mock findings without a key or network call. The mode selector also allows simulated analysis of an uploaded photo. Failed AI analysis offers **Use Demo Mode**; simulated findings remain explicitly labeled. Demo rescans simulate a repaired circuit; AI rescans analyze the currently uploaded photo again. Upload a new photo after physically changing connections. Editing inputs or starting a new scan cancels pending results.

## API and architecture

`POST /api/analyze` accepts multipart form fields `image` (File) and `description` (1–2000 characters). Successful responses contain:

```json
{
  "detectedComponents": [{ "name": "LED", "quantity": 1, "detail": "Red" }],
  "circuitStatus": "issues_detected",
  "issues": [
    {
      "id": "led-polarity",
      "severity": "HIGH",
      "title": "Possible reversed LED",
      "explanation": "The visible polarity may be reversed.",
      "suggestedFix": "Check cathode orientation.",
      "coordinates": { "x": 0.46, "y": 0.27 }
    }
  ]
}
```

Statuses: `issues_detected`, `no_obvious_issues`, `uncertain`. Severities: `HIGH`, `MEDIUM`, `LOW`. Errors return `{ "error": "..." }` with an appropriate HTTP status. Upload bodies are bounded even without Content-Length; file signatures and MIME types must match. The provider has a 60-second timeout and sanitizes upstream errors.

- `src/lib/analysis/schema.ts`: shared strict JSON schema and runtime validation, including coordinate bounds, unique issue IDs, and status consistency. Validated both server-side and before rendering.
- `src/lib/analysis/provider.ts`: server-only provider interface, OpenAI implementation, and factory. Replace the factory/provider for future computer vision while retaining the JSON contract.
- `src/lib/analysis/types.ts`: adapter from provider output to components and image annotations.
- `src/app/api/analyze/route.ts`: upload validation and provider orchestration.
- `src/lib/mockAnalysis.ts`: preserved offline mock fixtures.

The implementation follows the official [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) and [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses) documentation. Before public deployment, add authentication and deployment-level rate limiting to control access and API spend.

## Checks

```sh
npm run typecheck
npm run test:analysis
npm run build
# With the app running and Google Chrome installed:
npm run test:smoke
```

API/provider tests use stubbed upstream responses and require no key or billable requests. Browser smoke tests cover demo flows, uploads, annotations, cancellation, responsive layouts, AI response rendering, invalid JSON rejection, and demo fallback. Set `APP_URL` to test another port. A live model request requires your server API key and account access.
