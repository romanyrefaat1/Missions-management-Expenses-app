"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { resolvedTheme: theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  // Avoid SSR/client hydration mismatch on theme-dependent images
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.padding = "0";

    const firstDiv = document.body.querySelector(
      "#first-div-inside-body"
    ) as HTMLElement | null;

    if (firstDiv) {
      firstDiv.style.padding = "0";
      firstDiv.style.margin = "0";
    }

    return () => {
      document.body.style.padding = "";

      if (firstDiv) {
        firstDiv.style.padding = "";
        firstDiv.style.margin = "";
      }
    };
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `https://missiono.vercel.app/home?from=sign-up`,
        },
      });

      if (error) throw error;

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Illustration: light theme -> sign-up.png, dark theme -> sign-up-darkmode.jpg
  const illustrationSrc =
    !mounted || theme === "light" ? "/sign-up.png" : "/sign-up-darkmode.jpg";

  // Logo: needs to contrast with the background it sits on.
  // Light background -> dark text logo. Dark background -> light text logo.
  const logoSrc =
    !mounted || theme === "light"
      ? "/logo-dark-text-no-bg.png"
      : "/logo-light-text-no-bg.png";

  const form = (
    <form onSubmit={handleSignUp}>
      <div className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="font-body text-xs font-semibold tracking-wide"
          >
            Email
          </Label>

          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl border-border/70 bg-background px-3.5 font-body text-sm shadow-none transition-colors placeholder:text-muted-foreground/50 focus-visible:ring-2"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="font-body text-xs font-semibold tracking-wide"
          >
            Password
          </Label>

          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl border-border/70 bg-background px-3.5 font-body text-sm shadow-none transition-colors focus-visible:ring-2"
          />
        </div>

        {/* Repeat password */}
        <div className="space-y-2">
          <Label
            htmlFor="repeat-password"
            className="font-body text-xs font-semibold tracking-wide"
          >
            Repeat password
          </Label>

          <Input
            id="repeat-password"
            type="password"
            autoComplete="new-password"
            required
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="h-11 rounded-xl border-border/70 bg-background px-3.5 font-body text-sm shadow-none transition-colors focus-visible:ring-2"
          />
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="grid grid-cols-[auto_1fr] gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-left"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-500" />

            <p className="font-body text-sm leading-5 text-red-950 dark:text-red-100">
              {error}
            </p>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="h-11 w-full rounded-xl font-body text-sm font-semibold shadow-sm transition-all"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </div>

      {/* Login */}
      <p className="mt-6 text-center font-body text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );

  return (
    <div
      className={cn("min-h-dvh w-full bg-background", className)}
      {...props}
    >
      {/* Desktop / Large screens */}
      <div className="hidden min-h-dvh lg:grid lg:grid-cols-2">
        {/* Illustration */}
        <div className="relative min-h-dvh overflow-hidden bg-[#111318]">
          <Image
            src={illustrationSrc}
            alt="Missiono mission progress illustration"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/20" />

          {/* Brand */}
          <div className="absolute left-8 top-8 z-10">
            <Link href="/">
              <Image
                src={logoSrc}
                alt="Missionooo"
                width={140}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* Bottom message */}
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <div className="max-w-md">
              <p className="font-body text-sm font-medium text-white/60">
                Every mission starts somewhere.
              </p>

              <p className="mt-1 font-heading text-2xl font-medium tracking-tight text-white">
                Start moving forward.
              </p>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="flex min-h-dvh items-center justify-center px-8 py-12 xl:px-16">
          <div className="w-full max-w-[420px]">
            {/* Header */}
            <div className="mb-9">
              <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Missiono
              </p>

              <h1 className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.035em]">
                Create your account
              </h1>

              <p className="mt-3 font-body text-sm leading-6 text-muted-foreground">
                Start organizing your missions and keeping track of every
                task.
              </p>
            </div>

            {form}
          </div>
        </div>
      </div>

      {/* Tablet */}
      <div className="hidden min-h-dvh items-center justify-center px-8 py-12 md:flex lg:hidden">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm md:grid-cols-[0.9fr_1.1fr]">
          {/* Image */}
          <div className="relative min-h-[520px] overflow-hidden bg-[#111318]">
            <Image
              src={illustrationSrc}
              alt="Missiono mission progress illustration"
              fill
              priority
              sizes="45vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <div className="absolute bottom-7 left-7 right-7 z-10">
              <p className="font-body text-sm font-medium text-white/60">
                Every mission starts somewhere.
              </p>

              <p className="mt-1 font-heading text-xl font-medium tracking-tight text-white">
                Start moving forward.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="flex items-center px-8 py-12 lg:px-12">
            <div className="w-full">
              <div className="mb-9">
                <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Missiono
                </p>

                <h1 className="font-heading text-3xl font-medium leading-tight tracking-[-0.03em]">
                  Create your account
                </h1>

                <p className="mt-2 font-body text-sm leading-6 text-muted-foreground">
                  Start organizing your missions and keeping track of every
                  task.
                </p>
              </div>

              {form}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex min-h-dvh flex-col md:hidden">
        {/* Mobile image */}
        <div className="relative h-[240px] w-full overflow-hidden bg-[#111318] sm:h-[300px]">
          <Image
            src={illustrationSrc}
            alt="Missiono mission progress illustration"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-transparent" />

          {/* Logo */}
          <div className="absolute left-0 top-6 z-10">
            <Link href="/">
              <Image
                src={logoSrc}
                alt="Missionooo"
                width={140}
                height={40}
                priority
              />
            </Link>
          </div>
        </div>

        {/* Mobile form */}
        <div className="flex flex-1 flex-col px-5 pb-8 pt-7 sm:px-8">
          <div className="mb-8">
            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Missiono
            </p>

            <h1 className="font-heading text-3xl font-medium leading-[1.05] tracking-[-0.035em] sm:text-4xl">
              Create your account
            </h1>

            <p className="mt-3 max-w-md font-body text-sm leading-6 text-muted-foreground">
              Start organizing your missions and keeping track of every task.
            </p>
          </div>

          {form}
        </div>
      </div>
    </div>
  );
}