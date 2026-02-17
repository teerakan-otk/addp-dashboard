"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { editUserSchema, EditUserSchema } from "../schemas/edit-user";
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
import { Container } from "./container";
import { UserInfo } from "./user-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ViewUser({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading } = useSWR(`/api/v2/users/${id}`, fetcher, {
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
    if (!data?.data) return;

    reset(
      {
        maxContainers: Number(data.containers?.total ?? 0),
        database: data.database || "not connected",
      },
      { keepDirtyValues: true },
    );
  }, [data, reset]);

  if (isLoading) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">View User</h1>
        <p className="text-sm text-muted-foreground">
          View account limits and permissions.
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
            <Container containers={data?.containers} />
          </CardContent>
        </Card>
      </div>

      {/* Permissions Card */}
      <form id="form-rhf-view-user" className="space-y-6">
        <div className="rounded-xl border bg-card p-6 space-y-6">
          <h3 className="text-lg font-medium">Permissions & Limits</h3>

          <Field>
            <FieldLabel>Max Containers</FieldLabel>
            <Input value={data.containers?.total} readOnly />
            <FieldDescription>
              Maximum container instances this user can create.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Database Access</FieldLabel>
            <Input value={data.database} readOnly />
            <FieldDescription>
              Allow external database tunneling.
            </FieldDescription>
          </Field>
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
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/management/users")}
          >
            Go Back
          </Button>
        </div>
      </form>
    </div>
  );
}
