"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    setIsLoading(true);
    setError(null);

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/update-password`,
        });

      if (error) throw error;

      setSuccess(true);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex min-h-dvh w-full flex-col px-5 py-8 sm:hidden">
        <div className="mb-12 pt-5">
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Missiono
          </p>

          <h1 className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.035em]">
            {success ? "Check your email" : "Reset your password"}
          </h1>

          <p className="mt-3 max-w-sm font-body text-sm leading-6 text-muted-foreground">
            {success
              ? "We sent instructions to your email address."
              : "Enter your email and we’ll send you a secure reset link."}
          </p>
        </div>

        {success ? (
          <SuccessState />
        ) : (
          <ResetForm
            email={email}
            error={error}
            isLoading={isLoading}
            onEmailChange={setEmail}
            onSubmit={handleForgotPassword}
          />
        )}
      </div>

      <div className="hidden min-h-dvh items-center justify-center px-6 sm:flex">
        <Card className="w-full max-w-md rounded-2xl border-border/70 shadow-sm">
          {success ? (
            <SuccessState />
          ) : (
            <>
              <CardHeader className="space-y-3 p-7 pb-5">
                <div>
                  <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Missiono
                  </p>

                  <CardTitle className="font-heading text-3xl font-medium leading-tight tracking-[-0.03em]">
                    Reset your password
                  </CardTitle>

                  <CardDescription className="mt-2 font-body text-sm leading-6">
                    Enter your email and we’ll send you a secure reset link.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-7 pt-2">
                <ResetForm
                  email={email}
                  error={error}
                  isLoading={isLoading}
                  onEmailChange={setEmail}
                  onSubmit={handleForgotPassword}
                />
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function ResetForm({
  email,
  error,
  isLoading,
  onEmailChange,
  onSubmit,
}: {
  email: string;
  error: string | null;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="forgot-email"
            className="font-body text-xs font-semibold tracking-wide"
          >
            Email
          </Label>

          <Input
            id="forgot-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="h-11 rounded-xl border-border/70 bg-background px-3.5 font-body text-sm shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-2"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="grid grid-cols-[auto_1fr] gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3"
          >
            <AlertCircle className="mt-0.5 size-4 text-red-500" />

            <p className="font-body text-sm leading-5 text-red-950 dark:text-red-100">
              {error}
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="h-11 w-full rounded-xl font-body text-sm font-semibold"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send reset email"}
        </Button>
      </div>

      <p className="mt-6 text-center font-body text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}

function SuccessState() {
  return (
    <div className="p-7">
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
          <CheckCircle2 className="size-5 text-emerald-500" />
        </div>

        <h2 className="font-heading text-2xl font-medium tracking-[-0.025em]">
          Check your email
        </h2>

        <p className="mt-2 max-w-sm font-body text-sm leading-6 text-muted-foreground">
          If you registered using your email and password, you’ll receive a
          password reset email shortly.
        </p>

        <Link
          href="/auth/login"
          className="mt-6 font-body text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}