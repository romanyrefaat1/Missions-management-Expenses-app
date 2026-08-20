"use client";

import { useEffect, useRef, useState } from "react";

import {
  Hash,
  Wallet,
  CircleDollarSign,
  Trash2,
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

import CompletedToggleButton from "@/components/completed-toggle-button";

import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { MyAlert } from "@/components/my-alert";
import EditTaskButton from "./EditTaskButton";
import { SetPaidPriceForTaskDialog } from "./SetPaidPriceForTask";

export default function TaskItemInMissionPage({
  taskData,
}: {
  taskData: Task;
}) {

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false)
  
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

  const needsPaidPrice =
    taskData.is_completed &&
    (taskData.paid_price === 0 ||
      taskData.paid_price === null ||
      taskData.paid_price === undefined);

  return (
    <>
      <Card
        className={cn(
          "group relative overflow-hidden p-0 transition-colors bg-muted/40 hover:bg-muted/35",
          completed && "bg-muted/75 dark:bg-muted/10 hover:bg-muted/20",
        )}
      >
        {/* Completion state accent bar */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[3px] transition-colors",
            completed ? "bg-primary" : "bg-transparent",
          )}
        />

        <CardContent className="p-0">
          <div className="flex min-h-32 flex-col items-stretch lg:flex-row">
            {/* Completion */}
            <div className="flex shrink-0 items-center justify-center px-5 py-4 lg:py-0">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full transition-colors",
                  completed && "bg-primary/10",
                )}
              >
                <CompletedToggleButton
                  onCompletedChange={handleToggleCompleteTask}
                  isCompleted={isCompleted}
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Main */}
            <div className="min-w-0 flex-1 border-t px-5 py-4 lg:border-t-0 lg:border-l lg:py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle
                    className={cn(
                      "text-base font-semibold tracking-tight",
                      completed && "text-muted-foreground line-through",
                    )}
                  >
                    {taskData.name}
                  </CardTitle>

                  {taskData.description && (
                    <CardDescription className="mt-1 line-clamp-1 max-w-2xl text-sm">
                      {taskData.description}
                    </CardDescription>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                  <EditTaskButton task={taskData} />
                  <Button
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive-text"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setIsDeleteAlertOpen(true)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>

              <DeleteTaskDialog
                onOpenChange={() => {
                  setIsDeleteAlertOpen((prev) => !prev);
                }}
                open={isDeleteAlertOpen}
                taskId={taskData.id}
              />

              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <Badge variant={status.variant} className="rounded-md">
                  {status.label}
                </Badge>

                <div className="flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-xs text-muted-foreground">
                  <Hash className="size-3" />
                  <span className="font-medium text-foreground">
                    {taskData.count}
                  </span>
                </div>

                {taskData.expected_price !== null && (
                  <div className="flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-xs text-muted-foreground">
                    <CircleDollarSign className="size-3" />
                    <span>Expected</span>
                    <span className="font-medium text-foreground">
                      ${taskData.expected_price}
                    </span>
                  </div>
                )}

                {taskData.paid_price !== null && (
                  <div className="flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-xs text-muted-foreground">
                    <Wallet className="size-3" />
                    <span>Paid</span>
                    <span className="font-medium text-foreground">
                      ${taskData.paid_price}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        {needsPaidPrice && (
          <div className="border-t">
            <MyAlert
              variant="warning"
              title="You must set how much you paid for this task"
              action={<SetPaidPriceForTaskDialog taskId={taskData.id} />}
              className="rounded-none border-0"
            />
          </div>
        )}
      </Card>

      <DeleteTaskDialog
        taskId={taskData.id}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}