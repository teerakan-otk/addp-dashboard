import z from "zod";

/*
|--------------------------------------------------------------------------
| Shared schemas
|--------------------------------------------------------------------------
*/
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Must contain at least one number.")
  .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character.");

export const confirmPasswordSchema = z.string();

/*
|--------------------------------------------------------------------------
| Register schemas
|--------------------------------------------------------------------------
*/
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

/*
|--------------------------------------------------------------------------
| Login schemas
|--------------------------------------------------------------------------
*/
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

/*
|--------------------------------------------------------------------------
| ResetPassword schemas
|--------------------------------------------------------------------------
*/
export const resetPasswordSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

/*
|--------------------------------------------------------------------------
| VerifyOTP schemas
|--------------------------------------------------------------------------
*/
export const verifyOTPSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerifyOTPSchema = z.infer<typeof verifyOTPSchema>;

/*
|--------------------------------------------------------------------------
| SetPassword schemas
|--------------------------------------------------------------------------
*/
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
