import { describe, expect, it } from "vitest";
import {
  CAREGIVER_LINKS,
  getSpaceNavigation,
  PATIENT_LINKS,
} from "../app/space/[spaceSlug]/(navigation)/_navigation/space-navigation-links";
import type { AuthRole } from "../src/lib/auth/auth-permissions";

describe("getSpaceNavigation", () => {
  describe("Patient (owner) navigation", () => {
    it("should replace space slug in all URLs", () => {
      const slug = "test-space";
      const userRoles: AuthRole[] = ["owner"];
      const isPatient = true;

      const result = getSpaceNavigation(slug, userRoles, isPatient);

      // Check that all links have the slug replaced
      result.forEach((group) => {
        if (group.defaultOpenStartPath) {
          expect(group.defaultOpenStartPath).not.toContain(":spaceSlug");
          expect(group.defaultOpenStartPath).toContain(slug);
        }

        group.links.forEach((link) => {
          expect(link.href).not.toContain(":spaceSlug");
          expect(link.href).toContain(slug);
        });
      });
    });

    it("should show all patient links for owner role", () => {
      const slug = "test-space";
      const userRoles: AuthRole[] = ["owner"];
      const isPatient = true;

      const result = getSpaceNavigation(slug, userRoles, isPatient);

      // Owner can access all patient links
      const suiviGroup = result.find((g) => g.title === "Suivi");
      expect(suiviGroup?.links).toHaveLength(PATIENT_LINKS[0].links.length);

      // Owner can access all settings including Danger Zone
      const settingsGroup = result.find((g) => g.title === "Paramètres");
      const settingsLabels = settingsGroup?.links.map((l) => l.label);
      expect(settingsLabels).toContain("Mon profil");
      expect(settingsLabels).toContain("Mon espace");
      expect(settingsLabels).toContain("Mes proches");
      expect(settingsLabels).toContain("Facturation");
      expect(settingsLabels).toContain("Zone danger");
    });

    it("should filter settings for admin role (patient space)", () => {
      const slug = "test-space";
      const userRoles: AuthRole[] = ["admin"];
      const isPatient = true;

      const result = getSpaceNavigation(slug, userRoles, isPatient);

      // Admin can access patient links but not Danger Zone
      const settingsGroup = result.find((g) => g.title === "Paramètres");
      const settingsLabels = settingsGroup?.links.map((l) => l.label);
      expect(settingsLabels).toContain("Mon profil");
      expect(settingsLabels).toContain("Mon espace");
      expect(settingsLabels).toContain("Mes proches");
      expect(settingsLabels).toContain("Facturation");
      expect(settingsLabels).not.toContain("Zone danger");
    });

    it("should filter settings for member role (patient space)", () => {
      const slug = "test-space";
      const userRoles: AuthRole[] = ["member"];
      const isPatient = true;

      const result = getSpaceNavigation(slug, userRoles, isPatient);

      // Member can only see profile in settings
      const settingsGroup = result.find((g) => g.title === "Paramètres");
      const settingsLabels = settingsGroup?.links.map((l) => l.label);
      expect(settingsLabels).toContain("Mon profil");
      expect(settingsLabels).not.toContain("Mon espace");
      expect(settingsLabels).not.toContain("Mes proches");
      expect(settingsLabels).not.toContain("Facturation");
      expect(settingsLabels).not.toContain("Zone danger");
    });
  });

  describe("Caregiver (member) navigation", () => {
    it("should show caregiver-specific links", () => {
      const slug = "test-space";
      const userRoles: AuthRole[] = ["member"];
      const isPatient = false;

      const result = getSpaceNavigation(slug, userRoles, isPatient);

      // Caregiver sees different navigation
      const suiviGroup = result.find((g) => g.title === "Suivi");
      const suiviLabels = suiviGroup?.links.map((l) => l.label);

      expect(suiviLabels).toContain("Tableau de bord");
      expect(suiviLabels).toContain("Mes observations");
      expect(suiviLabels).toContain("Tendances");
      expect(suiviLabels).toContain("Export");
      expect(suiviLabels).toContain("Ressources de crise");

      // Caregiver does NOT see patient-specific links
      expect(suiviLabels).not.toContain("Humeur");
      expect(suiviLabels).not.toContain("Médicaments");
    });

    it("should only show profile in settings for caregiver", () => {
      const slug = "test-space";
      const userRoles: AuthRole[] = ["member"];
      const isPatient = false;

      const result = getSpaceNavigation(slug, userRoles, isPatient);

      // Caregiver only sees profile settings
      const settingsGroup = result.find((g) => g.title === "Paramètres");
      expect(settingsGroup?.links).toHaveLength(1);
      expect(settingsGroup?.links[0].label).toBe("Mon profil");
    });
  });

  describe("Edge cases", () => {
    it("should handle undefined user roles", () => {
      const slug = "test-space";
      const userRoles = undefined;
      const isPatient = true;

      const result = getSpaceNavigation(slug, userRoles, isPatient);

      // Should still show suivi links (no role restriction on main links)
      const suiviGroup = result.find((g) => g.title === "Suivi");
      expect(suiviGroup?.links).toHaveLength(PATIENT_LINKS[0].links.length);

      // Settings should only show profile (other links require admin/owner roles)
      const settingsGroup = result.find((g) => g.title === "Paramètres");
      expect(settingsGroup?.links).toHaveLength(1);
      expect(settingsGroup?.links[0].label).toBe("Mon profil");
    });

    it("should correctly replace slug in nested paths", () => {
      const slug = "my-health-space";
      const userRoles: AuthRole[] = ["owner"];
      const isPatient = true;

      const result = getSpaceNavigation(slug, userRoles, isPatient);

      // Check specific nested paths
      const settingsGroup = result.find((g) => g.title === "Paramètres");
      const caregiverLink = settingsGroup?.links.find(
        (l) => l.label === "Mes proches",
      );
      expect(caregiverLink?.href).toBe(
        "/space/my-health-space/settings/caregivers",
      );

      const billingLink = settingsGroup?.links.find(
        (l) => l.label === "Facturation",
      );
      expect(billingLink?.href).toBe("/space/my-health-space/settings/billing");
    });
  });
});

describe("Navigation link constants", () => {
  it("PATIENT_LINKS should have all required sections", () => {
    expect(PATIENT_LINKS).toHaveLength(2);
    expect(PATIENT_LINKS[0].title).toBe("Suivi");
    expect(PATIENT_LINKS[1].title).toBe("Paramètres");
  });

  it("CAREGIVER_LINKS should have observations link", () => {
    const suiviGroup = CAREGIVER_LINKS.find((g) => g.title === "Suivi");
    const observationsLink = suiviGroup?.links.find(
      (l) => l.label === "Mes observations",
    );
    expect(observationsLink).toBeDefined();
    expect(observationsLink?.href).toContain("/observations");
  });
});
