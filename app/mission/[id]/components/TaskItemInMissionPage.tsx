"use client";

import { useEffect, useRef, useState } from "react";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Hash,
  Wallet,
  CircleDollarSign,
} from "lucide-react";

import { Task } from "@/types/types";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";
import CompletedToggleButton from "@/components/completed-toggle-button";

import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { DeleteTaskDialog } from "./DeleteTaskDialog";

export default function TaskItemInMissionPage({
  taskData,
}: {
  taskData: Task;
}) {
  const [isCompleted, setIsCompleted] = useState(
    taskData.is_completed ?? false,
  );

  const [isSaving, setIsSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completed = isCompleted || taskData.state === "COMPLETED";

  const status = {
    PENDING: {
      label: "Pending",
      variant: "secondary" as const,
    },

    IN_PROGRESS: {
      label: "In progress",
      variant: "outline" as const,
    },

    COMPLETED: {
      label: "Completed",
      variant: "default" as const,
    },
  }[taskData.state];

  const handleToggleCompleteTask = (newValue: boolean) => {
    // Update UI immediately
    setIsCompleted(newValue);

    // Cancel previous pending DB update
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Wait before hitting DB
    debounceTimer.current = setTimeout(async () => {
      setIsSaving(true);

      const supabase = createClient();

      const { error } = await supabase
        .from("tasks")
        .update({
          is_completed: newValue,
        })
        .eq("id", taskData.id);

      setIsSaving(false);

      if (error) {
        console.error("Failed to update task:", error);

        // Revert optimistic update
        setIsCompleted(!newValue);

        toast.error("Failed to update task");
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden p-0 transition-all",
          completed && "bg-muted/30",
        )}
      >
        <CardContent className="p-0">
          <div className="flex min-h-32 items-stretch">
            {/* Completion */}
            <div className="flex shrink-0 items-center px-4">
              <CompletedToggleButton
                onCompletedChange={handleToggleCompleteTask}
                isCompleted={isCompleted}
                disabled={isSaving}
              />
            </div>

            <div className="w-[1px] bg-border self-stretch" />

            {/* Main */}
            <div className="min-w-0 flex-1 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle
                    className={cn(
                      "text-base",
                      completed && "text-muted-foreground line-through",
                    )}
                  >
                    {taskData.name}
                  </CardTitle>

                  {taskData.description && (
                    <CardDescription className="mt-1.5 max-w-2xl line-clamp-2">
                      {taskData.description}
                    </CardDescription>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 text-muted-foreground"
                    >
                      <MoreHorizontal className="size-4" />

                      <span className="sr-only">Task actions</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 size-4" />
                      Edit task
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={(event) => {
                        event.preventDefault();
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge variant={status.variant}>{status.label}</Badge>

                <Separator orientation="vertical" className="h-4" />

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Hash className="size-3.5" />

                  <span>{taskData.count}</span>
                </div>

                {taskData.expected_price !== null && (
                  <>
                    <Separator orientation="vertical" className="h-4" />

                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CircleDollarSign className="size-3.5" />

                      <span>
                        Expected{" "}
                        <span className="font-medium text-foreground">
                          ${taskData.expected_price}
                        </span>
                      </span>
                    </div>
                  </>
                )}

                {taskData.paid_price !== null && (
                  <>
                    <Separator orientation="vertical" className="h-4" />

                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Wallet className="size-3.5" />

                      <span>
                        Paid{" "}
                        <span className="font-medium text-foreground">
                          {taskData.paid_price}
                        </span>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog lives OUTSIDE the DropdownMenu */}
      <DeleteTaskDialog
        taskId={taskData.id}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
