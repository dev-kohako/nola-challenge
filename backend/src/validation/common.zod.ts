import { z } from "zod";

export const zDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
export const zChannel = z.enum(["ifood","rappi","whatsapp","app","presencial"]);

export const zBetween = z.tuple([z.string(), z.string()]);
