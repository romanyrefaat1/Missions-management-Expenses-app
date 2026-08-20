"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import TaskItemInMissionPage from "./TaskItemInMissionPage";
import EmptyTasksSection from "./EmptyTasksSection";
import { useFilteredTasks } from "../../contexts/filtered-tasks-context";

interface TaskSectionProps {
  title: string;
  tasks: Parameters<typeof TaskItemInMissionPage>[0]["taskData"][];
}

function TaskSection({ title, tasks }: TaskSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            <h3 className="font-body text-sm font-semibold tracking-[-0.01em] text-foreground">
              {title}
            </h3>
          </div>

          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-border/60 bg-muted/50 px-2 text-[11px] font-semibold tabular-nums text-muted-foreground">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="group flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          <span>{isOpen ? "Collapse" : "Expand"}</span>

          {isOpen ? (
            <ChevronUp className="h-3.5 w-3.5 transition-transform" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 transition-transform" />
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/50" />

      {/* Tasks */}
      {isOpen &&
        (tasks.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {tasks.map((task) => (
              <TaskItemInMissionPage
                key={task.id}
                taskData={task}
              />
            ))}
          </div>
        ) : (
          <EmptyTasksSection state={title} />
        ))}
    </section>
  );
}

export default function TasksListInMissionPage() {
  const { filteredTasks, searchKeyword } = useFilteredTasks();

  /*
   * SEARCH
   */
  if (searchKeyword.trim()) {
    return (
      <div className="flex flex-col gap-10">
        <TaskSection
          title={`Search results for "${searchKeyword.trim()}"`}
          tasks={filteredTasks.tasks}
        />
      </div>
    );
  }

  /*
   * DATE
   */
  if (filteredTasks.type === "DATE") {
    return (
      <div className="flex flex-col gap-10">
        <TaskSection
          title="Newest"
          tasks={filteredTasks.tasks}
        />
      </div>
    );
  }

  /*
   * IS_COMPLETED
   */
  if (filteredTasks.type === "IS_COMPLETED") {
    return (
      <div className="flex flex-col gap-10">
        <TaskSection
          title="Completed"
          tasks={filteredTasks.completed}
        />

        <TaskSection
          title="Not Completed"
          tasks={filteredTasks.not_completed}
        />
      </div>
    );
  }

  /*
   * STATE
   */
  return (
    <div className="flex flex-col gap-10">
      <TaskSection
        title="In Progress"
        tasks={filteredTasks.in_progress}
      />

      <TaskSection
        title="Completed"
        tasks={filteredTasks.completed}
      />

      <TaskSection
        title="Pending"
        tasks={filteredTasks.pending}
      />
    </div>
  );
}