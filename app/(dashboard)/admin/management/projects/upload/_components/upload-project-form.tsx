"use client";

import { useRouter, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { UploadProjectSchema, uploadProjectSchema } from "../_schemas";
import { projectType } from "../_constants";

export function UploadProjectForm() {
  const router = useRouter();

  const form = useForm<UploadProjectSchema>({
    resolver: zodResolver(uploadProjectSchema),
    defaultValues: {
      containerName: "",
      projectType: "",
      domainName: "",
      port: 80,
      projectFile: undefined,
    },
  });

  async function handleUpload(values: UploadProjectSchema) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "projectFile") {
          formData.append("file", value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) return console.error(data);

      return toast.message(<pre>{JSON.stringify(data, null, 2)}</pre>);
    } catch (e) {
      return console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Create New Project</h1>
        <p className="text-sm text-muted-foreground">
          Configure container settings and deploy your application.
        </p>
      </div>

      <Separator />

      {/* Content */}
      <form id="create-project" onSubmit={form.handleSubmit(handleUpload)}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Project Details</FieldLegend>
            <FieldDescription>
              Basic information about your project.
            </FieldDescription>
            <FieldGroup className="grid md:grid-cols-2 gap-6">
              <Controller
                name="containerName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Container Name
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="example-container"
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    <FieldDescription>
                      Must be unique. Lowercase letters and hyphens only.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="projectType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Project Type
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {projectType.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={String(project.id)}
                            >
                              {project.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid ?? (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
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
              <Controller
                name="port"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Port Mapping <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      type="number"
                      placeholder="80"
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <FieldDescription>
                      Internal container port to expose.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="domainName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Subdomain <span className="text-destructive">*</span>
                    </FieldLabel>
                    <InputGroup id={field.name}>
                      <InputGroupInput
                        {...field}
                        placeholder="john-project"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      <InputGroupAddon align="inline-end">
                        .addp.site
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription>
                      Your project will be accessible at this URL.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          {/* ================= File Upload ================= */}
          <FieldSet>
            <FieldLegend>Project Files</FieldLegend>
            <FieldDescription>Upload your deployment package.</FieldDescription>
            <FieldGroup>
              <Controller
                name="projectFile"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Upload .zip File
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    <div className="relative">
                      <Input
                        id={field.name}
                        type="file"
                        accept=".zip"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                      />

                      <label
                        htmlFor={field.name}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center cursor-pointer transition",
                          fieldState.invalid
                            ? "border-destructive bg-destructive/5"
                            : "hover:bg-muted/40",
                        )}
                      >
                        <p className="text-sm font-medium">
                          {field.value instanceof File
                            ? field.value.name
                            : "Click to upload"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Only .zip files are supported
                        </p>
                      </label>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <Field
            orientation="horizontal"
            className="flex items-center justify-end"
          >
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" form="create-project">
              Deploy Project
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
