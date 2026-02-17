"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

export function DocsCard({ label }: { label: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        {/* Left content */}
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{label}</span>
          </div>
        </div>

        {/* Right number */}
        <div className="text-3xl font-bold text-foreground">
          <Link href="#">
            <ExternalLink />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
