import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";

const compile = async (path, replacements = []) => {
  let source = await fs.readFile(path, "utf8");
  for (const [from, to] of replacements) source = source.replaceAll(from, to);
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
};
const schemaUrl = await compile("src/lib/analysis/schema.ts", [
  ['"zod"', JSON.stringify(import.meta.resolve("zod"))],
]);
const providerUrl = await compile("src/lib/analysis/provider.ts", [
  ['import "server-only";', ""],
  ['"./schema"', JSON.stringify(schemaUrl)],
]);
const routeUrl = await compile("src/app/api/analyze/route.ts", [
  ['"@/lib/analysis/provider"', JSON.stringify(providerUrl)],
  ['"@/lib/analysis/schema"', JSON.stringify(schemaUrl)],
]);
const { parseAnalysis } = await import(schemaUrl);
const { OpenAICircuitAnalysisProvider } = await import(providerUrl);
const { POST } = await import(routeUrl);
const result = {
  detectedComponents: [{ name: "LED", quantity: 1, detail: "Red" }],
  circuitStatus: "issues_detected",
  issues: [
    {
      id: "led",
      severity: "HIGH",
      title: "Polarity",
      explanation: "May be reversed",
      suggestedFix: "Check cathode",
      coordinates: { x: 0.4, y: 0.2 },
    },
  ],
};
assert.deepEqual(parseAnalysis(result), result);
for (const invalid of [
  { ...result, issues: [result.issues[0], result.issues[0]] },
  { ...result, circuitStatus: "no_obvious_issues" },
  { ...result, issues: [{ ...result.issues[0], coordinates: { x: 2, y: 0 } }] },
  { ...result, issues: [{ ...result.issues[0], severity: "CRITICAL" }] },
  {
    ...result,
    detectedComponents: [{ name: "LED", quantity: -1, detail: "" }],
  },
])
  assert.throws(() => parseAnalysis(invalid));
const originalFetch = globalThis.fetch;
const oldKey = process.env.OPENAI_API_KEY;
try {
  delete process.env.OPENAI_API_KEY;
  await assert.rejects(
    new OpenAICircuitAnalysisProvider().analyze({
      image: Buffer.from("image"),
      mimeType: "image/png",
      description: "LED",
    }),
    /not configured/,
  );
  process.env.OPENAI_API_KEY = "test-key";
  let requestBody;
  const mock = (body, status = 200) => {
    globalThis.fetch = async (_url, options) => {
      requestBody = JSON.parse(options.body);
      return Response.json(body, { status });
    };
  };
  mock({
    status: "completed",
    output: [
      {
        type: "message",
        content: [{ type: "output_text", text: JSON.stringify(result) }],
      },
    ],
  });
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j6XkAAAAASUVORK5CYII=",
    "base64",
  );
  const upload = (
    image = new File([png], "circuit.png", { type: "image/png" }),
    description = "LED should light",
  ) => {
    const form = new FormData();
    form.append("image", image);
    form.append("description", description);
    return new Request("http://localhost/api/analyze", {
      method: "POST",
      body: form,
    });
  };
  const response = await POST(upload());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), result);
  assert.equal(requestBody.store, false);
  assert.equal(requestBody.text.format.strict, true);
  assert.match(
    requestBody.input[0].content[1].image_url,
    /^data:image\/png;base64,/,
  );
  assert.match(requestBody.input[0].content[0].text, /LED should light/);
  assert.equal((await POST(upload(undefined, ""))).status, 400);
  assert.equal(
    (await POST(upload(new File(["fake"], "fake.png", { type: "image/png" }))))
      .status,
    415,
  );
  assert.equal(
    (
      await POST(
        new Request("http://localhost/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            "Content-Length": String(12 * 1024 * 1024),
          },
          body: "",
        }),
      )
    ).status,
    413,
  );
  mock({
    status: "completed",
    output: [
      { type: "message", content: [{ type: "output_text", text: "{}" }] },
    ],
  });
  assert.equal((await POST(upload())).status, 502);
  mock({ status: "incomplete", output: [] });
  assert.equal((await POST(upload())).status, 502);
  mock({
    status: "completed",
    output: [{ type: "message", content: [{ type: "refusal" }] }],
  });
  assert.equal((await POST(upload())).status, 502);
  mock({ error: { message: "secret upstream detail" } }, 429);
  const limited = await POST(upload());
  assert.equal(limited.status, 429);
  assert.ok(!(await limited.text()).includes("secret"));
  globalThis.fetch = async () => {
    throw new DOMException("Timeout", "TimeoutError");
  };
  assert.equal((await POST(upload())).status, 504);
  delete process.env.OPENAI_API_KEY;
  assert.equal((await POST(upload())).status, 503);
  console.log(
    "Passed: analysis validation, upload API, provider payload, invalid outputs, refusal, timeout, rate limits, and missing configuration.",
  );
} finally {
  globalThis.fetch = originalFetch;
  if (oldKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = oldKey;
}
