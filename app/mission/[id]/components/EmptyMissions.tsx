"use client";

import Link from "next/link";
import { ArrowUpRight, Flag, Plus } from "lucide-react";

const EmptyMissions = () => {
  return (
    <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden px-6">
      {/* Decorative Missiono arrows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
      >
        <ArrowUpRight className="absolute left-[12%] top-[18%] h-10 w-10 rotate-[-12deg] text-primary/15" />
        <ArrowUpRight className="absolute right-[15%] top-[24%] h-14 w-14 rotate-[8deg] text-primary/10" />
        <ArrowUpRight className="absolute bottom-[18%] left-[20%] h-12 w-12 rotate-[15deg] text-primary/10" />
        <ArrowUpRight className="absolute bottom-[20%] right-[18%] h-9 w-9 rotate-[-8deg] text-primary/15" />
      </div>

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-accent text-accent-foreground shadow-sm">
          <Flag className="h-7 w-7" strokeWidth={1.8} />
        </div>

        {/* Heading */}
        <h2 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          No missions yet
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-md text-muted-foreground">
          Your missions will appear here once you create one. Start a mission,
          add your tasks, and keep everything moving forward.
        </p>

        {/* CTA */}
        <Link
          href="/new-mission"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 font-medium text-primary-foreground shadow-sm transition-all hover:bg-[hsl(var(--primary-dark))] hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Create your first mission
        </Link>
      </div>
    </div>
  );
};

export default EmptyMissions;