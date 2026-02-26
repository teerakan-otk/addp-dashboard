"use client";

import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, FileText } from "lucide-react";

export function ProfileReadDocsCard() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        {/* Left content */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center p-3 rounded-md bg-accent">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              Read documentation
            </span>
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
