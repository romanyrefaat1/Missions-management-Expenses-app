import {
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[auto_1fr] gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3">
        <AlertCircle className="mt-0.5 size-4 text-red-500" />

        <div>
          <p className="font-body text-sm font-semibold text-red-950 dark:text-red-100">
            {params?.error
              ? "Authentication error"
              : "Something unexpected happened"}
          </p>

          <p className="mt-1 font-body text-sm leading-5 text-red-800/80 dark:text-red-200/80">
            {params?.error ||
              "An unspecified authentication error occurred."}
          </p>
        </div>
      </div>

      <Button asChild variant="outline" className="w-full rounded-xl">
        <Link href="/auth/login">
          <ArrowLeft className="mr-2 size-4" />
          Back to login
        </Link>
      </Button>
    </div>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center px-5 py-8 sm:px-6">
      <Card className="w-full max-w-md rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="space-y-3 p-7 pb-5">
          <div>
            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Missiono
            </p>

            <CardTitle className="font-heading text-3xl font-medium leading-tight tracking-[-0.03em]">
              Something went wrong
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-7 pt-2">
          <Suspense
            fallback={
              <p className="font-body text-sm text-muted-foreground">
                Loading error details...
              </p>
            }
          >
            <ErrorContent searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}