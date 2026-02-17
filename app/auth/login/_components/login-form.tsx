"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ScanFace } from "lucide-react";
import { toast } from "sonner";
import { loginSchema, LoginSchema } from "../../_schemas";

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginSchema) {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.error?.message);
      }

      router.refresh();
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
          <ScanFace className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Sign in to your account</CardTitle>
      </CardHeader>

      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel aria-invalid={fieldState.invalid}>
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center">
                    <FieldLabel>Password</FieldLabel>
                    <Link
                      href="/auth/password/request"
                      className="ml-auto text-sm text-primary hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    {...field}
                    type="password"
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field className="w-full">
          <Button
            type="submit"
            form="login-form"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : "Log in"}
          </Button>

          <FieldDescription className="text-center">
            Don’t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline"
            >
              Create one
            </Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
}
