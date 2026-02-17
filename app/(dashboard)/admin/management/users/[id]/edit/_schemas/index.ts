import { z } from "zod";

export const editUserSchema = z.object({
  maxContainers: z.number(),
  database: z.boolean(),
});

export type EditUserSchema = z.infer<typeof editUserSchema>;
