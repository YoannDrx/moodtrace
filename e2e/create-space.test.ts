import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { createTestAccount } from "./utils/auth-test";

test.describe("Create Space", () => {
  test("should create a new space after account creation", async ({ page }) => {
    // Create and login with a test account
    await createTestAccount({
      page,
      callbackURL: "/space",
    });

    await page.waitForURL(/\/space\/[^/]+$/);

    await expect(
      page.getByRole("heading", { name: /tableau de bord/i }),
    ).toBeVisible();

    // Go to the new space creation page (onboarding)
    await page.goto("/onboarding/patient");

    // Fill space form
    const spaceName =
      `${faker.animal.bear()}-${faker.string.alphanumeric(3)}`.toLowerCase();
    const expectedSlug = spaceName.split(" ").join("-");

    await page.getByLabel(/nom de votre espace/i).fill(spaceName);
    await page.getByLabel(/identifiant/i).fill(expectedSlug);

    // Submit form
    await page.getByRole("button", { name: /créer mon espace/i }).click();

    // Wait for redirect to the new space (uses window.location.href so it's a full navigation)
    await page.waitForURL(new RegExp(`/space/${expectedSlug}`), {
      timeout: 30000,
    });

    // Verify that the space selector contains the space name
    await expect(page.getByTestId("space-selector")).toContainText(spaceName);
  });
});
