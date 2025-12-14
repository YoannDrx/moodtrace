import { prisma } from "@/lib/prisma";
import { expect, test } from "@playwright/test";
import { createTestAccount, getUserEmail } from "./utils/auth-test";

test("invite caregiver as pro user", async ({ page }) => {
  // 1. Create a test account (owner/patient)
  await createTestAccount({
    page,
    callbackURL: "/space",
  });

  // Wait for navigation to complete - we should be redirected to the space page
  await page.waitForURL(/\/space\/.*/, { timeout: 30000 });

  // Extract space slug from URL
  const currentUrl = page.url();
  const spaceSlug = currentUrl.split("/space/")[1].split("/")[0];

  // Upgrade the organization to Pro plan to enable caregiver invites
  const organization = await prisma.organization.findFirst({
    where: { slug: spaceSlug },
  });
  if (organization) {
    // Create or update subscription to Pro plan with fake Stripe ID
    // Note: stripeSubscriptionId is required for getOrgActiveSubscription to return the plan
    const subId = `sub_test_${Date.now()}`;
    await prisma.subscription.upsert({
      where: { referenceId: organization.id },
      update: {
        plan: "pro",
        status: "active",
        stripeSubscriptionId: subId,
      },
      create: {
        id: subId,
        plan: "pro",
        status: "active",
        referenceId: organization.id,
        seats: 2,
        stripeSubscriptionId: subId,
      },
    });
  }

  // 3. Navigate to the Caregivers settings tab
  // Force a fresh page load to get the updated subscription data
  await page.goto(`/space/${spaceSlug}/settings/caregivers`, {
    waitUntil: "load",
  });
  // Reload to ensure subscription data is fetched fresh
  await page.reload({ waitUntil: "load" });
  // Wait a bit for the React hydration
  await page.waitForTimeout(1000);

  // 4. Verify the current user is listed as patient (owner)
  await expect(page.getByText("Patient")).toBeVisible();

  // 5. Open invite caregiver dialog (button should be visible now that we're on Pro plan)
  const inviteButton = page.getByRole("button", { name: /inviter un proche/i });
  await expect(inviteButton).toBeVisible({ timeout: 15000 });
  await inviteButton.click();

  // Wait for dialog to be visible
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 });

  // 6. Fill out the invite form
  const caregiverEmail = getUserEmail();
  const emailInput = page.getByLabel(/email de votre proche/i);
  await expect(emailInput).toBeVisible({ timeout: 5000 });
  await emailInput.fill(caregiverEmail);

  // Send invitation (role is automatically "member" for caregivers)
  await page.getByRole("button", { name: /envoyer l'invitation/i }).click();

  // Wait for the success toast
  await expect(page.getByText(/invitation envoyée/i)).toBeVisible({
    timeout: 10000,
  });

  // Wait for the dialog to close after success
  await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5000 });

  // Reload the page to ensure fresh data (router.refresh might not invalidate server cache)
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(500);

  // Click on the invitations tab to view pending invitations
  await page.getByRole("tab", { name: /invitations/i }).click();

  // 7. Verify the invitation appears in the list with "En attente" status
  await expect(page.getByText(caregiverEmail)).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/en attente/i)).toBeVisible();

  // Verify the invitation was created in database
  const invitation = await prisma.invitation.findFirst({
    where: {
      email: caregiverEmail,
      organizationId: organization?.id,
    },
  });
  expect(invitation).not.toBeNull();
  expect(invitation?.status).toBe("pending");
});
