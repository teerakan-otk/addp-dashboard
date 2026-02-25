"use client";

import { Controller, useForm } from "react-hook-form";
import { EditUserSchema } from "@/schemas/users";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  form: ReturnType<typeof useForm<EditUserSchema>>;
  isSubmitting: boolean;
};

const database = [
  {
    id: "0",
    title: "Disable",
  },
  {
    id: "1",
    title: "Pending",
  },
  {
    id: "2",
    title: "Active",
  },
];

export function PermissionsCard({ form, isSubmitting }: Props) {
  return (
    <Card>
      <CardContent>
        <FieldGroup>
          <Controller
            name="maxContainers"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend>Max Containers</FieldLegend>
                <FieldDescription>
                  Maximum container instances this user can create.
                </FieldDescription>
                <Field>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full max-w-[150px]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              </FieldSet>
            )}
          />

          <Controller
            name="database"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend>Database Access</FieldLegend>
                <FieldDescription>
                  Allow external database tunneling.
                </FieldDescription>
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  className="md:flex items-center gap-4"
                >
                  {database.map((item) => (
                    <FieldLabel
                      key={item.id}
                      htmlFor={`form-rhf-radiogroup-${item.id}`}
                      className="w-full max-w-sm"
                    >
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldTitle>{item.title}</FieldTitle>
                        </FieldContent>
                        <RadioGroupItem
                          value={item.id}
                          id={`form-rhf-radiogroup-${item.id}`}
                          aria-invalid={fieldState.invalid}
                        />
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
