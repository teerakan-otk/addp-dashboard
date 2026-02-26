"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";

import { AddUserSchema, addUserSchema } from "@/schemas/users";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TextField } from "./text-field";

const DATABASE_OPTIONS = [
  { value: 0, label: "Disconnected" },
  { value: 2, label: "Connected" },
];

export function CreateUserForm() {
  const router = useRouter();

  const form = useForm<AddUserSchema>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      cPassword: "",
      role: "",
      maxContainers: 5,
      database: 0, // aligned with backend state
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: AddUserSchema) {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          role: values.role,
          max_containers: values.maxContainers,
          database: values.database,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create user");
      }

      toast.success("User created successfully");
      router.push("/admin/management/users");
    } catch (err: any) {
      toast.error(err.message || "Internal server error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Create New User</h1>
        <p className="text-sm text-muted-foreground">
          Add a new account and configure permissions.
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          {/* ================= Account ================= */}
          <FieldSet>
            <FieldLegend>Account Information</FieldLegend>
            <FieldDescription>Basic user identity details.</FieldDescription>

            <FieldGroup className="grid md:grid-cols-2 gap-6">
              <TextField
                control={control}
                name="username"
                label="Username"
                required
                disabled={isSubmitting}
              />

              <TextField
                control={control}
                name="email"
                label="Email"
                required
                disabled={isSubmitting}
              />

              <TextField
                control={control}
                name="password"
                label="Password"
                type="password"
                required
                disabled={isSubmitting}
              />

              <TextField
                control={control}
                name="cPassword"
                label="Confirm Password"
                type="password"
                required
                disabled={isSubmitting}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          {/* ================= Access ================= */}
          <FieldSet>
            <FieldLegend>Access Control</FieldLegend>
            <FieldDescription>
              Define user permissions and limits.
            </FieldDescription>

            <FieldGroup className="grid md:grid-cols-2 gap-6">
              {/* Role */}
              <Controller
                name="role"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Role<span className="text-destructive">*</span>
                    </FieldLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
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
              <TextField
                control={control}
                name="maxContainers"
                label="Max Containers"
                type="number"
                required
                disabled={isSubmitting}
              />

              <Controller
                name="database"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Database Access</FieldLabel>

                    <Select
                      value={String(field.value)}
                      onValueChange={(val) => field.onChange(Number(val))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select database state" />
                      </SelectTrigger>

                      <SelectContent>
                        {DATABASE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={String(option.value)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              <Link href="/admin/management/users">Cancel</Link>
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
