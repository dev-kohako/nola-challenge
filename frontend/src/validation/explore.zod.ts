import z from "zod";

export const ExploreSchema = z.object({
  dimensions: z.array(z.string()).min(1, "Selecione ao menos uma dimensão."),
  measures: z
    .array(
      z.object({
        fn: z.enum(["sum", "avg", "count", "count_distinct", "min", "max"]),
        field: z.string().min(1),
        alias: z.string().optional(),
      })
    )
    .min(1, "Selecione ao menos uma métrica."),
  dateRange: z
    .object({
      from: z.string().nullable().optional(),
      to: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  filters: z
    .array(
      z.object({
        field: z.string(),
        op: z.string(),
        value: z.union([z.string(), z.number(), z.boolean()]).nullable(),
      })
    )
    .default([]),
  limit: z.number().min(1).max(1000).optional(),
});

export type ExploreSchemaType = z.infer<typeof ExploreSchema>;
