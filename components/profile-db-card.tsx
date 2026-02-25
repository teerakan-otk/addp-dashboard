"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { useMemo, useState } from "react";

import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
import { Circle, Database } from "lucide-react";

/**
 * Backend states:
 * 0 = DISCONNECTED
 * 1 = PENDING_CONNECTED
 * 2 = CONNECTED
 * 3 = PENDING_DISCONNECTED
 */

type DBStatus =
  | "disconnected"
  | "pending_connected"
  | "connected"
  | "pending_disconnected";

type StatusConfig = {
  label: string;
  color: string;
  action: string | null;
  variant?: "default" | "destructive" | "outline";
  confirmText?: string;
  actionValue?: 0 | 1 | 2 | 3;
};

const statusConfig: Record<DBStatus, StatusConfig> = {
  disconnected: {
    label: "Disconnected",
    color: "#9ca3af", // gray
    action: "Request Access",
    variant: "outline",
    confirmText: "Do you want to request database access?",
    actionValue: 1, // PENDING_CONNECTED
  },

  pending_connected: {
    label: "Pending Activation",
    color: "#f59e0b", // amber
    action: "Cancel Request",
    variant: "outline",
    confirmText: "Do you want to cancel your database activation request?",
    actionValue: 0, // DISCONNECTED
  },

  connected: {
    label: "Connected",
    color: "#22c55e", // green
    action: "Disable",
    variant: "outline",
    confirmText: "Are you sure you want to disable database access?",
    actionValue: 3, // PENDING_DISCONNECTED
  },

  pending_disconnected: {
    label: "Pending Deactivation",
    color: "#f97316", // orange
    action: null, // No action allowed while processing
  },
};

function mapDatabaseStatus(value: number): DBStatus {
  switch (value) {
    case 0:
      return "disconnected";
    case 1:
      return "pending_connected";
    case 2:
      return "connected";
    case 3:
      return "pending_disconnected";
    default:
      return "disconnected";
  }
}

export function ProfileDBCard({ data, mutate }: { data: any; mutate: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = useMemo(
    () => mapDatabaseStatus(data?.database ?? 0),
    [data?.database],
  );

  const config = useMemo(() => statusConfig[status], [status]);

  const handleConfirm = async () => {
    if (loading || config.actionValue == null) return;

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

      toast.success("Request submitted");

      await mutate();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const actionButton = config.action ? (
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

          <Button onClick={handleConfirm} variant="default" disabled={loading}>
            {loading ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Button variant="outline" disabled>
      Processing...
    </Button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-base font-semibold">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <Database className="w-4 h-4 text-foreground/70" />
          </div>

          <div className="flex flex-col">
            <span>Database Access</span>
            <span className="text-xs text-muted-foreground font-normal">
              Manage your database account permissions
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Status Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm bg-muted/40">
                <Circle
                  className="w-2.5 h-2.5"
                  strokeWidth={0}
                  fill={config.color}
                />
                <span className="text-foreground/80">{config.label}</span>
              </div>
            </div>

            {/* Action Button */}
            {actionButton}
          </div>

          {/* Optional contextual message */}
          <p className="text-xs text-muted-foreground">
            {status === "connected" &&
              "Your database access is currently active."}
            {status === "disconnected" &&
              "You do not have database access enabled."}
            {status === "pending_connected" &&
              "Your access request is under review."}
            {status === "pending_disconnected" &&
              "Your disable request is being processed."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
