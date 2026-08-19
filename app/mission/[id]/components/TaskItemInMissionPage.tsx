"use client";

import { useEffect, useRef, useState } from "react";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Hash,
  Wallet,
  CircleDollarSign,
  Trash,
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

  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden p-0 transition-all",
          completed && "bg-muted/30",
        )}
      >
        <CardContent className="p-0">
          <div className="flex min-h-32 items-stretch flex-col lg:flex-row pt-5 lg:pt-0">
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

                <div className="flex gap-2 border bg-accent p-1 rounded-xl">
                  <EditTaskButton task={taskData} />
                  <Button className="hover:text-destructive-text hover:bg-destructive/30" variant="ghost" size={"icon-sm"} onClick={() => setIsDeleteAlertOpen(true)}><Trash2 /></Button>
                </div>
              </div>
                  <DeleteTaskDialog onOpenChange={()=> {setIsDeleteAlertOpen((prev)=> !prev)}} open={isDeleteAlertOpen} taskId={taskData.id} />

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
        <div className="mb-2 p-2">
          {taskData.is_completed && (taskData.paid_price === 0 || taskData.paid_price === null || taskData.paid_price === undefined) ? 
          <MyAlert variant="warning" title="You must set how much you paid for this task" action={<SetPaidPriceForTaskDialog taskId={taskData.id}/>}/> : <></>}
        </div>
      </Card>

      <DeleteTaskDialog
        taskId={taskData.id}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
