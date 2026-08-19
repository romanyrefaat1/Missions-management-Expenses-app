"use client";

import { MyAlert } from "@/components/my-alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import TasksInMissionPage from "./TasksSectionInMissionPage";
import EditBudgetButton from "./EditBudgetButton";
import { useMission } from "@/contexts/mission-context";
import { useRouter } from "next/navigation";
import { MissionsDropdown } from "./MissionsDropdown";
import { MissionActionsDropDown } from "./MissionActionsDropDown";

export default function MissionPageClient() {
  const { mission, loading, error, tasks } = useMission();
  const router = useRouter();

  if (loading) return null;
  if (error) return <MyAlert>Error: {error}</MyAlert>;
  if (!mission) return <MyAlert>Mission not found.</MyAlert>;

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
      value: tasks.filter((item) => item.state === "IN_PROGRESS" && item).length,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1>
            <span className={"font-body"}>Mission:</span> {mission.name}
          </h1>

          <MissionsDropdown
            currentMission={mission.name}
            onChange={(missionId) => router.push(`/mission/${missionId}`)}
          />

          <MissionActionsDropDown missionId={mission.id
          } />
        </div>

        {mission.description && (
          <p className="text-muted-foreground">{mission.description}</p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <Link href={`/mission/${mission.id}/on-the-go`}>
            <Button variant="outline">Open as On The Go</Button>
          </Link>

          <span className="text-sm font-medium">
            {mission.state === "COMPLETED"
              ? "Completed"
              : mission.state === "IN_PROGRESS"
              ? "In progress"
              : "Pending"}
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <Card className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4 rounded-3xl overflow-hidden p-0 border">
        {topData.map((el, index) => (
          <div
            key={index}
            className="bg-card p-5 flex flex-col justify-between hover:bg-muted/50 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-muted-foreground/30">{el.title}</p>
              <h2 className="mt-2 text-6xl font-light md:text-6xl lg:mt-4 font-body">
                {el.value !== null && el.value !== undefined
                  ? `${el.type !== "tasks-in-progress" ? "$" : ""}${el.value}`
                  : "N/A"}
              </h2>
            </div>

            {el.button && <div className="mt-4 self-end">{el.button}</div>}
          </div>
        ))}
      </Card>

      {/* Warnings */}
      <div className="flex flex-col gap-2">
        {topData.map(
          (el, index) =>
            el.warning && (
              <div key={index} className="rounded-lg overflow-hidden">
                <MyAlert
                  variant="warning"
                  title={el.warning.label || "Unknown label"}
                  description={el.warning.description}
                  action={el.warning.action_component}
                />
              </div>
            )
        )}
      </div>

      {/* Tasks Section */}
      <TasksInMissionPage />
    </div>
  );
}