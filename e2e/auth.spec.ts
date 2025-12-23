import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display sign in page", async ({ page }) => {
    await page.goto("/auth/signin");

    // Check page title
    await expect(page).toHaveTitle(/MoodJournal/);

    // Check sign in form is visible
    await expect(page.getByRole("heading", { name: /connexion/i })).toBeVisible();
  });

  test("should display sign up page", async ({ page }) => {
    await page.goto("/auth/signup");

    // Check sign up form is visible
    await expect(page.getByRole("heading", { name: /inscription/i })).toBeVisible();
  });

  test("should redirect to signin when not authenticated", async ({ page }) => {
    // Try to access protected route
    await page.goto("/space/default");

    // Should redirect to signin
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/auth/signin");

    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill("invalid@example.com");
    await page.getByLabel(/mot de passe/i).fill("wrongpassword");

    // Submit form
    await page.getByRole("button", { name: /connexion/i }).click();

    // Should show error message
    await expect(page.getByText(/identifiants invalides/i)).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("should have accessible homepage", async ({ page }) => {
    await page.goto("/");

    // Check main heading
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
