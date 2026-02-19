"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "./profile-avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Shield, User2, IdCard } from "lucide-react";
import { ChangePasswordSchema, changePasswordSchema } from "../_schemas";
import { toast } from "sonner";

export function ProfileCard({ data }: { data: any }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      cNewPassword: "",
    },
  });

  async function handleChangePassword(values: ChangePasswordSchema) {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.error?.message);
      }

      toast.success("Update password success");
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch {
      return toast.error("Internal server error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IdCard className="h-5 w-5" /> User information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="hidden md:flex">
            <ProfileAvatar
              className="rounded-md h-21 w-21"
              username={data?.username}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <User2 className="h-5 w-5" />: <span>{data?.username}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />: <span>{data?.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />: <span>{data?.role}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Dialog
            open={open}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) {
                form.reset();
              }
            }}
          >
            <form
              id="form-rfh-change-password"
              onSubmit={form.handleSubmit(handleChangePassword)}
            >
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Your Password</DialogTitle>
                  <DialogDescription>
                    Please enter your current and new password below.
                  </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                  <Controller
                    name="oldPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          aria-invalid={fieldState.invalid}
                        >
                          Current Password
                        </FieldLabel>
                        <Input
                          {...field}
                          type="password"
                          id={field.name}
                          autoComplete="off"
                          aria-invalid={fieldState.invalid}
                          disabled={isSubmitting}
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="newPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          aria-invalid={fieldState.invalid}
                        >
                          New Password
                        </FieldLabel>
                        <Input
                          {...field}
                          type="password"
                          id={field.name}
                          autoComplete="off"
                          aria-invalid={fieldState.invalid}
                          disabled={isSubmitting}
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="cNewPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          aria-invalid={fieldState.invalid}
                        >
                          Confirm Password
                        </FieldLabel>
                        <Input
                          {...field}
                          type="password"
                          id={field.name}
                          autoComplete="off"
                          aria-invalid={fieldState.invalid}
                          disabled={isSubmitting}
                        />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    form="form-rfh-change-password"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>

          <Button type="button" size="sm" variant="destructive">
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
