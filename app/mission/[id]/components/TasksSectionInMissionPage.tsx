import { Input } from "@/components/ui/input";
import { AddTaskGroup } from "./AddTaskButtonGroup";
import TasksListInMissionPage from "./TasksListInMissionPage";

export default function TasksInMissionPage() {
  return (
    <div>
      <h2 className="text-muted-foreground hover:text-foreground w-fit mb-4">
        Tasks
      </h2>
      {/* Add a Task */}
      {/* Edit a Task */}
      {/* Search in Tasks */}
      <div className="flex gap-2 mb-3">
        <Input type="search" placeholder="Search in this mission's tasks" />
        {/* Button Group */}
        <AddTaskGroup />
      </div>
      {/* Remove a Task */}
      {/* Tasks */}
      <TasksListInMissionPage />
    </div>
  );
}
