"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/profile-avatar";
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
import {
  ChangePasswordSchema,
  changePasswordSchema,
} from "@/lib/schemas/profile";
import { toast } from "sonner";

type Props = {
  data: any;
};

export function ProfileInfoCard({ data }: Props) {
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
        return toast.error(
          data.error?.message ||
            data.message ||
            "Something went wrong. Try again later",
        );
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
                  <DialogTitle>Update your password</DialogTitle>
                  <DialogDescription className="pt-1">
                    For security reasons, please enter your current password and
                    choose a new one.
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
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" size="sm" variant="destructive">
                Delete Account
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-destructive">
                  Delete your account?
                </DialogTitle>
                <DialogDescription className="pt-2">
                  This action is permanent and cannot be undone. All your data
                  will be permanently deleted.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="gap-2 sm:justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Keep Account
                  </Button>
                </DialogClose>

                <Button
                  form="form-rfh-delete"
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Deleting..." : "Yes, Delete Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
