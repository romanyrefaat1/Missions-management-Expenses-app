"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMissionsAll } from "@/contexts/missions-all-context";

type Mission = {
  id: string;
  name: string;
};

interface MissionsDropdownProps {
  currentMission: string;
  onChange: (missionId: string) => void;
  isCurrentMission?: boolean;
  trigger_value?: string;
}

export function MissionsDropdown({
  currentMission,
  onChange,
  isCurrentMission = true,
  trigger_value,
}: MissionsDropdownProps) {
  const { allMissions } = useMissionsAll();

  const currentMissionData = allMissions.find(
    (mission) => mission.name === currentMission
  );

  return (
    <Select
      value={isCurrentMission ? currentMissionData?.id : undefined}
      onValueChange={onChange}
    >
      <SelectTrigger className="border-0 bg-transparent p-2 shadow-none">
        <SelectValue
          placeholder={isCurrentMission ? currentMission : trigger_value}
        />
      </SelectTrigger>

      <SelectContent>
        {allMissions.map((mission) => (
          <SelectItem key={mission.id} value={mission.id}>
            {mission.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}