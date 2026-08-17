"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { createClient } from "@/lib/supabase/client";
import type { Mission } from "@/types/types";

interface MissionsAllContextValue {
  allMissions: Mission[];
  loading: boolean;
  refreshMissions: () => Promise<void>;
}

interface MissionsAllProviderProps {
  children: ReactNode;
}

const MissionsAllContext = createContext<
  MissionsAllContextValue | undefined
>(undefined);

export function MissionsAllProvider({
  children,
}: MissionsAllProviderProps) {
  const [allMissions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const supabase = useMemo(() => createClient(), []);

  const fetchMissions = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting authenticated user:", userError);
        setMissions([]);
        return;
      }

      if (!user) {
        setMissions([]);
        return;
      }

      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching missions:", error);
        setMissions([]);
        return;
      }

      setMissions(data as Mission[]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const setupRealtime = async (): Promise<void> => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (error || !user) {
        setMissions([]);
        setLoading(false);
        return;
      }

      await fetchMissions();

      if (cancelled) return;

      channel = supabase
        .channel(`missions-all-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "missions",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const mission = payload.new as Mission;

            setMissions((currentMissions) => {
              if (
                currentMissions.some(
                  (currentMission) => currentMission.id === mission.id
                )
              ) {
                return currentMissions;
              }

              return [mission, ...currentMissions];
            });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "missions",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const updatedMission = payload.new as Mission;

            setMissions((currentMissions) =>
              currentMissions.map((mission) =>
                mission.id === updatedMission.id
                  ? updatedMission
                  : mission
              )
            );
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "missions",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const deletedMission = payload.old as Pick<Mission, "id">;

            setMissions((currentMissions) =>
              currentMissions.filter(
                (mission) => mission.id !== deletedMission.id
              )
            );
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log("Subscribed to missions realtime");
          }
        });
    };

    void setupRealtime();

    return () => {
      cancelled = true;

      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [fetchMissions, supabase]);

  const value = useMemo<MissionsAllContextValue>(
    () => ({
      allMissions,
      loading,
      refreshMissions: fetchMissions,
    }),
    [allMissions, loading, fetchMissions]
  );

  return (
    <MissionsAllContext.Provider value={value}>
      {children}
    </MissionsAllContext.Provider>
  );
}

export function useMissionsAll(): MissionsAllContextValue {
  const context = useContext(MissionsAllContext);

  if (!context) {
    throw new Error(
      "useMissionsAll must be used within a MissionsAllProvider"
    );
  }

  return context;
}