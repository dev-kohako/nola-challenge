import { z } from "zod";

export const PeriodSchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  prevDateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  prevDateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const DashboardFiltersSchema = z.object({
  channel: z.string().optional(),
  dow: z.number().min(0).max(6).optional(),
  hourFrom: z.number().min(0).max(23).optional(),
  hourTo: z.number().min(0).max(23).optional(),
  period: PeriodSchema,
});

export type DashboardFilters = z.infer<typeof DashboardFiltersSchema>;
