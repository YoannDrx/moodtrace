import { prisma } from "@/lib/prisma";
import { expect, test } from "@playwright/test";
import { createTestAccount } from "./utils/auth-test";

test("sign up and verify account creation", async ({ page }) => {
  const userData = await createTestAccount({
    page,
    callbackURL: "/space",
  });

  await page.waitForURL(/\/space\/.*/);

  // Verify we're on a space page
  const currentUrl = page.url();
  expect(currentUrl).toMatch(/\/space\/.*/);

  // Extract space slug from URL
  const spaceSlug = currentUrl.split("/space/")[1].split("/")[0];

  // Verify the user was created in the database
  const user = await prisma.user.findUnique({
    where: { email: userData.email },
    include: {
      members: {
        include: {
          organization: true,
        },
      },
    },
  });

  // Verify user exists
  expect(user).not.toBeNull();
  expect(user?.name).toBe(userData.name);
  expect(user?.email).toBe(userData.email);
  expect(user?.emailVerified).toBe(false); // Email should not be verified yet

  // Verify user is part of an organization
  expect(user?.members.length).toBeGreaterThan(0);

  // Verify the space slug matches the one in the URL
  const userSpace = user?.members[0].organization;
  expect(userSpace?.slug).toBe(spaceSlug);

  // Clean up - delete the test user and organization
  // This is optional but helps keep the test database clean
  if (user) {
    // Delete the user (cascade should handle related records)
    await prisma.user.delete({
      where: { id: user.id },
    });
  }
});
