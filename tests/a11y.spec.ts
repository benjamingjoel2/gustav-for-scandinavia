import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/journeys",
  "/journeys/fjords-slowly",
  "/destinations",
  "/destinations/tromso",
  "/experiences",
  "/light-calendar",
  "/route-builder?stops=oslo,flam,bergen",
  "/black-book",
  "/sapmi",
  "/travelling-lighter",
  "/about",
  "/journal",
  "/journal/sauna-like-a-finn",
  "/enquire",
  "/faq",
  "/legal",
];

for (const path of pages) {
  test(`no serious accessibility violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("load");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.nodes[0]?.target.join(" ")}`)).toEqual([]);
  });
}

test("the Light Calendar works from the keyboard", async ({ page }) => {
  await page.goto("/light-calendar");
  const slider = page.getByLabel("Day of the year");
  await page.getByRole("button", { name: "June" }).click();
  await slider.focus();
  await page.keyboard.press("PageUp");
  await expect(slider).toHaveAttribute("aria-valuetext", "15 July");
});

test("the route builder works without the map", async ({ page }) => {
  await page.goto("/route-builder");
  const disclosure = page.getByText("Choose places from a list");
  if (await disclosure.isVisible()) await disclosure.click();
  for (const name of ["Oslo", "Bergen"]) await page.getByRole("checkbox", { name, exact: true }).filter({ visible: true }).check();
  await expect(page.getByText("Bergen Line", { exact: true })).toBeVisible();
});
