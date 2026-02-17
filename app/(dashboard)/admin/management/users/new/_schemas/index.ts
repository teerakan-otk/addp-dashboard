import { z } from "zod";

export const addUserSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.email(),
    password: z.string().min(8, "Must be at least 8 characters long."),
    cPassword: z.string().min(8, "Must be at least 8 characters long."),
    role: z.string().refine((val) => val !== "", {
      message: "Role is required",
    }),
    maxContainers: z
      .number()
      .min(0, "Number of max container(s) must be at least 1"),
    database: z.boolean(),
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
