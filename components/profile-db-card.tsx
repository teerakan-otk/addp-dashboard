"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Database } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type DBStatus = "active" | "pending" | "disabled" | "error";

type Props = {
  status?: DBStatus;
};

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-green-500",
    action: "Disable",
    variant: "destructive" as const,
    confirmText: "Are you sure you want to disable database access?",
  },
  pending: {
    label: "Pending Approval",
    color: "bg-yellow-500",
    action: "Cancel",
    variant: "outline" as const,
    confirmText: "Do you want to cancel your database request?",
  },
  disabled: {
    label: "Disabled",
    color: "bg-gray-400",
    action: "Request Access",
    variant: "default" as const,
    confirmText: "Do you want to request database access?",
  },
  error: {
    label: "Error",
    color: "bg-red-500",
    action: "Retry",
    variant: "destructive" as const,
    confirmText: "Retry requesting database access?",
  },
};

export function ProfileDBCard({ status = "disabled" }: Props) {
  const config = statusConfig[status];
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);

      // TODO: call your API here
      // await fetch("/api/database-action", { method: "POST" });

      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        {/* Left */}
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

        {/* Right */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant={config.variant}>{config.action}</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>{config.confirmText}</DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                No
              </Button>

              <Button
                variant={config.variant}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Processing..." : "Yes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
