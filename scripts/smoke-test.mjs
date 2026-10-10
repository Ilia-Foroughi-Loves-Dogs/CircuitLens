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
  await page.goto("http://127.0.0.1:3000");
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
  await page.getByText("Your circuit workspace is ready.").waitFor();
  await page.locator("#description").fill("");
  await expect(analyze).toBeDisabled();
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "invalid.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("invalid"),
    });
  await page
    .getByRole("alert")
    .filter({ hasText: "Please choose a JPG" })
    .waitFor();
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "large.png",
      mimeType: "image/png",
      buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
    });
  await page.getByRole("alert").filter({ hasText: "too large" }).waitFor();
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j6XkAAAAASUVORK5CYII=",
        "base64",
      ),
    });
  await expect(page.locator(".error-message")).toHaveCount(0);
  await page.getByRole("button", { name: "Load Demo Circuit" }).click();
  await page.screenshot({
    path: "/tmp/circuitlens-desktop.png",
    fullPage: true,
  });
  for (const width of [390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
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
    "Passed: demo, local upload, file validation, analysis placeholder, responsive widths, and browser runtime checks.",
  );
} finally {
  await browser.close();
}
