import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { formatSupabaseTimestamp } from "@/lib/formatSupabaseTimestamp";
import { Mission } from "@/types/types";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return (
      <div>
        <h2>Missions</h2>
        <p>Please sign in to view your missions.</p>
      </div>
    );
  }

  const {
    data: missions,
    error: missionsError,
  } = await supabase
    .from("missions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (missionsError) {
    console.error("Error fetching missions:", missionsError);

    return (
      <div>
        <h2>Missions</h2>
        <p>Error loading missions.</p>
      </div>
    );
  }

  const missionGrid = (mission: Mission) => [
    {
      type: "spent",
      name: "You spent",
      value: mission.current_paid,
    },
    {
      type: "real-budget",
      name: "Your budget",
      value: mission.real_budget,
    },
    {
      type: "expected-budget",
      name: "Expected budget",
      value: mission.expected_budget,
    },
    {
      type: "state",
      name: "Mission State",
      value:
        mission.state === "IN_PROGRESS"
          ? "In progress"
          : mission.state === "COMPLETED"
            ? "Completed"
            : mission.state === "PENDING"
              ? "Pending"
              : "Unkown",
    },
    {
      type: "created-at",
      name: "Created At",
      value: formatSupabaseTimestamp(mission.created_at, {
  month: "short",
  day: "numeric",
  year: "numeric",
}),
    },
  ];

  return (
    <div>
      <div>
        <h1 className="mb-4 font-heading">All Missions</h1>

        <div className="grid grid-cols-1 gap-4">
          {missions?.map((mission) => (
            <Card key={mission.id} className="p-6 rounded-2xl">
              <CardTitle className="text-xl">{mission.name}</CardTitle>

              <CardDescription>{mission.description}</CardDescription>

              <Card className="p-0 grid-cols-2 lg:grid-cols-5 grid mt-5 mb-5 rounded-xl min-h-18 overflow-hidden hover:bg-card">
                {missionGrid(mission).map((el, index) => (
                  <div
                    className={cn(
                      "border-r p-4 border-r-secondary flex flex-col hover:bg-background transition-all",
                      index < 2 &&
                        "border-b border-b-secondary lg:border-b-none",
                    )}
                    key={index}
                  >
                    <span className="text-sm">{el.name}</span>

                    {el.description && (
                      <span className="text-muted-foreground text-md">
                        {el.description}
                      </span>
                    )}

                    <h3 className={cn("mb-1 text-xl font-normal")}>
                      {el.value && el.value !== "N/A"
                        ? `${el.value}`
                        : el.value == 0
                          ? `${0}`
                          : "N/A"}
                    </h3>

                    {el.button && (
                      <span className="align-end self-end">{el.button}</span>
                    )}
                  </div>
                ))}
              </Card>

              <div className="flex justify-end">
                
                <Link href={`/mission/${mission.id}`}>
                  <Button variant={"primary"}>View Mission</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}