"use client";

import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Home, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <main className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden px-6 py-16">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
      />

      {/* Decorative arrows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
      >
        <ArrowUpRight className="absolute left-[10%] top-[20%] h-12 w-12 rotate-[-18deg] text-primary/10" />
        <ArrowUpRight className="absolute right-[12%] top-[18%] h-16 w-16 rotate-[10deg] text-primary/10" />
        <ArrowUpRight className="absolute bottom-[18%] left-[16%] h-14 w-14 rotate-[14deg] text-primary/10" />
        <ArrowUpRight className="absolute bottom-[16%] right-[17%] h-10 w-10 rotate-[-12deg] text-primary/10" />
      </div>

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        {/* Error icon */}
        <div className="relative mb-7">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
            <AlertTriangle
              className="h-9 w-9 text-destructive-text"
              strokeWidth={1.7}
            />
          </div>
        </div>

        {/* Small label */}
        <span className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Mission interrupted
        </span>

        {/* Heading */}
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-md text-muted-foreground">
          We hit an unexpected problem while loading this page. Your mission
          isn&apos;t going anywhere — give it another try.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-medium text-primary-foreground shadow-sm transition-all hover:bg-[hsl(var(--primary-dark))] hover:shadow-md"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>

          <Link
            href="/home"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        {/* Subtle footer */}
        <p className="mt-8 text-xs text-muted-foreground/70">
          If this keeps happening, try refreshing the page.
        </p>
      </div>
    </main>
  );
}