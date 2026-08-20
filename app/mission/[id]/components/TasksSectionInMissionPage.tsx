import { Input } from "@/components/ui/input";
import { AddTaskGroup } from "./AddTaskButtonGroup";
import TasksListInMissionPage from "./TasksListInMissionPage";
import { useFilteredTasks } from "../../contexts/filtered-tasks-context";

export default function TasksInMissionPage() {
  const {setSearchKeyword} = useFilteredTasks()
  return (
    <div>
      {/* <h2 className="text-muted-foreground hover:text-foreground w-fit mb-4">
        Tasks
      </h2> */}
      <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Activity
          </p>

          <h2 className="mt-1 font-heading font-medium tracking-[-0.02em] text-foreground/80 hover:text-foreground w-fit mb-4">
            Tasks
          </h2>
        </div>
      {/* Add a Task */}
      {/* Edit a Task */}
      {/* Search in Tasks */}
      <div className="flex gap-2 mb-3 flex-col lg:flex-row">
        <Input type="search" placeholder="Search in this mission's tasks" onChange={(e)=> setSearchKeyword(e.target.value)} />
        {/* Button Group */}
        <AddTaskGroup />
      </div>
      {/* Remove a Task */}
      {/* Tasks */}
      <div className="mt-8">
      <TasksListInMissionPage />

      </div>
    </div>
  );
}
