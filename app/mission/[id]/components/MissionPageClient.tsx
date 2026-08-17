"use client";

import { MyAlert } from "@/components/my-alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import TasksInMissionPage from "./TasksSectionInMissionPage";
import EditBudgetButton from "./EditBudgetButton";
import { useMission } from "@/contexts/mission-context";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { MissionsDropdown } from "./MissionsDropdown";

{
  /* Budget */
}
{
  /* Current Paid */
}
{
  /* Rest of the money  */
}
{
  /* State */
}
{
  /* On The Go Button */
}

export default function MissionPageClient() {
  const { mission, loading, error, tasks } = useMission();
  const router = useRouter()

  if (loading) return;
  if (error) {
    return <MyAlert>Error: {error}</MyAlert>;
  }

  if (!mission) {
    return <MyAlert>Mission not found.</MyAlert>;
  }

  const topData = [
    {
      title: "Budget",
      value: mission.real_budget,
      button: (
        <EditBudgetButton missionId={mission.id} missionName={mission.name}>
          Edit
        </EditBudgetButton>
      ),
      warning: !mission.real_budget
        ? {
            label: "Please set your current Budget",
            action_component: <Button size="xs">Add Current Budget</Button>,
          }
        : undefined,
    },
    {
      title: "You spent on this mission",
      value: mission.current_paid || 0,
      warning: !mission.current_paid
        ? {
            label: "Please set how much you paid in any task",
          }
        : undefined,
    },
    {
      title: "You currently have",
      value:
        mission.real_budget && mission.current_paid
          ? mission.real_budget - mission.current_paid
          : null,
      warning:
        !mission.real_budget || !mission.current_paid
          ? {
              label: "Your Budget and any task's prices must be set",
              description: "Please click the button to fix",
              action_component: <Button size="sm">Button</Button>,
            }
          : undefined,
    },
    {
      type: "tasks-in-progress",
      title: "Tasks in progress",
      value: tasks.filter((item)=> item.state === "IN_PROGRESS" && item).length,
    },
  ];

  return (
      <div>
      <div className="flex items-center gap-3">
  <h1 className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
  <span className="text-3xl font-bold tracking-tight sm:text-4xl">
    Mission: {mission.name}
  </span>

  <div className="self-start lg:self-auto">
    <MissionsDropdown
      currentMission={mission.name}
      onChange={(missionId) => router.push(`/mission/${missionId}`)}
      isCurrentMission={false}
      trigger_value="Switch Mission"
    />
  </div>
</h1>
</div>
      {mission.description !== null && (
        <p className="text-muted-foreground">{mission.description}</p>
      )}

      <div className="flex gap-3 mt-3 items-center align-center">
        <Link href={`/mission/${mission.id}/on-the-go`}>
          <Button variant="outline">Open as On The Go</Button>
        </Link>
        <span>
          {mission.state === "COMPLETED"
            ? "Completed"
            : mission.state === "IN_PROGRESS"
              ? "In progress"
              : "Pending"}
        </span>
      </div>

      {/* Overview cards */}
      <Card className=" p-0 grid-cols-2 lg:grid-cols-4 grid mt-5 rounded-3xl min-h-36 overflow-hidden hover:bg-card">
        {topData.map((el, index) => (
          <div
            className={cn(
              "border-r p-4 border-r-secondary flex flex-col hover:bg-background transition-all",
              index < 2 && "border-b border-b-secondary lg:border-b-none",
            )}
            key={index}
          >
            <span className="text-">{el.title}</span>
            {el.description && (
              <span className="text-muted-foreground">{el.description}</span>
            )}
            <h3
              className={cn(
                "mb-4 text-5xl font-normal",
              )}
            >
              {el.value && el.value !== "N/A"
                ? `${el.type !== "tasks-in-progress" ? "$" : ""}${el.value}`
                : el.value == 0
                  ? `${el.type !== "tasks-in-progress" ? "$":""}${0}`
                  : "N/A"}
              {/* $20 */}
            </h3>

            {el.button && (
              <span className="align-end self-end">{el.button}</span>
            )}
          </div>
        ))}
      </Card>

      {/* Warnings */}
      <div className="mt-6 mb-6 flex flex-col gap-1">
        {topData.map(
          (el, index) =>
            el.warning && (
              <div key={index} className="rounded-lg overflow-hidden">
                <MyAlert
                  variant="warning"
                  title={el.warning.label || "Unkown label"}
                  description={el.warning.description}
                  action={el.warning.action_component}
                />
              </div>
            ),
        )}
      </div>

      <TasksInMissionPage />

      {/* <pre>{JSON.stringify(missionData, null, 2)}</pre> */}
    </div>
  );
}
