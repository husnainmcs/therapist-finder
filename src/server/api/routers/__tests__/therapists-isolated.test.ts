import { describe, it, expect } from "vitest";

// Test the filtering logic directly without tRPC/Next.js dependencies
describe("Therapist Filtering Logic", () => {
  describe("Experience Range Filtering", () => {
    const experienceRanges = [
      { value: "0-5", min: 0, max: 5 },
      { value: "5-10", min: 5, max: 10 },
      { value: "10-15", min: 10, max: 15 },
      { value: "15+", min: 15, max: Infinity },
    ];

    it("should correctly identify experience ranges", () => {
      const testCases = [
        { experience: 3, expectedRange: "0-5" },
        { experience: 5, expectedRange: "5-10" },
        { experience: 8, expectedRange: "5-10" },
        { experience: 12, expectedRange: "10-15" },
        { experience: 20, expectedRange: "15+" },
      ];

      testCases.forEach(({ experience, expectedRange }) => {
        const matchingRange = experienceRanges.find(
          (range) => experience >= range.min && experience < range.max,
        );
        expect(matchingRange?.value).toBe(expectedRange);
      });
    });
  });

  describe("Fee Range Filtering", () => {
    const feeRanges = [
      { value: "<2000", condition: (fee: number) => fee < 2000 },
      {
        value: "2000-4000",
        condition: (fee: number) => fee >= 2000 && fee < 4000,
      },
      {
        value: "4000-6000",
        condition: (fee: number) => fee >= 4000 && fee < 6000,
      },
      { value: ">6000", condition: (fee: number) => fee >= 6000 },
    ];

    it("should correctly identify fee ranges", () => {
      const testCases = [
        { fee: 1500, expectedRange: "<2000" },
        { fee: 2000, expectedRange: "2000-4000" },
        { fee: 3500, expectedRange: "2000-4000" },
        { fee: 4500, expectedRange: "4000-6000" },
        { fee: 7000, expectedRange: ">6000" },
      ];

      testCases.forEach(({ fee, expectedRange }) => {
        const matchingRange = feeRanges.find((range) => range.condition(fee));
        expect(matchingRange?.value).toBe(expectedRange);
      });
    });
  });

  describe("City Filtering Logic", () => {
    const mainCities = ["Karachi", "Lahore", "Islamabad"];

    it('should identify "Other" cities correctly', () => {
      const testCities = [
        { city: "Karachi", isOther: false },
        { city: "Lahore", isOther: false },
        { city: "Islamabad", isOther: false },
        { city: "Rawalpindi", isOther: true },
        { city: "Peshawar", isOther: true },
        { city: "Quetta", isOther: true },
      ];

      testCities.forEach(({ city, isOther }) => {
        const isMainCity = mainCities.includes(city);
        expect(!isMainCity).toBe(isOther);
      });
    });
  });

  describe("Search Logic", () => {
    const searchInFields = (searchTerm: string, therapist: any) => {
      const fieldsToSearch = [
        therapist.name,
        therapist.expertise,
        therapist.education,
        therapist.about,
      ];

      return fieldsToSearch.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    };

    it("should search across multiple fields", () => {
      const therapist = {
        name: "Dr. Sarah Ahmed",
        expertise: "Anxiety Disorders; Depression",
        education: "PhD Clinical Psychology",
        about: "Experienced in anxiety treatment",
      };

      expect(searchInFields("anxiety", therapist)).toBe(true);
      expect(searchInFields("depression", therapist)).toBe(true);
      expect(searchInFields("clinical", therapist)).toBe(true);
      expect(searchInFields("nonexistent", therapist)).toBe(false);
    });
  });
});
