"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { editUserSchema, EditUserSchema } from "@/lib/schemas/users";
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
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserInfo } from "../../_components/user-info";
import { ContainerCard } from "../../_components/container-card";

export function EditUserForm({ id }: { id: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useSWR(`/api/users/${id}`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const form = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      maxContainers: 0,
      database: false,
    },
  });

  const { reset } = form;
  useEffect(() => {
    if (!data) return;

    reset(
      {
        maxContainers: Number(data.containers?.total ?? 0),
        database: Boolean(data.database?.connected ?? false),
      },
      { keepDirtyValues: true },
    );
  }, [data, reset]);

  if (isLoading) return null;

  async function handleUpdate(values: EditUserSchema) {
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const user = await res.json();
      if (!res.ok) return toast.error(user.message);

      toast.success("Update user setting success");
      router.push("/admin/management/users");
    } catch {
      return toast.error("Internal server error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Edit User</h1>
        <p className="text-sm text-muted-foreground">
          Manage access limits and permissions for this account.
        </p>
      </div>

      {/* Top Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <UserInfo data={data} />
          </CardContent>
        </Card>

        {/* Containers Card */}
        <Card>
          <CardHeader>
            <CardTitle>Container Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ContainerCard data={data?.containers} />
          </CardContent>
        </Card>
      </div>

      {/* Permissions Card */}
      <form
        id="form-rhf-edit-user"
        onSubmit={form.handleSubmit(handleUpdate)}
        className="space-y-6"
      >
        <div className="rounded-xl border bg-card p-6 space-y-6">
          <h3 className="text-lg font-medium">Permissions & Limits</h3>

          <FieldGroup>
            <Controller
              name="maxContainers"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Max Containers</FieldLabel>
                  <Input
                    type="number"
                    id={field.name}
                    className="max-w-40"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    min={0}
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                  <FieldDescription>
                    Maximum container instances this user can create.
                  </FieldDescription>
                </Field>
              )}
            />

            <Controller
              name="database"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Database Access</FieldLabel>
                  <Switch
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                  <FieldDescription>
                    Allow external database tunneling.
                  </FieldDescription>
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        {/* Timestamp */}
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            <h4 className="font-medium text-foreground mb-2">Timestamp</h4>
            <p>Created at: {data.created_at}</p>
            <p>Last updated: {data.updated_at}</p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-end gap-3 *:cursor-pointer">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/management/users")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            Update Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
