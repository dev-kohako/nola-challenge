import { z } from "zod";

export const SaveDashboardInput = z.object({
  name: z.string().min(1, "Nome obrigatório").max(100),
  config: z.any(),
});

export type SaveDashboardInputType = z.infer<typeof SaveDashboardInput>;
