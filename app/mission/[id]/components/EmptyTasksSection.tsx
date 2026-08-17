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
    <Empty className="py-8">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ListTodo />
        </EmptyMedia>

        <EmptyTitle>No {state} tasks</EmptyTitle>

        <EmptyDescription>
          There are currently no {state.toLowerCase()} tasks in this mission.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}