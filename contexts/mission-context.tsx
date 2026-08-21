"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { createClient } from "@/lib/supabase/client";
import type { Mission, Task } from "@/types/types";
import { toast } from "sonner";

interface MissionContextType {
  mission: Mission | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  editMission: (data: Partial<Mission> & { missionId: Mission["id"] })=> void;
}

interface MissionProviderProps {
  children: ReactNode;
  missionId: string;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export function MissionProvider({ children, missionId }: MissionProviderProps) {
  const [mission, setMission] = useState<Mission | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchMissionData = async () => {
      setLoading(true);
      setError(null);

      const [
        { data: missionData, error: missionError },
        { data: tasksData, error: tasksError },
      ] = await Promise.all([
        supabase.from("missions").select("*").eq("id", missionId).single(),

        supabase.from("tasks").select("*").eq("mission", missionId),
      ]);

      if (missionError) {
        console.error("Error fetching mission data:", missionError.message);

        setError(missionError.message);
        toast.error(`Error fetching mission data: ${missionError.message}`);
      } else {
        setMission(missionData);
      }

      if (tasksError) {
        console.error("Error fetching tasks data:", tasksError.message);

        setError((prev) =>
          prev ? `${prev} - ${tasksError.message}` : tasksError.message,
        );

        toast.error(`Error fetching tasks data: ${tasksError.message}`);
      } else {
        setTasks(tasksData ?? []);
      }

      setLoading(false);
    };

    if (missionId) {
      fetchMissionData();
    }

    const tasksChannel = supabase.channel(`tasks-channel-${missionId}`);
    const missionChannel = supabase.channel(`mission-channel-${missionId}`);

    tasksChannel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((perv) => [...perv, payload.new]);
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((el) => el.id !== payload.old.id));
          } else if (payload.eventType === "UPDATE") {
  setTasks((prev) =>
    prev.map((el) =>
      el.id === payload.new.id ? payload.new as Task : el,
    ),
  );
}
        },
      )
      .subscribe();

    missionChannel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "missions",
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setMission(null);
          } else if (payload.eventType === "UPDATE") {
            setMission(payload.new);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(missionChannel);
    };
  }, [missionId]);

  const editMission = async (
  data: Partial<Mission> & { missionId: Mission["id"] }
) => {
  const supabase = createClient();

  const { missionId, ...updates } = data;

  const { error } = await supabase
    .from("missions")
    .update(updates)
    .eq("id", missionId);

  if (error) {
    toast.error(`Error editing mission: ${error.message}`)
    console.error(`Error editing mission: ${error.message}`)
  }
};

  return (
    <MissionContext.Provider
      value={{
        mission,
        tasks,
        loading,
        error,
        editMission
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMission(): MissionContextType {
  const context = useContext(MissionContext);

  if (context === undefined) {
    throw new Error("useMission must be used inside a MissionProvider");
  }

  return context;
}
