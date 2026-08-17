"use client";

import { useMission } from "@/contexts/mission-context";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MyAlert } from "@/components/my-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  ChevronDown,
  Pause,
  X,
  ArrowRight,
  Target,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Task } from "@/types/types";
import Link from "next/link";

export default function OnTheGoPage() {
  const { mission, tasks, loading, error } = useMission();

  /*
   * ---------------------------------------------------------
   * LOCAL PAGE STATE
   * ---------------------------------------------------------
   *
   * `tasks` from the context is the external source.
   *
   * We keep a local snapshot because this page also needs
   * temporary UI state such as ordering and optimistic updates.
   */

  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [taskOrder, setTaskOrder] = useState<string[]>([]);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    null,
  );

  // When the user manually switches the current task, keep the
  // task that was current immediately before it at the top of
  // the Up Next list. This gives the user a way to return to it.
  const [previousCurrentTaskId, setPreviousCurrentTaskId] =
    useState<string | null>(null);

  const [isCompleting, setIsCompleting] = useState(false);
  const [expandedCompletedTask, setExpandedCompletedTask] =
    useState<string | null>(null);
  const [expandedUpcomingTask, setExpandedUpcomingTask] =
    useState<string | null>(null);

  const [taskPrice, setTaskPrice] = useState("");

  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const priceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const currentTaskIdRef = useRef<string | null>(null);

  /*
   * ---------------------------------------------------------
   * FETCH FRESH TASKS
   * ---------------------------------------------------------
   *
   * This is only used by this page when the context gives us
   * an obviously malformed realtime snapshot.
   *
   * We are NOT modifying the MissionProvider.
   */

  const refreshLocalTasks = useCallback(async () => {
    if (!mission?.id) return;

    const supabase = createClient();

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("mission", mission.id);

    if (error) {
      console.error("Failed to refresh tasks:", error);
      return;
    }

    const freshTasks = data ?? [];

    setLocalTasks(freshTasks);

    setTaskOrder((previousOrder) => {
      const freshIds = new Set(freshTasks.map((task) => task.id));

      const preservedIds = previousOrder.filter((id) =>
        freshIds.has(id),
      );

      const newIds = freshTasks
        .map((task) => task.id)
        .filter((id) => !preservedIds.includes(id));

      return [...preservedIds, ...newIds];
    });
  }, [mission?.id]);

  /*
   * ---------------------------------------------------------
   * SYNC CONTEXT -> LOCAL STATE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!tasks) return;

    /*
     * Your provider's UPDATE handler can accidentally produce
     * duplicate IDs. Detect that before accepting the snapshot.
     */
    const ids = tasks.map((task) => task.id);
    const hasDuplicateIds = new Set(ids).size !== ids.length;

    if (hasDuplicateIds) {
      refreshLocalTasks();
      return;
    }

    /*
     * Valid context update.
     */
    setLocalTasks(tasks);

    /*
     * Don't destroy the user's manual ordering every time
     * Supabase Realtime updates a task.
     */
    setTaskOrder((previousOrder) => {
      const incomingIds = new Set(ids);

      const preservedIds = previousOrder.filter((id) =>
        incomingIds.has(id),
      );

      const newIds = ids.filter(
        (id) => !preservedIds.includes(id),
      );

      return [...preservedIds, ...newIds];
    });
  }, [tasks, refreshLocalTasks]);

  /*
   * ---------------------------------------------------------
   * INITIAL / MISSION CHANGE RESET
   * ---------------------------------------------------------
   */

  useEffect(() => {
    setSelectedTaskId(null);
    setPreviousCurrentTaskId(null);
    setExpandedCompletedTask(null);
    setExpandedUpcomingTask(null);
    setTaskPrice("");
  }, [mission?.id]);

  /*
   * ---------------------------------------------------------
   * ORDERED TASKS
   * ---------------------------------------------------------
   */

  const taskMap = useMemo(() => {
    return new Map(
      localTasks.map((task) => [task.id, task]),
    );
  }, [localTasks]);

  const orderedTasks = useMemo(() => {
    const ordered: Task[] = [];

    for (const id of taskOrder) {
      const task = taskMap.get(id);

      if (task) {
        ordered.push(task);
      }
    }

    /*
     * Safety net: if a task somehow exists in localTasks but
     * wasn't added to taskOrder yet, include it at the end.
     */
    const orderedIds = new Set(taskOrder);

    for (const task of localTasks) {
      if (!orderedIds.has(task.id)) {
        ordered.push(task);
      }
    }

    return ordered;
  }, [taskOrder, taskMap, localTasks]);

  /*
   * ---------------------------------------------------------
   * DERIVED TASK GROUPS
   * ---------------------------------------------------------
   */

  const completedTasks = useMemo(() => {
    return orderedTasks.filter(
      (task) =>
        task.is_completed ||
        task.state === "COMPLETED",
    );
  }, [orderedTasks]);

  const pendingTasks = useMemo(() => {
    return orderedTasks.filter(
      (task) =>
        !task.is_completed &&
        task.state !== "COMPLETED",
    );
  }, [orderedTasks]);

  /*
   * The manually selected task takes priority.
   *
   * If it becomes completed/deleted, automatically fall back
   * to the first pending task.
   */
  const currentTask = useMemo(() => {
    if (selectedTaskId) {
      const selected = pendingTasks.find(
        (task) => task.id === selectedTaskId,
      );

      if (selected) {
        return selected;
      }
    }

    return pendingTasks[0] ?? null;
  }, [pendingTasks, selectedTaskId]);

  const upcomingTasks = useMemo(() => {
    if (!currentTask) return [];

    const currentIndex = orderedTasks.findIndex(
      (task) => task.id === currentTask.id,
    );

    if (currentIndex === -1) return [];

    const nextTasks = orderedTasks
      .slice(currentIndex + 1)
      .filter(
        (task) =>
          !task.is_completed &&
          task.state !== "COMPLETED",
      );

    // When the user manually switches the current step, the step
    // they were just working on is no longer after the new current
    // step in `orderedTasks`. Put that previous step back at the
    // very top of Up Next so it remains easy to return to.
    const previousCurrentTask = previousCurrentTaskId
      ? pendingTasks.find(
          (task) => task.id === previousCurrentTaskId,
        )
      : null;

    if (previousCurrentTask) {
      return [
        previousCurrentTask,
        ...nextTasks.filter(
          (task) => task.id !== previousCurrentTask.id,
        ),
      ].slice(0, 3);
    }

    return nextTasks.slice(0, 3);
  }, [
    orderedTasks,
    currentTask,
    pendingTasks,
    previousCurrentTaskId,
  ]);

  const totalTasks = orderedTasks.length;

  const completedCount = completedTasks.length;

  const progressPercent =
    totalTasks > 0
      ? (completedCount / totalTasks) * 100
      : 0;

  const currentTaskPosition = useMemo(() => {
    if (!currentTask) return 0;

    const index = orderedTasks.findIndex(
      (task) => task.id === currentTask.id,
    );

    return index >= 0 ? index + 1 : completedCount + 1;
  }, [currentTask, orderedTasks, completedCount]);

  /*
   * ---------------------------------------------------------
   * KEEP PRICE INPUT IN SYNC
   * ---------------------------------------------------------
   */

  useEffect(() => {
    currentTaskIdRef.current =
      currentTask?.id ?? null;

    if (
      currentTask?.paid_price !== null &&
      currentTask?.paid_price !== undefined
    ) {
      setTaskPrice(String(currentTask.paid_price));
    } else {
      setTaskPrice("");
    }
  }, [
    currentTask?.id,
    currentTask?.paid_price,
  ]);

  /*
   * Cleanup debounce.
   */

  useEffect(() => {
    return () => {
      if (priceTimeoutRef.current) {
        clearTimeout(priceTimeoutRef.current);
      }
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * SELECT CURRENT TASK
   * ---------------------------------------------------------
   */

  const handleSelectCurrentTask = (taskId: string) => {
    const exists = pendingTasks.some(
      (task) => task.id === taskId,
    );

    if (!exists) return;

    // Remember the task that was current immediately before the
    // switch so it can appear at the top of Up Next.
    if (currentTask?.id && currentTask.id !== taskId) {
      setPreviousCurrentTaskId(currentTask.id);
    }

    setSelectedTaskId(taskId);
    setExpandedUpcomingTask(null);
  };

  /*
   * ---------------------------------------------------------
   * DRAG
   * ---------------------------------------------------------
   */

  const handleDragStart = (
    e: React.DragEvent,
    taskId: string,
  ) => {
    /*
     * Don't allow current task to be dragged.
     */
    if (taskId === currentTask?.id) {
      e.preventDefault();
      return;
    }

    setDraggedItem(taskId);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (
    e: React.DragEvent,
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent,
    targetTaskId: string,
  ) => {
    e.preventDefault();

    const draggedTaskId =
      draggedItem ||
      e.dataTransfer.getData("text/plain");

    setDraggedItem(null);

    if (
      !draggedTaskId ||
      draggedTaskId === targetTaskId ||
      draggedTaskId === currentTask?.id ||
      targetTaskId === currentTask?.id
    ) {
      return;
    }

    setTaskOrder((previousOrder) => {
      const pendingIds = previousOrder.filter((id) => {
        const task = taskMap.get(id);

        return (
          task &&
          !task.is_completed &&
          task.state !== "COMPLETED"
        );
      });

      const completedIds = previousOrder.filter((id) => {
        const task = taskMap.get(id);

        return (
          task &&
          (task.is_completed ||
            task.state === "COMPLETED")
        );
      });

      const draggedIndex =
        pendingIds.indexOf(draggedTaskId);

      const targetIndex =
        pendingIds.indexOf(targetTaskId);

      if (
        draggedIndex <= 0 ||
        targetIndex <= 0 ||
        draggedIndex === -1 ||
        targetIndex === -1
      ) {
        return previousOrder;
      }

      const reordered = [...pendingIds];

      [reordered[draggedIndex], reordered[targetIndex]] = [
        reordered[targetIndex],
        reordered[draggedIndex],
      ];

      return [
        ...reordered,
        ...completedIds,
      ];
    });
  };

  /*
   * ---------------------------------------------------------
   * COMPLETE / UNCOMPLETE
   * ---------------------------------------------------------
   */

  const handleToggleCompletion = async (
    isCompleted: boolean,
  ) => {
    if (!currentTask || isCompleting) return;

    if (taskPrice.trim() === "" || taskPrice.trim() === "0") {

        toast.error("Task Price must be more than 0$")
        return;
    }

    const taskId = currentTask.id;

    setIsCompleting(true);

    /*
     * Optimistically update THIS page immediately.
     *
     * The context can update later through Realtime.
     */
    setLocalTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              is_completed: isCompleted,
              state: isCompleted
                ? "COMPLETED"
                : "PENDING",
            }
          : task,
      ),
    );

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("tasks")
        .update({
          is_completed: isCompleted,
          state: isCompleted
            ? "COMPLETED"
            : "PENDING",
        })
        .eq("id", taskId);

      if (error) {
        throw error;
      }

      /*
       * If we just completed the current task,
       * let the next pending task become current.
       */
      if (isCompleted) {
        setSelectedTaskId(null);
        setPreviousCurrentTaskId(null);
      } else {
        /*
         * If uncompleted, explicitly select it so it
         * becomes the current task again.
         */
        setSelectedTaskId(taskId);
      }

      toast.success(
        isCompleted
          ? "Step completed"
          : "Task marked as incomplete",
      );

      /*
       * Do NOT manually modify context.
       *
       * Supabase Realtime will eventually deliver the
       * database change to MissionProvider.
       */
    } catch (err) {
      console.error(err);

      /*
       * Roll back optimistic update.
       */
      setLocalTasks((previous) =>
        previous.map((task) =>
          task.id === taskId
            ? currentTask
            : task,
        ),
      );

      toast.error(
        isCompleted
          ? "Failed to complete task"
          : "Failed to mark task as incomplete",
      );
    } finally {
      setIsCompleting(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * PRICE
   * ---------------------------------------------------------
   */

  const handleUpdatePrice = (
    price: string,
  ) => {
    setTaskPrice(price);

    if (priceTimeoutRef.current) {
      clearTimeout(priceTimeoutRef.current);
    }

    const taskId = currentTask?.id;

    if (!taskId) return;

    const trimmed = price.trim();

    if (
      trimmed !== "" &&
      !Number.isFinite(Number(trimmed))
    ) {
      return;
    }

    const numberValue =
      trimmed === ""
        ? null
        : Number(trimmed);

    if (
      numberValue !== null &&
      numberValue < 0
    ) {
      return;
    }

    priceTimeoutRef.current =
      setTimeout(async () => {
        /*
         * Make sure the user didn't switch tasks while
         * the debounce was waiting.
         */
        if (
          currentTaskIdRef.current !== taskId
        ) {
          return;
        }

        try {
          const supabase = createClient();

          const { error } = await supabase
            .from("tasks")
            .update({
              paid_price: numberValue,
            })
            .eq("id", taskId);

          if (error) {
            throw error;
          }

          /*
           * Optimistic local update.
           */
          setLocalTasks((previous) =>
            previous.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    paid_price: numberValue,
                  }
                : task,
            ),
          );
        } catch (err) {
          console.error(err);
          toast.error("Failed to update price");
        }
      }, 800);
  };

  /*
   * ---------------------------------------------------------
   * UNCOMPLETE COMPLETED TASK
   * ---------------------------------------------------------
   */

  const handleUncompleteTask = async (
    taskId: string,
  ) => {
    const task = taskMap.get(taskId);

    if (!task || isCompleting) return;

    setIsCompleting(true);

    /*
     * Optimistic update.
     */
    setLocalTasks((previous) =>
      previous.map((item) =>
        item.id === taskId
          ? {
              ...item,
              is_completed: false,
              state: "PENDING",
            }
          : item,
      ),
    );

    /*
     * Put the task at the front of the pending queue.
     */
    setTaskOrder((previousOrder) => {
      return [
        taskId,
        ...previousOrder.filter(
          (id) => id !== taskId,
        ),
      ];
    });

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("tasks")
        .update({
          is_completed: false,
          state: "PENDING",
        })
        .eq("id", taskId);

      if (error) {
        throw error;
      }

      /*
       * Make the restored task current.
       */
      setSelectedTaskId(taskId);
      setExpandedCompletedTask(null);

      toast.success(
        "Task marked as incomplete",
      );
    } catch (err) {
      console.error(err);

      /*
       * Roll back.
       */
      setLocalTasks((previous) =>
        previous.map((item) =>
          item.id === taskId
            ? task
            : item,
        ),
      );

      toast.error(
        "Failed to uncomplete task",
      );
    } finally {
      setIsCompleting(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading && localTasks.length === 0) {
    return (
      <div className="min-h-dvh bg-background">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="space-y-4">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-12 w-48 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * ERROR
   * ---------------------------------------------------------
   */

  if (error && !mission) {
    return (
      <div className="min-h-dvh bg-background">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <MyAlert>
            Error: {error}
          </MyAlert>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-dvh bg-background">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <MyAlert>
            Mission not found.
          </MyAlert>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * MISSION COMPLETE
   * ---------------------------------------------------------
   */

  if (
    mission.is_completed ||
    mission.state === "COMPLETED"
  ) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center bg-background px-4 py-8">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-success/10 p-4">
              <Check className="h-8 w-8 text-success" />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Mission complete
          </h1>

          <p className="text-lg text-muted-foreground">
            You finished "{mission.name}."
          </p>

          <p className="text-base text-muted-foreground">
            {completedCount} steps completed
          </p>

          <div className="pt-2">
            <Link href="/home">
              <Button className="gap-2">
                <ArrowRight className="h-4 w-4" />
                Start another mission
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * EMPTY
   * ---------------------------------------------------------
   */

  if (totalTasks === 0) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center bg-background px-4 py-8">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Target className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            You're all caught up
          </h1>

          <p className="text-base text-muted-foreground">
            No steps assigned to this mission yet.
          </p>

          <div className="pt-2">
            <Link
              href={`/mission/${mission.id}`}
            >
              <Button
                variant="outline"
                className="gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Back to mission
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------
   */

  return (
    <div className="min-h-dvh bg-background pb-24 sm:pb-8">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">

        {/* Header */}

        <div className="mb-7">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              On the go: {mission.name}
            </p>

            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                },
              )}
            </p>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {completedCount} of {totalTasks} completed
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                {Math.round(progressPercent)}%
              </p>
            </div>

            <Progress
              value={progressPercent}
              className="h-2"
            />
          </div>
        </div>

        {/* Current task */}

        {currentTask && (
          <div className="mb-7 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Step
              </p>

              {pendingTasks.length > 1 && (
                <Select
                  value={currentTask.id}
                  onValueChange={handleSelectCurrentTask}
                >
                  <SelectTrigger className="h-8 w-auto border-0 bg-transparent px-2 text-xs font-medium text-primary shadow-none hover:bg-muted/60">
                    <SelectValue placeholder="Switch step" />
                  </SelectTrigger>

                  <SelectContent>
                    {pendingTasks.map((task) => (
                      <SelectItem
                        key={task.id}
                        value={task.id}
                      >
                        {task.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Card className="rounded-xl border bg-card p-5 shadow-none sm:p-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold uppercase tracking-wider text-primary"
                  >
                    Step {currentTaskPosition} of {totalTasks}
                  </Badge>

                  {isCompleting && (
                    <span className="text-xs text-muted-foreground">
                      Saving...
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {currentTask.name}
                  </h2>

                  {currentTask.description && (
                    <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                      {currentTask.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2 border-t border-border pt-5">
                  <Label
                    htmlFor="paid-price"
                    className="text-sm font-medium"
                  >
                    Paid Price
                  </Label>

                  <Input
                    id="paid-price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    placeholder="0.00"
                    value={taskPrice}
                    onChange={(e) =>
                      handleUpdatePrice(e.target.value)
                    }
                    className="h-11 text-base bg-card"
                  />
                </div>

                <div className="border-t border-border pt-5">
                  <Button
                    type="button"
                    className="h-11 w-full gap-2 text-sm font-semibold"
                    onClick={() =>
                      handleToggleCompletion(true)
                    }
                    disabled={isCompleting}
                  >
                    <Check className="h-4 w-4" />
                    {isCompleting
                      ? "Completing..."
                      : "Mark as completed"}
                  </Button>

                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Complete this step to move to the next one.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Upcoming */}

        {upcomingTasks.length > 0 && (
          <div className="mb-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Up Next
            </p>

            <div className="space-y-2">
              {upcomingTasks.map((task) => {
                const expanded =
                  expandedUpcomingTask === task.id;

                const taskPosition =
                  orderedTasks.findIndex(
                    (item) => item.id === task.id,
                  ) + 1;

                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, task.id)
                    }
                    onDragOver={handleDragOver}
                    onDrop={(e) =>
                      handleDrop(e, task.id)
                    }
                    className={`overflow-hidden rounded-lg border transition-colors ${
                      draggedItem === task.id
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-background"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedUpcomingTask(
                          expanded ? null : task.id,
                        )
                      }
                      className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-muted/40 sm:px-4"
                      aria-expanded={expanded}
                    >
                      <GripVertical className="h-4 w-4 flex-shrink-0 cursor-grab text-muted-foreground/40" />

                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground/70">
                          Step {taskPosition}
                        </p>
                        <p className="truncate text-sm font-medium text-foreground">
                          {task.name}
                        </p>
                      </div>

                      <ChevronDown
                        className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {expanded && (
                      <div className="border-t border-border/50 bg-card/40 px-4 py-4">
                        <div className="space-y-4">
                          {task.description && (
                            <div>
                              <p className="mb-1 text-xs font-medium text-muted-foreground">
                                Description
                              </p>
                              <p className="text-sm leading-6 text-muted-foreground">
                                {task.description}
                              </p>
                            </div>
                          )}

                          {(task.expected_price !== null &&
                            task.expected_price !== undefined) ||
                          (task.paid_price !== null &&
                            task.paid_price !== undefined) ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                              {task.expected_price !== null &&
                                task.expected_price !== undefined && (
                                  <div>
                                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                                      Expected Price
                                    </p>
                                    <p className="text-sm font-medium">
                                      ${Number(task.expected_price).toFixed(2)}
                                    </p>
                                  </div>
                                )}

                              {task.paid_price !== null &&
                                task.paid_price !== undefined && (
                                  <div>
                                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                                      Paid Price
                                    </p>
                                    <p className="text-sm font-medium">
                                      ${Number(task.paid_price).toFixed(2)}
                                    </p>
                                  </div>
                                )}
                            </div>
                          ) : null}

                          {!task.description &&
                            task.expected_price == null &&
                            task.paid_price == null && (
                              <p className="text-sm text-muted-foreground">
                                No additional details for this step.
                              </p>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {pendingTasks.length > upcomingTasks.length + 1 && (
                <div className="flex justify-center pt-1">
                  <p className="text-xs text-muted-foreground">
                    +{pendingTasks.length - upcomingTasks.length - 1} more steps
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completed */}

        {completedTasks.length > 0 && (
          <div className="mb-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Completed
            </p>

            <div className="space-y-2">
              {completedTasks.map((task) => {
                const expanded =
                  expandedCompletedTask ===
                  task.id;

                return (
                  <div
                    key={task.id}
                    className="space-y-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCompletedTask(
                          expanded
                            ? null
                            : task.id,
                        )
                      }
                      className="flex w-full items-center gap-3 rounded-lg border border-border/50 bg-background px-3 py-2 text-left hover:bg-muted/50 sm:px-4 sm:py-3"
                    >
                      <Check className="h-4 w-4 flex-shrink-0 text-success" />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted-foreground line-through">
                          {task.name}
                        </p>
                      </div>

                      <ChevronDown
                        className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${
                          expanded
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    {expanded && (
                      <Card className="ml-2 rounded-lg border bg-card p-4">
                        <div className="space-y-3">
                          {task.description && (
                            <div>
                              <p className="mb-1 text-xs font-medium text-muted-foreground">
                                Description
                              </p>

                              <p className="text-sm text-muted-foreground">
                                {task.description}
                              </p>
                            </div>
                          )}

                          {task.paid_price !==
                            null &&
                            task.paid_price !==
                              undefined && (
                              <div>
                                <p className="mb-1 text-xs font-medium text-muted-foreground">
                                  Paid Price
                                </p>

                                <p className="text-sm font-medium">
                                  $
                                  {Number(
                                    task.paid_price,
                                  ).toFixed(2)}
                                </p>
                              </div>
                            )}

                          {task.expected_price !==
                            null &&
                            task.expected_price !==
                              undefined && (
                              <div>
                                <p className="mb-1 text-xs font-medium text-muted-foreground">
                                  Expected Price
                                </p>

                                <p className="text-sm text-muted-foreground">
                                  $
                                  {Number(
                                    task.expected_price,
                                  ).toFixed(2)}
                                </p>
                              </div>
                            )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUncompleteTask(
                                task.id,
                              )
                            }
                            disabled={isCompleting}
                            className="w-full"
                          >
                            Uncomplete
                          </Button>
                        </div>
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Controls */}

        <div className="flex gap-2 border-t border-border pt-5">
          <Link
            href={`/mission/${mission.id}`}
            className="flex-1 sm:flex-none"
          >
            <Button
              variant="ghost"
              className="w-full gap-2 text-muted-foreground hover:text-foreground sm:w-auto"
            >
              <X className="h-4 w-4" />
              Exit mission
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2"
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Pause mission?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  You can resume this mission anytime
                  from the mission page.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="flex gap-2">
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction asChild>
                  <Link
                    href={`/mission/${mission.id}`}
                  >
                    <Button>Pause</Button>
                  </Link>
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}