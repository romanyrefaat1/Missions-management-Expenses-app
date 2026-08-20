import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden px-6 py-16">
      {/* Brand glow */}
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
        {/* Icon */}
        <div className="relative mb-7">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
            <Compass
              className="h-9 w-9 text-primary"
              strokeWidth={1.7}
            />
          </div>
        </div>

        {/* Label */}
        <span className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Page not found
        </span>

        {/* Heading */}
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          This page went missing
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-md text-muted-foreground">
          We couldn&apos;t find the page you&apos;re looking for. It may
          have been deleted, moved, or the link might be incorrect.
        </p>

        {/* Action */}
        <Link
          href="/home"
          className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-medium text-primary-foreground shadow-sm transition-all hover:bg-[hsl(var(--primary-dark))] hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to pages
        </Link>
      </div>
    </main>
  );
}