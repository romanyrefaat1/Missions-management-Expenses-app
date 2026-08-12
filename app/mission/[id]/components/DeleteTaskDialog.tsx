"use client";

import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function DeleteTaskDialog({
  taskId,
  open,
  onOpenChange,
}: {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const handleDeleteTask = async () => {
    const supabase = createClient();

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      toast.error(`Error deleting task: ${error.message}`);
      console.error(`Error deleting task: ${error.message}`);
      return;
    }

    onOpenChange(false);
    toast.success("Task deleted");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>

          <AlertDialogTitle>Delete task?</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete this task.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleDeleteTask} variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
