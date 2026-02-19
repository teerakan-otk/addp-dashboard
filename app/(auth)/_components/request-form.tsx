"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { resetPasswordSchema, ResetPasswordSchema } from "../_schemas";
import { toast } from "sonner";

export function RequestForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      username: "",
    },
  });

  async function handleSubmit(values: ResetPasswordSchema) {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.error?.message);
      }

      toast.success("Send OTP successful");

      setTimeout(() => {
        router.push("/password/verify");
      }, 1500);
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
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Forgot your password?</CardTitle>
        <CardDescription>
          If username is exists. We're send OTP to your email
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="forgot-password" onSubmit={form.handleSubmit(handleSubmit)}>
          <Controller
            name="username"
            control={form.control}
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
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="forgot-password"
          disabled={isSubmitting}
          className="w-full cursor-pointer"
        >
          {isSubmitting ? <Spinner /> : "Send reset code"}
        </Button>

        <FieldDescription className="flex items-center justify-center text-sm">
          <Link href="/login" className="hover:underline text-muted-foreground">
            Back to sign in
          </Link>
        </FieldDescription>
      </CardFooter>
    </Card>
  );
}
