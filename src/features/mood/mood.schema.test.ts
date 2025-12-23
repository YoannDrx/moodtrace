import { describe, it, expect } from "vitest";
import { MoodEntrySchema, ENERGY_LABELS, ANXIETY_LABELS } from "./mood.schema";

describe("MoodEntrySchema", () => {
  it("should validate a valid mood entry", () => {
    const validEntry = {
      date: "2024-01-15",
      mood: 2,
      energy: 7,
      sleepHours: 8,
      sleepQuality: "good",
      anxiety: 3,
      notes: "Good day",
      tags: ["sport", "social"],
      sideEffects: [],
    };

    const result = MoodEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it("should validate mood values from -3 to 3 (bipolar scale)", () => {
    const validMoodValues = [-3, -2, -1, 0, 1, 2, 3];

    validMoodValues.forEach((mood) => {
      const entry = {
        date: "2024-01-15",
        mood,
      };
      const result = MoodEntrySchema.safeParse(entry);
      expect(result.success).toBe(true);
    });
  });

  it("should reject mood values outside -3 to 3 range", () => {
    const invalidMoodValues = [-4, 4, 5, -5, 10, -10];

    invalidMoodValues.forEach((mood) => {
      const entry = {
        date: "2024-01-15",
        mood,
      };
      const result = MoodEntrySchema.safeParse(entry);
      expect(result.success).toBe(false);
    });
  });

  it("should reject invalid date format", () => {
    const entry = {
      date: "15-01-2024", // Wrong format
      mood: 0,
    };

    const result = MoodEntrySchema.safeParse(entry);
    expect(result.success).toBe(false);
  });

  it("should validate energy values from 1 to 10", () => {
    const validEntry = {
      date: "2024-01-15",
      mood: 0,
      energy: 5,
    };

    const result = MoodEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it("should reject energy values outside 1-10 range", () => {
    const entry = {
      date: "2024-01-15",
      mood: 0,
      energy: 15,
    };

    const result = MoodEntrySchema.safeParse(entry);
    expect(result.success).toBe(false);
  });

  it("should allow optional fields to be null", () => {
    const entry = {
      date: "2024-01-15",
      mood: 0,
      energy: null,
      sleepHours: null,
      sleepQuality: null,
      anxiety: null,
      notes: null,
    };

    const result = MoodEntrySchema.safeParse(entry);
    expect(result.success).toBe(true);
  });

  it("should validate sleep quality enum values", () => {
    const validQualities = ["bad", "average", "good"];

    validQualities.forEach((quality) => {
      const entry = {
        date: "2024-01-15",
        mood: 0,
        sleepQuality: quality,
      };
      const result = MoodEntrySchema.safeParse(entry);
      expect(result.success).toBe(true);
    });
  });
});

describe("Label constants", () => {
  it("should have energy labels for values 1-10", () => {
    expect(ENERGY_LABELS[1]).toBeDefined();
    expect(ENERGY_LABELS[5]).toBeDefined();
    expect(ENERGY_LABELS[10]).toBeDefined();
  });

  it("should have anxiety labels for values 1-10", () => {
    expect(ANXIETY_LABELS[1]).toBeDefined();
    expect(ANXIETY_LABELS[5]).toBeDefined();
    expect(ANXIETY_LABELS[10]).toBeDefined();
  });
});
