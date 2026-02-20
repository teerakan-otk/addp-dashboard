"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { fetcher } from "@/lib/utils";
import { editUserSchema, EditUserSchema } from "@/lib/schemas/users";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ContainerCard } from "../../_components/container-card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Shield } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type EditUserFormProps = {
  id: string;
};

type ApiUserResponse = {
  id: string;
  created_at: string;
  updated_at: string;
  containers?: {
    used: number;
    total: number;
  };
  database?: {
    connected: boolean;
  };
  role: string;
  username: string;
  email: string;
};

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

export function EditUserForm({ id }: EditUserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useSWR<ApiUserResponse>(
    `/api/users/${id}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  const form = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      maxContainers: 0,
      database: false,
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                             Sync API → Form State                         */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!data) return;

    form.reset(
      {
        maxContainers: Number(data.containers?.total ?? 0),
        database: Boolean(data.database?.connected ?? false),
      },
      { keepDirtyValues: true },
    );
  }, [data, form]);

  /* -------------------------------------------------------------------------- */
  /*                              Submit Handler                               */
  /* -------------------------------------------------------------------------- */

  async function handleUpdate(values: EditUserSchema) {
    try {
      setIsSubmitting(true);

      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.message ?? "Failed to update user.");
        return;
      }

      toast.success("User settings updated successfully.");
      router.push("/admin/management/users");
    } catch (error) {
      toast.error("Internal server error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !data) return null;

  /* -------------------------------------------------------------------------- */
  /*                                  Render                                    */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      <PageHeader />

      <TopOverviewSection data={data} />

      <form
        id="form-rhf-edit-user"
        onSubmit={form.handleSubmit(handleUpdate)}
        className="space-y-6"
      >
        <PermissionsCard form={form} isSubmitting={isSubmitting} />

        <TimestampCard
          createdAt={data.created_at}
          updatedAt={data.updated_at}
        />

        <FormFooter
          isSubmitting={isSubmitting}
          onCancel={() => router.push("/admin/management/users")}
        />
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Sub Components                                */
/* -------------------------------------------------------------------------- */

function PageHeader() {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-semibold">Edit User</h1>
      <p className="text-sm text-muted-foreground">
        Manage access limits and permissions for this account.
      </p>
    </div>
  );
}

function TopOverviewSection({ data }: { data: ApiUserResponse }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>User Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <UserInfo data={data} />
        </CardContent>
      </Card>

      <ContainerCard data={data.containers} />
    </div>
  );
}

function UserInfo({ data }: { data: ApiUserResponse }) {
  const formattedRole =
    data.role?.charAt(0).toUpperCase() + data.role?.slice(1).toLowerCase();

  return (
    <div className="flex flex-1 items-start">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm">ID: {data.id}</p>

          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {formattedRole}
          </Badge>
        </div>

        <p className="text-sm">Username: {data.username}</p>
        <p className="text-sm">Email: {data.email}</p>
      </div>
    </div>
  );
}

function PermissionsCard({
  form,
  isSubmitting,
}: {
  form: ReturnType<typeof useForm<EditUserSchema>>;
  isSubmitting: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions & Limits</CardTitle>
      </CardHeader>

      <CardContent>
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
                  min={0}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
      </CardContent>
    </Card>
  );
}

function TimestampCard({
  createdAt,
  updatedAt,
}: {
  createdAt: string;
  updatedAt: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <h4 className="font-medium text-foreground">Timestamp</h4>
        <p>Created at: {createdAt}</p>
        <p>Last updated: {updatedAt}</p>
      </CardContent>
    </Card>
  );
}

function FormFooter({
  isSubmitting,
  onCancel,
}: {
  isSubmitting: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update Changes"}
      </Button>
    </div>
  );
}
