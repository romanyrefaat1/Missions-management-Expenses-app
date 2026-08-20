"use client";

import { MyAlert } from "@/components/my-alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import TasksInMissionPage from "./TasksSectionInMissionPage";
import EditBudgetButton from "./EditBudgetButton";
import { useMission } from "@/contexts/mission-context";
import { useRouter } from "next/navigation";
import { MissionsDropdown } from "./MissionsDropdown";
import { MissionActionsDropDown } from "./MissionActionsDropDown";
import { MissionoLoader } from "@/components/MissionoLoader";

export default function MissionPageClient() {
  const { mission, loading, error, tasks } = useMission();
  const router = useRouter();

  if (loading) {
  return <MissionoLoader />;
}
  if (error) throw new Error (`Something went wrong: ${error}`);

  const topData = [
    {
      title: "Budget",
      value: mission.real_budget,
      button: (
        <EditBudgetButton
          missionId={mission.id}
          missionName={mission.name}
        >
          Edit
        </EditBudgetButton>
      ),
      warning: !mission.real_budget
        ? {
            label: "Please set your current budget",
            action_component: (
              <Button size="sm">Add Current Budget</Button>
            ),
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
         tasks.filter((el)=> el.is_completed == true).length !==0 && (!mission.real_budget || !mission.current_paid )
          ? {
              label: "Your budget and task prices must be set",
              // description: "Please click the button to fix this.",
              action_component: <EditBudgetButton
          missionId={mission.id}
          missionName={mission.name}
        >
          Set Budget
        </EditBudgetButton>,
            }
          : undefined,
    },
    {
      type: "tasks-in-progress",
      title: "Tasks in progress",
      value: tasks.filter(
        (item) => item.state === "IN_PROGRESS"
      ).length,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <section className="space-y-5">
        <div className="flex flex-col gap-4">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Mission
            </span>

            <span className="h-px w-8 bg-border" />
          </div>

          {/* Mission title row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 md:flex-wrap md:items-center gap-3 flex-col md:flex-row">
              <h1 className="font-heading text-4xl font-medium leading-[1.05] tracking-[-0.035em] sm:text-5xl md:text-6xl">
                {mission.name}
              </h1>

              <div className="flex gap-2 items-center">
                <MissionsDropdown
                currentMission={mission.name}
                onChange={(missionId) =>
                  router.push(`/mission/${missionId}`)
                }
              />

              <MissionActionsDropDown missionId={mission.id} />
              </div>
            </div>
          </div>

          {/* Description */}
          {mission.description && (
            <p className="max-w-2xl text-[15px] leading-7 text-muted-foreground">
              {mission.description}
            </p>
          )}

          {/* Mission controls */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href={`/mission/${mission.id}/on-the-go`}>
              <Button
                variant="outline"
                className="rounded-xl px-4 font-medium"
              >
                Open as{" "}
                <span className="ml-1 font-semibold">
                  On The Go
                </span>
              </Button>
            </Link>

            <div className="flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  mission.state === "COMPLETED"
                    ? "bg-emerald-500"
                    : mission.state === "IN_PROGRESS"
                    ? "bg-primary"
                    : "bg-muted-foreground/40"
                }`}
              />

              <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                {mission.state === "COMPLETED"
                  ? "Completed"
                  : mission.state === "IN_PROGRESS"
                  ? "In progress"
                  : "Pending"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Overview
          </p>
        </div>

        <Card className="grid overflow-hidden rounded-2xl border-accent dark:border-accent/20 border-2 dark:border-1 p-px sm:grid-cols-2 lg:grid-cols-4">
          {topData.map((el, index) => (
            <div
              key={index}
              className="group flex min-h-[180px] flex-col justify-between bg-secondary/50 p-6 transition-colors hover:bg-muted/30"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] leading-snug text-muted-foreground">
                  {el.title}
                </p>

                <div className="mt-5 flex items-baseline">
                  {el.value !== null && el.value !== undefined ? (
                    <>
                      {el.type !== "tasks-in-progress" && (
                        <span className="mr-1 text-lg font-medium text-muted-foreground">
                          $
                        </span>
                      )}

                      <h2 className="font-body text-5xl font-light leading-none tracking-[-0.05em] tabular-nums sm:text-6xl">
                        {el.value}
                      </h2>
                    </>
                  ) : (
                    <h2 className="font-body text-4xl font-light tracking-[-0.04em] text-muted-foreground">
                      N/A
                    </h2>
                  )}
                </div>
              </div>

              {el.button && (
                <div className="mt-6 self-start">
                  {el.button}
                </div>
              )}
            </div>
          ))}
        </Card>
      </section>

      {/* Warnings */}
      {topData.some((el) => el.warning) && (
        <section className="space-y-2">
          {topData.map(
            (el, index) =>
              el.warning && (
                <div
                  key={index}
                  className="overflow-hidden"
                >
                  <MyAlert
                    variant="warning"
                    title={el.warning.label || "Something needs attention"}
                    description={el.warning.description}
                    action={el.warning.action_component}
                  />
                </div>
              )
          )}
        </section>
      )}

      {/* Tasks */}
      <section className="space-y-4">
        

        <TasksInMissionPage />
      </section>
    </div>
  );
}