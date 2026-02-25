"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { useMemo, useState } from "react";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Database } from "lucide-react";

type DBStatus = "active" | "pending" | "disabled";

type StatusConfig = {
  label: string;
  color: string;
  action: string;
  variant: "default" | "destructive" | "outline";
  confirmText: string;
  actionValue: 0 | 1 | 2;
};

const statusConfig: Record<DBStatus, StatusConfig> = {
  active: {
    label: "Active",
    color: "bg-green-500",
    action: "Disable",
    variant: "destructive",
    confirmText: "Are you sure you want to disable database access?",
    actionValue: 2,
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-500",
    action: "Cancel",
    variant: "outline",
    confirmText: "Do you want to cancel your database request?",
    actionValue: 1,
  },
  disabled: {
    label: "Disabled",
    color: "bg-gray-400",
    action: "Request Access",
    variant: "default",
    confirmText: "Do you want to request database access?",
    actionValue: 0,
  },
};

function mapDatabaseStatus(value: number): DBStatus {
  switch (value) {
    case 2:
      return "active";
    case 1:
      return "pending";
    case 0:
    default:
      return "disabled";
  }
}

export function ProfileDBCard() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, mutate } = useSWR("/api/profile", fetcher);

  const status = useMemo(
    () => mapDatabaseStatus(data.database),
    [data.database],
  );
  const config = useMemo(() => statusConfig[status], [status]);

  if (isLoading) return null;

  const handleConfirm = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch("/api/database", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: config.actionValue }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Something went wrong");
      }

      toast.success("Request successful");

      await mutate(); // refresh new data

      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center p-3 bg-accent rounded-md">
            <Database className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="grid gap-1">
            <p className="font-medium">Database Access</p>
            <Badge className={`${config.color} text-white`}>
              {config.label}
            </Badge>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant={config.variant}>{config.action}</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>{config.confirmText}</DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 gap-2">
              <DialogClose asChild>
                <Button variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>

              <Button
                onClick={handleConfirm}
                variant="default"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
