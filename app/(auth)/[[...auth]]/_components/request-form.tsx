"use client";

import React from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { resetPasswordSchema, ResetPasswordSchema } from "@/schemas/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RequestForm() {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(values: ResetPasswordSchema) {
    try {
      const res = await fetch("/api/password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Something went wrong. Please try again.");
      }

      // Always show generic success message
      toast.success(
        "If the account exists, a verification code has been sent.",
      );

      router.push("/password/verify");
    } catch {
      toast.error("Unable to process request. Please try again later.");
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>

        <CardTitle className="text-2xl">Forgot your password?</CardTitle>

        <CardDescription>
          Enter your username and we’ll send you a verification code.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  disabled={isSubmitting}
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Spinner /> : "Send verification code"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <FieldDescription className="text-sm">
          <Link href="/login" className="hover:underline text-muted-foreground">
            Back to sign in
          </Link>
        </FieldDescription>
      </CardFooter>
    </Card>
  );
}
