"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { RectangleEllipsis } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { verifyOTPSchema, VerifyOTPSchema } from "../_schemas";
import { toast } from "sonner";

export function VerifyOTPForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm<VerifyOTPSchema>({
    resolver: zodResolver(verifyOTPSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  async function handleSubmit(values: VerifyOTPSchema) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (!response.ok) {
        return toast.error(result.error?.message);
      }

      toast.success("Verify OTP successful");

      router.push("/password/new");
    } catch {
      return toast.error("Internal server error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendOTP() {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/password/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (!response.ok) {
        return toast.error(result.error?.message);
      }

      toast.message("OTP resent successfully");
    } catch {
      return toast.error("Internal server error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <RectangleEllipsis className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to your email.</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="otp" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="otp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="sr-only">
                    Verification code
                  </FieldLabel>

                  <div className="flex flex-col items-center gap-4">
                    <InputOTP
                      id={field.name}
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      pattern={REGEXP_ONLY_DIGITS}
                      disabled={isSubmitting}
                      autoFocus
                    >
                      <InputOTPGroup className="gap-2.5 *:rounded-md *:border">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            aria-invalid={fieldState.invalid}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field>
          <Button
            form="otp"
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : "Verify"}
          </Button>

          <FieldDescription className="text-center">
            Didn't receive the code?{" "}
            <span
              className="text-md text-muted-foreground hover:text-primary underline underline-offset-4 hover:cursor-pointer"
              onClick={handleResendOTP}
            >
              Resend
            </span>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
}
