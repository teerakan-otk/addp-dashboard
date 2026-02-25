import { z } from "zod";

export const editUserSchema = z.object({
  maxContainers: z.number().min(0),
  databaseEnabled: z.boolean(),
});

export type EditUserSchema = z.infer<typeof editUserSchema>;

export const addUserSchema = z
  .object({
    username: z.string().min(1, "Username is required").trim(),

    email: z.string().email("Invalid email address"),

    password: z.string().min(8, "Must be at least 8 characters long."),

    cPassword: z.string().min(8, "Must be at least 8 characters long."),

    role: z.string(),

    maxContainers: z.coerce
      .number()
      .int()
      .min(0, "Max containers must be 0 or greater"),

    // For CREATE: only allow final states
    database: z.coerce
      .number()
      .int()
      .refine((val) => [0, 2].includes(val), {
        message: "Invalid database state",
      }),
  })
  .superRefine(({ password, cPassword }, ctx) => {
    if (password !== cPassword) {
      ctx.addIssue({
        path: ["cPassword"],
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type AddUserSchema = z.infer<typeof addUserSchema>;
