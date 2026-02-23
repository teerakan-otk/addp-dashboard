import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">403 - Forbidden</CardTitle>
          <CardDescription>
            You don’t have permission to access this page.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/login">Login with different account</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
