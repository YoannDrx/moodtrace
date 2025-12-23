import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { createTestAccount } from "./utils/auth-test";

test("update space slug", async ({ page }) => {
  // 1. Create a test account (owner)
  await createTestAccount({ page, callbackURL: "/space" });

  await page.waitForURL(/\/space\/[^/]+$/);

  await expect(
    page.getByRole("heading", { name: /tableau de bord/i }),
  ).toBeVisible();

  // Extract space slug from URL
  const currentUrl = page.url();
  const originalSlug = currentUrl.split("/space/")[1].split("/")[0];

  // Store the original space data for verification
  const originalSpace = await prisma.organization.findFirst({
    where: {
      slug: originalSlug,
    },
  });

  if (!originalSpace) {
    throw new Error("Space not found");
  }

  // 2. Navigate to space danger settings page
  await page.goto(`/space/${originalSpace.slug}/settings/danger`, {
    waitUntil: "load",
  });
  await page.waitForTimeout(500);

  // 4. Generate a new space slug
  const newSlug = `${faker.internet.domainWord().toLowerCase()}-${faker.string.alphanumeric(4).toLowerCase()}`;

  // 5. Find the slug input field and update it
  const slugInput = page.getByRole("textbox");

  // Verify the current value matches the original space slug
  await expect(slugInput).toHaveValue(originalSlug);

  // Update the slug
  await slugInput.clear();
  await slugInput.fill(newSlug);

  // 6. Click the save button
  await page.getByRole("button", { name: /enregistrer/i }).click();

  // 7. Confirm the slug change in the dialog
  await page
    .getByRole("button", { name: /oui, modifier l'identifiant/i })
    .click();

  // 8. Wait for navigation to the new URL
  await page.waitForURL(new RegExp(`/space/${newSlug}/settings/danger`), {
    timeout: 15000,
  });

  // 9. Verify the URL has been updated
  expect(page.url()).toContain(`/space/${newSlug}/`);

  // 10. Verify the space was updated in the database
  const updatedSpace = await prisma.organization.findFirst({
    where: {
      id: originalSpace.id,
    },
  });

  expect(updatedSpace?.slug).toBe(newSlug);
});
