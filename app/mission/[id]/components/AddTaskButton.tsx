"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useIsMobile } from "@/hooks/use-mobile";
import { Mission, TaskState } from "@/types/types";
import { createClient } from "@/lib/supabase/client";
import { CompletedToggle } from "@/components/completed-toggle";
import { useSession } from "@/contexts/session-context";
import { useMission } from "@/contexts/mission-context";

type AddTaskDrawerProps = {
  mission: Mission;
};

type TaskDraft = {
  id: string;
  name: string;
  description: string;
  expectedPrice: string;
  paidPrice: string;
  count: string;
  state: TaskState;
  isCompleted: boolean;
};

function createEmptyTask(): TaskDraft {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    expectedPrice: "",
    paidPrice: "",
    count: "",
    state: "IN_PROGRESS",
    isCompleted: false,
  };
}

export function AddTaskDrawer() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { session } = useSession();
  const { mission } = useMission();

  const [tasks, setTasks] = React.useState<TaskDraft[]>([createEmptyTask()]);

  const [expandedTask, setExpandedTask] = React.useState(0);

  const isMobile = useIsMobile();

  function resetForm() {
    setTasks([createEmptyTask()]);
    setExpandedTask(0);
  }

  function updateTask(index: number, updates: Partial<TaskDraft>) {
    setTasks((current) =>
      current.map((task, taskIndex) =>
        taskIndex === index ? { ...task, ...updates } : task,
      ),
    );
  }

  function handleAddMoreTasks() {
    const currentTask = tasks[expandedTask];

    // Only name is required
    if (!currentTask.name.trim()) {
      toast.error("Task name is required");
      return;
    }

    const newTask = createEmptyTask();

    setTasks((current) => [...current, newTask]);

    setExpandedTask(tasks.length);
  }

  const handleDeleteTask = (taskId: string)=> {
    setTasks(tasks => tasks.filter(el=> el.id !== taskId))
  }

  async function handleSubmit() {
    // Make sure every task has a name
    const invalidTask = tasks.findIndex((task) => !task.name.trim());

    if (invalidTask !== -1) {
      setExpandedTask(invalidTask);

      toast.error(`Task ${invalidTask + 1} needs a name`);

      return;
    }

    const formattedTasks = tasks.map((task) => {
      const expectedPrice =
        task.expectedPrice.trim() !== "" ? Number(task.expectedPrice) : null;

      const paidPrice =
        task.paidPrice.trim() !== "" ? Number(task.paidPrice) : null;

      const count = task.count.trim() !== "" ? Number(task.count) : null;

      return {
        user_id: session?.user.id,
        name: task.name.trim(),
        description: task.description.trim() || null,
        expected_price: expectedPrice,
        paid_price: paidPrice,
        count,
        state: task.state,
        is_completed: task.isCompleted,
        mission: mission.id,
      };
    });

    // Validate optional numeric values
    for (let i = 0; i < formattedTasks.length; i++) {
      const task = formattedTasks[i];

      if (
        task.expected_price !== null &&
        (Number.isNaN(task.expected_price) || task.expected_price < 0)
      ) {
        setExpandedTask(i);
        toast.error(`Expected price for task ${i + 1} is invalid`);
        return;
      }

      if (
        task.paid_price !== null &&
        (Number.isNaN(task.paid_price) || task.paid_price < 0)
      ) {
        setExpandedTask(i);
        toast.error(`Paid price for task ${i + 1} is invalid`);
        return;
      }

      if (task.count !== null && (Number.isNaN(task.count) || task.count < 1)) {
        setExpandedTask(i);
        toast.error(`Count for task ${i + 1} must be at least 1`);
        return;
      }
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.from("tasks").insert(formattedTasks);

    setLoading(false);

    if (error) {
      console.error("Error creating tasks:", error);
      toast.error(`Error creating tasks: ${error.message}`);
      return;
    }

    toast.success(
      `${formattedTasks.length} ${
        formattedTasks.length === 1 ? "task" : "tasks"
      } added successfully`,
    );

    resetForm();
    setOpen(false);
  }

  return (
      <Drawer
  open={open}
  onOpenChange={setOpen}
  direction="right"
  swipeDirection="right"
>
      <DrawerTrigger asChild>
        <Button variant="primary">Add Task</Button>
      </DrawerTrigger>

      <DrawerContent className="mt-12 mr-5">
        <DrawerHeader>
          <DrawerTitle>Add tasks to {mission.name}</DrawerTitle>

          <DrawerDescription>
            Add one or multiple tasks to this mission.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {tasks.map((task, index) => {
              const isExpanded = expandedTask === index;

              return (
                <div
                  key={task.id}
                  className="overflow-hidden rounded-xl border"
                >
                  {/* Folded task */}
                  {!isExpanded && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto w-full justify-between rounded-none p-4 text-left"
                      onClick={() => setExpandedTask(index)}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{task.name}</p>

                        {task.description && (
                          <p className="mt-1 truncate text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <Button onClick={()=> handleDeleteTask(task.id)} variant="secondary" size="sm" className="ml-4 shrink-0 text-xs text-muted-foreground">
                        Remove Task
                      </Button>
                    </Button>
                  )}

                  {/* Expanded task */}
                  {isExpanded && (
                    <div className="space-y-6 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Task {index + 1}</p>

                          <p className="text-sm text-muted-foreground">
                            Task details
                          </p>
                        </div>

                        {tasks.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedTask(-1)}
                          >
                            Collapse
                          </Button>
                        )}
                      </div>

                      {/* Name */}
                      <Field>
                        <FieldLabel htmlFor={`task-name-${task.id}`}>
                          <FieldTitle>Name</FieldTitle>
                        </FieldLabel>

                        <FieldContent>
                          <Input
                            id={`task-name-${task.id}`}
                            placeholder="e.g. Build landing page"
                            value={task.name}
                            onChange={(e) =>
                              updateTask(index, {
                                name: e.target.value,
                              })
                            }
                            disabled={loading}
                          />
                        </FieldContent>
                      </Field>

                      {/* Description */}
                      <Field>
                        <FieldLabel htmlFor={`task-description-${task.id}`}>
                          <FieldTitle>Description</FieldTitle>
                        </FieldLabel>

                        <FieldContent>
                          <Textarea
                            id={`task-description-${task.id}`}
                            placeholder="Describe what needs to be done..."
                            value={task.description}
                            onChange={(e) =>
                              updateTask(index, {
                                description: e.target.value,
                              })
                            }
                            disabled={loading}
                          />
                        </FieldContent>
                      </Field>

                      {/* Prices */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field>
                          <FieldLabel htmlFor={`expected-price-${task.id}`}>
                            <FieldTitle>Expected price</FieldTitle>
                          </FieldLabel>

                          <FieldContent>
                            <Input
                              id={`expected-price-${task.id}`}
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Optional"
                              value={task.expectedPrice}
                              onChange={(e) =>
                                updateTask(index, {
                                  expectedPrice: e.target.value,
                                })
                              }
                              disabled={loading}
                            />
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel htmlFor={`paid-price-${task.id}`}>
                            <FieldTitle>Paid price</FieldTitle>
                          </FieldLabel>

                          <FieldContent>
                            <Input
                              id={`paid-price-${task.id}`}
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Optional"
                              value={task.paidPrice}
                              onChange={(e) =>
                                updateTask(index, {
                                  paidPrice: e.target.value,
                                })
                              }
                              disabled={loading}
                            />

                            <FieldDescription>
                              Leave empty if nothing has been paid yet.
                            </FieldDescription>
                          </FieldContent>
                        </Field>
                      </div>

                      {/* Count */}
                      <Field>
                        <FieldLabel htmlFor={`task-count-${task.id}`}>
                          <FieldTitle>Quantity</FieldTitle>
                        </FieldLabel>

                        <FieldContent>
                          <Input
                            id={`task-count-${task.id}`}
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Optional"
                            value={task.count}
                            onChange={(e) =>
                              updateTask(index, {
                                count: e.target.value,
                              })
                            }
                            disabled={loading}
                          />
                        </FieldContent>
                      </Field>

                      {/* State */}
                      <Field>
                        <FieldLabel>
                          <FieldTitle>State</FieldTitle>
                        </FieldLabel>

                        <FieldContent>
                          <Select
                            value={task.state}
                            onValueChange={(value) =>
                              updateTask(index, {
                                state: value as TaskState,
                              })
                            }
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>

                              <SelectItem value="IN_PROGRESS">
                                In Progress
                              </SelectItem>

                              <SelectItem value="COMPLETED">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldContent>
                      </Field>

                      {/* Completed */}
                      <CompletedToggle
                        isCompleted={task.isCompleted}
                        onCompletedChange={(value) =>
                          updateTask(index, {
                            isCompleted: value,
                          })
                        }
                        disabled={loading}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add another task */}
            <Button
              type="button"
              variant="ghost"
              className="h-20 w-full rounded-xl border border-dotted text-muted-foreground"
              onClick={handleAddMoreTasks}
              disabled={loading}
            >
              + Add more tasks
            </Button>
          </div>
        </div>

        <DrawerFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="h-[34px]"
          >
            {loading
              ? "Adding tasks..."
              : `Add ${tasks.length} ${tasks.length === 1 ? "Task" : "Tasks"}`}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
