"use client";

import { Controller, useWatch } from "react-hook-form";
import { useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

type DatabaseStatus = 0 | 1 | 2 | 3;

type Props = {
  form: any;
  isSubmitting: boolean;
  currentDatabaseState: DatabaseStatus;
};

function getStatusLabel(status: DatabaseStatus) {
  switch (status) {
    case 0:
      return "Disconnected";
    case 1:
      return "Pending Activation";
    case 2:
      return "Connected";
    case 3:
      return "Pending Deactivation";
  }
}

function resolveDatabaseTransition(
  current: DatabaseStatus,
  enable: boolean,
): DatabaseStatus {
  if (enable) {
    if (current === 2) return 2;
    return 1;
  }

  if (current === 0) return 0;
  return 3;
}

export function PermissionsCard({
  form,
  isSubmitting,
  currentDatabaseState,
}: Props) {
  const enableAccess = useWatch({
    control: form.control,
    name: "databaseEnabled",
  }) as boolean;

  const nextState = useMemo(() => {
    if (enableAccess === undefined) return currentDatabaseState;
    return resolveDatabaseTransition(currentDatabaseState, enableAccess);
  }, [enableAccess, currentDatabaseState]);

  return (
    <Card>
      <CardContent>
        <FieldGroup>
          {/* Max Containers */}
          <Controller
            name="maxContainers"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend>Max Containers</FieldLegend>
                <FieldDescription>
                  Maximum number of container instances this user can create.
                </FieldDescription>

                <Field>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full max-w-40"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              </FieldSet>
            )}
          />

          {/* Database Access */}
          <Controller
            name="databaseEnabled"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend>Database Access</FieldLegend>
                <FieldDescription>
                  Enable or disable external database provisioning.
                </FieldDescription>

                {/* Current State */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Current Status:
                  </span>
                  <Badge variant="outline">
                    {getStatusLabel(currentDatabaseState)}
                  </Badge>
                </div>

                <RadioGroup
                  value={String(field.value)}
                  onValueChange={(val) => field.onChange(val === "true")}
                  className="grid gap-3 md:grid-cols-2"
                >
                  <FieldLabel>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>Enable</FieldTitle>
                        <p className="text-xs text-muted-foreground">
                          User should have active database access.
                        </p>
                      </FieldContent>
                      <RadioGroupItem value="true" disabled={isSubmitting} />
                    </Field>
                  </FieldLabel>

                  <FieldLabel>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>Disable</FieldTitle>
                        <p className="text-xs text-muted-foreground">
                          User should not have database access.
                        </p>
                      </FieldContent>
                      <RadioGroupItem value="false" disabled={isSubmitting} />
                    </Field>
                  </FieldLabel>
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
