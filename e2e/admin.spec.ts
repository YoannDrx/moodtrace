import { expect, test } from "@playwright/test";
import {
  createTestAccount,
  signInAccount,
  signOutAccount,
} from "./utils/auth-test";

test.describe("admin", () => {
  test("verify admin dashboard and impersonation", async ({ page }) => {
    // Create an admin user
    const adminUser = await createTestAccount({
      page,
      callbackURL: "/space",
      admin: true,
    });
    await signOutAccount({ page });

    // Sign in as admin
    await signInAccount({
      page,
      userData: {
        email: adminUser.email,
        password: adminUser.password,
      },
      callbackURL: "/admin",
    });

    await page.goto("/admin");

    // Verify admin navigation links
    await expect(page.getByRole("link", { name: "Users" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Organizations" }),
    ).toBeVisible();

    // Navigate to Users page
    await page.getByRole("link", { name: "Users" }).click();
    await expect(page).toHaveURL("/admin/users");

    // Wait for users list to load
    await page.waitForLoadState("networkidle");

    // Open the actions menu for the first user in the list
    const actionsButton = page.getByRole("button", {
      name: /open actions menu/i,
    });
    await expect(actionsButton.first()).toBeVisible();
    await actionsButton.first().click();

    // Verify impersonate option is available
    await expect(
      page.getByRole("menuitem", { name: /impersonate/i }),
    ).toBeVisible();

    // Close the dropdown by pressing escape
    await page.keyboard.press("Escape");

    // Navigate to Organizations page
    await page.getByRole("link", { name: "Organizations" }).click();
    await expect(page).toHaveURL("/admin/organizations");
  });
});
