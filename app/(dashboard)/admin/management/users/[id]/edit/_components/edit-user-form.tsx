"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { fetcher } from "@/lib/api";
import { editUserSchema, EditUserSchema } from "@/schemas/users";

import { TimestampCard } from "@/components/timestamp-card";
import { UserInfo } from "./user-info";
import { PermissionsCard } from "./permission-card";
import { Button } from "@/components/ui/button";

type EditUserFormProps = {
  id: string;
};

export function EditUserForm({ id }: EditUserFormProps) {
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
      databaseEnabled: false,
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                             Sync API → Form State                         */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!data) return;

    const dbState = Number(data.database ?? 0);

    form.reset(
      {
        maxContainers: Number(data.containers?.max ?? 0),
        databaseEnabled: dbState === 1 || dbState === 2,
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
        toast.error(result?.error?.message ?? result?.message);
        return;
      }

      toast.success("User settings updated successfully.");
      router.push("/admin/management/users");
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !data) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Edit User</h1>
        <p className="text-sm text-muted-foreground">
          Manage access limits and permissions for this account.
        </p>
      </div>

      <UserInfo data={data} />

      <form
        id="edit-user"
        onSubmit={form.handleSubmit(handleUpdate)}
        className="space-y-6"
      >
        <PermissionsCard
          form={form}
          isSubmitting={isSubmitting}
          currentDatabaseState={data.database}
        />

        <TimestampCard
          createdAt={data.created_at}
          updatedAt={data.updated_at}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" form="edit-user" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
