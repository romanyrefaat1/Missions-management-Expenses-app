"use client";

import { useState } from "react";
import TaskItemInMissionPage from "./TaskItemInMissionPage";
import EmptyTasksSection from "./EmptyTasksSection";
import { useFilteredTasks } from "../../contexts/filtered-tasks-context";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TaskSectionProps {
  title: string;
  tasks: Parameters<typeof TaskItemInMissionPage>[0]["taskData"][];
}

function TaskSection({ title, tasks }: TaskSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="flex flex-col gap-3">
      {/* Header Container */}
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-bold tracking-tight text-foreground">
            {title}
          </h3>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {isOpen ? (
            <>
              Collapse <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Expand <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Task Content */}
      {isOpen &&
        (tasks.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {tasks.map((task) => (
              <div key={task.id}>
                <TaskItemInMissionPage taskData={task} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyTasksSection state={title} />
        ))}
    </section>
  );
}

export default function TasksListInMissionPage() {
  const { filteredTasks } = useFilteredTasks();

  if (filteredTasks.type === "DATE") {
    return (
      <div className="flex flex-col gap-8">
        <TaskSection title="Newest" tasks={filteredTasks.tasks} />
      </div>
    );
  }

  if (filteredTasks.type === "IS_COMPLETED") {
    return (
      <div className="flex flex-col gap-8">
        <TaskSection title="Completed" tasks={filteredTasks.completed} />
        <TaskSection
          title="Not Completed"
          tasks={filteredTasks.not_completed}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <TaskSection
        title="In Progress"
        tasks={filteredTasks.in_progress}
      />
      <TaskSection title="Completed" tasks={filteredTasks.completed} />
      <TaskSection title="Pending" tasks={filteredTasks.pending} />
    </div>
  );
}