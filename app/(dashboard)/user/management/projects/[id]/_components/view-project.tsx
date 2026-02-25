"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/api";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function ViewProject({ id }: { id: string }) {
  const router = useRouter();

  const { data, isLoading } = useSWR(`/api/containers/${id}`, fetcher);
  if (isLoading) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">View Project</h1>
        <p className="text-sm text-muted-foreground">
          View container settings.
        </p>
      </div>

      <Separator />

      {/* Content */}
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Project Details</FieldLegend>
          <FieldDescription>
            Basic information about your project.
          </FieldDescription>
          <FieldGroup className="grid md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>Owner</FieldLabel>
              <Input value={data.data?.owner ?? ""} readOnly />
            </Field>

            <Field>
              <FieldLabel>Container Name</FieldLabel>
              <Input value={data.data?.containerName ?? ""} readOnly />
            </Field>

            <Field>
              <FieldLabel>Project Type</FieldLabel>
              <Input value={data.data?.projectType ?? ""} readOnly />
            </Field>

            <Field>
              <FieldLabel>Publish</FieldLabel>
              <Input value={data.data?.publish ?? ""} readOnly />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        {/* ================= Deployment Settings ================= */}
        <FieldSet>
          <FieldLegend>Deployment Settings</FieldLegend>
          <FieldDescription>
            Configure networking and domain access.
          </FieldDescription>
          <FieldGroup className="grid md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>Port Mapping</FieldLabel>
              <Input value={data.data?.port ?? 0} readOnly />
              <FieldDescription>
                Internal container port to expose.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Domain</FieldLabel>
              <Input value={data.data?.domain ?? ""} readOnly />
              <FieldDescription>
                Your project will be accessible at this URL.
              </FieldDescription>
            </Field>

            {/* ================= File Upload ================= */}
            <Field>
              <FieldLabel>Project Path</FieldLabel>
              <Input value={data.data?.projectPath ?? ""} readOnly />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <Field>
          <FieldLabel>Metadata</FieldLabel>
          <FieldContent className="text-sm">
            <p>Created at: {data.data?.createdAt}</p>
            <p>Last updated: {data.data?.updatedAt}</p>
          </FieldContent>
        </Field>

        <FieldSeparator />

        <Field
          orientation="horizontal"
          className="flex items-center justify-end"
        >
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Go Back
          </Button>
        </Field>
      </FieldGroup>
    </div>
  );
}
