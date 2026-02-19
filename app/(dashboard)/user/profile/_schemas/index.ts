import { z } from "zod";

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "New password must be at least 8 characters"),

    cNewPassword: z
      .string()
      .min(1, "Confirm password is required")
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .superRefine(({ oldPassword, newPassword, cNewPassword }, ctx) => {
    if (newPassword !== cNewPassword) {
      ctx.addIssue({
        path: ["cNewPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }

    if (oldPassword === newPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        message: "New password must be different from current password",
        code: "custom",
      });
    }
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
