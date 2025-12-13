import { getAllMedications } from "@/features/medication/medication.query";
import { orgRoute } from "@/lib/zod-route";

/**
 * GET /api/medications
 * Get all medications for the current user
 */
export const GET = orgRoute.handler(async (_req, { ctx }) => {
  const medications = await getAllMedications({
    userId: ctx.organization.user.id,
    organizationId: ctx.organization.id,
    includeInactive: true,
  });

  return medications;
});
