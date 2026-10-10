import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";

const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(process.env.APP_URL ?? "http://localhost:3000");
  await page
    .getByRole("heading", { name: "Make sense of every connection." })
    .waitFor();
  const analyze = page.getByRole("button", { name: "Analyze Circuit" });
  await expect(analyze).toBeDisabled();
  await page.getByRole("button", { name: "Load Demo Circuit" }).click();
  await expect(analyze).toBeEnabled();
  assert.match(await page.locator("#description").inputValue(), /220Ω/);
  await expect
    .poll(() =>
      page
        .locator(".image-viewer img")
        .evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await analyze.click();
  await expect(
    page.getByRole("button", { name: "Analyzing Circuit…" }),
  ).toBeDisabled();
  await page.getByText("2 issues detected").waitFor();
  await expect(page.locator(".component-list li")).toHaveCount(4);
  await expect(page.locator(".issue-card")).toHaveCount(2);
  await expect(
    page.getByText("LED polarity may be reversed", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Move the jumper from row 14 to row 15.", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".severity-high")).toHaveText("HIGH");
  await expect(page.locator(".severity-medium")).toHaveText("MEDIUM");
  await expect(page.locator(".annotation-marker")).toHaveCount(3);
  await page.getByRole("button", { name: "Issue 1 · Show on image" }).click();
  await expect(
    page.locator('[data-annotation-id="led-highlight"]'),
  ).toHaveClass(/is-selected/);
  await page.getByRole("button", { name: "Issue 2 · Show on image" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.locator('[data-annotation-id="ground-highlight"]'),
  ).toHaveClass(/is-selected/);
  await expect(
    page.locator('[data-annotation-id="led-highlight"]'),
  ).not.toHaveClass(/is-selected/);
  await page
    .getByRole("button", { name: "Issue 1: LED polarity may be reversed" })
    .click();
  await expect(
    page.getByRole("button", { name: "Issue 1 · Show on image" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Circuit Fixed? Scan Again" }).click();
  await expect(page.locator(".annotation-overlay")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Analyzing Circuit…" }),
  ).toBeDisabled();
  await page.getByRole("heading", { name: "Circuit Verified" }).waitFor();
  await expect(
    page.getByText("No obvious wiring problems detected."),
  ).toBeVisible();
  await expect(page.locator(".analysis-panel")).toHaveClass(
    /analysis-verified/,
  );
  await expect(page.locator(".issue-card")).toHaveCount(0);
  await expect(page.locator(".annotation-problem")).toHaveCount(0);
  await expect(
    page.locator(".annotation-correct .annotation-marker"),
  ).toHaveCount(3);
  await expect(page.locator(".annotation.is-selected")).toHaveCount(0);
  await page.getByRole("button", { name: "Start New Scan" }).click();
  await expect(page.locator(".image-viewer")).toHaveCount(0);
  await expect(page.locator("#description")).toHaveValue("");
  await expect(page.locator(".analysis-panel")).toHaveCount(0);
  await expect(analyze).toBeDisabled();
  await page.getByRole("button", { name: "Load Demo Circuit" }).click();
  await analyze.click();
  await page.getByText("2 issues detected").waitFor();
  await page.getByRole("button", { name: "Circuit Fixed? Scan Again" }).click();
  await page.getByRole("button", { name: "Start New Scan" }).click();
  await page.waitForTimeout(1600);
  await expect(page.locator(".analysis-panel")).toHaveCount(0);
  await page.getByRole("button", { name: "Load Demo Circuit" }).click();
  await page.locator("#description").fill("");
  await expect(analyze).toBeDisabled();
  await expect(page.locator(".analysis-panel")).toHaveCount(0);
  await expect(page.locator(".annotation-overlay")).toHaveCount(0);
  await page.locator("input[type=file]").setInputFiles({
    name: "invalid.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("invalid"),
  });
  await page
    .getByRole("alert")
    .filter({ hasText: "Please choose a JPG" })
    .waitFor();
  await page.locator("input[type=file]").setInputFiles({
    name: "large.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
  });
  await page.getByRole("alert").filter({ hasText: "too large" }).waitFor();
  await page.locator("input[type=file]").setInputFiles({
    name: "test.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j6XkAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await expect(page.locator(".error-message")).toHaveCount(0);
  await page.locator("#description").fill("The LED should light up.");
  await analyze.click();
  await page.getByRole("button", { name: "Load Demo Circuit" }).click();
  await page.waitForTimeout(1600);
  await expect(page.locator(".analysis-panel")).toHaveCount(0);
  await expect(page.locator(".annotation-overlay")).toHaveCount(0);
  await analyze.click();
  await page.getByText("2 issues detected").waitFor();
  await page.screenshot({
    path: "/tmp/circuitlens-desktop.png",
    fullPage: true,
  });
  for (const width of [390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    const alignment = await page.evaluate(() => {
      const image = document
        .querySelector(".annotated-image img")
        .getBoundingClientRect();
      const overlay = document
        .querySelector(".annotation-overlay")
        .getBoundingClientRect();
      const box = document
        .querySelector('[data-annotation-id="led-highlight"] .annotation-box')
        .getBoundingClientRect();
      return {
        image: {
          x: image.x,
          y: image.y,
          width: image.width,
          height: image.height,
        },
        overlay: {
          x: overlay.x,
          y: overlay.y,
          width: overlay.width,
          height: overlay.height,
        },
        x: (box.x - image.x) / image.width,
        y: (box.y - image.y) / image.height,
      };
    });
    assert.deepEqual(alignment.image, alignment.overlay);
    assert.ok(Math.abs(alignment.x - 0.455) < 0.002);
    assert.ok(Math.abs(alignment.y - 0.265) < 0.002);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
      `Overflow at ${width}px`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "/tmp/circuitlens-mobile.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  console.log(
    "Passed: demo, local upload, file validation, mock analysis, repair/rescan, verified markers, new scan, loading, result reset, cancellation, responsive widths, and browser runtime checks.",
  );
} finally {
  await browser.close();
}
