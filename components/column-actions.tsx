"use client";

import { useState, useCallback } from "react";
import { mutate } from "swr";
import Link from "next/link";
import { Eye, MoreHorizontal, Pencil, Trash, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ColumnActionsProps = {
  editURL?: string;
  deleteURL?: string;
  viewURL?: string;
  mutateKey?: string; // SWR key to revalidate
  entityName?: string;
};

export function ColumnActions({
  editURL,
  deleteURL,
  viewURL,
  mutateKey,
  entityName = "record",
}: ColumnActionsProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);

      const res = await fetch(deleteURL || "", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      toast.success(`${entityName} deleted successfully`);
      setOpen(false);

      if (mutateKey) {
        await mutate(mutateKey);
      }
    } catch (error) {
      toast.error(`Failed to delete ${entityName}. Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteURL, entityName, mutateKey]);

  return (
    <>
      {/* Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Open actions menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {viewURL && (
            <>
              <DropdownMenuItem asChild>
                <Link href={viewURL}>
                  <Eye />
                  View
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {editURL && (
            <DropdownMenuItem asChild>
              <Link href={editURL} className="flex items-center gap-2">
                <Pencil />
                Edit
              </Link>
            </DropdownMenuItem>
          )}

          {deleteURL && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <span className="flex items-center gap-2">
                  <Trash className="text-destructive" />
                  Delete
                </span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirm Delete Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete {entityName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this{" "}
              {entityName}.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
