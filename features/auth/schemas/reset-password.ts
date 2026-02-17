import z from "zod";

export const resetPasswordSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
