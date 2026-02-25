"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  value?: any;
  label: string;
  Icon: LucideIcon;
  href?: string;
  className?: string;
};

export function StatCard({
  value,
  label,
  Icon,
  href,
  className,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-6">
        {/* Icon */}
        <div className="bg-muted p-4 rounded-full">
          <Icon />
        </div>

        {/* Content */}
        <div>
          {href ? (
            <Link href={href} className="text-2xl font-semibold">
              {value}
            </Link>
          ) : (
            <p className={cn("text-2xl font-semibold", className)}>
              {value ?? "-"}
            </p>
          )}
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
