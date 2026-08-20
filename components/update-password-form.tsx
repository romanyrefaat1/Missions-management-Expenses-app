"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setSuccess(true);

      setTimeout(() => {
        router.push("/home");
      }, 1000);
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
      <div className="flex min-h-dvh w-full items-center justify-center px-5 py-8 sm:px-6">
        <Card className="w-full max-w-md rounded-2xl border-border/70 shadow-sm">
          {success ? (
            <div className="p-7">
              <div className="flex flex-col items-center text-center">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                  <CheckCircle2 className="size-5 text-emerald-500" />
                </div>

                <h1 className="font-heading text-3xl font-medium tracking-[-0.03em]">
                  Password updated
                </h1>

                <p className="mt-2 font-body text-sm leading-6 text-muted-foreground">
                  Your password has been changed. Taking you back to
                  Missiono...
                </p>
              </div>
            </div>
          ) : (
            <>
              <CardHeader className="space-y-3 p-7 pb-5">
                <div>
                  <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Missiono
                  </p>

                  <CardTitle className="font-heading text-3xl font-medium leading-tight tracking-[-0.03em]">
                    Set a new password
                  </CardTitle>

                  <CardDescription className="mt-2 font-body text-sm leading-6">
                    Choose a new password for your account.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-7 pt-2">
                <form onSubmit={handleUpdatePassword}>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="new-password"
                        className="font-body text-xs font-semibold tracking-wide"
                      >
                        New password
                      </Label>

                      <Input
                        id="new-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Enter your new password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      {isLoading
                        ? "Saving..."
                        : "Save new password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}