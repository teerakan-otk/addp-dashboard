import z from "zod";
import { confirmPasswordSchema, passwordSchema } from "./password";

export const registerSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.email("Invalid email address"),
    password: passwordSchema,
    cPassword: confirmPasswordSchema,
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

export type RegisterSchema = z.infer<typeof registerSchema>;
