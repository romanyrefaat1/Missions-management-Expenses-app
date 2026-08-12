"use client";

import { useMission } from "@/contexts/mission-context";
import TaskItemInMissionPage from "./TaskItemInMissionPage";

export default function TasksListInMissionPage() {
  const { tasks } = useMission();

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((el, index) => (
        <div key={index}>
          <TaskItemInMissionPage taskData={el} />
        </div>
      ))}
    </div>
  );
}
