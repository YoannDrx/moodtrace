import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { createTestAccount } from "./utils/auth-test";

test("update space name", async ({ page }) => {
  // 1. Create a test account (owner)
  await createTestAccount({
    page,
    callbackURL: "/space",
  });

  // Wait for navigation to complete - we should be redirected to the space page
  await page.waitForURL(/\/space\/[^/]+$/);

  // Extract space slug from URL
  const currentUrl = page.url();
  const spaceSlug = currentUrl.split("/space/")[1].split("/")[0];

  // Store the original space data for verification
  const originalSpace = await prisma.organization.findFirst({
    where: {
      slug: spaceSlug,
    },
  });

  if (!originalSpace) {
    throw new Error("Space not found");
  }

  // 2. Navigate to space settings page
  await page.goto(`/space/${spaceSlug}/settings`, { waitUntil: "load" });
  // Wait for React hydration
  await page.waitForTimeout(500);

  // 4. Generate a new space name
  const newSpaceName = faker.company.name();

  // Find the input within that card and update it
  const nameInput = page.locator('input[name="name"]');

  // Verify the current value matches the original space name
  await expect(nameInput).toHaveValue(originalSpace.name);

  // Update the name
  await nameInput.clear();
  await nameInput.fill(newSpaceName);

  // 6. Click the save button
  await page
    .getByRole("button", { name: /enregistrer/i })
    .first()
    .click();

  // refresh
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(500);

  const nameInput2 = page.locator('input[name="name"]');

  await expect(nameInput2).toHaveValue(newSpaceName);

  const updatedSpace = await prisma.organization.findFirst({
    where: {
      slug: spaceSlug,
    },
  });

  expect(updatedSpace?.name).toBe(newSpaceName);
});
