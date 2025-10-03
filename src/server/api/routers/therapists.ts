import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const therapistRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        cities: z.array(z.string()).optional(),
        genders: z.array(z.string()).optional(),
        experienceRanges: z.array(z.string()).optional(),
        feeRanges: z.array(z.string()).optional(),
        modes: z.array(z.string()).optional(),
        limit: z.number().min(1).max(100).default(12),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const {
        search,
        cities,
        genders,
        experienceRanges,
        feeRanges,
        modes,
        limit,
        cursor,
      } = input;

      // Build where conditions
      const whereConditions: any = {};

      // Search across multiple fields
      if (search) {
        whereConditions.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { expertise: { contains: search, mode: "insensitive" } },
          { education: { contains: search, mode: "insensitive" } },
          { about: { contains: search, mode: "insensitive" } },
        ];
      }

      // City filter
      if (cities && cities.length > 0) {
        if (cities.includes("Other")) {
          // For "Other", include cities not in the main list
          const mainCities = ["Karachi", "Lahore", "Islamabad"];
          whereConditions.NOT = {
            city: { in: mainCities },
          };
        } else {
          whereConditions.city = { in: cities };
        }
      }

      // Gender filter
      if (genders && genders.length > 0) {
        whereConditions.gender = { in: genders };
      }

      // Experience range filter
      if (experienceRanges && experienceRanges.length > 0) {
        const experienceConditions = experienceRanges.map((range) => {
          switch (range) {
            case "0-5":
              return { experience_years: { gte: 0, lt: 5 } };
            case "5-10":
              return { experience_years: { gte: 5, lt: 10 } };
            case "10-15":
              return { experience_years: { gte: 10, lt: 15 } };
            case "15+":
              return { experience_years: { gte: 15 } };
            default:
              return {};
          }
        });
        whereConditions.OR = [
          ...(whereConditions.OR || []),
          ...experienceConditions,
        ];
      }

      // Fee range filter
      if (feeRanges && feeRanges.length > 0) {
        const feeConditions = feeRanges.map((range) => {
          switch (range) {
            case "<2000":
              return { fee_amount: { lt: 2000 } };
            case "2000-4000":
              return { fee_amount: { gte: 2000, lt: 4000 } };
            case "4000-6000":
              return { fee_amount: { gte: 4000, lt: 6000 } };
            case ">6000":
              return { fee_amount: { gte: 6000 } };
            default:
              return {};
          }
        });
        whereConditions.OR = [...(whereConditions.OR || []), ...feeConditions];
      }

      // Consultation mode filter
      if (modes && modes.length > 0) {
        const modeConditions = modes.map((mode) => ({
          modes: { contains: mode, mode: "insensitive" },
        }));
        whereConditions.OR = [...(whereConditions.OR || []), ...modeConditions];
      }

      const therapists = await ctx.db.therapist.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereConditions,
        orderBy: { name: "asc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (therapists.length > limit) {
        const nextItem = therapists.pop();
        nextCursor = nextItem!.id;
      }

      return {
        therapists,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.therapist.findUnique({
        where: { id: input.id },
      });
    }),

  getFilterOptions: publicProcedure.query(async ({ ctx }) => {
    const [cities, genders, modes] = await Promise.all([
      ctx.db.therapist.groupBy({
        by: ["city"],
        _count: {
          city: true,
        },
      }),
      ctx.db.therapist.groupBy({
        by: ["gender"],
        _count: {
          gender: true,
        },
      }),
      ctx.db.therapist.findMany({
        select: { modes: true },
      }),
    ]);

    // Extract unique consultation modes
    const allModes = new Set<string>();
    modes.forEach((therapist) => {
      if (therapist.modes) {
        therapist.modes.split(";").forEach((mode) => {
          const cleanMode = mode.trim();
          if (cleanMode) allModes.add(cleanMode);
        });
      }
    });

    return {
      cities: cities.map((c) => ({
        name: c.city,
        count: c._count.city,
      })),
      genders: genders.map((g) => ({
        name: g.gender,
        count: g._count.gender,
      })),
      modes: Array.from(allModes),
    };
  }),
});
