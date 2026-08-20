"use client";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ListTodo } from "lucide-react";

interface EmptyTasksSectionProps {
  state: string;
}

export default function EmptyTasksSection({
  state,
}: EmptyTasksSectionProps) {
  return (
    <Empty className="rounded-2xl border border-dashed border-border/70 bg-muted/10 py-12">
      <EmptyHeader className="max-w-md">
        <EmptyMedia
          variant="icon"
          className="mb-1 size-10 rounded-xl border border-border/70 bg-muted/40"
        >
          <ListTodo className="size-4 text-muted-foreground" />
        </EmptyMedia>

        <EmptyTitle className="font-body text-base font-semibold tracking-[-0.015em]">
          No <span className="font-heading text-primary">{state.toLowerCase()}</span> tasks
        </EmptyTitle>

        <EmptyDescription className="text-sm leading-6 text-muted-foreground/80">
          There are currently no {state.toLowerCase()} tasks in this mission.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}