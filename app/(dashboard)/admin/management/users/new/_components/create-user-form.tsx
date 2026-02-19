"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { AddUserSchema, addUserSchema } from "@/lib/schemas/users";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export function CreateUserForm() {
  const form = useForm<AddUserSchema>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      cPassword: "",
      role: "",
      maxContainers: 5,
      database: false,
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  async function handleCreate(values: AddUserSchema) {
    setIsLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          email: values.email,
          role: values.role,
          database: values.database,
          max_containers: values.maxContainers,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return toast.error(data?.message);
      }

      toast.success("Create user successful");

      return router.push("/admin/management/users");
    } catch {
      return toast.error("Internal server error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Create New User</h1>
        <p className="text-sm text-muted-foreground">
          Add a new account and configure permissions.
        </p>
      </div>
      <Separator />
      <form id="form-rhf-add-user" onSubmit={form.handleSubmit(handleCreate)}>
        <FieldGroup>
          {/* ================= Account Info ================= */}
          <FieldSet>
            <FieldLegend>Account Information</FieldLegend>
            <FieldDescription>Basic user identity details.</FieldDescription>
            <FieldGroup className="grid md:grid-cols-2 gap-6">
              {/* Username */}
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Username
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="john_doe"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Email
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="john@example.com"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Password
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="cPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter confirm password"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          {/* ================= Access Control ================= */}
          <FieldSet>
            <FieldLegend>Access Control</FieldLegend>
            <FieldDescription>Define user permissions.</FieldDescription>
            <FieldGroup className="grid md:grid-cols-2 gap-6">
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Role
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="user">Standard User</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Max Containers */}
              <Controller
                name="maxContainers"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      Max Containers
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      type="number"
                      placeholder="5"
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Database Toggle */}
              <Controller
                name="database"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Database Access
                    </FieldLabel>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                      <FieldDescription>
                        Allow user to create and manage databases.
                      </FieldDescription>
                    </div>
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <Field
            orientation="horizontal"
            className="flex items-center justify-end *:cursor-pointer"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/management/users")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Create User
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
