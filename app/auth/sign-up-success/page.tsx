import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center px-5 py-8 sm:px-6">
      <Card className="w-full max-w-md rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="items-center space-y-4 p-7 pb-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
            <CheckCircle2 className="size-5 text-emerald-500" />
          </div>

          <div>
            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Missiono
            </p>

            <CardTitle className="font-heading text-3xl font-medium leading-tight tracking-[-0.03em]">
              Welcome to Missiono
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-7 pt-2 text-center">
          <p className="font-body text-sm leading-6 text-muted-foreground">
            Your account has been created successfully. Check your email to
            confirm your account before signing in.
          </p>

          <Link
            href="/auth/login"
            className="mt-6 inline-block font-body text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}