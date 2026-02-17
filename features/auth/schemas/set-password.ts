import z from "zod";
import { confirmPasswordSchema, passwordSchema } from "./password";

export const setPasswordSchema = z
  .object({
    password: passwordSchema,
    cPassword: confirmPasswordSchema,
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

export type SetPasswordSchema = z.infer<typeof setPasswordSchema>;
