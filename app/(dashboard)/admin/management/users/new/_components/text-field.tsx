import { Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function TextField({
  control,
  name,
  label,
  type = "text",
  required,
  disabled,
}: any) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name} aria-invalid={fieldState.invalid}>
            {label}
            {required && <span className="text-destructive">*</span>}
          </FieldLabel>

          <Input
            {...field}
            type={type}
            id={field.name}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
            onChange={(e) =>
              type === "number"
                ? field.onChange(Number(e.target.value))
                : field.onChange(e.target.value)
            }
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
